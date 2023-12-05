// chatService.js
import { MessageType } from "../types/types";
import axios from "../utils/axios";

const API_BASE_URL = "http://localhost:3001"; // Replace with your server URL

const chatService = {
  getMessages: async (username:string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/chat/messages/${username}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching messages:", error);
      throw error;
    }
  },

  sendMessage: async (message: MessageType) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/chat/send`, message);
      return response.data;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  },
};

export default chatService;
