import React from 'react';
import Product from '../components/Product';
import MyPolicies from '../components/MyPolicies';
import BackgroundOrbs from '../components/BackgroundOrbs';
import "../components/Product.css";

const CustomerDashboard = () => {

    return (
        <div className="dashboardContainer">

            <BackgroundOrbs />

            <div className="dashboardContent">

                <h1 className="dashboardTitle mb-8">
                    Customer Dashboard
                </h1>


                <div className="mb-12">

                    <h2 className="sectionTitle mb-6">
                        My Policies
                    </h2>

                    <MyPolicies />

                </div>


                <div>

                    <h2 className="sectionTitle mb-6">
                        Available Insurance Products
                    </h2>

                    <Product />

                </div>

            </div>

        </div>
    );
};

export default CustomerDashboard;