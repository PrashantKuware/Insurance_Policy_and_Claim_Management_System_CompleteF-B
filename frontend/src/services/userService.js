import apiClient from "../api/apiClient";

export const loginUser = async (loginData) => {
  const response = await apiClient.post("/auth/login", loginData);
  return response.data;
};

export const registerUser = async (registerData) => {
  const response = await apiClient.post("/auth/register", registerData);
  return response.data;
};

export const sendEmailOtp = async (email) => {
  const response = await apiClient.post(`/auth/send-email-otp?email=${encodeURIComponent(email)}`);
  return response.data;
};

export const sendMobileOtp = async (mobileNumber) => {
  const response = await apiClient.post(`/auth/send-mobile-otp?mobileNumber=${encodeURIComponent(mobileNumber)}`);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await apiClient.get("/auth/me");
  return response.data;
};

export const getAllUsers = async () => {
  const response = await apiClient.get("/auth/get");
  return response.data;
};

export const createAgent = async (agentData) => {
  const response = await apiClient.post("/auth/agent", agentData);
  return response.data;
};

export const updateUserStatus = async (userId, activeState) => {
  const response = await apiClient.patch(`/auth/${userId}/status`, { active: activeState });
  return response.data;
};
