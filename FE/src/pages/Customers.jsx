import { useEffect, useState } from "react";
import { message, Pagination, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { pageResult, storeApi } from "../api.js";
import { useStore } from "../store/StoreContext.jsx";
import Modal from "../components/Modal.jsx";
import { Button, Form, Input } from "antd";

const empty = () => ({
  id: "",
  username: "",
  password: "",
  fullName: "",
  phone: "",
  address: "",
});

const customerFormValues = (customer) => ({
  id: customer.id,
  fullName: customer.fullName ?? customer.name ?? "",
  username: customer.username ?? "",
  phone: customer.phone ?? "",
  address: customer.address ?? "",
  status: Number(customer.status ?? 1),
  password: "",
});

export default function Customers() {
  const { upsertCustomer, orders } = useStore();
  const [customers, setCustomers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [statusFilter, setStatusFilter] = useState(0);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [statusLoadingId, setStatusLoadingId] = useState(null);

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
        status: statusFilter,
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

  const save = async (values) => {
    const customer = {
      ...(form.id ? { id: form.id } : {}),
      username: values.username,
      fullName: values.fullName,
      phone: values.phone,
      address: values.address,
      ...(form.id ? { status: Number(form.status) } : {}),
      ...(values.password ? { password: values.password } : {}),
    };
    setSaving(true);
    try {
      await upsertCustomer(customer);
      await loadCustomers();
      setForm(null);
      message.success(form.id ? "Đã cập nhật khách hàng" : "Đã thêm khách hàng");
    } catch (error) {
      message.error(error?.message || "Không thể lưu khách hàng");
    } finally {
      setSaving(false);
    }
  };

  const updateCustomerStatus = async (customer, status) => {
    setStatusLoadingId(customer.id);
    try {
      await storeApi.updateCustomer(customer.id, { ...customer, status });
      await loadCustomers();
      message.success(
        status === 1
          ? "Đã chuyển khách hàng sang trạng thái hoạt động"
          : "Đã ngừng hoạt động khách hàng",
      );
    } catch (error) {
      message.error(error?.message || "Không thể cập nhật trạng thái khách hàng");
    } finally {
      setStatusLoadingId(null);
    }
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
          placeholder="Tìm theo tên, tài khoản, SĐT..."
          style={{ maxWidth: 300 }}
          allowClear
        />
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          style={{ width: 180 }}
          options={[
            { value: 0, label: "Tất cả trạng thái" },
            { value: 1, label: "Hoạt động" },
            { value: 2, label: "Ngừng hoạt động" },
          ]}
        />
      </div>
      <div className="card table-wrap">
        <table>
          <thead>
            <tr>
              <th>Tài khoản</th>
              <th>Họ và tên</th>
              <th>Điện thoại</th>
              <th>Địa chỉ</th>
              <th>Trạng thái</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id}>
                <td>{c.username || "—"}</td>
                <td>{c.fullName || c.name || "—"}</td>
                <td>{c.phone || "—"}</td>
                <td>{c.address || "—"}</td>
                <td>
                  <Select
                    value={Number(c.status)}
                    style={{ width: 170 }}
                    loading={statusLoadingId === c.id}
                    disabled={statusLoadingId === c.id || c.id === "c0"}
                    onChange={(status) => updateCustomerStatus(c, status)}
                    options={[
                      { value: 1, label: "Hoạt động" },
                      { value: 2, label: "Ngừng hoạt động" },
                    ]}
                  />
                </td>
                <td>
                  <div className="actions">
                    <button
                      className="btn btn-sm"
                      onClick={() => setForm(customerFormValues(c))}
                    >
                      Sửa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          style={{ display: "flex", justifyContent: "flex-end" }}
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
          onClose={() => {
            if (!saving) setForm(null);
          }}
        >
          <Form layout="vertical" initialValues={form} onFinish={save}>
            <Form.Item
              label="Tài khoản"
              name="username"
              rules={[{ required: true, message: "Vui lòng nhập tài khoản" }]}
            >
              <Input />
            </Form.Item>
            {!form.id && (
              <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
              >
                <Input.Password />
              </Form.Item>
            )}
            <Form.Item
              label="Họ và tên"
              name="fullName"
              rules={[{ required: true, message: "Vui lòng nhập tên" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="Điện thoại" name="phone">
              <Input />
            </Form.Item>
            <Form.Item label="Địa chỉ" name="address">
              <Input />
            </Form.Item>
            {form.id && (
              <p className="sub">
                Tổng đã mua: {spent(form.id).toLocaleString("vi-VN")} đ
              </p>
            )}
            <div className="actions" style={{ justifyContent: "flex-end" }}>
              <Button onClick={() => setForm(null)} disabled={saving}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" loading={saving}>
                Lưu
              </Button>
            </div>
          </Form>
        </Modal>
      )}
    </div>
  );
}
