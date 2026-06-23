import productApi from "../api/productApi";

const handleError = (error) => {
  console.log("Product API Error:", error?.response?.data || error.message);
  throw error;
};


export const getAllProduct = async (pageNo = 0, pageSize = 10) => {
  try {
    const res = await productApi.get("", {
      params: { pageNo, pageSize },
    });

    return res.data;
  } catch (error) {
    handleError(error);
  }
};


export const addNewProduct = async (
  productName,
  productType,
  description
) => {
  try {
    const res = await productApi.post("", {
      productName,
      productType,
      description,
    });

    return res.data;
  } catch (error) {
    handleError(error);
  }
};