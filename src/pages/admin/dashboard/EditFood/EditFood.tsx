import React, { useState } from "react";
import classes from "./EditFood.module.css";
import { Modal, message } from "antd";
import { auth, firestore } from "../../../../firebase";
import AddFoodForm from "../../../user/dashboard/ReservationForm/ReservationForm";

const EditFood = ({ getFoodsList, food, onClose }:any) => {
  const [loading, setLoading] = useState(false);

  const handleOk = () => {
    !loading &&  onClose();
  };

  const handleCancel = () => {
    !loading &&  onClose();
  };

  const onSubmit = (values:any) => {
    setLoading(true);
    firestore
      .collection("foods")
      .doc(food.id)
      .update({
        ...values,
        date: values.date.toDate(),
      })
      .then((res) => {
        message.success("Food Updated!");
        getFoodsList();
        onClose();
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
        <Modal
          footer={null}
          title="Add Food"
          visible={true}
          onOk={handleOk}
          onCancel={handleCancel}
        >
            {/* <AddFoodForm
              // isModalVisible={food}
              // initialValues={food}
              loading={loading}
              onSubmit={onSubmit}
            /> */}
        </Modal>
    </>
  );
};

export default EditFood;
