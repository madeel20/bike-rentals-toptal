import { Button, Col, DatePicker, Row, Typography } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { auth, firestore } from "../../../firebase";
import classes from "./CaloriesPerDay.module.css";
import DataTable from "./DataTable";
import { getPerDayCalories } from "./helpers";
const { RangePicker } = DatePicker;

const { Title } = Typography;
const CaloriesPerDay = () => {
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const [data, setData] = useState<{
    date: string;
    calories: unknown;
}[]>([]);

  useEffect(() => {
    getFoodsList();
  }, []);

  const getFoodsList = () => {
    setLoading(true);
    firestore
      .collection("foods")
      .where("uid", "==", auth.currentUser?.uid)
      .get()
      .then((res) => setData(getPerDayCalories(res.docs || [])))
      .finally(() => setLoading(false));
  };

  return (
    <div className={classes.Dashboard}>
      <Row justify="space-between">
        <Col>
          <Title level={4}>Calories per day</Title>
        </Col>
        <Col>
          <Button onClick={() => history.push("/")} type="link">
            My foods
          </Button>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col span={24}>
          <DataTable loading={loading} data={data} />
        </Col>
      </Row>
    </div>
  );
};

export default CaloriesPerDay;
