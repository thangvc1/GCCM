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
      <Form.Item
        label="Họ và tên"
        name="fullName"
        rules={[
          {
            required: true,
            whitespace: true,
            message: "Họ và tên không được để trống",
          },
          { max: 100, message: "Họ tên không vượt quá 100 ký tự" },
        ]}
      >
        <Input
          placeholder="Nguyễn Văn A"
          disabled={isSubmitting}
          size="large"
        />
      </Form.Item>
      <Form.Item
        label="Tên đăng nhập"
        name="username"
        rules={[
          {
            required: true,
            whitespace: true,
            message: "Tên đăng nhập không được để trống",
          },
          { min: 4, max: 30, message: "Tên đăng nhập phải từ 4 đến 30 ký tự" },
          {
            pattern: /^[a-zA-Z0-9]+$/,
            message:
              "Tên đăng nhập không được chứa ký tự đặc biệt hoặc khoảng trắng",
          },
        ]}
      >
        <Input placeholder="nhanvien01" disabled={isSubmitting} size="large" />
      </Form.Item>
      <Form.Item
        label="Số điện thoại"
        name="phone"
        rules={[
          {
            required: true,
            whitespace: true,
            message: "Số điện thoại không được để trống",
          },
          {
            pattern: /^(0|\+84)(3|5|7|8|9)\d{8}$/,
            message: "Số điện thoại không hợp lệ (phải là số di động Việt Nam)",
          },
        ]}
      >
        <Input
          placeholder="0912 345 678"
          disabled={isSubmitting}
          size="large"
        />
      </Form.Item>
      <Form.Item
        label="Địa chỉ"
        name="address"
        rules={[
          {
            required: true,
            whitespace: true,
            message: "Địa chỉ không được để trống",
          },
          { min: 10, max: 255, message: "Địa chỉ phải từ 10 đến 255 ký tự" },
        ]}
      >
        <Input
          placeholder="Nhập địa chỉ"
          disabled={isSubmitting}
          size="large"
        />
      </Form.Item>
      <Form.Item
        label="Mật khẩu"
        name="password"
        rules={[
          {
            required: true,
            whitespace: true,
            message: "Mật khẩu không được để trống",
          },
          { min: 6, max: 50, message: "Mật khẩu phải từ 6 đến 50 ký tự" },
        ]}
      >
        <Input.Password
          placeholder="Tối thiểu 6 ký tự"
          disabled={isSubmitting}
          size="large"
        />
      </Form.Item>
      <Form.Item
        label="Xác nhận mật khẩu"
        name="confirmPassword"
        dependencies={["password"]}
        rules={[
          {
            required: true,
            whitespace: true,
            message: "Vui lòng xác nhận mật khẩu",
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              return !value || value === getFieldValue("password")
                ? Promise.resolve()
                : Promise.reject(new Error("Mật khẩu xác nhận không khớp"));
            },
          }),
        ]}
      >
        <Input.Password
          placeholder="Nhập lại mật khẩu"
          disabled={isSubmitting}
          size="large"
        />
      </Form.Item>
      <Button
        type="primary"
        htmlType="submit"
        block
        size="large"
        loading={isSubmitting}
      >
        Đăng ký tài khoản
      </Button>
      {onSwitchToLogin && (
        <p className="auth-switch">
          Đã có tài khoản?{" "}
          <Button type="link" onClick={onSwitchToLogin}>
            Đăng nhập
          </Button>
        </p>
      )}
    </Form>
  );
}
