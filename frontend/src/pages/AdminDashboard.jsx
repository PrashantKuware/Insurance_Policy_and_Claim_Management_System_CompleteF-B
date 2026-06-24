import Product from '../components/Product';
import GetAllUser from '../components/GetAllUser';
import GetAllCustomer from '../components/GetAllCustomer';
import "../components/Product.css";
import { NavLink } from 'react-router-dom';

const AdminDashboard = () => {

    return (
        <div className="dashboardContainer">

            <div className="orb orb1"></div>
            <div className="orb orb2"></div>
            <div className="orb orb3"></div>
            <div className="orb orb4"></div>

            <div className="dashboardContent">

                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">

                    <h1 className="dashboardTitle">
                        Insurance Admin Dashboard
                    </h1>

                    <NavLink
                        to="/viewallclaim"
                        className="
                            px-6 py-3
                            rounded-xl
                            bg-linear-to-r
                            from-purple-600
                            to-pink-600
                            text-white
                            font-semibold
                            shadow-lg
                            hover:scale-105
                            transition-all
                            duration-300
                        "
                    >
                        📋 View All Claims
                    </NavLink>

                </div>


                <div className="mb-12">

                    <div className="flex justify-between items-center mb-6">

                        <h2 className="sectionTitle">
                            Customers
                        </h2>

                    </div>

                    <GetAllCustomer />

                </div>


                <div className="mb-12">

                    <div className='flex justify-between items-center'>
                        <h2 className="sectionTitle mb-6">
                        Agents
                    </h2>
                    <NavLink
                        to="/addagent"
                        className="
                            px-6 py-3
                            rounded-xl
                            bg-linear-to-r
                            from-purple-600
                            to-pink-600
                            text-white
                            font-semibold
                            shadow-lg
                            hover:scale-105
                            transition-all
                            duration-300
                        "
                    >
                        ➕ Add Agent
                    </NavLink>
                    </div>

                    <GetAllUser />

                </div>


                <div>
                    <Product />

                </div>

            </div>

        </div>
    );
};

export default AdminDashboard;