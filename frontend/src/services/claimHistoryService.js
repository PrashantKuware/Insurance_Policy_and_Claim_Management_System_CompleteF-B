import axios from "axios";
import claimHistoryApi from "../api/claimHistoryApi"

const handleError = (error) => {
    const message =
        error?.response?.data?.message ||
        error?.response?.data ||
        error.message;

    console.log("API Error:", message);
    throw new Error(message);
};


export const getClaimHistoryByClaimId = async (claimId) => {
    try {
        const res = await claimHistoryApi.get(`/${claimId}`)
        return res.data
    } catch (error) {
        handleError(error);
    }
}

export const getClaimHistoryByPolicyId = async (policyId) => {
    try {
        const res = await claimHistoryApi.get(`/policy/${policyId}`)
        return res.data
    } catch (error) {
        handleError(error);
    }
}

export const downloadClaimHistoryPdf = async (policyId) => {

    const token =
        localStorage.getItem("token");

    const response = await axios.get(
        `http://localhost:8080/api/claim-history/policy/${policyId}/pdf`,
        {
            responseType: "blob",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const url =
        window.URL.createObjectURL(
            new Blob([response.data]));

    const link =
        document.createElement("a");

    link.href = url;

    link.setAttribute(
        "download",
        `claim-history-${policyId}.pdf`
    );

    document.body.appendChild(link);

    link.click();

    link.remove();
};