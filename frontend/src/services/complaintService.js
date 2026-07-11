import complaintApi from "../api/complaintsApi"

export const getSubmitComplaint = async (formData) => {
    try {
        const res = await complaintApi.post("", formData)

        return res.data
    } catch (error) {
        console.log(error)
        throw error;
    }
}

export const getCustomerComplaint = async () => {
    try {
        const res = await complaintApi.get("/my")

        return res.data
    } catch (error) {
        console.log(error)
        throw error;
    }
}

export const getAllComplaint = async () => {
    try {
        const res = await complaintApi.get("")

        return res.data
    } catch (error) {
        console.log(error)
        throw error;
    }
}