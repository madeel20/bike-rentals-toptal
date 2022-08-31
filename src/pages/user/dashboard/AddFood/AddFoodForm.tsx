import { Form, Input, Button, Checkbox, DatePicker, AutoComplete } from "antd";
// import axios from "axios";
import React,{ useDeferredValue, useEffect, useState } from "react";
import { auth, firestore } from "../../../../firebase";
import { NUTRITIONIX_APP_ID, NUTRITIONIX_KEY } from "../../../../utils/constants";

const AddFoodForm = ({ loading, onSubmit, isModalVisible, initialValues = {food:'',calories:''} }:any) => {
  const [form] = Form.useForm();
  const [options, setOptions] = useState([]);
  const [search,setSearch] = useState('');
  
  const deferredSearchValue = useDeferredValue(search);
  
  useEffect(()=>{
    form.resetFields()
  },[isModalVisible])

  useEffect(()=>{
    if(deferredSearchValue){
      // axios.get(
      //   "https://trackapi.nutritionix.com/v2/search/instant?query="+deferredSearchValue,
      //   {
      //     headers: {
      //       "x-app-key": NUTRITIONIX_KEY,
      //       "x-app-id": NUTRITIONIX_APP_ID,
      //     },
      //   }
      // ).then(res=>{ setOptions(res.data?.branded || []); });
    }
    else {
      setOptions([]);
    }
  },[deferredSearchValue])

  const onSearch = (searchText:string) => {
    setSearch(searchText)
  };

  const onSelect = (food_name:string) => {
    // let foodItem = options.find(e=>e.food_name === food_name);
    // form.setFieldsValue({calories: foodItem?.nf_calories })
  };

  const onFinish = (values:object) => {
    onSubmit(values, () => { 
      form.resetFields();
      setSearch('');
      setOptions([])
    });
  };


  const dateTimePickerConfig = {
    rules: [
      {
        type: "object",
        required: true,
        message: "Please select time!",
      },
    ],
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
        label="Food"
        name="food"
        rules={[{ required: true, message: "Please input your food!" }]}
      >
        <AutoComplete
          options={options.map((e:any)=>({label: e?.food_name, value: e?.food_name}))}
          onSelect={onSelect}
          onSearch={onSearch}
          disabled={loading}
        />
      </Form.Item>

      <Form.Item
        label="Calories"
        name="calories"
        rules={[{ required: true, message: "Please input calories!" }]}
      >
        <Input disabled={loading} type="number" />
      </Form.Item>

      {/* <Form.Item name="date" label="Date & Time:" {...dateTimePickerConfig}>
        <DatePicker disabled={loading} showTime format="YYYY-MM-DD HH:mm:ss" />
      </Form.Item> */}

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button loading={loading} type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddFoodForm;
