import React, { useState } from "react";
import { Modal, Button, message, Rate, Col, Row } from "antd";
import { firestore } from "../../../../firebase";
import  firebase from 'firebase';

interface RateABikeProps {
  callback?: () => any;
  bikeId?: string;
  reservationId?: string;
}

const RateABike = ({
  callback,
  bikeId = "",
  reservationId = "",
}: RateABikeProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(5);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    !loading && setIsModalVisible(false);
  };

  const handleCancel = () => {
    !loading && setIsModalVisible(false);
  };

  const handleSubmit = () => {
    setLoading(true);
    Promise.all([
      firestore.collection("Reservations").doc(reservationId).update({
        rating,
      }),
      firestore.collection("Bikes").doc(bikeId).update({
        ratings: firebase.firestore.FieldValue.arrayUnion({
          reservationId,
          rating
        }),
      }),
    ]).finally(() => {
      message.success("Rating Added!");
      setLoading(false);
      callback && callback();
      setIsModalVisible(false);
    });
  };

  return (
    <>
      <Button onClick={showModal} size="small" type="primary">
        Rate the bike
      </Button>
      {isModalVisible && (
        <Modal
          footer={null}
          title="Rate the bike"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          {isModalVisible && (
            <>
              <Row>
                <Rate
                  onChange={setRating}
                  value={rating}
                  disabled={loading}
                  defaultValue={rating}
                />
              </Row>
              <Row style={{ marginTop: 20 }}>
                <Button
                  onClick={handleSubmit}
                  loading={loading}
                  type="primary"
                  htmlType="submit"
                >
                  Submit
                </Button>
              </Row>
            </>
          )}
        </Modal>
      )}
    </>
  );
};

export default RateABike;
