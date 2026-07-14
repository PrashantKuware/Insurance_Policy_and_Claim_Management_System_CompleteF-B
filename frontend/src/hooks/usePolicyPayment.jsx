import { useState } from "react";
import { toast } from "react-toastify";
import { createPaymentOrder, payForPolicy } from "../services/paymentService";

const usePolicyPayment = () => {

    const [paymentLoading, setPaymentLoading] = useState(false);


    const payPolicy = async (
        policyId,
        premiumAmount,
        navigate
    ) => {

           console.log("Hook Policy ID:", policyId);
    console.log("Hook Premium:", premiumAmount);


        try {
            setPaymentLoading(true);

            const order = await createPaymentOrder(policyId);


            const options = {
                key: order.razorpayKey,

                amount: premiumAmount * 100,

                currency: "INR",

                name: "INSUREX",

                description: "Policy Premium Payment",

                order_id: order.razorpayOrderId,


                handler: async function (response) {

                    try {

                        await payForPolicy(
                            policyId,
                            premiumAmount,
                            "UPI",
                            response
                        );


                        toast.success(
                            "Payment Successful ✅"
                        );


                        setTimeout(() => {
                            navigate("/customerdashboard");
                        }, 1000);


                    } catch (error) {

                        console.log(error);

                        toast.error(
                            "Payment Save Failed ❌"
                        );
                    }
                },


                prefill: {
                    name: "Mayank",
                    email: "test@example.com",
                    contact: "9999999999"
                },


                method: {
                    upi: true,
                    card: true,
                    netbanking: true
                },


                theme: {
                    color: "#06b6d4"
                }
            };


            const razor =
                new window.Razorpay(options);

            razor.open();


        } catch (error) {

            console.log(error);

            toast.error(
                "Payment Failed ❌"
            );

        } finally {

            setPaymentLoading(false);

        }
    };


    return {
        payPolicy,
        paymentLoading
    };
};


export default usePolicyPayment;