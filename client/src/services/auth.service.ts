import { User } from "../types/types";
import axios from "../utils/axios";

export interface Credentials {
  username: string;
  password: string;
}

export type response = { access_token: string; user: User };

const baseUrl = `http://localhost:3001/auth/login`;

const login = async (credentials: Credentials): Promise<response> => {
  const { data } = await axios.post<response>(baseUrl, credentials);
  return data;
};

export { login };
