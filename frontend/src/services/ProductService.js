import apiClient from "../api/apiClient";

export const getAllProducts = async (pageNo = 0, pageSize = 10) => {
  const response = await apiClient.get(`/products?pageNo=${pageNo}&pageSize=${pageSize}`);
  return response.data;
};

export const getProductById = async (id) => {
  const response = await apiClient.get(`/products/${id}`);
  return response.data;
};

export const addProduct = async (productData) => {
  const response = await apiClient.post("/products", productData);
  return response.data;
};

export const updateProduct = async (id, productData) => {
  const response = await apiClient.put(`/products/${id}`, productData);
  return response.data;
};

export const deactivateProduct = async (id) => {
  const response = await apiClient.patch(`/products/${id}/deactivate`);
  return response.data;
};

export const activateProduct = async (productId) => {
  const product = await getProductById(productId);
  const response = await updateProduct(productId, {
    productName: product.productName,
    productType: product.productType,
    description: product.description,
    status: true, // mapped to active=true in the backend via ProductRequestDto.status
  });
  return response;
};
