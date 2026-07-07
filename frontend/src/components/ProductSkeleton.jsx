import React from "react";

const ProductSkeleton = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {
                [...Array(6)].map((_, index) => (
                    <div
                        key={index}
                        className="h-64 rounded-xl bg-gray-200 animate-pulse"
                    />
                ))
            }
        </div>
    );
};

export default ProductSkeleton;