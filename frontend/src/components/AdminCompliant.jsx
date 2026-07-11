import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getAllComplaint, getCustomerComplaint } from "../services/complaintService";
import { MdReportProblem } from "react-icons/md";
import { FiPlus, FiCalendar, FiHash } from "react-icons/fi";
import { useNavigate } from "react-router-dom";


const AdminCompliant = () => {

    const [complaints, setComplaints] = useState([]);

    const navigate = useNavigate();


    const getCusComp = async () => {
        try {

            const data = await getAllComplaint();

            setComplaints(data);

            console.log(data);

        } catch (error) {
            console.log(error);
        }
    };


    useEffect(() => {
        getCusComp();
    }, []);



    return (

        <motion.div

            className="
            relative
            overflow-hidden
            space-y-10
            p-8
            rounded-[35px]
            bg-[#081226]
            text-white
            border border-slate-800
            shadow-[0_25px_70px_rgba(0,0,0,0.5)]
            "

            initial={{
                opacity:0,
                y:30
            }}

            animate={{
                opacity:1,
                y:0
            }}

            transition={{
                duration:0.6
            }}

        >


            {/* Background Glow */}

            <div className="
            absolute
            -top-20
            -right-20
            w-72
            h-72
            bg-blue-600/20
            blur-[100px]
            rounded-full
            " />


            <div className="
            absolute
            -bottom-20
            -left-20
            w-72
            h-72
            bg-purple-600/20
            blur-[100px]
            rounded-full
            " />




            {/* Header */}

            <div className="
            relative
            flex
            justify-between
            items-center
            "
            >


                <div>


                    <div className="flex items-center gap-3">


                        <div className="
                        w-14
                        h-14
                        rounded-2xl
                        bg-red-500/10
                        flex
                        items-center
                        justify-center
                        border
                        border-red-500/20
                        "
                        >

                            <MdReportProblem
                                size={32}
                                className="text-red-400"
                            />

                        </div>



                        <div>

                            <h1 className="
                            text-3xl
                            font-bold
                            tracking-wide
                            "
                            >
                                All Complaints
                            </h1>
                            <p className="
                            text-slate-400
                            text-sm
                            mt-1
                            "
                            >
                                Manage and track your insurance complaints
                            </p>
                        </div>
                    </div>
                </div>
            </div>





            {/* Count */}

            <div className="
            relative
            flex
            gap-4
            "
            >

                <div className="
                px-5
                py-3
                rounded-2xl
                bg-white/5
                border
                border-white/10
                backdrop-blur-md
                "
                >

                    <p className="text-sm text-slate-400">
                        Total Complaints
                    </p>


                    <h2 className="
                    text-2xl
                    font-bold
                    text-blue-400
                    "
                    >
                        {complaints.length}
                    </h2>


                </div>


            </div>






            {/* Cards */}

            {
                complaints.length === 0 ?


                <div className="
                h-60
                flex
                items-center
                justify-center
                text-slate-400
                "
                >

                    No complaints found

                </div>


                :


                <div className="
                relative
                grid
                grid-cols-1
                md:grid-cols-2
                xl:grid-cols-3
                gap-7
                "
                >


                {
                    complaints.map((item,index)=>(


                        <motion.div


                        key={item.complaintId}


                        className="
                        group
                        relative
                        p-6
                        rounded-[28px]
                        bg-gradient-to-br
                        from-[#111d35]
                        to-[#0c172d]
                        border
                        border-slate-800
                        hover:border-blue-500/50
                        shadow-xl
                        overflow-hidden
                        "



                        initial={{
                            opacity:0,
                            y:50
                        }}


                        animate={{
                            opacity:1,
                            y:0
                        }}


                        transition={{
                            duration:0.5,
                            delay:index*0.15
                        }}



                        whileHover={{
                            y:-10
                        }}


                        >



                        {/* Hover Glow */}

                        <div className="
                        absolute
                        inset-0
                        bg-blue-500/5
                        opacity-0
                        group-hover:opacity-100
                        transition
                        "
                        />



                        <div className="relative">


                            <div className="
                            flex
                            justify-between
                            items-start
                            "
                            >


                                <div className="
                                w-12
                                h-12
                                rounded-2xl
                                bg-red-500/10
                                flex
                                items-center
                                justify-center
                                "
                                >

                                    <MdReportProblem
                                    size={26}
                                    className="text-red-400"
                                    />

                                </div>
                            </div>

  <h1 className="
                            mt-2
                            text-xl
                            font-semibold
                            "
                            >
Name: 
                                {" " +item.customerName}

                            </h1>



                            <h2 className="
                            mt-3
                            text-xl
                            font-semibold
                            "
                            >

                                {item.subject}

                            </h2>



                            <p className="
                            mt-3
                            text-sm
                            text-slate-400
                            leading-relaxed
                            line-clamp-3
                            "
                            >

                                {item.description}

                            </p>





                            <div className="
                            mt-6
                            space-y-3
                            text-sm
                            text-slate-400
                            "
                            >


                                <div className="
                                flex
                                items-center
                                gap-2
                                "
                                >

                                    <FiHash/>

                                    Complaint ID:
                                    {item.complaintId}

                                </div>



                                <div className="
                                flex
                                items-center
                                gap-2
                                "
                                >

                                    <FiCalendar/>

                                    {
                                    new Date(item.createdAt)
                                    .toLocaleDateString()
                                    }

                                </div>


                            </div>



                        </div>



                        </motion.div>


                    ))
                }


                </div>

            }



        </motion.div>


    )

}


export default AdminCompliant;