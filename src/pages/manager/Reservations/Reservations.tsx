import { Col, Row, Select, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { getAllUsersService } from "../../../services/user";
import User from "../../../interfaces/User";
import ReservationsList from "../../../components/ReservationsList/ReservationsList";
import Reservation from "../../../interfaces/Reservation";
import { firestore } from "../../../firebase";
const { Option } = Select;
const { Title } = Typography;

type ReservationItemType = Reservation & Pick<User, "displayName" | "email">;

const Reservations = () => {
  const [reservationsList, setReservationsList] = useState<
    ReservationItemType[]
  >([]);

  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(
    undefined
  );

  const [loading, setLoading] = useState(false);

  const onChange = (value: string | undefined) => {
    setSelectedUserId(value);
  };

  useEffect(() => {
    getReservations();
  }, [selectedUserId]);

  const getReservations = () => {
    // Fetch reservations & bikes
    setLoading(true);
    let reservationsRef: any = firestore.collection("Reservations");
    if (selectedUserId) {
      reservationsRef = reservationsRef.where("uid", "==", selectedUserId);
    }

    Promise.all([
      reservationsRef.get(),
      firestore.collection("Bikes").get(),
      getAllUsersService(),
    ])
      .then(([reservations, bikes, users]) => {
        setReservationsList(
          reservations.docs.map((eachReservation: any) => ({
            id: eachReservation.id,
            ...eachReservation.data(),
            model: bikes.docs
              .find((bike) => bike.id === eachReservation.data().bikeId)
              ?.data().model,
            ...users.find((user) => user.uid === eachReservation.data().uid),
          })) as ReservationItemType[]
        );
        setAllUsers(users);
      })
      .finally(() => setLoading(false));
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
            All Reservations
          </Title>
        </Col>
        <Col>
          <Select
            showSearch
            placeholder="Select a person"
            optionFilterProp="children"
            style={{minWidth:200}}
            allowClear
            onChange={onChange}
            filterOption={(input, option) =>
              (option!.children as unknown as string)
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            disabled={loading}
          >
            {allUsers.map((eachUser) => {
              return <Option value={eachUser.uid}>{eachUser.email}</Option>;
            })}
          </Select>
        </Col>
      </Row>
      <Row style={{ width: "100%" }}>
        <ReservationsList
          reservations={reservationsList}
          loading={loading}
          callback={getReservations}
        />
      </Row>
    </Row>
  );
};

export default Reservations;
