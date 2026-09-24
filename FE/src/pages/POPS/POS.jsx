import { PhoneOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Dropdown,
  Form,
  Input,
  InputNumber,
  Layout,
  message,
  Modal,
  Select,
  Space,
} from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";
import { publicApi } from "../../api.js";
import { vnd } from "../../lib/format.js";
import { useAuth } from "../../store/AuthContext.jsx";
import AboutSection from "./AboutSection";
import AdvantagesSection from "./AdvantagesSection";
import ContactSection from "./ContactSection";
import FastCalculator from "./FastCalculator";
import HeroSection from "./HeroSection";
import PricingCards from "./PricingCards";
import ProcessSection from "./ProcessSection";
import SpecsSection from "./SpecsSection";
import StructureSection from "./StructureSection";
import { PRICING_TABLE } from "./fakedata";

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
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
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
      thickness: productThickness(item)
        ? `${productThickness(item)}mm`
        : thicknessStr,
      item,
      area: defaultArea,
    });
    form.setFieldsValue({ area: defaultArea, payMethod: "Chuyển khoản" });
  };

  const handleConfirmOrder = async (values) => {
    if (!orderModal) return;
    setIsSubmittingOrder(true);
    try {
      await publicApi.createOrder({
        receiverName: values.customerName,
        receiverPhone: values.phone,
        deliveryAddress: values.address,
        items: [
          {
            productId: orderModal.item.id,
            quantityM2: Number(orderArea),
          },
        ],
        customerNote: orderModal.thickness,
        // unitPrice: orderPrice,
        // total: orderTotal,
      });
      message.success(
        `Đặt hàng thành công cho công trình ${values.customerName}!`,
      );
      setOrderModal(null);
      form.resetFields();
    } catch (error) {
      message.error(error?.message || "Không thể tạo đơn hàng");
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  return (
    <Layout
      className="pops-page"
      style={{ border: "none", minHeight: "100vh" }}
    >
      <header className="landing-header">
        <Link className="landing-brand" to="/">
          <img
            src="/dist/img/logo.jpg"
            alt="Thảm Bê Tông Việt Nam logo"
            style={{
              width: 42,
              height: 42,
              objectFit: "cover",
              borderRadius: 10,
              display: "block",
            }}
          />
          <div className="brand-text-wrap">
            <span className="brand-title">THẢM BÊ TÔNG</span>
            <span className="brand-sub">Việt Nam</span>
          </div>
        </Link>

        <nav className="landing-nav-links">
          <a href="#ve-chung-toi">Về chúng tôi</a>
          <a href="#cau-tao">Cấu tạo sản phẩm</a>
          <a href="#quy-trinh">Quy trình</a>
          <a href="#thong-so">Thông số</a>
          <a href="#bang-gia">Bảng giá</a>
          <a href="#uu-diem">Ưu điểm</a>
          <a href="#lien-he">Liên hệ</a>
        </nav>

        <div className="landing-header-actions">
          {/* Nút Số điện thoại */}
          <Space size={8}>
            <Button
              type="default"
              icon={<PhoneOutlined />}
              href="tel:0345412152"
              style={{
                borderRadius: 20,
                fontWeight: 600,
                fontSize: 13,
                borderColor: "#2b4836",
                color: "#2b4836",
              }}
            >
              0345 412 152
            </Button>

            <Button
              type="default"
              icon={<PhoneOutlined />}
              href="tel:0375033487"
              style={{
                borderRadius: 20,
                fontWeight: 600,
                fontSize: 13,
                borderColor: "#2b4836",
                color: "#2b4836",
              }}
            >
              0375 033 487
            </Button>
          </Space>
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
      <HeroSection onOpenOrder={handleOpenOrder} />
      <div className="lp-marquee-bar lp-marquee-full-width">
        <div className="marquee-track">
          <span>SẢN XUẤT TẠI VIỆT NAM — CÔNG NGHỆ TIÊN TIẾN TỪ NƯỚC NGOÀI</span>
          <span>Đồng Hành Cùng Mọi Công Trình ›</span>
        </div>
      </div>

      <AboutSection />
      <StructureSection />
      <ProcessSection />
      <SpecsSection />

      <FastCalculator
        selectedThickness={selectedThickness}
        setSelectedThickness={setSelectedThickness}
        area={area}
        setArea={setArea}
        onOpenOrder={handleOpenOrder}
      />
      <PricingCards onOpenOrder={handleOpenOrder} />

      {/* </Content> */}
      <AdvantagesSection />
      <ContactSection />

      {/* Modal Đặt Hàng */}
      <Modal
        className="pops-order-modal"
        title={`Đặt hàng Bê tông cuộn ${orderModal?.thickness}`}
        width={900}
        open={!!orderModal}
        onCancel={() => setOrderModal(null)}
        onOk={() => form.submit()}
        confirmLoading={isSubmittingOrder}
        cancelButtonProps={{
          danger: true,
          className: "pops-cancel-button",
        }}
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
              <h3>
                {orderModal.item.name || `Bê tông cuộn ${orderModal.thickness}`}
              </h3>
              <strong>{vnd(orderModal.item.unitPrice || orderPrice)}</strong>
              {orderModal.item.description && (
                <div
                  className="order-modal-product-description"
                  dangerouslySetInnerHTML={{
                    __html: orderModal.item.description,
                  }}
                />
              )}
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
            <img
              src="/dist/img/logo.jpg"
              alt="Thảm Bê Tông Việt Nam logo"
              style={{
                width: 36,
                height: 36,
                objectFit: "cover",
                borderRadius: 8,
                display: "block",
              }}
            />
            <div>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 15,
                  letterSpacing: 0.5,
                  color: "#ffffff",
                }}
              >
                THẢM BÊ TÔNG VIỆT NAM
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
              style={{
                color: "#ffffff",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              0345 412 152 - 0375 033 487
            </a>{" "}
            • Facebook:{" "}
            <span style={{ color: "#a3b2a7" }}>Thảm Bê Tông Việt Nam</span>
          </div>

          {/* Cột 3: Bản quyền */}
          <div style={{ fontSize: 13, color: "#8b9b90" }}>
            © {new Date().getFullYear()} Thảm Bê Tông Việt Nam
          </div>
        </div>
      </Footer>
    </Layout>
  );
}
