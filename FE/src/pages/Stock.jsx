import { useEffect, useState } from "react";
import { Pagination } from "antd";
import { pageResult, storeApi } from "../api.js";
import { useStore } from "../store/StoreContext.jsx";
import { fmtDate } from "../lib/format.js";
import { Button, Form, Input, InputNumber, Select } from "antd";

export default function Stock() {
  const { products, adjustStock } = useStore();
  const [stockLogs, setStockLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [productId, setProductId] = useState(products[0]?.id || "");
  const [qty, setQty] = useState(10);
  const [type, setType] = useState("nhập");
  const [note, setNote] = useState("");

  const loadStockLogs = async () => {
    const result = pageResult(await storeApi.getStockLogs({ page, size }));
    setStockLogs(result.items);
    setTotal(result.total);
  };

  useEffect(() => {
    loadStockLogs();
  }, [page, size]);

  const submit = (values) => {
    adjustStock(values);
    loadStockLogs();
    setNote("");
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Tồn kho</h1>
          <p className="sub">Nhập, xuất, kiểm kê và cảnh báo định mức.</p>
        </div>
      </div>
      <div className="grid three">
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Điều chỉnh</h3>
          <Form
            layout="vertical"
            onFinish={submit}
            initialValues={{ productId, qty: 10, type: "nhập" }}
          >
            <Form.Item
              label="Sản phẩm"
              name="productId"
              rules={[{ required: true }]}
            >
              <Select
                options={products.map((p) => ({
                  value: p.id,
                  label: `${p.name} (còn ${p.stock})`,
                }))}
              />
            </Form.Item>
            <Form.Item label="Loại" name="type" rules={[{ required: true }]}>
              <Select
                options={[
                  { value: "nhập", label: "Nhập kho" },
                  { value: "xuất", label: "Xuất kho" },
                  { value: "kiểm", label: "Kiểm kê / hao" },
                ]}
              />
            </Form.Item>
            <Form.Item
              label="Số lượng"
              name="qty"
              rules={[{ required: true, type: "number", min: 1 }]}
            >
              <InputNumber style={{ width: "100%" }} min={1} />
            </Form.Item>
            <Form.Item label="Ghi chú" name="note">
              <Input placeholder="Nhà cung cấp, lý do..." />
            </Form.Item>
            <Button type="primary" htmlType="submit">
              Cập nhật kho
            </Button>
          </Form>
        </div>
        <div className="card" style={{ gridColumn: "span 2" }}>
          <h3 style={{ marginTop: 0 }}>Sổ kho</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Thời gian</th>
                  <th>SP</th>
                  <th>Loại</th>
                  <th className="right">SL</th>
                  <th>Ghi chú</th>
                </tr>
              </thead>
              <tbody>
                {stockLogs.map((l) => (
                  <tr key={l.id}>
                    <td>{fmtDate(l.at)}</td>
                    <td>{l.productName}</td>
                    <td>
                      <span className="tag">{l.type}</span>
                    </td>
                    <td className="right">{l.qty > 0 ? `+${l.qty}` : l.qty}</td>
                    <td>{l.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            current={page}
            pageSize={size}
            total={total}
            showSizeChanger
            pageSizeOptions={[10, 50, 100]}
            onChange={(nextPage, nextSize) => {
              setPage(nextSize !== size ? 1 : nextPage);
              setSize(nextSize);
            }}
          />
        </div>
      </div>
    </div>
  );
}
