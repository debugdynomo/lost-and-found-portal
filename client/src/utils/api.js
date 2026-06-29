import axios from "axios";

const api = axios.create({
  baseURL: "https://lost-and-found-portal-ksnh.onrender.com/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
