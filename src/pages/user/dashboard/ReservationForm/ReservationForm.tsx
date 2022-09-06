import React, { useEffect, useState } from "react";
import { Modal, Button, message } from "antd";
import CForm from "./CForm";
import { auth, firestore } from "../../../../firebase";
import Reservation from "../../../../interfaces/Reservation";
import moment, { Moment } from "moment";

interface ReservationFormInterface {
  callback?: () => any;
  bikeId?: string;
}

const ReservationForm = ({
  callback,
  bikeId = "",
}: ReservationFormInterface) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bikePrevReservations, setBikePrevReservations] = useState<
    {
      startTime: Moment;
      endTime: Moment;
    }[]
  >([]);

  useEffect(() => {
    // Get bike reservations
    if (isModalVisible)
      firestore
        .collection("Reservations")
        .where("bikeId", "==", bikeId)
        .get()
        .then((res) => {
          setBikePrevReservations(
            res.docs
              .filter((each) => !each?.data().cancelled)
              .map((eachReservation) => ({
                startTime: moment(
                  new Date(
                    (eachReservation.data() as Reservation).startTime.seconds *
                      1000
                  )
                ),
                endTime: moment(
                  new Date(
                    (eachReservation.data() as Reservation).endTime.seconds *
                      1000
                  )
                ),
              }))
          );
        });
  }, [bikeId, isModalVisible]);

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
      bikeId,
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
              bikePrevReservations={bikePrevReservations}
            />
          )}
        </Modal>
      )}
    </>
  );
};

export default ReservationForm;
