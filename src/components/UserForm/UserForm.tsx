import React, { useState } from "react";
import { Modal, Button, message } from "antd";
import User from "../../interfaces/User";
import { createAUserService, updateAUserService } from "../../services/user";
import UserFormFields from "./UserFormFields";

interface UserFormProps {
  callback?: () => any;
  user?: User;
}

type FormValues = Pick<User, "displayName" | "email" | "isManager">;

const UserForm = ({ callback, user }: UserFormProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    !loading && setIsModalVisible(false);
  };

  const handleCancel = () => {
    !loading && setIsModalVisible(false);
  };

  const handleSubmit = (values: FormValues) => {
    setLoading(true);

    if (user) {
      updateAUserService({
        ...user,
        ...values,
      })
        .then((res) => {
          message.success("User Updated!");
          callback && callback();
          setIsModalVisible(false);
        })
        .catch((err) => {
          message.error(err?.response?.data?.message || err?.message);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      createAUserService(values)
        .then((res) => {
          message.success("User Added!");
          callback && callback();
          setIsModalVisible(false);
        })
        .catch((err) => {
          message.error(err?.response?.data?.message || err?.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <>
      <Button onClick={showModal} type={user ? "link" : "primary"}>
        {user ? "Edit" : "Add a User"}
      </Button>
      {isModalVisible && (
        <Modal
          footer={null}
          title={user ? "Edit User" : "Add a User"}
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          {isModalVisible && (
            <UserFormFields
              user={user}
              onFinish={handleSubmit}
              loading={loading}
            />
          )}
        </Modal>
      )}
    </>
  );
};

export default UserForm;
