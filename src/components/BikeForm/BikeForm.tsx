import React, { useEffect, useState } from "react";
import { Modal, Button, message, Form, Input } from "antd";
import { firestore } from "../../firebase";
import Bike from "../../interfaces/Bike";

interface RateABikeProps {
  callback?: () => any;
  bike?: Bike;
}

type FormValues = Pick<Bike, "color" | "model" | "location">;

const BikeForm = ({ callback, bike }: RateABikeProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [initialValues, setInitialValues] = useState<FormValues>(
    bike || {
      color: "",
      location: "",
      model: "",
    }
  );

  useEffect(() => bike && setInitialValues(bike), [bike]);

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
    setLoading(true);
    let bikesCollection = firestore.collection("Bikes");

    if (bike) {
      bikesCollection
        .doc(bike.id)
        .update({
          ...values,
        })
        .finally(() => {
          message.success("Bike Updated!");
          setLoading(false);
          callback && callback();
          setIsModalVisible(false);
        });
    } else {
      const newBike: Bike = {
        ...values,
        ratings: [],
        available: true,
      };
      bikesCollection.add(newBike).finally(() => {
        message.success("Bike Added!");
        setLoading(false);
        callback && callback();
        setIsModalVisible(false);
      });
    }
  };

  return (
    <>
      <Button onClick={showModal} type={bike ? "link" : "primary"}>
        {bike ? "Edit" : "Add a Bike"}
      </Button>
      {isModalVisible && (
        <Modal
          footer={null}
          title={bike ? "Edit Bike" : "Add a Bike"}
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          {isModalVisible && (
            <Form
              name="normal_login"
              className="login-form"
              initialValues={initialValues}
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
