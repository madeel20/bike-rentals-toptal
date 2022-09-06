import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { useHistory } from "react-router-dom";
import { auth } from "../../firebase";
import firebase from "firebase";
import { Typography } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import User from "../../interfaces/User";

const { Title } = Typography;

type FormFields = Pick<User, "email" | "password">;

export default function LoginPage() {
  const history = useHistory();
  const [loading, setLoading] = useState<boolean>(false);

  const onFinish = (values: FormFields) => {
    setLoading(true);
    auth
      .signInWithEmailAndPassword(values.email, values.password!)
      .then((res: firebase.auth.UserCredential) => {
        message.success("Login Successful!");
      })
      .catch((err) => {
        message.error(err?.message);
      })
      .finally(() => setLoading(false));
  };

  return (
    <Form
      name="normal_login"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      style={{ width: 350 }}
    >
      <Title>Sign In</Title>

      <Form.Item
        name="email"
        rules={[
          { required: true, message: "Please input your email!" },
          {
            type: "email",
            message: "Enter a valid email",
          },
        ]}
      >
        <Input
          size="large"
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="Email"
        />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          { required: true, message: "Please input your Password!" },
          {
            min: 6,
            message: "Password should be more then 6 characters.",
          },
        ]}
      >
        <Input.Password
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Password"
          size="large"
        />
      </Form.Item>

      <Form.Item>
        <Button
          loading={loading}
          type="primary"
          htmlType="submit"
          className="login-form-button"
        >
          Log in
        </Button>{" "}
        &nbsp; &nbsp; Or{" "}
        <Button
          onClick={() => history.push("/signup")}
          disabled={loading}
          type="link"
        >
          Sign Up
        </Button>
      </Form.Item>
    </Form>
  );
}
