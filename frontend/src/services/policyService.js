import policyApi from "../api/policyApi";

const handleError = (error) => {
  console.log("Policy API Error:", error?.response?.data || error.message);
  throw error;
};


export const getAllPoliciesByCustomer = async () => {
  try {
    const res = await policyApi.get("/my-policies");
    return res.data;
  } catch (error) {
    handleError(error);
  }
};


export const purchasePolicy = async (planId) => {
  try {
    const res = await policyApi.post("/purchase", {
      planId,
    });

    return res.data;
  } catch (error) {
    handleError(error);
  }
};


export const getPolicyByPolicyId = async (policyId) => {
  try {
    const res = await policyApi.get(`/${policyId}`);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};