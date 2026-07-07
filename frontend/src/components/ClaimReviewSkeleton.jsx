import React from "react";

const ClaimReviewSkeleton = () => {
    return (
        <div className="p-6 animate-pulse">

            <div className="border rounded-lg p-4 mb-6">
                <div className="h-8 bg-gray-200 rounded w-52 mb-4"></div>

                <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-72"></div>
                    <div className="h-4 bg-gray-200 rounded w-60"></div>
                    <div className="h-4 bg-gray-200 rounded w-48"></div>
                    <div className="h-4 bg-gray-200 rounded w-64"></div>
                </div>
            </div>

            <div className="border rounded-lg p-4">
                <div className="h-8 bg-gray-200 rounded w-40 mb-4"></div>

                <div className="h-32 bg-gray-200 rounded"></div>
            </div>

        </div>
    );
};

export default ClaimReviewSkeleton;