import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  submitClaim,
  uploadDocument,
} from "../services/claimService";
import {
  useNavigate,
  useParams,
} from "react-router-dom";
import { toast } from "react-toastify";

const SubmitClaim = () => {
  const [docuBtn, setDocuBtn] = useState(false);
  const [claimSubmitData, setClaimSubmitData] = useState(null);
  const [file, setFile] = useState([]);

  const [claimLoading, setClaimLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);

  const [formData, setFormData] = useState({
    claimAmount: "",
    claimReason: "",
    incidentDate: "",
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
        toast.error("Invalid Claim Response ❌");
        return;
      }

      setClaimSubmitData(data);
      setDocuBtn(true);

      toast.success("Claim Submitted Successfully ✅");
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
      toast.warning("Please Submit Claim First");
      return;
    }

    if (!file || file.length === 0) {
      toast.warning("Please Select Documents");
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
    }
  };

  return (
    <>
      <div className="relative min-h-screen flex items-center justify-center bg-[#eceef2] overflow-hidden">

        {/* Background Animation */}
        <div className="absolute inset-0 animate-spin-slow opacity-40">
          <div className="w-[200%] h-[200%] bg-[radial-gradient(circle,#dcefff_0%,transparent_25%),radial-gradient(circle,#b9daf5_0%,transparent_25%)]" />
        </div>

        {/* Floating Orbs */}
        <div className="orb orb1"></div>
        <div className="orb orb2"></div>
        <div className="orb orb3"></div>
        <div className="orb orb4"></div>

        {/* Claim Form */}
        <motion.div
          className="relative z-10 w-[650px] p-10 rounded-[35px]
          backdrop-blur-[35px] bg-white/30 border border-white/40
          shadow-[0_20px_60px_rgba(0,0,0,0.08)]"
          initial={{
            opacity: 0,
            scale: 0.7,
            y: 80,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}
          transition={{
            duration: 0.8,
          }}
        >
          <h1 className="text-4xl font-bold text-center text-[#243447]">
            Insurance Portal
          </h1>

          <p className="text-center mt-3 mb-8 text-gray-500">
            Submit Your Claim
          </p>

          <form
            onSubmit={handleSubmitClaim}
            className="space-y-5"
          >
            <div className="p-4 rounded-xl bg-white/40 hover:shadow-lg transition">
              <input
                type="number"
                placeholder="Enter Claim Amount"
                className="w-full bg-transparent outline-none"
                value={formData.claimAmount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    claimAmount: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="p-4 rounded-xl bg-white/40 hover:shadow-lg transition">
              <textarea
                rows="4"
                placeholder="Enter Claim Reason"
                className="w-full bg-transparent outline-none resize-none"
                value={formData.claimReason}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    claimReason: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="p-4 rounded-xl bg-white/40 hover:shadow-lg transition">
              <input
                type="date"
                className="w-full bg-transparent outline-none"
                max={
                  new Date()
                    .toISOString()
                    .split("T")[0]
                }
                value={formData.incidentDate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    incidentDate: e.target.value,
                  })
                }
                required
              />
            </div>

            <motion.button
              type="submit"
              disabled={claimLoading}
              className="w-full h-14 rounded-xl text-lg font-semibold
              bg-gradient-to-r from-[#d2e6ff] to-[#a7ccff]"
              whileHover={{
                scale: claimLoading ? 1 : 1.05,
              }}
              whileTap={{
                scale: claimLoading ? 1 : 0.95,
              }}
            >
              {claimLoading ? (
                <div className="flex justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                "Submit Claim →"
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>

      {/* Upload Documents */}
      {docuBtn && (
        <div className="flex justify-center mt-10 mb-10">
          <div
            className="w-[650px] p-8 rounded-[30px]
            backdrop-blur-[35px] bg-white/30 border border-white/40
            shadow-[0_20px_60px_rgba(0,0,0,0.08)]"
          >
            <h2 className="text-3xl font-bold text-center text-[#243447] mb-6">
              Upload Documents
            </h2>

            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.webp"
              onChange={(e) =>
                setFile(
                  Array.from(e.target.files)
                )
              }
              className="w-full mb-5"
            />

            {file.length > 0 && (
              <div className="bg-white/40 p-4 rounded-xl mb-5">
                <p className="font-semibold mb-2">
                  Selected Files
                </p>

                {file.map((f, index) => (
                  <p key={index}>
                    • {f.name}
                  </p>
                ))}
              </div>
            )}

            <motion.button
              onClick={handleUpload}
              disabled={uploadLoading}
              className="w-full h-14 rounded-xl text-lg font-semibold
              bg-gradient-to-r from-[#d2e6ff] to-[#a7ccff]"
              whileHover={{
                scale: uploadLoading ? 1 : 1.05,
              }}
              whileTap={{
                scale: uploadLoading ? 1 : 0.95,
              }}
            >
              {uploadLoading ? (
                <div className="flex justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                `Upload ${file.length || ""} Document${
                  file.length > 1 ? "s" : ""
                } →`
              )}
            </motion.button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes float {
          50% {
            transform: translateY(-30px) rotate(10deg);
          }
        }

        @keyframes spinSlow {
          100% {
            transform: rotate(360deg);
          }
        }

        .animate-spin-slow {
          animation: spinSlow 18s linear infinite;
        }

        .orb {
          position: absolute;
          border-radius: 9999px;
          background: radial-gradient(circle at 30% 30%, #fff, #9cc8eb);
          animation: float 8s ease-in-out infinite;
        }

        .orb1 {
          width: 320px;
          height: 320px;
          top: -60px;
          left: 30%;
        }

        .orb2 {
          width: 150px;
          height: 150px;
          top: 15%;
          right: 20%;
          animation-delay: 2s;
        }

        .orb3 {
          width: 220px;
          height: 220px;
          bottom: 15%;
          left: 10%;
          animation-delay: 1s;
        }

        .orb4 {
          width: 180px;
          height: 180px;
          bottom: 10%;
          right: 10%;
          animation-delay: 3s;
        }
      `}</style>
    </>
  );
};

export default SubmitClaim;