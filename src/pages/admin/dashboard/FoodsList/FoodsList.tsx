import React from 'react'
import { Table, Tag, Space, Button } from 'antd';
import moment from 'moment';

const FoodsList = ({
    loading,
    foodsList,
    onEdit,
    onDelete,
}:any) => {

    const columns = [
        {
          title: 'Name',
          dataIndex: 'food',
          key: 'food',
          render: (text:any) => <a>{text}</a>,
        },
        {
          title: 'Calories',
          dataIndex: 'calories',
          key: 'calories',
        },
        {
          title: 'User',
          dataIndex: 'email',
          key: 'email',
        },
        {
          title: 'Date & Time',
          key: 'date',
          dataIndex: 'date',
          render: (date:any) => {
              return (
            <>
              {moment(new Date(date.seconds * 1000)).format("DD MMM YY, hh:mm A")}
            </>
          )},
        },
        {
          title: '',
          key: 'edit',
          dataIndex: 'id',
          render:(id:any,foodData:any) => (
            <Space size="middle">
              <Button onClick={()=>onEdit(foodData)} type='link'>Edit</Button>
            </Space>
          ),
        },
        {
          title: '',
          key: 'delete',
          dataIndex: 'id',
          render: (id:any) => (
            <Space size="middle">
              <Button onClick={()=>onDelete(id)} type='link'>Delete</Button>
            </Space>
          ),
        },
      ];

  return (
    <Table size="small" pagination={{pageSize:8}} loading={loading} columns={columns} dataSource={foodsList} />
  )
}

export default FoodsList