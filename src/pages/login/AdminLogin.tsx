import React, { useEffect, useState } from "react";
import { Form, Input, Button, Typography, message } from 'antd';
import { Link, useHistory } from "react-router-dom";
import { auth } from "../../firebase";

const { Title } = Typography;
export default function AdminLogin() {
    const [loading, setLoading] = useState(false)
  const history = useHistory();

  const handleSubmit = (values:any) => {
    setLoading(true)
      auth.signInWithEmailAndPassword(values?.email,values?.password).then((res:any)=>{
        history.push('/');
      })
      .catch((err:any)=>{
          message.error(err?.message);
      }).finally(()=>setLoading(false))
  }

  return (
    <div className="login-container text-center">
      <Form onFinish={handleSubmit} className="inner-container">

         <Title className="mb-4">Calorie Tracking App(Admin Login)</Title>

        <Form.Item
          name="email"
          rules={[{ required: true, message: 'Please input your email!' }]}
        >
          <Input type="email" placeholder="Email" disabled={loading} />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password
            iconRender={() => <a>Show</a>}
            placeholder="Password"
            disabled={loading}
          />
        </Form.Item>

        <Button size="large" type="primary" htmlType="submit" className="c-button large" loading={loading}>
          Log in
        </Button>

        <div className="more-pages mt-4">
          <span>For Users <Link to="/">Go to Sign In</Link></span>
        </div>

      </Form>
    </div>
  );
}
