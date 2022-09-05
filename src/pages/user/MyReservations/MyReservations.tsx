import { Col, Row, Typography } from "antd";
import { Button} from "antd";
import React, { useEffect, useState } from "react";
import { auth, firestore } from "../../../firebase";
import Reservation from "../../../interfaces/Reservation";
import { useHistory } from "react-router-dom";
import ReservationsList from "../../../components/ReservationsList/ReservationsList";
const { Title } = Typography;

const MyReservations: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const [loading, setLoading] = useState(false);

  const history = useHistory();

  useEffect(() => {
    getReservations();
  }, []);

  const getReservations = () => {
    // Fetch reservations & bikes
    setLoading(true);
    Promise.all([
      firestore
        .collection("Reservations")
        .where("uid", "==", auth.currentUser?.uid)
        .get(),
      firestore.collection("Bikes").get(),
    ])
      .then(([reservations, bikes]) => {
        setReservations(
          reservations.docs.map((eachBike) => ({
            id: eachBike.id,
            ...eachBike.data(),
            model: bikes.docs
              .find((bike) => bike.id === eachBike.data().bikeId)
              ?.data().model,
          })) as Reservation[]
        );
      })
      .finally(() => setLoading(false));
  };

  const handleCancelReservation = (reservationId: string) => {
    setLoading(true);
    firestore
      .collection("Reservations")
      .doc(reservationId)
      .update({
        cancelled: true,
      })
      .then((res) => {
        getReservations();
      });
  };

  return (
    <div style={{width: 800}}>
      <Row>
        <Col span={19}>
          <Title level={4}>My Reservations</Title>
        </Col>
        <Col style={{ display: "flex", justifyContent: "end" }} span={5}>
          <Button onClick={() => history.goBack()} type="link">
            Go Back
          </Button>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col span={24}>
          <ReservationsList
            reservations={reservations}
            callback={getReservations}
            loading={loading}
            handleCancelReservation={handleCancelReservation}
          />
        </Col>
      </Row>
    </div>
  );
};

export default MyReservations;
