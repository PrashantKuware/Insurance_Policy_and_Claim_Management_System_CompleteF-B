import React, { useEffect, useState } from 'react';
import { getAllUsers } from "../services/userService";
import { toast } from 'react-toastify';
import "./Product.css";

const GetAllUser = () => {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadUsers = async () => {

        try {

            setLoading(true);

            const data = await getAllUsers();

            setUsers(data || []);

        } catch (error) {

            console.error(error);

            toast.error(
                error?.response?.data?.message ||
                "Failed To Load Agents ❌"
            );

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const agents = users.filter(
        (user) => user.role === "AGENT"
    );

    if (loading) {

        return (
            <div className="customerGrid">

                {Array.from({ length: 6 }).map((_, index) => (

                    <div
                        key={index}
                        className="customerCard animate-pulse"
                    >

                        <div className="h-6 w-20 bg-gray-300 rounded mb-4"></div>

                        <div className="h-5 w-40 bg-gray-300 rounded mb-3"></div>

                        <div className="h-4 w-52 bg-gray-300 rounded mb-2"></div>

                        <div className="h-4 w-36 bg-gray-300 rounded mb-2"></div>

                        <div className="h-4 w-28 bg-gray-300 rounded"></div>

                    </div>

                ))}

            </div>
        );
    }

    return (
        <>
            <div className="customerGrid">

                {
                    agents.length > 0 ? (

                        agents.map((ele) => (

                            <div
                                key={ele.userId}
                                className="customerCard"
                            >

                                <div className="agentBadge">
                                    AGENT
                                </div>

                                <h3>
                                    {ele.fullName}
                                </h3>

                                <p>
                                    {ele.email}
                                </p>

                                <p>
                                    {ele.mobileNumber}
                                </p>

                                <div className="status">

                                    Status :

                                    <span
                                        className={
                                            ele.active
                                                ? "text-green-600 font-semibold"
                                                : "text-red-600 font-semibold"
                                        }
                                    >
                                        {ele.active
                                            ? " Active"
                                            : " Inactive"}
                                    </span>

                                </div>

                            </div>

                        ))

                    ) : (

                        <div className="col-span-full text-center py-10">

                            <h2 className="text-2xl font-semibold">
                                No Agents Found
                            </h2>

                        </div>

                    )
                }

            </div>
        </>
    );
};

export default GetAllUser;
