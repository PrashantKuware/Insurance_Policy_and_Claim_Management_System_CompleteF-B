import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getSubmitComplaint } from "../services/complaintService";

import {
    FaArrowLeft,
    FaCommentDots,
    FaExclamationCircle
} from "react-icons/fa";


// Glowing Background Effects
const Orbs = () => (
    <>
        <div className="absolute w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-purple-500/10 to-indigo-500/5 top-[-150px] left-[5%] blur-3xl animate-float pointer-events-none" />
        <div className="absolute w-[350px] h-[350px] rounded-full bg-gradient-to-tr from-cyan-500/10 to-blue-500/5 bottom-[5%] right-[5%] blur-3xl animate-float delay-2000 pointer-events-none" />
    </>
);


const AddComplaint = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        subject: "",
        description: ""
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const data = await getSubmitComplaint(formData);
            console.log(data)
            toast.success("Complaint Submitted Successfully ✅");
            setTimeout(() => {
                navigate("/customer/complaints");
            }, 1000);
        }
        catch (error) {
            console.log(error);
            toast.error(
                error?.response?.data?.message ||
                "Complaint Submission Failed ❌"
            );
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div className=" relative min-h-screen bg-[#070d19] p-6 md:p-10 text-slate-300 overflow-hidden flex flex-col items-center justify-center">
            <Orbs />
            <motion.div
                initial={{
                    opacity: 0,
                    y: 30
                }}
                animate={{
                    opacity: 1,
                    y: 0
                }}
                transition={{
                    duration: 0.6
                }}
                className="w-full max-w-2xl relative z-10">

                <button
                    onClick={() => navigate(-1)}
                    className=" cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-950/60 order border-slate-900 hover:border-slate-700 text-sm font-semibold text-slate-400 hover:text-white transition-all group">
                    <FaArrowLeft
                        className=" text-xs group-hover:-translate-x-1 transition" />
                    Back
                </button>

                {/* MAIN CARD */}
                <div className="
                mt-6
                relative
                bg-[#111c30]
                border
                border-slate-800/80
                rounded-3xl
                shadow-2xl
                overflow-hidden
                ">

                    <div className="
                    absolute
                    inset-0
                    pointer-events-none
                    bg-gradient-to-b
                    from-purple-500/0
                    to-purple-500/[0.02]
                    " />

                    {/* HEADER */}

                    <div className="
                    bg-gradient-to-r
                    from-blue-950/40
                    via-slate-900/80
                    to-purple-950/40
                    p-6
                    md:p-8
                    border-b
                    border-slate-900
                    ">

                        <h1 className="
                        text-2xl
                        md:text-3xl
                        font-black
                        text-white
                        tracking-wide
                        flex
                        items-center
                        gap-3
                        ">
                            <FaCommentDots
                                className="text-purple-400"
                            />
                            Customer Support Portal
                        </h1>

                        <p className="
                        text-slate-500
                        text-xs
                        mt-2
                        ">
                            Submit your insurance related complaint securely.
                        </p>
                    </div>

                    {/* FORM */}

                    <div className="
                    relative
                    z-30
                    p-6
                    md:p-8
                    ">
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >
                            {/* SUBJECT */}
                            <div className="space-y-1.5">
                                <label className="
                                text-xs
                                font-mono
                                font-bold
                                text-slate-400
                                uppercase
                                tracking-wider
                                ">
                                    Complaint Subject
                                </label>
                                <div className="
                                flex
                                items-center
                                bg-slate-950/50
                                border
                                border-slate-900
                                rounded-xl
                                px-4
                                py-3.5
                                focus-within:border-purple-500/50
                                transition
                                ">
                                    <input
                                        type="text"
                                        placeholder="Enter complaint subject"
                                        required
                                        value={formData.subject}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                subject: e.target.value
                                            })
                                        }
                                        className="
                                    w-full
                                    bg-transparent
                                    outline-none
                                    text-white
                                    text-sm
                                    placeholder:text-slate-600
                                    "
                                    />
                                </div>
                            </div>

                            {/* DESCRIPTION */}
                            <div className="space-y-1.5">
                                <label className="
                                text-xs
                                font-mono
                                font-bold
                                text-slate-400
                                uppercase
                                tracking-wider
                                ">
                                    Complaint Description
                                </label>
                                <div className="
                                bg-slate-950/50
                                border
                                border-slate-900
                                rounded-xl
                                px-4
                                py-3.5
                                focus-within:border-purple-500/50
                                transition
                                ">
                                    <textarea
                                        rows="5"
                                        placeholder="Describe your issue..."
                                        required
                                        value={formData.description}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                description: e.target.value
                                            })
                                        }
                                        className="
                                    w-full
                                    bg-transparent
                                    outline-none
                                    text-slate-300
                                    text-sm
                                    resize-none
                                    placeholder:text-slate-600
                                    "
                                    />
                                </div>
                            </div>

                            {/* BUTTON */}

                            <button
                                type="submit"
                                disabled={loading}
                                className="
                            cursor-pointer
                            w-full
                            h-13
                            rounded-xl
                            font-bold
                            text-xs
                            uppercase
                            tracking-wider
                            text-purple-400
                            bg-purple-500/10
                            hover:bg-purple-600
                            hover:text-white
                            border
                            border-purple-500/20
                            hover:border-transparent
                            transition-all
                            duration-200
                            disabled:opacity-40
                            "
                            >
                                {
                                    loading ?
                                        "Submitting..." :
                                        <>
                                            <FaExclamationCircle className="inline mr-2" />
                                            Submit Complaint →
                                        </>
                                }
                            </button>
                        </form>
                    </div>
                </div>
            </motion.div>
            <style>{`
            @keyframes float {
                0%,100%{
                    transform:translateY(0px) scale(1);
                }
                50%{
                    transform:translateY(-25px) scale(1.02);
                }
            }
            .animate-float{
                animation:float 14s ease-in-out infinite;
            }
            .delay-2000{
                animation-delay:3s;
            }
            `}</style>
        </div>
    );
};


export default AddComplaint;