// import planApi from "../api/planApi";

// const handleError = (error) => {
//   console.log("Plan API Error:", error?.response?.data || error.message);
//   throw error;
// };


// export const getAllPolicy = async () => {
//   try {
//     const res = await planApi.get("");
//     return res.data;
//   } catch (error) {
//     handleError(error);
//   }
// };


// export const addNewPlanPolicy = async (
//   productId,
//   planName,
//   coverageAmount,
//   premiumAmount,
//   premiumType,
//   duration,
//   termsConditions
// ) => {
//   try {
//     const res = await planApi.post("", {
//       productId,
//       planName,
//       coverageAmount,
//       premiumAmount,
//       premiumType,
//       duration,
//       termsConditions,
//     });

//     return res.data; 
//   } catch (error) {
//     handleError(error);
//   }
// };


// export const getPolicyByProductId = async (productId) => {
//   try {
//     const res = await planApi.get(`/product/${productId}`);
//     return res.data;
//   } catch (error) {
//     handleError(error);
//   }
// };


// export const getPolicyByPlanId = async (planId) => {
//   try {
//     const res = await planApi.get(`/${planId}`);
//     return res.data;
//   } catch (error) {
//     handleError(error);
//   }
// };

import planApi from "../api/planApi";

const handleError = (error) => {
  console.log("Plan API Error:", error?.response?.data || error.message);
  throw error;
};


export const getAllPolicy = async () => {
  try {
    const res = await planApi.get("");
    return res.data;
  } catch (error) {
    handleError(error);
  }
};


export const addNewPlanPolicy = async (
  productId,
  planName,
  coverageAmount,
  premiumAmount,
  premiumType,
  duration,
  termsConditions
) => {
  try {
    const res = await planApi.post("", {
      productId,
      planName,
      coverageAmount,
      premiumAmount,
      premiumType,
      duration,
      termsConditions,
    });

    return res.data; 
  } catch (error) {
    handleError(error);
  }
};


export const getPolicyByProductId = async (productId) => {
  try {
    const res = await planApi.get(`/product/${productId}`);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};


export const getPolicyByPlanId = async (planId) => {
  try {
    const res = await planApi.get(`/${planId}`);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};