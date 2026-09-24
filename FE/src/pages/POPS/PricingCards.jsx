import {
  Button,
  Card,
  Empty,
  Pagination,
  Spin,
  Typography,
  message,
} from "antd";
import { useEffect, useState } from "react";
import { publicApi } from "../../api.js";
import { vnd } from "../../lib/format.js";

const { Title, Text } = Typography;
const PAGE_SIZE = 10;
const productImage = (product) =>
  product.imageUrl ||
  product.image ||
  product.imagePath ||
  product.thumbnailUrl;

export default function PricingCards({ onOpenOrder }) {
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const pageItems = products;

  useEffect(() => {
    let active = true;

    const loadProducts = async () => {
      setLoading(true);
      try {
        const response = await publicApi.getProducts({
          page,
          size: PAGE_SIZE,
        });
        const data = response?.data?.data ?? response?.data ?? response;
        const items = Array.isArray(data)
          ? data
          : data?.items || data?.content || data?.results || [];
        const totalItems =
          data?.totalElements ??
          data?.totalItems ??
          data?.total ??
          data?.page?.totalElements ??
          (data?.totalPages ? data.totalPages * PAGE_SIZE : 0);

        if (active) {
          setProducts(items);
          setTotal(totalItems);
        }
      } catch (error) {
        if (active) {
          setProducts([]);
          setTotal(0);
          message.error(error?.message || "Không thể tải danh sách sản phẩm");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadProducts();
    return () => {
      active = false;
    };
  }, [page]);

  return (
    <div id="bang-gia">
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Text type="secondary" strong>
            THẢM BÊ TÔNG VIỆT NAM
          </Text>
          <Title level={2}>Bảng Giá Bê Tông Cuộn</Title>
          <Text type="secondary">
            Công nghệ bê tông cuộn — thi công theo độ dày và diện tích. Đơn giá
            tính theo đồng / m²
          </Text>
        </div>
      </div>
      {loading ? (
        <div style={{ textAlign: "center", padding: 40 }}>
          <Spin />
        </div>
      ) : products.length === 0 ? (
        <Empty description="Chưa có sản phẩm" />
      ) : (
        <div className="pops-product-grid">
          {pageItems.map((item) => (
            <Card
              onClick={() =>
                onOpenOrder?.(`${item.thicknessMm || ""}mm`, 200, item)
              }
              key={item.id}
              className="pops-product-card"
              hoverable
              cover={
                productImage(item) ? (
                  <img alt={item.name} src={productImage(item)} />
                ) : (
                  <div className="pops-product-image-placeholder">BT</div>
                )
              }
            >
              <div className="pops-product-card-body">
                <Title level={4}>{item.name}</Title>
                <strong className="pops-product-price">
                  {vnd(item.unitPrice || 0)}
                </strong>
                <Button
                  type="primary"
                  block
                  onClick={() =>
                    onOpenOrder?.(`${item.thicknessMm || ""}mm`, 200, item)
                  }
                >
                  Đặt hàng
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
      {total > 0 && (
        <Pagination
          current={page}
          pageSize={PAGE_SIZE}
          total={total}
          showSizeChanger={false}
          onChange={setPage}
          style={{ marginTop: 24, textAlign: "center" }}
        />
      )}
    </div>
  );
}
