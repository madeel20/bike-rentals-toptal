import { Col, message, Row, Typography } from "antd";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import React, { useEffect, useState } from "react";
import BikeForm from "../../../components/BikeForm/BikeForm";
import { firestore } from "../../../firebase";
import Bike from "../../../interfaces/Bike";
import BikesList from "../../../components/BikesList/BikesList";

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
          res.docs
            .filter((e) => !e?.data()?.isDeleted)
            .map((each) => ({ id: each.id, ...each.data() })) as Bike[]
        );
      })
      .finally(() => setLoading(false));
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
        message.success("Availability Updated!");
      })
      .finally(() => setLoading(false));
  };

  const handleDeleteBike = (bikeId: string) => {
    setLoading(true);
    firestore
      .collection("Bikes")
      .doc(bikeId)
      .update({
        isDeleted: true,
      })
      .then((res) => {
        let bikes = [...bikesList];
        bikes= bikes.filter((each) => each.id !== bikeId);
        setBikesList(bikes);
        message.success("Bike Deleted!");
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
          handleDeleteBike={handleDeleteBike}
        />
      </Row>
    </Row>
  );
};

export default ManageBikes;
