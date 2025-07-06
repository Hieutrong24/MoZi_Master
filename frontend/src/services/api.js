import axios from "../utils/axios-customize";

export const register = async (email, name, password, gender) => {
  return await axios.post("/auth/sign-up", {
    email,
    name,
    password,
    gender,
  });
};

export const login = async (email, password) => {
  return await axios.post("/auth/sign-in", {
    email,
    password,
  });
};

export const logout = async () => {
  return await axios.post("/auth/sign-out");
};

export const fetchAccount = async () => {
  return await axios.post("/auth/fetch-account");
};

export const getUsers = async () => {
  return await axios.get("/user");
};

export const getConversation = async (id) => {
  return await axios.get("/message/" + id);
};

export const sendMessage = async (id, message) => {
  return await axios.post("/message/send/" + id, { message });
};
