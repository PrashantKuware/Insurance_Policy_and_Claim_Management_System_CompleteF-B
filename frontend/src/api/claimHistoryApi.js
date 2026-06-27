import axios from "axios";

const claimHistoryApi = axios.create({
  baseURL: "http://localhost:8080/api/claim-history",
});

claimHistoryApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default claimHistoryApi;