import reviewApi from "../api/reviewApi"

export const getAllReviewByPlanId = async (planId) => {
    try {
        const res = await reviewApi.get(`/plan/${planId}`)

        return res.data
    } catch (error) {
        console.log(error)
        throw error;
    }
}

export const submitReviewByCustomer = async (formData) => {
    try {
        const res = await reviewApi.post("", formData)

        return res.data
    } catch (error) {
        console.log(error)
        throw error;
    }
}

export const checkReviewExists = async (policyId) => {
    try {
        const res = await reviewApi.get(`/exists/${policyId}`);

        return res.data;
    } catch (error) {
        console.log(error)
        throw error;
    }
};

export const getAverageRating = async (planId) => {
    try {
        const res = await reviewApi.get(`/average/${planId}`)

        return res.data
    } catch (error) {
        console.log(error)
        throw error;
    }
}