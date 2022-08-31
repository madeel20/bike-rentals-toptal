import React, { useState } from "react";
import classes from "./AddFood.module.css";
import { Modal, Button, message } from "antd";
import AddFoodForm from "./AddFoodForm";
import { auth, firestore } from "../../../../firebase";

const AddFood = ({ getFoodsList }:any) => {
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

  const onSubmit = (values:object) => {
    setLoading(true);
    firestore
      .collection("foods")
      .add({
        uid: auth.currentUser?.uid,
        email: auth?.currentUser?.email,
        ...values,
        // date: values?.date?.toDate(),
      })
      .then((res) => {
        message.success("Food Added!");
        getFoodsList();
        setIsModalVisible(false);
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Add Food
      </Button>
      {isModalVisible && (
        <Modal
          footer={null}
          title="Add Food"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          {isModalVisible && (
            <AddFoodForm
              isModalVisible={isModalVisible}
              loading={loading}
              onSubmit={onSubmit}
            />
          )}
        </Modal>
      )}
    </>
  );
};

export default AddFood;
