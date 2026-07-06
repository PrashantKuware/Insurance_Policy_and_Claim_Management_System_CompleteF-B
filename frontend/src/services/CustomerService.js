import apiClient from "../api/apiClient";

export const createCustomerProfile = async (customerData) => {
  const response = await apiClient.post("/customer", customerData);
  return response.data;
};

export const getAllCustomers = async () => {
  const response = await apiClient.get("/customer");
  return response.data; // Note: returns ApiResponse containing the list in the 'data' field
};

export const getCustomerById = async (customerId) => {
  const response = await apiClient.get(`/customer/${customerId}`);
  return response.data;
};

export const deleteCustomer = async (customerId) => {
  const response = await apiClient.delete(`/customer/${customerId}`);
  return response.data;
};

export const updateCustomerProfile = async (customerData) => {
  const response = await apiClient.put("/customer", customerData);
  return response.data;
};

export const checkCustomerProfileExists = async () => {
  const response = await apiClient.get("/customer/exists");
  return response.data; // returns boolean direct from ResponseEntity
};
