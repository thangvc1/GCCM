import { Button, Form, Input } from "antd";
import { useState } from "react";

export default function RegisterForm({ onSubmit, onSwitchToLogin }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async ({ confirmPassword, ...values }) => {
    setIsSubmitting(true);
    try {
      await onSubmit?.(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form layout="vertical" onFinish={handleSubmit} requiredMark={false}>
      <Form.Item label="Họ và tên" name="fullName" rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}>
        <Input placeholder="Nguyễn Văn A" disabled={isSubmitting} size="large" />
      </Form.Item>
      <Form.Item label="Tên đăng nhập" name="username" rules={[{ required: true, min: 3, message: "Tên đăng nhập tối thiểu 3 ký tự" }]}>
        <Input placeholder="nhanvien01" disabled={isSubmitting} size="large" />
      </Form.Item>
      <Form.Item label="Số điện thoại" name="phone" rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}>
        <Input placeholder="0912 345 678" disabled={isSubmitting} size="large" />
      </Form.Item>
      <Form.Item label="Địa chỉ" name="address" rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}>
        <Input placeholder="Nhập địa chỉ" disabled={isSubmitting} size="large" />
      </Form.Item>
      <Form.Item label="Mật khẩu" name="password" rules={[{ required: true, min: 6, message: "Mật khẩu tối thiểu 6 ký tự" }]}>
        <Input.Password placeholder="Tối thiểu 6 ký tự" disabled={isSubmitting} size="large" />
      </Form.Item>
      <Form.Item
        label="Xác nhận mật khẩu"
        name="confirmPassword"
        dependencies={["password"]}
        rules={[
          { required: true, message: "Vui lòng xác nhận mật khẩu" },
          ({ getFieldValue }) => ({
            validator(_, value) {
              return !value || value === getFieldValue("password")
                ? Promise.resolve()
                : Promise.reject(new Error("Mật khẩu xác nhận không khớp"));
            },
          }),
        ]}
      >
        <Input.Password placeholder="Nhập lại mật khẩu" disabled={isSubmitting} size="large" />
      </Form.Item>
      <Button type="primary" htmlType="submit" block size="large" loading={isSubmitting}>
        Đăng ký tài khoản
      </Button>
      {onSwitchToLogin && (
        <p className="auth-switch">
          Đã có tài khoản?{" "}
          <Button type="link" onClick={onSwitchToLogin}>Đăng nhập</Button>
        </p>
      )}
    </Form>
  );
}
