import React from "react";
import { Table, Tag, Space } from "antd";
import moment from "moment";
import { CALORIES_LIMIT_PER_DAY } from "../../../utils/constants";

const DataTable = ({ loading, data }:any) => {
  const columns = [
    {
      title: "Date",
      key: "date",
      dataIndex: "date",
      render: (date:string) => {
        return <>{date}</>;
      },
    },
    {
      title: "Total Calories",
      dataIndex: "calories",
      key: "calories",
    },
    {
      title: "",
      dataIndex: "calories",
      key: "limit",
      render: (calories:number) => {
        return (
          <>
            {calories > CALORIES_LIMIT_PER_DAY ? (
              <Tag color={"volcano"}>
                DAILY LIMIT EXCEEDED
              </Tag>
            ) : (
              ""
            )}
          </>
        );
      },
    },
  ];

  return <Table pagination={{pageSize:7}} loading={loading} columns={columns} dataSource={data} />;
};

export default DataTable;
