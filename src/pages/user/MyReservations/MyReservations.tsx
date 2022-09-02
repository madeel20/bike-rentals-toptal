import { Col, Row, Typography } from "antd";
import { Button, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import React, { useEffect, useState } from "react";
import classes from "./MyReservations.module.css";
import { firestore } from "../../../firebase";
import Reservation from "../../../interfaces/Reservation";
import { getFormattedDate } from "../../../utils/helpers";
import { useHistory } from "react-router-dom";
const { Title } = Typography;

const MyReservations: React.FC = () => {

  const [reservations,setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  useEffect(() => {
    getReservations();
  }, []);

  const getReservations = () => {
    setLoading(true);
    firestore
      .collection("Reservations")
      .get()
      .then((res) => {
        setReservations(
          res.docs.map((each) => ({ id: each.id, ...each.data() })) as Reservation[]
        );
      })
      .finally(() => setLoading(false));
  };

  const columns: ColumnsType<Reservation> = [
    {
      title: "Start Time",
      dataIndex: "startTime",
      key: "startTime",
      width: "30%",
      render: (value:any)=> <>{getFormattedDate(new Date(value?.seconds *1000))}</>
    },
    {
      title: "End Time",
      dataIndex: "endTime",
      key: "endtime",
      width: "30%",
      render: (value:any)=> <>{getFormattedDate(new Date(value?.seconds *1000))}</>

    },
    // {
    //   title: "",
    //   key: "resrevations",
    //   render: (key, record) => <ReservationForm callback={onReservationAdd} bikeId={record?.id} />,
    // },
  ];

  return (
    <div className={classes.Dashboard}>
    <Row>
      <Col span={19}>
        <Title level={4}>My Appointments</Title>
      </Col>
      <Col style={{ display: "flex", justifyContent: "end" }} span={5}>
        <Button onClick={() => history.goBack()} type="link">
          Go Back
        </Button>
      </Col>
    </Row>
    <Row className="mt-4">
      <Col span={24}>
       
    <Table
      rowKey={(record) => record?.id!}
      columns={columns}
      dataSource={reservations}
      loading={loading}
    />
      </Col>
    </Row>
  </div>
  );
};

export default MyReservations;
