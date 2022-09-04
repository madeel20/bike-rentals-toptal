import React, { useState } from "react";
import { message } from "antd";
import { useHistory } from "react-router-dom";
import { auth } from "../../firebase";
import firebase from "firebase";
import { Typography } from "antd";
import User from "../../interfaces/User";
import UserFormFields from "../../components/UserForm/UserFormFields";

const { Title } = Typography;

type FormFields = Pick<User, "displayName" | "email" | "password">;

export default function SignUpPage() {
  const history = useHistory();
  const [loading, setLoading] = useState<boolean>(false);

  const onFinish = (values: FormFields) => {
    setLoading(true);
    auth
      .createUserWithEmailAndPassword(values.email, values.password!)
      .then((res: firebase.auth.UserCredential) => {
        res.user
          ?.updateProfile({
            displayName: values.displayName,
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
    <>
      <Title>Sign UP</Title>
      <UserFormFields onFinish={onFinish} loading={loading} />
    </>
  );
}
