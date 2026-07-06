import apiClient from "../api/apiClient";

// Policies endpoints
export const purchasePolicy = async (purchaseData) => {
  const response = await apiClient.post("/policies/purchase", purchaseData);
  return response.data;
};

export const getPolicyById = async (policyId) => {
  const response = await apiClient.get(`/policies/${policyId}`);
  return response.data;
};

export const getMyPolicies = async () => {
  const response = await apiClient.get("/policies/my-policies");
  return response.data; // Returns list
};

export const getAllPolicies = async (pageNo = 0, pageSize = 10, sortBy = "policyId") => {
  const response = await apiClient.get(`/policies?pageNo=${pageNo}&pageSize=${pageSize}&sortBy=${sortBy}`);
  return response.data; // Returns page
};

export const activatePolicy = async (policyId) => {
  const response = await apiClient.patch(`/policies/${policyId}/activate`);
  return response.data;
};

export const cancelPolicy = async (policyId) => {
  const response = await apiClient.patch(`/policies/${policyId}/cancel`);
  return response.data;
};

// Payments endpoints
export const payPremium = async (policyId, paymentRequestDto) => {
  const response = await apiClient.post(`/payments/policy/${policyId}`, paymentRequestDto);
  return response.data;
};

export const getPaymentById = async (paymentId) => {
  const response = await apiClient.get(`/payments/${paymentId}`);
  return response.data;
};

export const getPaymentsByPolicy = async (policyId, page = 0, size = 10) => {
  const response = await apiClient.get(`/payments/policy/${policyId}?page=${page}&size=${size}`);
  return response.data;
};

export const getAllPayments = async (page = 0, size = 10) => {
  const response = await apiClient.get(`/payments?page=${page}&size=${size}`);
  return response.data;
};

export const updatePaymentStatus = async (paymentId, status) => {
  const response = await apiClient.patch(`/payments/${paymentId}/status?status=${encodeURIComponent(status)}`);
  return response.data;
};
