import { Col, Row, Typography } from "antd";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import React, { useEffect, useState } from "react";
import BikeForm from "../../../components/BikeForm/BikeForm";
import { firestore } from "../../../firebase";
import Bike from "../../../interfaces/Bike";
import BikesList from "../../../components/BikesList/BikesList";
import classes from "./ManageBikes.module.css";

const { Title } = Typography;
const ManageBikes = () => {
  const [bikesList, setBikesList] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getBikesList();
  }, []);

  const getBikesList = () => {
    setLoading(true);
    firestore
      .collection("Bikes")
      .get()
      .then((res) => {
        setBikesList(
          res.docs.map((each) => ({ id: each.id, ...each.data() })) as Bike[]
        );
      })
      .finally(() => setLoading(false));
  };

  const onReservationAdd = () => {
    getBikesList();
  };

  const handleChangeAvailability = (
    event: CheckboxChangeEvent,
    bikeId: string
  ) => {
    setLoading(true);
    firestore
      .collection("Bikes")
      .doc(bikeId)
      .update({
        available: event.target.checked,
      })
      .then((res) => {
        let bikes = [...bikesList];
        bikes[bikes.findIndex((each) => each.id === bikeId)].available =
          event.target.checked;
        setBikesList(bikes);
      })
      .finally(() => setLoading(false));
  };

  return (
    <Row>
      <Row
        style={{ width: "100%", margin: "10px 0px 20px 0px" }}
        align="middle"
        justify="space-between"
      >
        <Col>
          <Title style={{ marginLeft: 10 }} level={5}>
            All Bikes
          </Title>
        </Col>
        <Col>
         <BikeForm callback={getBikesList} />
        </Col>
      </Row>
      <Row style={{ width: "100%" }}>
        <BikesList
          onAction={getBikesList}
          loading={loading}
          bikesList={bikesList}
          handleChangeAvailability={handleChangeAvailability}
        />
      </Row>
    </Row>
  );
};

export default ManageBikes;
