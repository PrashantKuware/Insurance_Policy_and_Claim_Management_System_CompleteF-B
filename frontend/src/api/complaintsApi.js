import axios from "axios";

const complaintApi = axios.create({
  baseURL: "http://localhost:8080/api/complaints",
});

complaintApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default complaintApi;