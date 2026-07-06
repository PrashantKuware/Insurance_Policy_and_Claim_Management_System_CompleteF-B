import apiClient from "../api/apiClient";

export const addPlan = async (planData) => {
  const response = await apiClient.post("/plans", planData);
  return response.data;
};

export const getPlanById = async (id) => {
  const response = await apiClient.get(`/plans/${id}`);
  return response.data;
};

export const getAllPlans = async (pageNo = 0, pageSize = 10) => {
  const response = await apiClient.get(`/plans?pageNo=${pageNo}&pageSize=${pageSize}`);
  return response.data;
};

export const updatePlan = async (id, planData) => {
  const response = await apiClient.put(`/plans/${id}`, planData);
  return response.data;
};

export const deactivatePlan = async (id) => {
  const response = await apiClient.patch(`/plans/${id}/deactivate`);
  return response.data;
};

export const getPolicyByProductId = async (productId) => {
  const response = await apiClient.get(`/plans/product/${productId}`);
  return response.data;
};
