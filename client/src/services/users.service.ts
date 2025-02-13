// chatService.js
import axios, { setTokenInAxios } from "../utils/axios";

const API_BASE_URL = "http://localhost:3001"; // Replace with your server URL

const usersService = {
  getUsers: async () => {
    try {
      setTokenInAxios(sessionStorage.getItem("accessToken") || "");
      const response = await axios.get(`${API_BASE_URL}/users`);
      console.log("fetch users from api")
      return response.data;
    } catch (error) {
      console.error("Error fetching messages:", error);
      throw error;
    }
  },

  // sendMessage: async (message) => {
  //   try {
  //     const response = await axios.post(`${API_BASE_URL}/chat/send`, message);
  //     return response.data;
  //   } catch (error) {
  //     console.error("Error sending message:", error);
  //     throw error;
  //   }
  // },
};

export default usersService;
