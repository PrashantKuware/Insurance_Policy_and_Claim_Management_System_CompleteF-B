import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { getAllProduct } from "../services/ProductService";

const useProducts = () => {

    const [productData, setProductData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getProductData = useCallback(async () => {

        try {

            setLoading(true);
            setError(null);

            const data = await getAllProduct();

            setProductData(
                data?.content || []
            );

        } catch (err) {

            console.error(err);

            setError(err);

            toast.error(
                err?.response?.data?.message ||
                "Failed To Load Products ❌"
            );

        } finally {

            setLoading(false);

        }

    }, []);

    useEffect(() => {

        let mounted = true;

        const loadProducts = async () => {

            if (mounted) {
                await getProductData();
            }

        };

        loadProducts();

        return () => {
            mounted = false;
        };

    }, [getProductData]);

    return {
        productData,
        loading,
        error,
        refreshProducts: getProductData
    };
};

export default useProducts;