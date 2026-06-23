import { loginApi } from "../api/login";

export const loginService = async (email, password) => {
    try {
        const res = await loginApi.post("/login", {
            email,
            password,
        });

        return res.data;
    } catch (error) {
        console.log("Login API Error:", error?.response?.data || error.message);
        throw error; // IMPORTANT
    }
};