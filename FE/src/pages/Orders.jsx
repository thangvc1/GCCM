import { useMemo, useState } from "react";
import {
  Table,
  Tag,
  Button,
  Input,
  Select,
  Space,
  Popconfirm,
  Modal,
  message,
} from "antd";
import {
  EyeOutlined,
  CloseCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useStore } from "../store/StoreContext.jsx";
import { fmtDate, vnd } from "../lib/format.js";

export default function Orders() {
  const { orders, cancelOrder } = useStore();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("Tất cả");
  const [viewingOrder, setViewingOrder] = useState(null);

  const filteredOrders = useMemo(
    () =>
      orders.filter((o) => {
        const okStatus = status === "Tất cả" || o.status === status;
        const okQuery = `${o.code} ${o.customerName}`
          .toLowerCase()
          .includes(q.toLowerCase());
        return okStatus && okQuery;
      }),
    [orders, q, status],
  );

  const handleCancelOrder = (id) => {
    cancelOrder(id);
    message.warning("Đã hủy đơn hàng và hoàn trả số lượng vào kho");
  };

  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "code",
      key: "code",
      render: (code) => <strong>{code}</strong>,
    },
    {
      title: "Thời gian",
      dataIndex: "at",
      key: "at",
      render: (time) => fmtDate(time),
      sorter: (a, b) => new Date(a.at) - new Date(b.at),
    },
    {
      title: "Khách hàng",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Hình thức",
      dataIndex: "payMethod",
      key: "payMethod",
      render: (method) => <Tag color="geekblue">{method}</Tag>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (st) => {
        const isCanceled = st === "đã hủy";
        return (
          <Tag color={isCanceled ? "error" : "success"}>{st.toUpperCase()}</Tag>
        );
      },
      filters: [
        { text: "Hoàn tất", value: "hoàn tất" },
        { text: "Đã hủy", value: "đã hủy" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Tổng tiền",
      dataIndex: "total",
      key: "total",
      align: "right",
      render: (total) => <strong>{vnd(total)}</strong>,
      sorter: (a, b) => a.total - b.total,
    },
    {
      title: "Hành động",
      key: "actions",
      align: "center",
      width: 160,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => setViewingOrder(record)}
          >
            Chi tiết
          </Button>
          {record.status !== "đã hủy" && (
            <Popconfirm
              title="Hủy đơn hàng"
              description={`Xác nhận hủy đơn ${record.code} và hoàn lại kho?`}
              onConfirm={() => handleCancelOrder(record.id)}
              okText="Hủy đơn"
              cancelText="Không"
              okButtonProps={{ danger: true }}
            >
              <Button type="link" danger icon={<CloseCircleOutlined />}>
                Hủy
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="page-head" style={{ marginBottom: 16 }}>
        <div>
          <h1>Đơn hàng</h1>
          <p className="sub">Lịch sử bán hàng, hóa đơn và hoàn trả tồn kho.</p>
        </div>
      </div>

      <div
        className="filters"
        style={{ marginBottom: 16, display: "flex", gap: 12 }}
      >
        <Input
          prefix={<SearchOutlined style={{ color: "#999" }} />}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Tìm theo mã đơn hoặc tên khách hàng..."
          style={{ maxWidth: 300 }}
          allowClear
        />
        <Select
          value={status}
          onChange={setStatus}
          style={{ width: 160 }}
          options={[
            { value: "Tất cả", label: "Tất cả trạng thái" },
            { value: "hoàn tất", label: "Hoàn tất" },
            { value: "đã hủy", label: "Đã hủy" },
          ]}
        />
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <Table
          columns={columns}
          dataSource={filteredOrders}
          rowKey="id"
          pagination={{
            pageSize: 8,
            showSizeChanger: true,
            pageSizeOptions: ["8", "15", "30"],
            showTotal: (total) => `Tổng cộng ${total} đơn hàng`,
          }}
        />
      </div>

      {/* Modal chi tiết đơn hàng */}
      <Modal
        title={`Chi tiết đơn hàng: ${viewingOrder?.code}`}
        open={Boolean(viewingOrder)}
        onCancel={() => setViewingOrder(null)}
        footer={[
          <Button
            key="close"
            type="primary"
            onClick={() => setViewingOrder(null)}
          >
            Đóng
          </Button>,
        ]}
      >
        {viewingOrder && (
          <div>
            <p className="sub" style={{ marginBottom: 16 }}>
              <strong>{viewingOrder.customerName}</strong> ·{" "}
              {fmtDate(viewingOrder.at)} ·{" "}
              <Tag color="geekblue">{viewingOrder.payMethod}</Tag>
            </p>

            <div style={{ borderTop: "1px solid #eee", paddingTop: 10 }}>
              {viewingOrder.items.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "8px 0",
                    borderBottom: "1px dashed #f0f0f0",
                  }}
                >
                  <span>
                    {item.name} × <strong>{item.qty}</strong>
                  </span>
                  <strong>{vnd(item.price * item.qty)}</strong>
                </div>
              ))}
            </div>

            {viewingOrder.discount > 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 12,
                  color: "#d97706",
                }}
              >
                <span>Giảm giá</span>
                <span>-{vnd(viewingOrder.discount)}</span>
              </div>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 14,
                fontSize: 16,
                paddingTop: 10,
                borderTop: "2px solid #e4dbcd",
              }}
            >
              <span>Tổng thanh toán:</span>
              <strong style={{ color: "#c45c26", fontSize: 18 }}>
                {vnd(viewingOrder.total)}
              </strong>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
