import { User } from "./Usuario.type";


export type ApiError = {
  data: {
    message: string;
  };
  status: number;
};

export type loginData = {
  email: string;
  password: string;
};

export type userState = {
  users: User[];
  userLogin: User;
};



export type RootState = {
  user: userState;
};