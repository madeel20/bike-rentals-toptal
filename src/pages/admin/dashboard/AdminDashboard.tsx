import { Button, Col, DatePicker, Row, Typography } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { firestore } from "../../../firebase";
// import AddFood from "./AddFood/AddFood";
import classes from "./Dashboard.module.css";
import EditFood from "./EditFood/EditFood";
import FoodsList from "./FoodsList/FoodsList";

const { Title } = Typography;
const AdminDashboard = () => {
  const [foodsList, setFoodsList] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [currentEditFood, setCurrentEditFood] = useState<any>(null);
  const [currentDeleteId, setCurrentDeleteId] = useState(null);
  const history = useHistory();

  useEffect(() => {
    getFoodsList();
  }, []);

  const getFoodsList = () => {
    setLoading(true);
    firestore
      .collection("foods")
      .get()
      .then((res) => {
        setFoodsList(res?.docs?.map((each:any) => ({ id: each.id, ...each.data() })));
      })
      .finally(() => setLoading(false));
  };

  const onEdit = (foodData:any) =>
    setCurrentEditFood({
      ...foodData,
      date: moment(new Date(foodData?.date?.seconds * 1000)),
    });
  const onDelete = (id:any) => setCurrentDeleteId(id);

  useEffect(() => {
    if (currentDeleteId) {
      if (window.confirm("Are you sure you want to delete this record?")) {
        setLoading(true);
        firestore
          .collection("foods")
          .doc(currentDeleteId)
          .delete()
          .then(() => getFoodsList())
          .finally(() => setLoading(false));
      } else setCurrentDeleteId(null);
    }
  }, [currentDeleteId]);

  return (
    <div className={classes.Dashboard}>
      <Row>
        <Col span={19}>
          <Title level={4}>Admin Dashboard - Foods List </Title>
        </Col>
        <Col style={{ display: "flex", justifyContent: "end" }} span={5}>
          <Button onClick={() => history.push("/reports")} type="link">
            Reports
          </Button>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col span={24}>
          <FoodsList
            onDelete={onDelete}
            onEdit={onEdit}
            loading={loading}
            foodsList={foodsList}
          />
        </Col>
      </Row>
      {currentEditFood && (
        <EditFood
          onClose={() => setCurrentEditFood(null)}
          food={currentEditFood}
          getFoodsList={getFoodsList}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
