import React from "react";
import { Row, Col, Typography, Card } from "antd";
import {
  PhoneOutlined,
  EnvironmentOutlined,
  FacebookOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

export default function ContactSection() {
  return (
    <div style={{ marginTop: 40 }} id="lien-he">
      {/* Khối trên: Tiêu đề & Mở đầu */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <Text type="secondary" strong style={{ letterSpacing: "0.08em" }}>
          ĐẶT HÀNG / BÁO GIÁ
        </Text>
        <Title level={2} style={{ marginTop: 8, marginBottom: 12 }}>
          Liên hệ với chúng tôi
        </Title>
        <Text
          style={{
            fontSize: 15,
            color: "#595959",
            maxWidth: 600,
            display: "inline-block",
          }}
        >
          Liên hệ ngay để nhận báo giá chi tiết và hỗ trợ tư vấn phương án thi
          công tối ưu nhất cho công trình của bạn.
        </Text>
      </div>

      {/* Khối dưới: Card Thông tin liên hệ */}
      <Card
        bordered={false}
        style={{
          borderRadius: 16,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
          backgroundColor: "#f9fbf9",
          border: "1px solid #e2ece5",
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          padding: "32px 24px",
          width: "100%",
          margin: "0 auto",
        }}
      >
        <Title
          level={4}
          style={{
            marginTop: 0,
            marginBottom: 24,
            textAlign: "center",
            color: "#1c3a28",
          }}
        >
          Thông tin liên hệ trực tiếp
        </Title>

        <Row gutter={[24, 24]}>
          {/* Hotline / Zalo */}
          <Col xs={24} sm={12}>
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  backgroundColor: "#e8f5e9",
                  color: "#2e7d32",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  flexShrink: 0,
                }}
              >
                <PhoneOutlined />
              </div>
              <div>
                <Text
                  type="secondary"
                  style={{ fontSize: 13, display: "block" }}
                >
                  Hotline / Zalo:
                </Text>
                <a
                  href="tel:0979749602"
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#2e7d32",
                    textDecoration: "none",
                  }}
                >
                  0979 749 602
                </a>
              </div>
            </div>
          </Col>

          {/* Bán sỉ */}
          <Col xs={24} sm={12}>
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  backgroundColor: "#e8f5e9",
                  color: "#2e7d32",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  flexShrink: 0,
                }}
              >
                <EnvironmentOutlined />
              </div>
              <div>
                <Text
                  type="secondary"
                  style={{ fontSize: 13, display: "block" }}
                >
                  Chính sách bán sỉ:
                </Text>
                <Text strong style={{ fontSize: 16 }}>
                  Tối thiểu 200m² trở lên
                </Text>
              </div>
            </div>
          </Col>

          {/* Thời gian phản hồi */}
          <Col xs={24} sm={12}>
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  backgroundColor: "#e8f5e9",
                  color: "#2e7d32",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  flexShrink: 0,
                }}
              >
                <ClockCircleOutlined />
              </div>
              <div>
                <Text
                  type="secondary"
                  style={{ fontSize: 13, display: "block" }}
                >
                  Thời gian phản hồi:
                </Text>
                <Text strong style={{ fontSize: 16 }}>
                  Trong 30 phút (Giờ hành chính)
                </Text>
              </div>
            </div>
          </Col>

          {/* Facebook */}
          <Col xs={24} sm={12}>
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  backgroundColor: "#e8f5e9",
                  color: "#2e7d32",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  flexShrink: 0,
                }}
              >
                <FacebookOutlined />
              </div>
              <div>
                <Text
                  type="secondary"
                  style={{ fontSize: 13, display: "block" }}
                >
                  Fanpage Facebook:
                </Text>
                <Text strong style={{ fontSize: 16 }}>
                  Thảm xi măng Việt Nam
                </Text>
              </div>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
