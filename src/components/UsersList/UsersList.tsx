import { SearchOutlined } from "@ant-design/icons";
import { Checkbox, InputRef, Popconfirm, Row } from "antd";
import { Button, Input, Space, Table } from "antd";
import type { ColumnsType, ColumnType } from "antd/es/table";
import type { FilterConfirmProps } from "antd/es/table/interface";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import React, { useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import User from "../../interfaces/User";
import UserForm from "../UserForm/UserForm";

type DataIndex = keyof User;

interface BikesListProps {
  loading: boolean;
  usersList: User[];
  onAction: () => any;
  handleChangeRole?: (
    event: CheckboxChangeEvent,
    user: User
  ) => any;
  handleDeleteAUser?: (uid: string) => any;
}

const UsersList: React.FC<BikesListProps> = ({
  loading,
  usersList,
  onAction,
  handleChangeRole,
  handleDeleteAUser
}) => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);

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
  ): ColumnType<User> => ({
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

  const columns: ColumnsType<User> = [
    {
      title: "Full Name",
      dataIndex: "displayName",
      key: "displayName",
      ...getColumnSearchProps("displayName"),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ...getColumnSearchProps("email"),
    },
    {
      title: "Manager",
      dataIndex: "isManager",
      key: "isManager",
      sorter: (a, b) => (a.isManager === b.isManager ? 0 : a.isManager ? -1 : 1),
      sortDirections: ["descend", "ascend"],
      render: (isManager, record) => {
        return (
          <Checkbox
          onChange={(event) =>
            handleChangeRole &&
            handleChangeRole(event, record)
          }
          checked={isManager}
        />
        );
      },
    },
    {
      title: "",
      dataIndex: "edit&delete",
      key: "edit&delete",
      render: (available, record) => (
        <Row wrap={false} gutter={10} align="middle">
          <UserForm user={record} callback={onAction} />
          <Popconfirm
            placement="top"
            title={"Are you sure you want to delete this User?"}
            onConfirm={() => handleDeleteAUser && handleDeleteAUser(record.uid!)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" style={{ color: "red" }}>
              Delete
            </Button>
          </Popconfirm>
        </Row>
      ),
    }
  ];

  return (
    <Table
      rowKey={(record) => record?.uid!}
      columns={columns}
      dataSource={usersList}
      loading={loading}
      pagination={{ pageSize: 5 }}
      style={{ width: "100%" }}
    />
  );
};

export default UsersList;
