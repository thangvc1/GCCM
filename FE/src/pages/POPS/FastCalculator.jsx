import { ArrowRightOutlined } from "@ant-design/icons";
import {
  Button,
  ConfigProvider,
  Empty,
  Flex,
  Radio,
  Slider,
  Spin,
  Typography,
  message,
} from "antd";
import { useEffect, useMemo, useState } from "react";
import { publicApi } from "../../api.js";
import { vnd } from "../../lib/format.js";
import { discountLabelForArea, discountRateForArea } from "./pricing.js";

const { Text, Title } = Typography;
const productImage = (product) =>
  product?.imageUrl ||
  product?.image ||
  product?.imagePath ||
  product?.thumbnailUrl;
const productThickness = (product) =>
  product?.thicknessMm || product?.thickness || product?.thicknessMM;
const thicknessValue = (product) => {
  const value = Number.parseFloat(String(productThickness(product) || ""));
  return Number.isFinite(value) ? value : Number.POSITIVE_INFINITY;
};
const thicknessLabel = (product) => {
  const thickness = productThickness(product);
  if (!thickness) return "";
  return String(thickness).endsWith("mm")
    ? String(thickness)
    : `${thickness}mm`;
};
const productPrice = (product) =>
  Number(product?.unitPrice || product?.price || product?.basePrice || 0);

export default function FastCalculator({
  selectedThickness,
  setSelectedThickness,
  area,
  setArea,
  onOpenOrder,
}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    publicApi
      .getProducts({ page: 1, size: 100 })
      .then((response) => {
        const data = response?.data?.data ?? response?.data ?? response;
        const items = Array.isArray(data)
          ? data
          : data?.items || data?.content || data?.results || [];
        if (active) {
          setProducts(
            [...items].sort(
              (first, second) => thicknessValue(first) - thicknessValue(second),
            ),
          );
        }
      })
      .catch((error) => {
        if (active) message.error(error?.message || "Không thể tải sản phẩm");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const currentItem = useMemo(
    () =>
      products.find(
        (product) => thicknessLabel(product) === selectedThickness,
      ) || products[0],
    [products, selectedThickness],
  );

  useEffect(() => {
    if (currentItem && thicknessLabel(currentItem) !== selectedThickness) {
      setSelectedThickness(thicknessLabel(currentItem));
    }
  }, [currentItem, selectedThickness, setSelectedThickness]);

  const baseUnitPrice = productPrice(currentItem);
  const discountRate = discountRateForArea(area);
  const unitPrice = baseUnitPrice * (1 - discountRate);
  const tierText = discountLabelForArea(area);

  const calculatedTotal = unitPrice * Number(area);

  if (loading) {
    return (
      <Flex justify="center" style={{ padding: 40 }}>
        <Spin />
      </Flex>
    );
  }

  if (!products.length) {
    return <Empty description="Chưa có sản phẩm để tính giá" />;
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#DF8A0F",
        },
      }}
    >
      <div
        className="pops-fast-calculator"
        style={{
          borderRadius: 16,
          margin: "0 30px 20px",
          padding: "28px 32px",
          color: "#fff",
          boxShadow: "0 10px 30px rgba(15, 15, 15, 0.15)",
          backgroundImage: productImage(currentItem)
            ? `linear-gradient(90deg, rgb(167 185 239 / 98%), rgba(28, 59, 145, 0.9)), url("${productImage(currentItem)}")`
            : undefined,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        {/* Header */}
        <Flex align="center" gap={10} style={{ marginBottom: 24 }}>
          <span style={{ fontSize: 20 }}>🧮</span>
          <Title
            level={4}
            style={{ color: "#000000", margin: 0, fontWeight: 700 }}
          >
            Tính giá nhanh
          </Title>
        </Flex>

        {/* Form Controls */}
        <Flex
          className="pops-fast-calculator-controls"
          justify="space-between"
          align="flex-start"
          gap={32}
          style={{ marginBottom: 24 }}
          wrap="wrap"
        >
          {/* Chọn độ dày */}
          <div style={{ flex: 1, minWidth: 280 }}>
            <Text
              style={{
                color: "#121312",
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: 0.5,
                display: "block",
                marginBottom: 12,
              }}
            >
              CHỌN ĐỘ DÀY
            </Text>
            <Radio.Group
              value={selectedThickness}
              onChange={(e) => setSelectedThickness(e.target.value)}
              buttonStyle="solid"
            >
              <Flex className="pops-thickness-options" gap={8} wrap>
                {products.map((item) => (
                  <Radio.Button
                    key={item.id || thicknessLabel(item)}
                    value={thicknessLabel(item)}
                    style={{
                      backgroundColor:
                        selectedThickness === thicknessLabel(item)
                          ? "#528e6d"
                          : "#23372a",
                      color:
                        selectedThickness === thicknessLabel(item)
                          ? "#fff"
                          : "#8fa395",
                      border: "none",
                      borderRadius: 8,
                      fontWeight: 600,
                      height: 40,
                      lineHeight: "40px",
                      padding: "0 16px",
                    }}
                  >
                    {thicknessLabel(item)}
                  </Radio.Button>
                ))}
              </Flex>
            </Radio.Group>
          </div>

          {/* Slider diện tích */}
          <div style={{ flex: 1, minWidth: 280 }}>
            <Flex
              justify="space-between"
              align="center"
              style={{ marginBottom: 8 }}
            >
              <Text
                style={{
                  color: "#000000",
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: 0.5,
                }}
              >
                DIỆN TÍCH – TỐI THIỂU 100M²
              </Text>
              <Text style={{ color: "#000000", fontWeight: 700, fontSize: 18 }}>
                {area} <span style={{ fontSize: 13 }}>m²</span>
              </Text>
            </Flex>
            <Slider
              min={100}
              max={3000}
              step={50}
              value={area}
              onChange={setArea}
              styles={{
                track: { background: "#e8e8e8" },
                rail: { background: "#2a4233" },
              }}
              tooltip={{ open: false }}
            />
          </div>
        </Flex>

        {/* Result Display Box */}
        <div
          style={{
            backgroundColor: "#145a62",
            borderRadius: 12,
            padding: "20px 28px",
            marginBottom: 16,
          }}
        >
          <Flex
            className="pops-fast-calculator-result"
            justify="space-between"
            align="center"
            wrap="wrap"
            gap={16}
          >
            <div>
              <Text style={{ color: "#ffff", fontSize: 13, display: "block" }}>
                Đơn giá ({tierText})
              </Text>
              <Text style={{ color: "#fff", fontSize: 22, fontWeight: 700 }}>
                {vnd(unitPrice)}
                <span
                  style={{ fontSize: 13, fontWeight: 400, color: "#8fa395" }}
                >
                  /m²
                </span>
              </Text>
            </div>

            <div>
              <Text style={{ color: "#ffff", fontSize: 13, display: "block" }}>
                Mức giá áp dụng
              </Text>
              <Text style={{ color: "#ffff", fontSize: 15, fontWeight: 600 }}>
                {tierText}
              </Text>
            </div>

            <div>
              <Text style={{ color: "#ffff", fontSize: 13, display: "block" }}>
                Thành tiền
              </Text>
              <Text style={{ color: "#ffff", fontSize: 22, fontWeight: 700 }}>
                {vnd(calculatedTotal)}
              </Text>
            </div>
          </Flex>
        </div>

        {/* Note */}
        <Text
          style={{
            color: "#000000",
            fontSize: 12,
            textAlign: "center",
            display: "block",
          }}
        >
          * Chưa bao gồm phí vận chuyển. Liên hệ để được báo giá chi tiết.
        </Text>
        <Flex justify="center" style={{ marginTop: 20 }}>
          <Button
            type="primary"
            size="large"
            icon={<ArrowRightOutlined />}
            onClick={() => onOpenOrder(selectedThickness, area, currentItem)}
            style={{
              width: 220, // Đặt độ rộng vừa phải cho nút (có thể tăng/giảm tùy ý)
              fontWeight: 600,
            }}
          >
            Đặt hàng ngay
          </Button>
        </Flex>
      </div>
    </ConfigProvider>
  );
}
