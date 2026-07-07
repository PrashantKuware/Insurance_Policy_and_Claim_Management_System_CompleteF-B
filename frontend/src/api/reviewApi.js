import axios from "axios";

const reviewApi = axios.create({
  baseURL: "http://localhost:8080/api/reviews",
});

reviewApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default reviewApi;