import { Button, Form, Input } from "antd";
import { useState } from "react";

export default function LoginForm({ onSubmit, onSwitchToRegister }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      await onSubmit?.(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form layout="vertical" onFinish={handleSubmit} requiredMark={false}>
      <Form.Item
        label="Tên đăng nhập"
        name="username"
        rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập" }]}
      >
        <Input placeholder="Nhập tên đăng nhập" disabled={isSubmitting} size="large" />
      </Form.Item>
      <Form.Item
        label="Mật khẩu"
        name="password"
        rules={[
          { required: true, message: "Vui lòng nhập mật khẩu" },
          // { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
        ]}
      >
        <Input.Password placeholder="Nhập mật khẩu" disabled={isSubmitting} size="large" />
      </Form.Item>
      <Button type="primary" htmlType="submit" block size="large" loading={isSubmitting}>
        Đăng nhập
      </Button>
      {onSwitchToRegister && (
        <p className="auth-switch">
          Chưa có tài khoản?{" "}
          <Button type="link" onClick={onSwitchToRegister}>Đăng ký ngay</Button>
        </p>
      )}
    </Form>
  );
}
