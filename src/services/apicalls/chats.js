import axios from "axios";

export const createchat = (data) => {
  return axios.post("http://localhost:5409/chats/create-chat", data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};