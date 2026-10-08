import { useEffect, useMemo, useState } from "react";
import { Pagination, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { pageResult, storeApi } from "../api.js";
import { useStore } from "../store/StoreContext.jsx";
import { uid } from "../lib/format.js";
import Modal from "../components/Modal.jsx";
import { Button, Form, Input } from "antd";

const empty = () => ({ id: "", name: "", phone: "", note: "", points: 0 });

export default function Customers() {
  const { upsertCustomer, deleteCustomer, orders } = useStore();
  const [customers, setCustomers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tất cả");
  const [form, setForm] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQ(q);
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [q]);

  const loadCustomers = async () => {
    const result = pageResult(
      await storeApi.getCustomers({
        page,
        size,
        keyword: debouncedQ || undefined,
        status:
          statusFilter === "Tất cả"
            ? undefined
            : statusFilter === "Hoạt động"
              ? 1
              : 0,
      }),
    );
    setCustomers(result.items);
    setTotal(result.total);
  };

  useEffect(() => {
    loadCustomers();
  }, [page, size, debouncedQ, statusFilter]);

  const spent = (id) =>
    orders
      .filter((o) => o.customerId === id && o.status !== "đã hủy")
      .reduce((s, o) => s + o.total, 0);

  const save = (values) => {
    upsertCustomer({
      ...form,
      ...values,
      id: form.id || uid("c"),
      points: +form.points || 0,
    });
    loadCustomers();
    setForm(null);
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Khách hàng</h1>
          <p className="sub">Danh bạ, điểm tích lũy và lịch sử mua.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setForm(empty())}>
          + Thêm khách
        </button>
      </div>
      <div
        className="filters"
        style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
      >
        <Input
          prefix={<SearchOutlined style={{ color: "#999" }} />}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Tìm theo tên, SĐT, ghi chú..."
          style={{ maxWidth: 300 }}
          allowClear
        />
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          style={{ width: 180 }}
          options={[
            { value: "Tất cả", label: "Tất cả trạng thái" },
            { value: "Hoạt động", label: "Hoạt động" },
            { value: "Ngừng hoạt động", label: "Ngừng hoạt động" },
          ]}
        />
      </div>
      <div className="card table-wrap">
        <table>
          <thead>
            <tr>
              <th>Tên</th>
              <th>Điện thoại</th>
              <th>Ghi chú</th>
              <th className="right">Điểm</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.phone || "—"}</td>
                <td>{c.note || "—"}</td>
                <td className="right">{c.points || 0}</td>
                <td>
                  <div className="actions">
                    <button className="btn btn-sm" onClick={() => setForm(c)}>
                      Sửa
                    </button>
                    {c.id !== "c0" && (
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() =>
                          confirm("Xóa khách?") && deleteCustomer(c.id)
                        }
                      >
                        Xóa
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
      {form && (
        <Modal
          title={form.id ? "Sửa khách" : "Thêm khách"}
          onClose={() => setForm(null)}
        >
          <Form layout="vertical" initialValues={form} onFinish={save}>
            <Form.Item
              label="Tên"
              name="name"
              rules={[{ required: true, message: "Vui lòng nhập tên" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="Điện thoại" name="phone">
              <Input />
            </Form.Item>
            <Form.Item label="Ghi chú" name="note">
              <Input.TextArea rows={3} />
            </Form.Item>
            {form.id && (
              <p className="sub">
                Tổng đã mua: {spent(form.id).toLocaleString("vi-VN")} đ
              </p>
            )}
            <div className="actions" style={{ justifyContent: "flex-end" }}>
              <Button onClick={() => setForm(null)}>Hủy</Button>
              <Button type="primary" htmlType="submit">
                Lưu
              </Button>
            </div>
          </Form>
        </Modal>
      )}
    </div>
  );
}
