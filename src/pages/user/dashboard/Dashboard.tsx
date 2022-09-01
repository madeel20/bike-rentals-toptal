import { Button, Col, DatePicker, Row, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { auth, firestore } from "../../../firebase";
// import { getFormattedDate } from "../../../src/utils/helpers";
import AddFood from "./AddFood/AddFood";
import classes from "./Dashboard.module.css";
import BikesList from "./BikesList/BikesList";
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
          res.docs.map((each) => ({ id: each.id, ...each.data() })) as Bike[]
        );
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className={classes.Dashboard}>
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
          <BikesList loading={loading} bikesList={bikesList} />
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
