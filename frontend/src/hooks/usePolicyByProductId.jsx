import { useEffect, useState, useCallback } from "react";
import { getPolicyByProductId } from "../services/PlanServices";

const usePolicyByProductId = (productId) => {

    const [policyData, setPolicyData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPolicies = useCallback(async () => {

        if (!productId) return;

        try {

            setLoading(true);
            setError(null);

            const data = await getPolicyByProductId(productId);

            setPolicyData(data || []);

        } catch (err) {

            console.error(err);

            setError(err);

        } finally {

            setLoading(false);

        }

    }, [productId]);

    useEffect(() => {

        fetchPolicies();

    }, [fetchPolicies]);

    return {
        policyData,
        loading,
        error,
        refreshPolicies: fetchPolicies
    };
};

export default usePolicyByProductId;