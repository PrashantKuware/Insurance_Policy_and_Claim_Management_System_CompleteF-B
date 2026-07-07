import axios from "axios";

export const loginApi = axios.create({
    baseURL: "http://localhost:8080/api/auth"
})