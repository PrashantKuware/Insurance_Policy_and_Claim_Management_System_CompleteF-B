import paymentApi from "../api/paymentApi";

export const payForPolicy = async (
  policyId,
  amount,
  paymentMode = "UPI"
) => {
  try {
    const res = await paymentApi.post(`/policy/${policyId}`, {
      amount,
      paymentMode,
    });

    return res.data;
  } catch (error) {
    console.log(
      "Payment API Error:",
      error?.response?.data || error.message
    );
    throw error;
  }
};