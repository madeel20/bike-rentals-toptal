import { Col, message, Row, Typography } from "antd";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import React, { useEffect, useState } from "react";
import {
  deleteAUserService,
  getAllUsersService,
  updateAUserService,
} from "../../../services/user";
import User from "../../../interfaces/User";
import UsersList from "../../../components/UsersList/UsersList";
import UserForm from "../../../components/UserForm/UserForm";

const { Title } = Typography;
const ManageUsers = () => {
  const [usersList, setUsersList] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = () => {
    setLoading(true);
    getAllUsersService()
      .then(setUsersList)
      .finally(() => setLoading(false));
  };

  const handleChangeRole = (event: CheckboxChangeEvent, user: User) => {
    setLoading(true);
    updateAUserService({
      ...user,
      isManager: event.target.checked,
    })
      .then((res) => {
        let users = [...usersList];
        users[users.findIndex((each) => each.uid === user.uid)].isManager =
          event.target.checked;
        setUsersList(users);
        message.success("User Role Updated!");
      })
      .catch((err) => {
        message.error(err?.response?.data?.message || err?.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDeleteAUser = (uid: string) => {
    setLoading(true);
    deleteAUserService({
      uid,
    })
      .then((res) => {
        let users = [...usersList];
        users = users.filter((each) => each.uid !== uid);
        setUsersList(users);
        message.success("User Deleted!");
      })
      .catch((err) => {
        message.error(err?.response?.data?.message || err?.message);
      })
      .finally(() => {
        setLoading(false);
      });
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
            All Users
          </Title>
        </Col>
        <Col>
          <UserForm callback={getUsers} />
        </Col>
      </Row>
      <Row style={{ width: "100%" }}>
        <UsersList
          onAction={getUsers}
          loading={loading}
          usersList={usersList}
          handleChangeRole={handleChangeRole}
          handleDeleteAUser={handleDeleteAUser}
        />
      </Row>
    </Row>
  );
};

export default ManageUsers;
