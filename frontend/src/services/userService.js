
import userApi from "../api/userApi";

const handleError = (error) => {
  const message =
    error?.response?.data?.message ||
    error?.response?.data ||
    error.message;

  console.log("API Error:", message);
  throw new Error(message);
};


export const getAllUsers = async () => {
  try {
    const res = await userApi.get("/get");
    return res.data;
  } catch (error) {
    handleError(error);
  }
};


export const sendEmailOtp = async (email) => {
  try {
    const res = await userApi.post(`/send-email-otp?email=${email}`);
    return res.data;
  } catch (error) {
    console.log(error?.response?.data || error.message);
    throw error;
  }
};

export const sendMobileOtp = async (mobileNumber) => {
  try {
    const res = await userApi.post(
      `/send-mobile-otp?mobileNumber=${mobileNumber}`
    );
    return res.data;
  } catch (error) {
    console.log(error?.response?.data || error.message);
    throw error;
  }
};


export const createAgent = async (data) => {
  try {
    const res = await userApi.post("/agent", data);
    return res.data;
  } catch (error) {
    console.log(error?.response?.data || error.message);
    throw error;
  }
};


export const registerCustomer = async (data) => {
  try {
    const res = await userApi.post("/register", data);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};