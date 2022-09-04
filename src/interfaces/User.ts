interface User {
  uid: string;
  email: string;
  displayName: string;
  isManager: boolean;
  password?: string;
}


export default User;
