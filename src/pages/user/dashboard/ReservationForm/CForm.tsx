import { Form, Button, DatePicker } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
const { RangePicker } = DatePicker;

const CForm = ({
  loading,
  onSubmit,
  isModalVisible,
  initialValues = { food: "", calories: "" },
}: any) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields();
  }, [isModalVisible]);

  const onFinish = (values: object) => {
    console.log(values);
    onSubmit(values, () => {
      form.resetFields();
    });
  };

  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      onFinish={onFinish}
      initialValues={initialValues}
      autoComplete="off"
      form={form}
    >
      <Form.Item
        name="date"
        label="Date & Time:"
        rules={[
          {
            type: "array",
            required: true,
            message: "Please select time!",
          },
        ]}
      >
        <RangePicker
          ranges={{
            Today: [moment(), moment()],
            "This Month": [moment().startOf("month"), moment().endOf("month")],
          }}
          showTime
          format="YYYY/MM/DD HH:mm:ss"
          disabled={loading}
        />

      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button loading={loading} type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CForm;
