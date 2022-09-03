import React, { useState } from "react";
import {
  Modal,
  Button,
  message,
  Form,
  Input,
} from "antd";
import { firestore } from "../../firebase";
import Bike from "../../interfaces/Bike";

interface RateABikeProps {
  callback?: () => any;
  bike?: Bike;
  reservationId?: string;
}

const BikeForm = ({ callback, bike }: RateABikeProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    !loading && setIsModalVisible(false);
  };

  const handleCancel = () => {
    !loading && setIsModalVisible(false);
  };

  const handleSubmit = (values: Pick<Bike, "color" | "model" | "location">) => {
    const bike: Bike = {
      ...values,
      ratings: [],
      available: true,
    };

    setLoading(true);

    firestore
      .collection("Bikes")
      .add(bike)
      .finally(() => {
        message.success("Bike Added!");
        setLoading(false);
        callback && callback();
        setIsModalVisible(false);
      });
  };

  return (
    <>
      <Button onClick={showModal} type="primary">
        Add a Bike
      </Button>
      {isModalVisible && (
        <Modal
          footer={null}
          title="Add a bike"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          {isModalVisible && (
            <Form
              name="normal_login"
              className="login-form"
              initialValues={{ remember: true }}
              onFinish={handleSubmit}
              style={{ width: 350 }}
            >
              <Form.Item
                name="model"
                rules={[
                  { required: true, message: "Please input bike model!" },
                  {
                    pattern: new RegExp(/^([a-zA-z0-9/\\''(),-\s]{2,50})$/),
                    message: "Please enter a valid bike modal!",
                  },
                ]}
              >
                <Input size="large" placeholder="Bike model" />
              </Form.Item>
              <Form.Item
                name="location"
                rules={[
                  { required: true, message: "Please input bike location!" },
                  {
                    pattern: new RegExp(/^([a-zA-z0-9/\\''(),-\s]{2,255})$/),
                    message: "Please enter a valid location!",
                  },
                ]}
              >
                <Input size="large" placeholder="Bike location" />
              </Form.Item>

              <Form.Item
                name="color"
                rules={[
                  { required: true, message: "Please input bike color!" },
                  {
                    pattern: new RegExp(/^([a-zA-z/\\''()\s]{2,20})$/),
                    message: "Please enter a valid color!",
                  },
                ]}
              >
                <Input size="large" placeholder="Bike color" />
              </Form.Item>

              <Form.Item>
                <Button loading={loading} type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          )}
        </Modal>
      )}
    </>
  );
};

export default BikeForm;
