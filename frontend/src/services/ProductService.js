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

export const getProductBtProductType = async (productType) => {
  try {
    const res = await productApi.get("/producttype", {
      params: {
        productType,
      },
    });

    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const changeProductStatus = async (productId) => {
  try {

    const res = await productApi.patch(`/${productId}/status`);

    return res.data;

  } catch (error) {
    handleError(error);
  }
};

export const updateProduct = async (
  productId,
  productName,
  productType,
  description
) => {
  try {
    const res = await productApi.put(`/${productId}`, {
      productName,
      productType,
      description,
      status: true
    });
    return res.data;
  } catch (error) {
    handleError(error);
  }

}