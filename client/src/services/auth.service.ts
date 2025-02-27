import { User } from "../types/types";
import axios from "../utils/axios";

export interface Credentials {
  username: string;
  password: string;
}

export interface Register {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export type response = { access_token: string; user: User };

const baseUrl = `http://localhost:3001/auth/login`;
const registerUrl = `http://localhost:3001/auth/register`;
const forgotUrl = "http://localhost:3001/auth/forgot-password"; // Replace with your server URL
const verifyUrl = "http://localhost:3001/auth/verify-reset-code";
const resetUrl = "http://localhost:3001/auth/reset-password";

const login = async (credentials: Credentials): Promise<response> => {
  const { data } = await axios.post<response>(baseUrl, credentials);
  return data;
};
const register = async (info: Register): Promise<response> => {
  const { data } = await axios.post<response>(registerUrl, info);
  return data;
};
const sendResetCode = async (email: string) => {
  const { data } = await axios.post<{
    message: string;
  }>(forgotUrl, { email: email });
  return data;
};
const verifyResetCode = async (email: string, code: string) => {
  const { data } = await axios.post<{
    message: string;
  }>(verifyUrl, { email: email, code: code });
  return data;
};
const resetPassword = async (
  email: string,
  code: string,
  newPassword: string
) => {
  const { data } = await axios.post<{
    message: string;
  }>(resetUrl, { email: email, code: code, newPassword: newPassword });
  return data;
};

export { login, register, sendResetCode, verifyResetCode, resetPassword };
