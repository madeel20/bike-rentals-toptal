import { Col, Popconfirm, Row, Typography } from "antd";
import { Button, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import React, { useEffect, useState } from "react";
import classes from "./MyReservations.module.css";
import { auth, firestore } from "../../../firebase";
import Reservation from "../../../interfaces/Reservation";
import { getFormattedDate } from "../../../utils/helpers";
import { useHistory } from "react-router-dom";
import moment from "moment";
import RateABike from "./RateABike/RateABike";
const { Title } = Typography;

const MyReservations: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const [loading, setLoading] = useState(false);

  const history = useHistory();

  useEffect(() => {
    getReservations();
  }, []);

  const getReservations = () => {
    // Fetch reservations & bikes
    setLoading(true);
    Promise.all([
      firestore.collection("Reservations").where('uid','==',auth.currentUser?.uid).get(),
      firestore.collection("Bikes").get(),
    ])
      .then(([reservations, bikes]) => {
        setReservations(
          reservations.docs.map((eachBike) => ({
            id: eachBike.id,
            ...eachBike.data(),
            model: bikes.docs
              .find((bike) => bike.id === eachBike.data().bikeId)
              ?.data().model,
          })) as Reservation[]
        );
      })
      .finally(() => setLoading(false));
  };

  const handleCancelReservation = (reservationId: string) => {
    setLoading(true);
    firestore
      .collection("Reservations")
      .doc(reservationId)
      .update({
        cancelled: true,
      })
      .then((res) => {
        getReservations();
      });
  };

  const renderActions = (key: any, record: Reservation) => {
    // if reservations is cancelled
    if (record?.cancelled)
      return <Typography style={{ color: "red" }}>Cancelled</Typography>;

    // if already rated
    if (record.hasOwnProperty("rating")) return "Reviewed";

    // if reservation completed
    if (isReservationCompleted(record))
      return (
        <RateABike
          callback={getReservations}
          bikeId={record.bikeId}
          reservationId={record.id}
        />
      );

    return (
      <Popconfirm
        placement="top"
        title={"Do you want to cancel this reservation?"}
        onConfirm={() => handleCancelReservation(record.id!)}
        okText="Yes"
        cancelText="No"
      >
        <Button type="link">Cancel</Button>
      </Popconfirm>
    );
  };

  const columns: ColumnsType<Reservation> = [
    {
      title: "Bike Model",
      dataIndex: "model",
      key: "model",
    },
    {
      title: "Start Time",
      dataIndex: "startTime",
      key: "startTime",
      render: (value: any) => <>{getFormattedDate(value)}</>,
    },
    {
      title: "End Time",
      dataIndex: "endTime",
      key: "endtime",
      render: (value: any) => <>{getFormattedDate(value)}</>,
    },
    {
      title: "",
      dataIndex: "cancel",
      key: "cancel",
      render: renderActions,
    },
  ];

  const isReservationCompleted = (reservation: Reservation) => {
    if (reservation.cancelled) return false;
    let endTime = moment(new Date(reservation.endTime?.seconds * 1000));
    let now = moment(new Date());
    return now.isAfter(endTime);
  };

  return (
    <div className={classes.Dashboard}>
      <Row>
        <Col span={19}>
          <Title level={4}>My Reservations</Title>
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
            pagination={{pageSize:7}}
          />
        </Col>
      </Row>
    </div>
  );
};

export default MyReservations;
