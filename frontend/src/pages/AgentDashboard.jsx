import React from 'react';
import GetSubmittedClaim from '../components/GetSubmittedClaim';
import BackgroundOrbs from '../components/BackgroundOrbs';
import "../components/Product.css";

const AgentDashboard = () => {

    return (
        <div className="dashboardContainer">

            <BackgroundOrbs />

            <div className="dashboardContent">

                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">

                    <h1 className="dashboardTitle">
                        Agent Dashboard
                    </h1>

                    <div
                        className="
                            px-5 py-3
                            rounded-xl
                            bg-linear-to-r
                            from-blue-600
                            to-indigo-600
                            text-white
                            font-semibold
                            shadow-lg
                        "
                    >
                        📋 Claim Review Portal
                    </div>

                </div>

                <div>

                    <h2 className="sectionTitle mb-6">
                        Submitted Claims
                    </h2>

                    <GetSubmittedClaim />

                </div>

            </div>

        </div>
    );
};

export default AgentDashboard;