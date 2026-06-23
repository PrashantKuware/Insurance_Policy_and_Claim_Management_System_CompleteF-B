// import React, { useEffect, useState } from 'react'
// import { getAllCustomers } from '../services/CustomerService'
// import "./Product.css";

// const GetAllCustomer = () => {

//     const [cusData, setCusData] = useState([])
//     const [selectedCustomer, setSelectedCustomer] = useState(null)

//     const getAllCustomer = async () => {
//         const data = await getAllCustomers()
//         setCusData(data.data)
//     }

//     useEffect(() => {
//         getAllCustomer()
//     }, [])

//     return (
//         <>
//             <div className="customerGrid">
//                 {
//                     cusData.length !== 0
//                         ? cusData.map((ele) => (
//                             <div
//                                 key={ele.customerId}
//                                 className="customerCard"
//                                 onClick={() => setSelectedCustomer(ele)}
//                             >
//                                 <div className="customerBadge">
//                                     CUSTOMER
//                                 </div>

//                                 <h3>{ele.fullName}</h3>

//                                 <p>{ele.email}</p>
//                                 <p>{ele.city}, {ele.state}</p>

//                                 <button className="viewDetailsBtn">
//                                     View Details
//                                 </button>
//                             </div>
//                         ))
//                         : <h2>No Customer Yet !!!</h2>
//                 }
//             </div>

//             {selectedCustomer && (
//                 <div className="modalOverlay">
//                     <div className="modalCard">

//                         <button
//                             className="closeBtn"
//                             onClick={() => setSelectedCustomer(null)}
//                         >
//                             ×
//                         </button>

//                         <h2>Customer Details</h2>

//                         <div className="detailsGrid">
//                             <p><strong>ID:</strong> {selectedCustomer.customerId}</p>
//                             <p><strong>Name:</strong> {selectedCustomer.fullName}</p>
//                             <p><strong>Email:</strong> {selectedCustomer.email}</p>
//                             <p><strong>DOB:</strong> {selectedCustomer.dateOfBirth}</p>
//                             <p><strong>Nominee:</strong> {selectedCustomer.nomineeName}</p>
//                             <p><strong>Address:</strong> {selectedCustomer.address}</p>
//                             <p><strong>City:</strong> {selectedCustomer.city}</p>
//                             <p><strong>State:</strong> {selectedCustomer.state}</p>
//                             <p><strong>Pincode:</strong> {selectedCustomer.pinCode}</p>
//                         </div>

//                     </div>
//                 </div>
//             )}
//         </>
//     )

// }

// export default GetAllCustomer

import React, { useEffect, useState } from 'react';
import { getAllCustomers } from '../services/CustomerService';
import { toast } from 'react-toastify';
import "./Product.css";

const GetAllCustomer = () => {

    const [cusData, setCusData] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [loading, setLoading] = useState(true);

    const getAllCustomer = async () => {

        try {

            setLoading(true);

            const data = await getAllCustomers();

            setCusData(data.data || []);

        } catch (error) {

            console.error(error);

            toast.error(
                error?.response?.data?.message ||
                "Failed To Load Customers ❌"
            );

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        getAllCustomer();
    }, []);

    if (loading) {
        return (
            <div className="customerGrid">

                {Array.from({ length: 6 }).map((_, index) => (

                    <div
                        key={index}
                        className="customerCard animate-pulse"
                    >
                        <div className="h-6 bg-gray-300 rounded w-24 mb-4"></div>

                        <div className="h-5 bg-gray-300 rounded w-40 mb-3"></div>

                        <div className="h-4 bg-gray-300 rounded w-52 mb-2"></div>

                        <div className="h-4 bg-gray-300 rounded w-36 mb-4"></div>

                        <div className="h-10 bg-gray-300 rounded"></div>
                    </div>

                ))}

            </div>
        );
    }

    return (
        <>
            <div className="customerGrid">

                {
                    cusData.length > 0 ? (

                        cusData.map((ele) => (

                            <div
                                key={ele.customerId}
                                className="customerCard"
                                onClick={() => setSelectedCustomer(ele)}
                            >

                                <div className="customerBadge">
                                    CUSTOMER
                                </div>

                                <h3>{ele.fullName}</h3>

                                <p>{ele.email}</p>

                                <p>
                                    {ele.city}, {ele.state}
                                </p>

                                <button
                                    className="viewDetailsBtn"
                                >
                                    View Details
                                </button>

                            </div>

                        ))

                    ) : (

                        <div className="col-span-full text-center py-10">
                            <h2 className="text-2xl font-semibold">
                                No Customer Found
                            </h2>
                        </div>

                    )
                }

            </div>

            {
                selectedCustomer && (

                    <div
                        className="modalOverlay"
                        onClick={() =>
                            setSelectedCustomer(null)
                        }
                    >

                        <div
                            className="modalCard"
                            onClick={(e) =>
                                e.stopPropagation()
                            }
                        >

                            <button
                                className="closeBtn"
                                onClick={() =>
                                    setSelectedCustomer(null)
                                }
                            >
                                ×
                            </button>

                            <h2>
                                Customer Details
                            </h2>

                            <div className="detailsGrid">

                                <p>
                                    <strong>ID:</strong>{" "}
                                    {selectedCustomer.customerId}
                                </p>

                                <p>
                                    <strong>Name:</strong>{" "}
                                    {selectedCustomer.fullName}
                                </p>

                                <p>
                                    <strong>Email:</strong>{" "}
                                    {selectedCustomer.email}
                                </p>

                                <p>
                                    <strong>DOB:</strong>{" "}
                                    {selectedCustomer.dateOfBirth}
                                </p>

                                <p>
                                    <strong>Nominee:</strong>{" "}
                                    {selectedCustomer.nomineeName}
                                </p>

                                <p>
                                    <strong>Address:</strong>{" "}
                                    {selectedCustomer.address}
                                </p>

                                <p>
                                    <strong>City:</strong>{" "}
                                    {selectedCustomer.city}
                                </p>

                                <p>
                                    <strong>State:</strong>{" "}
                                    {selectedCustomer.state}
                                </p>

                                <p>
                                    <strong>Pincode:</strong>{" "}
                                    {selectedCustomer.pinCode}
                                </p>

                            </div>

                        </div>

                    </div>

                )
            }
        </>
    );
};

export default GetAllCustomer;