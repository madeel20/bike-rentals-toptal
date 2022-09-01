import React, { useEffect, useState } from "react";
import { Form, Input, Button, Row, message } from "antd";
import { Link, useHistory } from "react-router-dom";
import { auth, googleProvider } from "../../firebase";
import firebase from "firebase";
import { Typography } from "antd";
import classes from "./login.module.css";
import { LockOutlined, UserOutlined } from "@ant-design/icons";

const { Title } = Typography;

export default function LoginPage() {
  const history = useHistory();
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = () => {
    auth.signInWithPopup(googleProvider);
  };

  const onFinish = (values: { email: string; password: string }) => {
    setLoading(true);
    auth
      .signInWithEmailAndPassword(values.email, values.password)
      .then((res: firebase.auth.UserCredential) => {
        message.success("Login Successful!");
      })
      .catch((err) => {
        message.error(err?.message);
      })
      .finally(() => setLoading(false));
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  // get redux state

  return (
    <Form
      name="normal_login"
      className="login-form"
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
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Password"
          size="large"
        />
      </Form.Item>

      <Form.Item>
        <Button loading={loading} type="primary" htmlType="submit" className="login-form-button">
          Log in
        </Button>{" "}
        &nbsp; &nbsp; Or <Button onClick={()=>history.push('/signup')} disabled={loading} type="link">register now!</Button>
      </Form.Item>
    </Form>
  );
}
