import axios from "axios";

const userApi = axios.create({
  baseURL: "http://localhost:8080/api/auth",
});

userApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default userApi;