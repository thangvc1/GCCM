import { useEffect, useMemo, useState } from "react";
import { Pagination } from "antd";
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
  const [form, setForm] = useState(null);

  const loadCustomers = async () => {
    const result = pageResult(await storeApi.getCustomers({ page, size }));
    setCustomers(result.items);
    setTotal(result.total);
  };

  useEffect(() => {
    loadCustomers();
  }, [page, size]);

  const list = useMemo(
    () =>
      customers.filter((c) =>
        `${c.name} ${c.phone}`.toLowerCase().includes(q.toLowerCase()),
      ),
    [customers, q],
  );

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
      <div className="filters">
        <input
          className="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Tên, SĐT"
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
            {list.map((c) => (
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
