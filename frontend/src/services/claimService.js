import claimApi from "../api/claimApi";

const handleError = (error) => {
  console.log(
    "Claim API Error:",
    error?.response?.data || error.message
  );
  throw error;
};

export const submitClaim = async (
  policyId,
  claimAmount,
  claimReason,
  incidentDate
) => {
  try {
    const res = await claimApi.post(`/policy/${policyId}`, {
      claimAmount,
      claimReason,
      incidentDate,
    });

    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const uploadDocument = async (claimId, files = []) => {
  try {
    if (!Array.isArray(files) || files.length === 0) {
      throw new Error("No files provided for upload");
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    const res = await claimApi.post(
      `/${claimId}/documents`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const getClaimByPolicyId = async (policyId) => {
  try {
    const res = await claimApi.get(`/policy/${policyId}`);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const getClaimDocument = async (claimId) => {
  try {
    const res = await claimApi.get(`/${claimId}/documents`);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const withdrawClaimById = async (claimId) => {
  try {
    const res = await claimApi.put(`/${claimId}/withdraw`, {});
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const getSubmittedClaim = async () => {
  try {
    const res = await claimApi.get("/submitted");
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const agentClaimReview = async (claimId) => {
  try {
    const res = await claimApi.put(`/${claimId}/review`, {});
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const agentRecommendClaimForApproval = async (
  claimId,
  remarks
) => {
  try {
    const res = await claimApi.put(
      `/${claimId}/recommend-approval`,
      { remarks }
    );

    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const agentRecommendClaimForRejection = async (
  claimId,
  remarks
) => {
  try {
    const res = await claimApi.put(
      `/${claimId}/recommend-rejection`,
      { remarks }
    );

    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const getAllClaims = async (page = 0, size = 20) => {
  try {
    const res = await claimApi.get("", {
      params: { page, size },
    });

    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const adminApproveClaim = async (claimId, remarks) => {
  try {
    const res = await claimApi.put(
      `/${claimId}/approve`,
      { remarks }
    );

    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const adminRejectClaim = async (claimId, remarks) => {
  try {
    const res = await claimApi.put(
      `/${claimId}/reject`,
      { remarks }
    );

    return res.data;
  } catch (error) {
    handleError(error);
  }
};

// export const getAllClaims = async (page = 0, size = 10) => {
//   try {
//     const res = await claimApi.get(
//       `?page=${page}&size=${size}`
//     );

//     return res.data;
//   } catch (error) {
//     console.error("Error fetching claims:", error);
//     throw error;
//   }
// };