import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  console.log("================================");
  console.log("REQUEST URL:", config.url);
  console.log("TOKEN:", token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  console.log("AUTH HEADER:", config.headers.Authorization);
  console.log("================================");

  return config;
});

export default api;