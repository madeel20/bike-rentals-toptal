import {  Col, Row, Tabs, Typography } from "antd";
import React from "react";
import ManageBikes from "./manageBikes/ManageBikes";
import ManageUsers from "./manageUsers/ManageUsers";
import Reservations from "./Reservations/Reservations";
const { TabPane } = Tabs;

const { Title } = Typography;
const AdminDashboard = () => {

  return (
    <div style={{width: 1000, marginTop: -50}}>
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
