import { Button, Col, Row, Tabs, Typography } from "antd";
import React from "react";
import { useHistory } from "react-router-dom";
import ManageBikes from "./manageBikes/ManageBikes";
import classes from "./Dashboard.module.css";
const { TabPane } = Tabs;

const { Title } = Typography;
const AdminDashboard = () => {
  const history = useHistory();

  return (
    <div className={classes.Dashboard}>
      <Row>
        <Col span={19}>
          <Title level={4}>Manager Dashboard </Title>
        </Col>
        <Col style={{ display: "flex", justifyContent: "end" }} span={5}>
          <Button onClick={() => history.push("/reports")} type="link">
            Reports
          </Button>
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
          Content of Tab Pane 2
        </TabPane>
        <TabPane tab="Manage Managers" key="3">
          Content of Tab Pane 3
        </TabPane>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
