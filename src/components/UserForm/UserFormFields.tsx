import React, { useContext, useEffect, useState } from "react";
import { Form, Input, Button, Checkbox } from "antd";
import { useHistory } from "react-router-dom";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { UserContext } from "../../App";
import User from "../../interfaces/User";


type FormValues = Pick<User, "displayName" | "email" | "isManager">;

interface UserFormFieldsProps {
  onFinish: (values: any) => any;
  loading: boolean;
  user?: User;
}

const UserFormFields = (props: UserFormFieldsProps) => {
  const { user } = props;
  const [isManager, setIsManager] = useState(user?.isManager || false);
  const { isAdmin } = useContext(UserContext);
  const history = useHistory();
  const [initialValues, setInitialValues] = useState<FormValues>(
    user || {
      email: "",
      displayName: "",
      isManager: false,
    }
  );

  useEffect(() => user && setInitialValues(user), [user]);

  return (
    <Form
      name="normal_login"
      className="login-form"
      initialValues={initialValues}
      onFinish={(values) => props.onFinish({ ...values, isManager })}
      style={{ width: 350 }}
    >
      <Form.Item
        name="displayName"
        rules={[
          { required: true, message: "Please input name!" },
          {
            pattern: new RegExp(/^([a-zA-z\s]{2,30})$/),
            message: "Please enter a valid name!",
          },
        ]}
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
          { required: true, message: "Please input email!" },
          {
            type: "email",
            message: "Enter a valid email",
          },
        ]}
      >
        <Input
          disabled={!!user}
          size="large"
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="Email"
        />
      </Form.Item>

      {!user && (
        <Form.Item
          name="password"
          rules={[
            { required: true, message: "Please input Password!" },
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
      )}

      {isAdmin && (
        <Form.Item name="isManager">
          <Checkbox
            value={isManager}
            onChange={(e) => setIsManager(e.target.checked)}
            checked={isManager}
          >
            Manager
          </Checkbox>
        </Form.Item>
      )}

      <Form.Item>
        <Button
          loading={props.loading}
          type="primary"
          htmlType="submit"
          className="login-form-button"
        >
          Submit
        </Button>
        {!isAdmin && (
          <>
            &nbsp; &nbsp; Or{" "}
            <Button
              onClick={() => history.push("/")}
              disabled={props.loading}
              type="link"
            >
              Login
            </Button>
          </>
        )}
      </Form.Item>
    </Form>
  );
};

export default UserFormFields;
