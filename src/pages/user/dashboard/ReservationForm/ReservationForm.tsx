import React, { useState } from "react";
import classes from "./AddReservation.module.css";
import { Modal, Button, message } from "antd";
import CForm from "./CForm";
import { auth, firestore } from "../../../../firebase";
import Reservation from "../../../../interfaces/Reservation";

interface AddReservationInterface {
  callback?: () => any;
  bikeId?: string;
}

const ReservationForm = ({
 callback,
  bikeId,
}: AddReservationInterface) => {
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

  const onSubmit = (values: any) => {
   
    let reservation: Reservation = {
      uid: auth.currentUser?.uid!,
      email: auth?.currentUser?.email!,
      startTime: values?.date[0].toDate(),
      endTime: values?.date[1].toDate(),
    };

    setLoading(true);
    firestore
      .collection("Reservations")
      .add(reservation)
      .then((res) => {
        message.success("Reservation Added!");
        callback && callback();
        setIsModalVisible(false);
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <Button type="link" onClick={showModal}>
        Create Reservation
      </Button>
      {isModalVisible && (
        <Modal
          footer={null}
          title="Add Reservation"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          {isModalVisible && (
            <CForm
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

export default ReservationForm;
