import { Request } from "express";

export interface FullUser {
  id: string;
  email: string;
  password?: string;
  role?: string;
  status?: number;
  active: number;
  token?: number;
  first_time_login?: boolean;
}

export interface User {
  id: number;
  role: string;
}
export interface MulterRequest extends Request {
  file: any;
}

export interface UserRequest extends Request {
  body: {
    uuid?: string;
    email?: string;
    password?: string;
    otp?: number;
    oldPassword?: string;
    newPassword?: string;
    name?: string;
    phone?: string;
    phoneNumber?: string;
    industry?: string;
    interest_area?: string;
    state?: string;
    city_lga?: string;
    address?: string;
    about?: string;
    website?: string;
    cac?: string;
    orgemail?: string;
    orgphone?: string;
    additional_information?: string;
    bankName?: string;
    accountName?: string;
    accountNumber?: string;
    bvn?: string;
    [key: string]: any;
  };
  cookies: {
    giveback?: string;
  };
  user?: User;
  files?: any;
}
