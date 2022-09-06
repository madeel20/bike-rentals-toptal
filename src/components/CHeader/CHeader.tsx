import { Avatar, Dropdown, Layout, Menu, Row } from "antd";
import React from "react";
import { Link, useHistory } from "react-router-dom";
import { Typography } from "antd";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { auth } from "../../firebase";
const { Header } = Layout;
const { Title } = Typography;

/**
 * This is a shared header for all the screens
 * @returns {JSX}
 */
function CHeader() {
  const history = useHistory();

  const menu = (
    <Menu>
      <Menu.Item
        onClick={() => auth.signOut().then((res) => history.push("/"))}
      >
        <LogoutOutlined /> Sign Out
      </Menu.Item>
    </Menu>
  );

  return (
    <Header style={styles.header}>
      <Link to="/">
        <Title level={2} style={styles.heading}>
          React Bike Rentals
        </Title>
      </Link>
      {auth.currentUser && (
        <Row align="middle">
          <Typography style={{ color: "white", marginRight: 20 }}>
            <b>{auth.currentUser?.displayName}</b> ( {auth.currentUser?.email} )
          </Typography>
          <Dropdown overlay={menu} placement="bottomLeft" arrow>
            <Avatar size="large" icon={<UserOutlined />} />
          </Dropdown>
        </Row>
      )}
    </Header>
  );
}

const styles = {
  header: {
    alignItems: "center",
    display: "flex",
    justifyContent: "space-between",
  },
  heading: { color: "white", marginBottom: 0 },
};

export default CHeader;
