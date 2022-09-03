import { Form, Button, DatePicker } from "antd";
import { RangePickerProps } from "antd/lib/date-picker";
import moment, { Moment } from "moment";
import React, { useEffect } from "react";
const { RangePicker } = DatePicker;

interface CFormProps {
  loading: boolean;
  onSubmit: (values: any, callback: () => any) => any;
  isModalVisible: boolean;
  initialValues?: any;
  bikePrevReservations: {
    startTime: Moment;
    endTime: Moment;
  }[];
}

const CForm = ({
  loading,
  onSubmit,
  isModalVisible,
  initialValues = { food: "", calories: "" },
  bikePrevReservations,
}: CFormProps) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields();
  }, [isModalVisible]);

  const onFinish = (values: object) => {
    onSubmit(values, () => {
      form.resetFields();
    });
  };

  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    // disabled dates with reservations & days in past as well
    return (current && current < moment()) || checkForPrevAppointments(current);
  };

  // helper for checking appointments dates
  const checkForPrevAppointments = (current: Moment) => {
    return bikePrevReservations.some((each) =>
      current
        .isBetween(each.startTime.startOf("day"), each.endTime.endOf("day"))
    );
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
          disabledDate={disabledDate}
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
