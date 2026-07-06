import apiClient from "../api/apiClient";

export const submitClaim = async (policyId, claimData) => {
  const response = await apiClient.post(`/claims/policy/${policyId}`, claimData);
  return response.data;
};

export const getClaimsByPolicy = async (policyId, page = 0, size = 10) => {
  const response = await apiClient.get(`/claims/policy/${policyId}?page=${page}&size=${size}`);
  return response.data;
};

export const withdrawClaim = async (claimId) => {
  const response = await apiClient.put(`/claims/${claimId}/withdraw`);
  return response.data;
};

export const reviewClaim = async (claimId, reviewData) => {
  const response = await apiClient.put(`/claims/${claimId}/review`, reviewData);
  return response.data;
};

export const recommendClaimApproval = async (claimId, recommendData) => {
  const response = await apiClient.put(`/claims/${claimId}/recommend-approval`, recommendData);
  return response.data;
};

export const recommendClaimRejection = async (claimId, recommendData) => {
  const response = await apiClient.put(`/claims/${claimId}/recommend-rejection`, recommendData);
  return response.data;
};

export const approveClaim = async (claimId, decisionData) => {
  const response = await apiClient.put(`/claims/${claimId}/approve`, decisionData);
  return response.data;
};

export const rejectClaim = async (claimId, decisionData) => {
  const response = await apiClient.put(`/claims/${claimId}/reject`, decisionData);
  return response.data;
};

export const getClaimById = async (claimId) => {
  const response = await apiClient.get(`/claims/${claimId}`);
  return response.data;
};

export const getClaimsByCustomer = async (customerId, page = 0, size = 10) => {
  const response = await apiClient.get(`/claims/customer/${customerId}?page=${page}&size=${size}`);
  return response.data;
};

export const getAllClaims = async (page = 0, size = 10) => {
  const response = await apiClient.get(`/claims?page=${page}&size=${size}`);
  return response.data;
};

export const uploadClaimDocuments = async (claimId, formData) => {
  const response = await apiClient.post(`/claims/${claimId}/documents`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getClaimDocuments = async (claimId) => {
  const response = await apiClient.get(`/claims/${claimId}/documents`);
  return response.data;
};

export const getSubmittedClaims = async () => {
  const response = await apiClient.get("/claims/submitted");
  return response.data;
};
