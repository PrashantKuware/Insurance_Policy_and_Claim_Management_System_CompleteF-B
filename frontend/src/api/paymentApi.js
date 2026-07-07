import axios from "axios";

const paymentApi = axios.create({
  baseURL: "http://localhost:8080/api/payments",
});

paymentApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default paymentApi;