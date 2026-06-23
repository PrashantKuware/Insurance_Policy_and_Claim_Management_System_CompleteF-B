import React, { useState } from 'react';
import { motion } from "framer-motion";
import './Login.css';
import {
    submitClaim,
    uploadDocument
} from '../services/claimService';
import {
    useNavigate,
    useParams
} from 'react-router-dom';
import { toast } from 'react-toastify';

const SubmitClaim = () => {

    const [docuBtn, setDocuBtn] = useState(false);
    const [claimSubmitData, setClaimSubmitData] = useState(null);
    const [file, setFile] = useState([]);

    const [claimLoading, setClaimLoading] = useState(false);
    const [uploadLoading, setUploadLoading] = useState(false);

    const [formData, setFormData] = useState({
        claimAmount: "",
        claimReason: "",
        incidentDate: ""
    });

    const { policyId } = useParams();
    const navigate = useNavigate();

    const handleSubmitClaim = async (e) => {

        e.preventDefault();

        try {

            setClaimLoading(true);

            const data = await submitClaim(
                policyId,
                formData.claimAmount,
                formData.claimReason,
                formData.incidentDate
            );

            if (!data?.claimId) {

                toast.error(
                    "Invalid Claim Response ❌"
                );

                return;
            }

            setClaimSubmitData(data);
            setDocuBtn(true);

            toast.success(
                "Claim Submitted Successfully ✅"
            );

        } catch (error) {

            console.error(error);

            toast.error(
                error?.response?.data?.message ||
                "Claim Submission Failed ❌"
            );

        } finally {

            setClaimLoading(false);

        }
    };

    const handleUpload = async () => {

        if (!claimSubmitData?.claimId) {

            toast.warning(
                "Please Submit Claim First"
            );

            return;
        }

        if (!file || file.length === 0) {

            toast.warning(
                "Please Select Documents"
            );

            return;
        }

        try {

            setUploadLoading(true);

            await uploadDocument(
                claimSubmitData.claimId,
                file
            );

            toast.success(
                "Documents Uploaded Successfully ✅"
            );

            setTimeout(() => {
                navigate(`/policy/${policyId}`);
            }, 1000);

        } catch (error) {

            console.error(error);

            toast.error(
                error?.response?.data?.message ||
                "Document Upload Failed ❌"
            );

        } finally {

            setUploadLoading(false);
            navigate("/customerdashboard")
        }
    };

    return (
        <>
            <div className="container">

                <motion.div
                    className="card"
                    initial={{
                        opacity: 0,
                        scale: 0.7,
                        y: 80
                    }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                        y: 0
                    }}
                    transition={{
                        duration: 1
                    }}
                >

                    <h1>
                        Insurance Portal
                    </h1>

                    <p>
                        Submit Your Claim
                    </p>

                    <form onSubmit={handleSubmitClaim}>

                        <div className="inputBox">

                            <input
                                type="number"
                                placeholder="Enter Claim Amount"
                                value={formData.claimAmount}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        claimAmount: e.target.value
                                    })
                                }
                                required
                            />

                        </div>

                        <div className="inputBox">

                            <textarea
                                rows="4"
                                placeholder="Enter Claim Reason"
                                value={formData.claimReason}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        claimReason: e.target.value
                                    })
                                }
                                required
                            />

                        </div>

                        <div className="inputBox">

                            <input
                                type="date"
                                max={
                                    new Date()
                                        .toISOString()
                                        .split("T")[0]
                                }
                                value={formData.incidentDate}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        incidentDate: e.target.value
                                    })
                                }
                                required
                            />

                        </div>

                        <motion.button
                            className="button"
                            type="submit"
                            disabled={claimLoading}
                            whileHover={{
                                scale: claimLoading
                                    ? 1
                                    : 1.05
                            }}
                            whileTap={{
                                scale: claimLoading
                                    ? 1
                                    : 0.95
                            }}
                        >

                            {
                                claimLoading
                                    ? (
                                        <div className="flex items-center justify-center gap-2">

                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>

                                            Submitting...

                                        </div>
                                    )
                                    : "Submit Claim"
                            }

                        </motion.button>

                    </form>

                </motion.div>

            </div>

            {
                docuBtn && (

                    <div className="max-w-xl mx-auto mt-8 bg-white rounded-xl shadow-lg p-6">

                        <h2 className="text-2xl font-bold mb-4">
                            Upload Supporting Documents
                        </h2>

                        <input
                            type="file"
                            multiple
                            accept=".pdf,.jpg,.jpeg,.png,.webp"
                            onChange={(e) =>
                                setFile(
                                    Array.from(
                                        e.target.files
                                    )
                                )
                            }
                            className="mb-4"
                        />

                        {
                            file.length > 0 && (

                                <div className="mb-4">

                                    <p className="font-semibold">
                                        Selected Files:
                                    </p>

                                    {
                                        file.map((f, index) => (

                                            <p
                                                key={index}
                                                className="text-sm text-gray-600"
                                            >
                                                • {f.name}
                                            </p>

                                        ))
                                    }

                                </div>

                            )
                        }

                        <button
                            onClick={handleUpload}
                            disabled={uploadLoading}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg transition disabled:opacity-50"
                        >

                            {
                                uploadLoading
                                    ? (
                                        <div className="flex items-center gap-2">

                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>

                                            Uploading...
                                        </div>
                                    )
                                    : `Upload ${file.length || ""} Document${file.length > 1 ? "s" : ""}`
                            }

                        </button>

                    </div>

                )
            }
        </>
    );
};

export default SubmitClaim;