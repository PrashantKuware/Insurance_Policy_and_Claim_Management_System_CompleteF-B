import axios from "axios";

const planApi = axios.create({
  baseURL: "http://localhost:8080/api/plans",
});

planApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default planApi;