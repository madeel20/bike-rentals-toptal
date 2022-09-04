import {  Col, Row, Tabs, Typography } from "antd";
import React from "react";
import ManageBikes from "./manageBikes/ManageBikes";
import classes from "./Dashboard.module.css";
import ManageUsers from "./manageUsers/ManageUsers";
import Reservations from "./Reservations/Reservations";
const { TabPane } = Tabs;

const { Title } = Typography;
const AdminDashboard = () => {

  return (
    <div className={classes.Dashboard}>
      <Row>
        <Col span={19}>
          <Title level={4}>Manager Dashboard </Title>
        </Col>
      </Row>
      <Tabs
        style={{ backgroundColor: "white", padding: 15, marginTop: 20 }}
        defaultActiveKey="1"
      >
        <TabPane tab="Manage Bikes" key="1">
          <ManageBikes />
        </TabPane>
        <TabPane tab="Manage Users" key="2">
          <ManageUsers />
        </TabPane>
        <TabPane tab="Reservations" key="3">
          <Reservations />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
