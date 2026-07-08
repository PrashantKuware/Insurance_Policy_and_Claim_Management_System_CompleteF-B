import paymentApi from "../api/paymentApi";

export const payForPolicy = async (
  policyId,
  amount,
  paymentMode,
  razorpayResponse
) => {

  const res = await paymentApi.post(
    `/policy/${policyId}`,
    {
      amount: amount,
      paymentMode: paymentMode,
      razorpayPaymentId:
        razorpayResponse.razorpay_payment_id,
      razorpayOrderId:
        razorpayResponse.razorpay_order_id,
      razorpaySignature:
        razorpayResponse.razorpay_signature
    }
  );
  return res.data;
};

export const createPaymentOrder = async (policyId) => {

  const res =
    await paymentApi.post(
      `/create-order/${policyId}`
    );

  return res.data;

}
