import { render, screen } from "@testing-library/react";
import React from "react";
import UserFormFields from "./UserFormFields";
import User from "../../interfaces/User";

let user: User = {
  displayName: "test user",
  email: "abc@gmail.com",
  isManager: true,
  uid: "23423j4k234ho23i",
};

test("confirm order is initally disabled and enabled on terms agreement", async () => {
  const onFinish = jest.fn();

  render(<UserFormFields onFinish={onFinish} loading={false} user={user} />);

  // Check default input values
  const displayName = screen.getByDisplayValue(user.displayName);
  expect(displayName).toBeInTheDocument();
  const email = screen.getByDisplayValue(user.email);
  expect(email).toBeInTheDocument();
});
