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

    const data = res.data;

    // Load local overrides
    let activatedIds = [];
    let deactivatedIds = [];
    try {
      activatedIds = JSON.parse(localStorage.getItem("activated_products") || "[]");
      deactivatedIds = JSON.parse(localStorage.getItem("deactivated_products") || "[]");
    } catch (e) {
      console.error(e);
    }

    const applyOverrides = (p) => {
      if (!p) return p;
      let active = p.active;
      if (activatedIds.includes(p.productId)) {
        active = true;
      }
      if (deactivatedIds.includes(p.productId)) {
        active = false;
      }
      return { ...p, active };
    };

    if (data) {
      if (data.content) {
        data.content = data.content.map(applyOverrides);
      } else if (Array.isArray(data)) {
        return data.map(applyOverrides);
      }
    }

    const role = localStorage.getItem("role");

    if (role === "CUSTOMER" && data) {
      let deletedIds = [];
      try {
        deletedIds = JSON.parse(localStorage.getItem("deleted_products") || "[]");
      } catch (e) {
        console.error(e);
      }

      if (data.content) {
        data.content = data.content.filter(
          (p) => p.active && !deletedIds.includes(p.productId)
        );
      } else if (Array.isArray(data)) {
        return data.filter((p) => p.active && !deletedIds.includes(p.productId));
      }
    }

    return data;
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

    const data = res.data;

    // Load overrides
    let activatedIds = [];
    let deactivatedIds = [];
    try {
      activatedIds = JSON.parse(localStorage.getItem("activated_products") || "[]");
      deactivatedIds = JSON.parse(localStorage.getItem("deactivated_products") || "[]");
    } catch (e) {
      console.error(e);
    }

    const applyOverrides = (p) => {
      if (!p) return p;
      let active = p.active;
      if (activatedIds.includes(p.productId)) {
        active = true;
      }
      if (deactivatedIds.includes(p.productId)) {
        active = false;
      }
      return { ...p, active };
    };

    let mappedData = Array.isArray(data) ? data.map(applyOverrides) : data;

    const role = localStorage.getItem("role");

    if (role === "CUSTOMER" && Array.isArray(mappedData)) {
      let deletedIds = [];
      try {
        deletedIds = JSON.parse(localStorage.getItem("deleted_products") || "[]");
      } catch (e) {
        console.error(e);
      }
      return mappedData.filter((p) => p.active && !deletedIds.includes(p.productId));
    }

    return mappedData;
  } catch (error) {
    handleError(error);
  }
};

export const updateProduct = async (productId, productName, productType, description) => {
  try {
    const res = await productApi.put(`/${productId}`, {
      productName,
      productType,
      description,
    });
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const deactivateProduct = async (productId) => {
  try {
    const res = await productApi.patch(`/${productId}/deactivate`);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};