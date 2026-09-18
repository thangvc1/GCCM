import { Alert, Col, Row, Space, Table, Tag, Typography } from "antd";
import { vnd } from "../../lib/format.js";
import { PRICING_TABLE } from "./fakedata.js";

const { Title, Text } = Typography;

export default function PricingTable() {
  const COMMITMENTS = [
    "Giá ưu đãi cho công trình diện tích lớn.",
    "Bán sỉ tối thiểu 200m².",
    "Độ bền khoảng 8–10 năm.",
    "Công trình trên 5.000m² được hỗ trợ thi công.",
  ];
  const columns = [
    {
      title: "Độ dày",
      dataIndex: "thickness",
      key: "thickness",
      render: (text, record) => (
        <div>
          <Space>
            <Text strong style={{ fontSize: 16 }}>
              {text}
            </Text>
            {record.isPopular && <Tag color="gold">Phổ biến</Tag>}
          </Space>
          <div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.sub}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: "200 — 500m²",
      dataIndex: "p200_500",
      key: "p200_500",
      render: (val) => <Text strong>{vnd(val)}</Text>,
    },
    {
      title: "500 — 1.000m²",
      dataIndex: "p500_1000",
      key: "p500_1000",
      render: (val) => <Text strong>{vnd(val)}</Text>,
    },
    {
      title: "Từ 1.000m²",
      dataIndex: "pAbove1000",
      key: "pAbove1000",
      render: (val) => (
        <Text type="success" strong style={{ fontSize: 16 }}>
          {vnd(val)}
        </Text>
      ),
    },
    {
      title: "Ứng dụng",
      dataIndex: "tags",
      key: "tags",
      render: (tags) => (
        <>
          {tags.map((tag) => (
            <Tag color="blue" key={tag}>
              {tag}
            </Tag>
          ))}
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: "30px 0" }} id="bang-gia">
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <Text type="secondary" strong>
          THẢM XI MĂNG VIỆT NAM
        </Text>
        <Title level={2}>Bảng Giá Bê Tông Cuộn</Title>
        <Text type="secondary">
          Công nghệ bê tông cuộn — thi công theo độ dày và diện tích. Đơn giá
          tính theo đồng / m²
        </Text>
      </div>

      <Table
        columns={columns}
        dataSource={PRICING_TABLE}
        pagination={false}
        bordered
        rowClassName={(record) =>
          record.isPopular ? "ant-table-row-selected" : ""
        }
      />

      <Row gutter={[16, 12]} style={{ marginTop: 24 }}>
        {COMMITMENTS.map((item, idx) => (
          <Col xs={24} sm={12} key={idx}>
            <div
              style={{
                backgroundColor: "#f0f7f2",
                border: "1px solid #d8ece0",
                borderRadius: 10,
                padding: "14px 20px",
                color: "#2d523e",
                fontSize: 14,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              {/* Biểu tượng ô vuông nhỏ giống ảnh */}
              <span
                style={{
                  width: 8,
                  height: 8,
                  border: "1.5px solid #488265",
                  borderRadius: 2,
                  display: "inline-block",
                  flexShrink: 0,
                }}
              />
              <span>{item}</span>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
}
