import { useState } from "react";
import { useStore } from "../store/StoreContext.jsx";
import { Button, Form, Input } from "antd";

export default function Settings() {
  const { settings, saveSettings } = useStore();
  const [form, setForm] = useState(settings);

  const save = (values) => {
    saveSettings(values);
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Cài đặt</h1>
          <p className="sub">Thông tin cửa hàng được đồng bộ từ hệ thống.</p>
        </div>
      </div>
      <div className="grid two">
        <Form className="card" layout="vertical" initialValues={form} onFinish={save}>
          <Form.Item label="Tên cửa hàng" name="shopName"><Input /></Form.Item>
          <Form.Item label="Địa chỉ" name="address"><Input /></Form.Item>
          <Form.Item label="Điện thoại" name="phone"><Input /></Form.Item>
          <Button type="primary" htmlType="submit">Lưu cài đặt</Button>
        </Form>
      </div>
    </div>
  );
}
