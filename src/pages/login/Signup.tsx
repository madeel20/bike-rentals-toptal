import React, { useEffect, useState } from "react";
import { Form, Input, Button, Row, message } from "antd";
import { Link, useHistory } from "react-router-dom";
import { auth, firestore, googleProvider } from "../../firebase";
import firebase from "firebase";
import { Typography } from "antd";
import classes from "./login.module.css";
import { LockOutlined, UserOutlined } from "@ant-design/icons";

const { Title } = Typography;

export default function SignUpPage() {
  const history = useHistory();
  const [loading, setLoading] = useState<boolean>(false);

  const onFinish = (values: {
    email: string;
    password: string;
    fullname: string;
  }) => {
    setLoading(true);
    auth
      .createUserWithEmailAndPassword(values.email, values.password)
      .then((res: firebase.auth.UserCredential) => {
        res.user
          ?.updateProfile({
            displayName: values.fullname,
          })
          .then((res) => {
            history.push("/");
            message.success("SignUp Successful!");
          });
      })
      .catch((err) => {
        message.error(err?.message);
      })
      .finally(() => setLoading(false));
  };

  return (
    <Form
      name="normal_login"
      className="login-form"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      style={{ width: 350 }}
    >
      <Title>Sign UP</Title>

      <Form.Item
        name="fullname"
        rules={[{ required: true, message: "Please input your name!" }]}
      >
        <Input
          size="large"
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="Full Name"
        />
      </Form.Item>
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
          Sign Up
        </Button>{" "}
        &nbsp; &nbsp; Or{" "}
        <Button
          onClick={() => history.push("/")}
          disabled={loading}
          type="link"
        >
          Login
        </Button>
      </Form.Item>
    </Form>
  );
}
