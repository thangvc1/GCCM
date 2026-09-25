import { ArrowRightOutlined } from "@ant-design/icons";
import { Button, ConfigProvider, Flex, Radio, Slider, Typography } from "antd";
import { useMemo } from "react";
import { vnd } from "../../lib/format.js";
import { PRICING_TABLE } from "./fakedata.js";

const { Text, Title } = Typography;

export default function FastCalculator({
  selectedThickness,
  setSelectedThickness,
  area,
  setArea,
  onOpenOrder,
}) {
  const currentItem = useMemo(
    () =>
      PRICING_TABLE.find((p) => p.thickness === selectedThickness) ||
      PRICING_TABLE[2],
    [selectedThickness],
  );

  const { unitPrice, tierText } = useMemo(() => {
    if (area < 500)
      return { unitPrice: currentItem.p200_500, tierText: "Dưới 500m²" };
    if (area <= 1000)
      return { unitPrice: currentItem.p500_1000, tierText: "500m² - 1.000m²" };
    return { unitPrice: currentItem.pAbove1000, tierText: "Trên 1.000m²" };
  }, [area, currentItem]);

  const calculatedTotal = unitPrice * area;

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
                {PRICING_TABLE.map((item) => (
                  <Radio.Button
                    key={item.thickness}
                    value={item.thickness}
                    style={{
                      backgroundColor:
                        selectedThickness === item.thickness
                          ? "#528e6d"
                          : "#23372a",
                      color:
                        selectedThickness === item.thickness
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
                    {item.thickness}
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
                DIỆN TÍCH – TỐI THIỂU 200M²
              </Text>
              <Text style={{ color: "#000000", fontWeight: 700, fontSize: 18 }}>
                {area} <span style={{ fontSize: 13 }}>m²</span>
              </Text>
            </Flex>
            <Slider
              min={200}
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
            backgroundColor: "#131f18",
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
            onClick={() => onOpenOrder(selectedThickness, area)}
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
