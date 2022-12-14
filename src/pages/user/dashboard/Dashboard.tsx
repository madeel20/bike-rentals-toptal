import { Button, Col, Row, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {  firestore } from "../../../firebase";
import BikesList from "../../../components/BikesList/BikesList";
import Bike from "../../../interfaces/Bike";
const { Title } = Typography;

const Dashboard = () => {
  const [bikesList, setBikesList] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  useEffect(() => {
    getBikesList();
  }, []);

  const getBikesList = () => {
    setLoading(true);
    firestore
      .collection("Bikes")
      .where("available", "==", true)
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

  return (
    <div style={{width: 800}}>
      <Row>
        <Col span={19}>
          <Title level={4}>Bikes Available</Title>
        </Col>
        <Col style={{ display: "flex", justifyContent: "end" }} span={5}>
          <Button onClick={() => history.push("/my-reservations")} type="link">
            My Reservations
          </Button>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col span={24}>
          <BikesList
            onAction={getBikesList}
            loading={loading}
            bikesList={bikesList}
          />
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
