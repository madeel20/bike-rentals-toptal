import { SearchOutlined } from "@ant-design/icons";
import { Checkbox, InputRef, Rate, Row } from "antd";
import { Button, Input, Space, Table } from "antd";
import type { ColumnsType, ColumnType } from "antd/es/table";
import type { FilterConfirmProps } from "antd/es/table/interface";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import React, { useContext, useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { UserContext } from "../../App";
import Bike from "../../interfaces/Bike";
import ReservationForm from "../../pages/user/dashboard/ReservationForm/ReservationForm";
import BikeForm from "../BikeForm/BikeForm";

interface BikeWithAvgRating extends Bike {
  rating: number;
}
type DataIndex = keyof BikeWithAvgRating;

interface BikesListProps {
  loading: boolean;
  bikesList: Bike[];
  onAction: () => any;
  handleChangeAvailability?: (
    event: CheckboxChangeEvent,
    bikeId: string
  ) => any;
}

const BikesList: React.FC<BikesListProps> = ({
  loading,
  bikesList,
  onAction,
  handleChangeAvailability,
}) => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [bikes, setBikes] = useState<BikeWithAvgRating[]>([]);
  const searchInput = useRef<InputRef>(null);
  const { isAdmin } = useContext(UserContext);

  useEffect(() => {
    if (bikesList) {
      setBikes(
        bikesList.map((eachBike: Bike) => ({
          ...eachBike,
          rating: eachBike.ratings.length
            ? eachBike.ratings.reduce(
                (total, current) => total + current?.rating,
                0
              ) / eachBike.ratings.length
            : 5,
        }))
      );
    }
  }, [bikesList]);

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): ColumnType<BikeWithAvgRating> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]!.toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns: ColumnsType<BikeWithAvgRating> = [
    {
      title: "Model",
      dataIndex: "model",
      key: "model",
      width: "30%",
      ...getColumnSearchProps("model"),
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      width: "20%",
      ...getColumnSearchProps("location"),
    },
    {
      title: "Color",
      dataIndex: "color",
      key: "color",
      width: "20%",
      ...getColumnSearchProps("color"),
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      sorter: (a, b) => (a?.rating || 0) - (b?.rating || 0),
      sortDirections: ["descend", "ascend"],
      render: (rating: number) => {
        return (
          <Row style={{ width: 140 }}>
            <Rate disabled defaultValue={Number(rating)} />
          </Row>
        );
      },
    },
  ];

  if (!isAdmin)
    columns.push({
      title: "",
      key: "reservations",
      render: (key, record) => (
        <ReservationForm callback={onAction} bikeId={record?.id} />
      ),
    });
  else {
    columns.push({
      title: "Available",
      dataIndex: "available",
      key: "available",
      sorter: (a, b) => (a === b ? 0 : a ? -1 : 1),
      sortDirections: ["descend", "ascend"],
      render: (available, record) => (
        <Checkbox
          onChange={(event) =>
            handleChangeAvailability &&
            handleChangeAvailability(event, record.id!)
          }
          checked={available}
        />
      ),
    });
    columns.push({
      title: "",
      dataIndex: "edit&delete",
      key: "edit&delete",
      render: (available, record) => (
        <Row wrap={false} gutter={10} align="middle">
          <BikeForm bike={record} callback={onAction}  />
          <Button type="link" style={{color:'red'}}>Delete</Button>
        </Row>
      ),
    });
  }

  return (
    <Table
      rowKey={(record) => record?.id!}
      columns={columns}
      dataSource={bikes}
      loading={loading}
      pagination={{ pageSize: 5 }}
      style={{ width: "100%" }}
    />
  );
};

export default BikesList;
