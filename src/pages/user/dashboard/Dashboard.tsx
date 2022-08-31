import { Button, Col, DatePicker, Row, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { auth, firestore } from "../../../firebase";
// import { getFormattedDate } from "../../../src/utils/helpers";
import AddFood from "./AddFood/AddFood";
import classes from "./Dashboard.module.css";
import FoodsList from "./FoodsList/FoodsList";
const { RangePicker } = DatePicker;

const { Title } = Typography;
const Dashboard = () => {
  const [foodsList, setFoodsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  useEffect(() => {
    getFoodsList();
  }, []);

  const getFoodsList = (dates = null) => {
    if(!auth.currentUser?.uid) return;

    setLoading(true);
    // if (!dates)
    //   firestore
    //     .collection("foods")
    //     .where("uid", "==", auth.currentUser?.uid)
    //     .get()
    //     .then((res) => {
    //       setFoodsList(
    //         res.docs.map((each) => ({ id: each.id, ...each.data() }))
    //       );
    //     })
    //     .finally(() => setLoading(false));
    // else {
    //   let startDate = new Date(getFormattedDate(dates[0]));
    //   let endDate = new Date(getFormattedDate(dates[1]));
    //   firestore
    //     .collection("foods")
    //     .where("uid", "==", auth.currentUser?.uid)
    //     .where("date", ">=", startDate)
    //     .where("date", "<=", endDate)
    //     .get()
    //     .then((res) => {
    //       setFoodsList(
    //         res.docs.map((each) => ({ id: each.id, ...each.data() }))
    //       );
    //     })
    //     .finally(() => setLoading(false));
    
  };

  return (
    <div className={classes.Dashboard}>
      <Row>
        <Col span={19}>
          <Title level={4}>Calories Per Day</Title>
        </Col>
        <Col style={{ display: "flex", justifyContent: "end" }} span={5}>
          <AddFood getFoodsList={getFoodsList} />
        </Col>
      </Row>
      <Row justify="space-between" className="mt-3">
        <Col>
          {" "}
          {/* <RangePicker onChange={getFoodsList} /> */}
        </Col>
        <Col >
           <Button onClick={()=>history.push('/calories-per-day')} type="link">Calories per day</Button>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col span={24}>
          <FoodsList loading={loading} foodsList={foodsList} />
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
