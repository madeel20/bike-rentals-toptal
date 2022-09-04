import axios from "axios";
import User from "../interfaces/User";

export const getAllUsersService = () =>
  axios.get(`/user`).then((res) => (res.data?.users || []) as User[]);

export const createAUserService = (
  newUser: Pick<User, "displayName" | "email" | "isManager">
) => axios.post(`/user`, newUser);

export const updateAUserService = (user: User) => axios.patch(`/user`, user);

export const deleteAUserService = (payload: Pick<User, "uid">) =>
  axios.delete(`/user`, {
    data: payload,
  });
