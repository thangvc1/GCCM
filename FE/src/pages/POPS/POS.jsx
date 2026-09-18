import {
  Avatar,
  Dropdown,
  Form,
  Input,
  InputNumber,
  Layout,
  message,
  Modal,
  Select,
} from "antd";
import { useState } from "react";
import ContactSection from "./ContactSection";
import AdvantagesSection from "./AdvantagesSection";
import FastCalculator from "./FastCalculator";
import PricingCards from "./PricingCards";
import PricingTable from "./PricingTable";
import { PRICING_TABLE } from "./fakedata";
import { Link } from "react-router-dom";
import { vnd } from "../../lib/format.js";
import { useAuth } from "../../store/AuthContext.jsx";
import { publicApi } from "../../api.js";

const { Header, Content, Footer } = Layout;
const productImage = (product) =>
  product?.imageUrl ||
  product?.image ||
  product?.imagePath ||
  product?.thumbnailUrl;

const productThickness = (product) =>
  product?.thicknessMm || product?.thickness || product?.thicknessMM;

const productPrice = (product) =>
  Number(product?.unitPrice || product?.price || product?.basePrice || 0);

export default function POS() {
  const { user, logout } = useAuth();
  const [selectedThickness, setSelectedThickness] = useState("10mm");
  const [area, setArea] = useState(200);
  const [orderModal, setOrderModal] = useState(null);
  const [form] = Form.useForm();
  const orderArea = Form.useWatch("area", form) || orderModal?.area || 200;
  const orderPayMethod = Form.useWatch("payMethod", form) || "Chuyển khoản";
  const orderPrice = orderModal
    ? orderModal.item.unitPrice || orderModal.item.price
      ? productPrice(orderModal.item)
      : orderArea >= 1000
        ? orderModal.item.pAbove1000
        : orderArea >= 500
          ? orderModal.item.p500_1000
          : orderModal.item.p200_500
    : 0;
  const orderTotal = Number(orderArea) * orderPrice;
  const paymentDue =
    orderPayMethod === "Chuyển khoản" ? orderTotal * 0.5 : orderTotal;

  const handleOpenOrder = (thicknessStr, defaultArea = 200, product) => {
    const item =
      product ||
      PRICING_TABLE.find((p) => p.thickness === thicknessStr) ||
      PRICING_TABLE[2];
    setOrderModal({
      thickness: productThickness(item) ? `${productThickness(item)}mm` : thicknessStr,
      item,
      area: defaultArea,
    });
    form.setFieldsValue({ area: defaultArea, payMethod: "Chuyển khoản" });
  };

  const handleConfirmOrder = async (values) => {
    try {
      await publicApi.createOrder({
        ...values,
        thickness: orderModal.thickness,
        area: Number(orderArea),
        unitPrice: orderPrice,
        total: orderTotal,
      });
      message.success(
        `Đặt hàng thành công cho công trình ${values.customerName}!`,
      );
      setOrderModal(null);
    } catch (error) {
      message.error(error?.message || "Không thể tạo đơn hàng");
    }
  };

  return (
    <Layout
      className="pops-page"
      style={{ border: "none", minHeight: "100vh" }}
    >
      <header className="landing-header">
        <div className="landing-brand">
          <div className="brand-badge-box">BT</div>
          <div className="brand-text-wrap">
            <span className="brand-title">THẢM BÊ TÔNG</span>
            <span className="brand-sub">Việt Nam</span>
          </div>
        </div>

        <nav className="landing-nav-links">
          <a href="#bang-gia">Bảng giá</a>
          <a href="#uu-diem">Ưu điểm</a>
          <a href="#lien-he">Liên hệ</a>
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Nút Số điện thoại */}
          <a href="tel:0979749602" className="btn-header-phone">
            <span className="phone-ico">📞</span>
            <strong>0979 749 602</strong>
          </a>

          {user ? (
            <Dropdown
              trigger={["click"]}
              placement="bottomRight"
              dropdownRender={() => (
                <div className="pops-user-dropdown">
                  <div className="pops-user-dropdown-head">
                    <Avatar className="pops-user-avatar pops-user-avatar-large">
                      {(user.fullName || user.username || "U")
                        .charAt(0)
                        .toUpperCase()}
                    </Avatar>
                    <div>
                      <strong>{user.fullName || user.username}</strong>
                      <span>{user.username}</span>
                    </div>
                  </div>
                  <div className="pops-user-details">
                    <div>
                      <span>Vai trò</span>
                      <strong>
                        {user.role === "ROLE_ADMIN"
                          ? "Quản trị viên"
                          : "Khách hàng"}
                      </strong>
                    </div>
                    {user.phone && (
                      <div>
                        <span>Số điện thoại</span>
                        <strong>{user.phone}</strong>
                      </div>
                    )}
                    {user.address && (
                      <div>
                        <span>Địa chỉ</span>
                        <strong>{user.address}</strong>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    className="pops-user-logout"
                    onClick={logout}
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            >
              <button
                type="button"
                className="pops-user-trigger"
                aria-label="Mở thông tin người dùng"
              >
                <Avatar className="pops-user-avatar">
                  {(user.fullName || user.username || "U")
                    .charAt(0)
                    .toUpperCase()}
                </Avatar>
                <span className="pops-user-trigger-name">
                  {user.fullName || user.username}
                </span>
              </button>
            </Dropdown>
          ) : (
            <Link
              to="/login"
              style={{
                padding: "6px 16px",
                backgroundColor: "#2b4836",
                color: "#ffffff",
                borderRadius: 20,
                fontWeight: 600,
                fontSize: 14,
                textDecoration: "none",
                transition: "all 0.3s ease",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Đăng nhập
            </Link>
          )}
        </div>
      </header>
      <section className="lp-hero lp-hero-full-width">
        <div className="hero-container">
          <div className="lp-hero-grid">
            <div className="lp-hero-left">
              <div className="lp-hero-tag">
                <span className="pill-dot">●</span> THẢM XI MĂNG VIỆT NAM — BÊ
                TÔNG CUỘN
              </div>
              <h1 className="lp-hero-title">
                BẢNG GIÁ <br />
                <span className="text-mint">BÊ TÔNG</span> <br />
                <span className="text-mint">CUỘN</span>
              </h1>
              <p className="lp-hero-desc">
                Công nghệ bê tông cuộn — thi công theo độ dày và diện tích.{" "}
                <br />
                Bán sỉ tối thiểu <strong>200m²</strong>. Công trình lớn hỗ trợ
                thi công.
              </p>

              <div className="lp-hero-stats">
                <div className="stat-block">
                  <strong>68.000đ</strong>
                  <span>/m² giá bán buôn</span>
                </div>
                <div className="stat-block">
                  <strong>200m²</strong>
                  <span>bán sỉ tối thiểu</span>
                </div>
                <div className="stat-block">
                  <strong>8–10 năm</strong>
                  <span>độ bền ước tính</span>
                </div>
              </div>

              <div className="lp-hero-btns">
                <button
                  type="button"
                  className="btn-lp-primary"
                  onClick={() => handleOpenOrder("10mm", 200)}
                >
                  Đặt hàng ngay
                </button>
                <a href="#bang-gia" className="btn-lp-secondary">
                  Xem bảng giá
                </a>
              </div>
            </div>

            <div className="lp-hero-right">
              <div className="lp-commitment-box">
                <h3 className="commitment-title">CAM KẾT CỦA CHÚNG TÔI</h3>
                <ul className="commitment-ul">
                  <li>
                    <span className="chk">•</span> Giá xuất xưởng cho công trình
                    diện tích lớn.
                  </li>
                  <li>
                    <span className="chk">•</span> Bán sỉ tối thiểu 200m².
                  </li>
                  <li>
                    <span className="chk">•</span> Độ bền khoảng 8–10 năm.
                  </li>
                  <li>
                    <span className="chk">•</span> Công trình trên 5.000m² được
                    hỗ trợ thi công.
                  </li>
                </ul>
                <div className="commitment-hotline">
                  <span className="lbl">Hotline / Zalo:</span>
                  <a href="tel:0979749602" className="val">
                    0979 749 602
                  </a>
                  <span className="fb-text">
                    Facebook: Thảm xi măng Việt Nam
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="lp-marquee-bar lp-marquee-full-width">
        <div className="marquee-track">
          <span>🚚 GIAO HÀNG TOÀN QUỐC</span>
          <span>📦 BÁN SỈ TỐI THIỂU 200M²</span>
          <span>💰 GIÁ TỐT NHẤT THỊ TRƯỜNG</span>
          <span>✅ BÊ TÔNG CUỘN CHÍNH HÃNG</span>
        </div>
      </div>
      {/* <PricingTable /> */}
      <PricingCards onOpenOrder={handleOpenOrder} />

      <FastCalculator
        selectedThickness={selectedThickness}
        setSelectedThickness={setSelectedThickness}
        area={area}
        setArea={setArea}
        onOpenOrder={handleOpenOrder}
      />
      {/* </Content> */}
      <AdvantagesSection />
      <ContactSection />

      {/* Modal Đặt Hàng */}
      <Modal
        title={`Đặt hàng Bê tông cuộn ${orderModal?.thickness}`}
        width={900}
        open={!!orderModal}
        onCancel={() => setOrderModal(null)}
        onOk={() => form.submit()}
        okText="Xác nhận tạo đơn"
        cancelText="Hủy"
      >
        {orderModal && (
          <div className="order-modal-layout">
            <div className="order-modal-product">
              {productImage(orderModal.item) ? (
                  <img
                    src={productImage(orderModal.item)}
                  alt={orderModal.item.name || orderModal.thickness}
                />
              ) : (
                <div className="order-modal-product-placeholder">BT</div>
              )}
              <h3>{orderModal.item.name || `Bê tông cuộn ${orderModal.thickness}`}</h3>
              <strong>{vnd(orderModal.item.unitPrice || orderPrice)}</strong>
              {orderModal.item.description && <p>{orderModal.item.description}</p>}
            </div>
            <div className="order-modal-form">
              <Form form={form} layout="vertical" onFinish={handleConfirmOrder}>
            <Form.Item
              name="customerName"
              label="Tên người nhận / Công trình"
              rules={[{ required: true }]}
            >
              <Input placeholder="Anh Hùng - Công trình Đồng Nai" />
            </Form.Item>
            <Form.Item
              name="phone"
              label="Số điện thoại"
              rules={[{ required: true }]}
            >
              <Input placeholder="09xx xxx xxx" />
            </Form.Item>
            <Form.Item name="area" label="Diện tích (m²)">
              <InputNumber min={200} style={{ width: "100%" }} />
            </Form.Item>
            <div className="order-payment-summary">
              <div>
                <span>Đơn giá</span>
                <strong>{vnd(orderPrice)} / m²</strong>
              </div>
              <div>
                <span>Tổng tiền</span>
                <strong>{vnd(orderTotal)}</strong>
              </div>
              <div className="order-payment-due">
                <span>Số tiền cần thanh toán</span>
                <strong>{vnd(paymentDue)}</strong>
              </div>
            </div>
            <Form.Item name="address" label="Địa chỉ giao hàng">
              <Input placeholder="Số nhà, Xã, Tỉnh..." />
            </Form.Item>
            <Form.Item name="payMethod" label="Phương thức thanh toán">
              <Select>
                <Select.Option value="Chuyển khoản">
                  Chuyển khoản cọc 50%
                </Select.Option>
                <Select.Option value="Chờ tư vấn">Chờ tư vấn</Select.Option>
              </Select>
            </Form.Item>
              </Form>
            </div>
          </div>
        )}
      </Modal>
      <Footer
        style={{
          backgroundColor: "#1c2d22",
          color: "#ffffff",
          padding: "24px 40px",
          marginTop: 40,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          {/* Cột 1: Logo & Tên thương hiệu */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                backgroundColor: "#3a6048",
                color: "#ffffff",
                fontWeight: 800,
                fontSize: 13,
                padding: "6px 8px",
                borderRadius: 6,
                lineHeight: 1,
              }}
            >
              TXM
            </div>
            <div>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 15,
                  letterSpacing: 0.5,
                  color: "#ffffff",
                }}
              >
                THẢM XI MĂNG VIỆT NAM
              </div>
              <div style={{ fontSize: 12, color: "#8b9b90", marginTop: 2 }}>
                Bê tông cuộn chuyên nghiệp
              </div>
            </div>
          </div>

          {/* Cột 2: Hotline & Facebook */}
          <div style={{ fontSize: 13, color: "#a3b2a7", textAlign: "center" }}>
            Hotline / Zalo:{" "}
            <a
              href="tel:0979749602"
              style={{
                color: "#ffffff",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              0979 749 602
            </a>{" "}
            • Facebook:{" "}
            <span style={{ color: "#a3b2a7" }}>Thảm xi măng Việt Nam</span>
          </div>

          {/* Cột 3: Bản quyền */}
          <div style={{ fontSize: 13, color: "#8b9b90" }}>
            © {new Date().getFullYear()} Thảm Xi Măng Việt Nam
          </div>
        </div>
      </Footer>
    </Layout>
  );
}
