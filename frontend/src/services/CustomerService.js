import customerApi from "../api/customerApi";

export const getAllCustomers = async () => {
  try {
    const response = await customerApi.get("");
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getCustomerByCustomerId = async (customerID) => {
  try {
    const res = await customerApi.get(`/${customerID}`);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const addCustomer = async (customerData) => {
  try {
    const res = await customerApi.post("", customerData);

    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const customerExists = async () => {
  try {
    const res = await customerApi.get("/exists");
    return res.data;

  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateCustomer = async (customerData) => {
  try {
    const res = await customerApi.put("", customerData);

    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
} 