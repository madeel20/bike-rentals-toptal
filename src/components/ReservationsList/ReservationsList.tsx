import { Button, Popconfirm, Table, Typography } from "antd";
import { ColumnsType } from "antd/lib/table";
import moment from "moment";
import React, { useContext } from "react";
import { UserContext } from "../../App";
import Reservation from "../../interfaces/Reservation";
import { getFormattedDate } from "../../utils/helpers";
import RateABike from "../RateABike/RateABike";

interface ReservationListProps {
  callback: (arg?: any) => any;
  handleCancelReservation?: (id: string) => any;
  reservations: Reservation[];
  loading: boolean;
}

const ReservationsList = ({
  callback,
  handleCancelReservation,
  loading,
  reservations,
}: ReservationListProps) => {
  const { isManager } = useContext(UserContext);

  const renderActions = (key: any, record: Reservation) => {
    // if reservations is cancelled
    if (record?.cancelled)
      return <Typography style={{ color: "red" }}>Cancelled</Typography>;

    // if already rated
    if (record.hasOwnProperty("rating")) return "Reviewed";

    // if reservation completed
    if (isReservationCompleted(record))
      if (isManager) return <>Waiting for Review</>;
      else
        return (
          <RateABike
            callback={callback}
            bikeId={record.bikeId}
            reservationId={record.id}
          />
        );

    if (!isManager)
      return (
        <Popconfirm
          placement="top"
          title={"Do you want to cancel this reservation?"}
          onConfirm={() =>
            handleCancelReservation && handleCancelReservation(record.id!)
          }
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

  if (isManager) {
    columns.unshift({
      title: "Email",
      dataIndex: "email",
      key: "email",
    });
    columns.unshift({
      title: "Full Name",
      dataIndex: "displayName",
      key: "displayName",
    });
  }

  const isReservationCompleted = (reservation: Reservation) => {
    if (reservation.cancelled) return false;
    let endTime = moment(new Date(reservation.endTime?.seconds * 1000));
    let now = moment(new Date());
    return now.isAfter(endTime);
  };

  return (
    <Table
      rowKey={(record) => record?.id!}
      columns={columns}
      dataSource={reservations}
      loading={loading}
      pagination={{ pageSize: 7 }}
      style={{ width: "100%" }}
    />
  );
};

export default ReservationsList;
