// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import {
//   submitClaim,
//   uploadDocument,
// } from "../services/claimService";
// import {
//   useNavigate,
//   useParams,
// } from "react-router-dom";
// import { toast } from "react-toastify";

// const SubmitClaim = () => {
//   const [docuBtn, setDocuBtn] = useState(false);
//   const [claimSubmitData, setClaimSubmitData] = useState(null);
//   const [file, setFile] = useState([]);

//   const [claimLoading, setClaimLoading] = useState(false);
//   const [uploadLoading, setUploadLoading] = useState(false);

//   const [formData, setFormData] = useState({
//     claimAmount: "",
//     claimReason: "",
//     incidentDate: "",
//   });

//   const { policyId } = useParams();
//   const navigate = useNavigate();

//   const handleSubmitClaim = async (e) => {
//     e.preventDefault();

//     try {
//       setClaimLoading(true);

//       const data = await submitClaim(
//         policyId,
//         formData.claimAmount,
//         formData.claimReason,
//         formData.incidentDate
//       );

//       if (!data?.claimId) {
//         toast.error("Invalid Claim Response ❌");
//         return;
//       }

//       setClaimSubmitData(data);
//       setDocuBtn(true);

//       toast.success("Claim Submitted Successfully ✅");
//     } catch (error) {
//       console.error(error);

//       toast.error(
//         error?.response?.data?.message ||
//           "Claim Submission Failed ❌"
//       );
//     } finally {
//       setClaimLoading(false);
//     }
//   };

//   const handleUpload = async () => {
//     if (!claimSubmitData?.claimId) {
//       toast.warning("Please Submit Claim First");
//       return;
//     }

//     if (!file || file.length === 0) {
//       toast.warning("Please Select Documents");
//       return;
//     }

//     try {
//       setUploadLoading(true);

//       await uploadDocument(
//         claimSubmitData.claimId,
//         file
//       );

//       toast.success(
//         "Documents Uploaded Successfully ✅"
//       );

//       setTimeout(() => {
//         navigate(`/policy/${policyId}`);
//       }, 1000);
//     } catch (error) {
//       console.error(error);

//       toast.error(
//         error?.response?.data?.message ||
//           "Document Upload Failed ❌"
//       );
//     } finally {
//       setUploadLoading(false);
//     }
//   };

//   return (
//     <>
//       <div className="relative text-gray-500 min-h-screen flex items-center justify-center bg-[#eceef2] overflow-hidden">

//         {/* Background Animation */}
//         <div className="absolute inset-0 animate-spin-slow opacity-40">
//           <div className="w-[200%] h-[200%] bg-[radial-gradient(circle,#dcefff_0%,transparent_25%),radial-gradient(circle,#b9daf5_0%,transparent_25%)]" />
//         </div>

//         {/* Floating Orbs */}
//         <div className="orb orb1"></div>
//         <div className="orb orb2"></div>
//         <div className="orb orb3"></div>
//         <div className="orb orb4"></div>

//         {/* Claim Form */}
//         <motion.div
//           className="relative z-10 w-[650px] p-10 rounded-[35px]
//           backdrop-blur-[35px] bg-white/30 border border-white/40
//           shadow-[0_20px_60px_rgba(0,0,0,0.08)]"
//           initial={{
//             opacity: 0,
//             scale: 0.7,
//             y: 80,
//           }}
//           animate={{
//             opacity: 1,
//             scale: 1,
//             y: 0,
//           }}
//           transition={{
//             duration: 0.8,
//           }}
//         >
//           <h1 className="text-4xl font-bold text-center text-[#243447]">
//             Insurance Portal
//           </h1>

//           <p className="text-center mt-3 mb-8 text-gray-500">
//             Submit Your Claim
//           </p>

//           <form
//             onSubmit={handleSubmitClaim}
//             className="space-y-5"
//           >
//             <div className="p-4 rounded-xl bg-white/40 hover:shadow-lg transition">
//               <input
//                 type="number"
//                 placeholder="Enter Claim Amount"
//                 className="w-full bg-transparent outline-none"
//                 value={formData.claimAmount}
//                 onChange={(e) =>
//                   setFormData({
//                     ...formData,
//                     claimAmount: e.target.value,
//                   })
//                 }
//                 required
//               />
//             </div>

//             <div className="p-4 rounded-xl bg-white/40 hover:shadow-lg transition">
//               <textarea
//                 rows="4"
//                 placeholder="Enter Claim Reason"
//                 className="w-full bg-transparent outline-none resize-none"
//                 value={formData.claimReason}
//                 onChange={(e) =>
//                   setFormData({
//                     ...formData,
//                     claimReason: e.target.value,
//                   })
//                 }
//                 required
//               />
//             </div>

//             <div className="p-4 rounded-xl bg-white/40 hover:shadow-lg transition">
//               <input
//                 type="date"
//                 className="w-full bg-transparent outline-none"
//                 max={
//                   new Date()
//                     .toISOString()
//                     .split("T")[0]
//                 }
//                 value={formData.incidentDate}
//                 onChange={(e) =>
//                   setFormData({
//                     ...formData,
//                     incidentDate: e.target.value,
//                   })
//                 }
//                 required
//               />
//             </div>

//             <motion.button
//               type="submit"
//               disabled={claimLoading}
//               className="w-full h-14 rounded-xl text-lg font-semibold
//               bg-gradient-to-r from-[#d2e6ff] to-[#a7ccff]"
//               whileHover={{
//                 scale: claimLoading ? 1 : 1.05,
//               }}
//               whileTap={{
//                 scale: claimLoading ? 1 : 0.95,
//               }}
//             >
//               {claimLoading ? (
//                 <div className="flex justify-center">
//                   <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                 </div>
//               ) : (
//                 "Submit Claim →"
//               )}
//             </motion.button>
//           </form>
//         </motion.div>
//       </div>

//       {/* Upload Documents */}
//       {docuBtn && (
//         <div className="flex justify-center mt-10 mb-10">
//           <div
//             className="w-[650px] p-8 rounded-[30px]
//             backdrop-blur-[35px] bg-white/30 border border-white/40
//             shadow-[0_20px_60px_rgba(0,0,0,0.08)]"
//           >
//             <h2 className="text-3xl font-bold text-center text-[#243447] mb-6">
//               Upload Documents
//             </h2>

//             <input
//               type="file"
//               multiple
//               accept=".pdf,.jpg,.jpeg,.png,.webp"
//               onChange={(e) =>
//                 setFile(
//                   Array.from(e.target.files)
//                 )
//               }
//               className="w-full mb-5"
//             />

//             {file.length > 0 && (
//               <div className="bg-white/40 p-4 rounded-xl mb-5">
//                 <p className="font-semibold mb-2">
//                   Selected Files
//                 </p>

//                 {file.map((f, index) => (
//                   <p key={index}>
//                     • {f.name}
//                   </p>
//                 ))}
//               </div>
//             )}

//             <motion.button
//               onClick={handleUpload}
//               disabled={uploadLoading}
//               className="w-full h-14 rounded-xl text-lg font-semibold
//               bg-gradient-to-r from-[#d2e6ff] to-[#a7ccff]"
//               whileHover={{
//                 scale: uploadLoading ? 1 : 1.05,
//               }}
//               whileTap={{
//                 scale: uploadLoading ? 1 : 0.95,
//               }}
//             >
//               {uploadLoading ? (
//                 <div className="flex justify-center">
//                   <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                 </div>
//               ) : (
//                 `Upload ${file.length || ""} Document${
//                   file.length > 1 ? "s" : ""
//                 } →`
//               )}
//             </motion.button>
//           </div>
//         </div>
//       )}

//       <style>{`
//         @keyframes float {
//           50% {
//             transform: translateY(-30px) rotate(10deg);
//           }
//         }

//         @keyframes spinSlow {
//           100% {
//             transform: rotate(360deg);
//           }
//         }

//         .animate-spin-slow {
//           animation: spinSlow 18s linear infinite;
//         }

//         .orb {
//           position: absolute;
//           border-radius: 9999px;
//           background: radial-gradient(circle at 30% 30%, #fff, #9cc8eb);
//           animation: float 8s ease-in-out infinite;
//         }

//         .orb1 {
//           width: 320px;
//           height: 320px;
//           top: -60px;
//           left: 30%;
//         }

//         .orb2 {
//           width: 150px;
//           height: 150px;
//           top: 15%;
//           right: 20%;
//           animation-delay: 2s;
//         }

//         .orb3 {
//           width: 220px;
//           height: 220px;
//           bottom: 15%;
//           left: 10%;
//           animation-delay: 1s;
//         }

//         .orb4 {
//           width: 180px;
//           height: 180px;
//           bottom: 10%;
//           right: 10%;
//           animation-delay: 3s;
//         }
//       `}</style>
//     </>
//   );
// };

// export default SubmitClaim;

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { submitClaim, uploadDocument } from "../services/claimService";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FaArrowLeft, FaFileInvoiceDollar, FaCloudUploadAlt, FaCalendarAlt, FaPenNib, FaFileAlt } from "react-icons/fa";

// Glowing Cyber Ambient Effects 
const Orbs = () => (
  <>
    <div className="absolute w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-purple-500/10 to-indigo-500/5 top-[-150px] left-[5%] blur-3xl animate-float pointer-events-none" />
    <div className="absolute w-[350px] h-[350px] rounded-full bg-gradient-to-tr from-cyan-500/10 to-blue-500/5 bottom-[5%] right-[5%] blur-3xl animate-float delay-2000 pointer-events-none" />
  </>
);

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
        error?.response?.data?.message || "Claim Submission Failed ❌"
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
      await uploadDocument(claimSubmitData.claimId, file);
      toast.success("Documents Uploaded Successfully ✅");

      setTimeout(() => {
        navigate(`/policy/${policyId}`);
      }, 1000);
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Document Upload Failed ❌"
      );
    } finally {
      setUploadLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#070d19] p-6 md:p-10 text-slate-300 overflow-hidden flex flex-col items-center justify-center">
      <Orbs />

      {/* जोड़ा गया relative z-10 ताकि बैकग्राउंड ओर्ब्स इनपुट को ब्लॉक न करें */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="w-full max-w-2xl z-10 space-y-6 relative"
      >
        {/* --- BACK NAVIGATION BUTTON --- */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-950/60 border border-slate-900 hover:border-slate-800 text-sm font-semibold text-slate-400 hover:text-white transition-all group"
        >
          <FaArrowLeft className="text-xs group-hover:-translate-x-0.5 transition-transform" />
          Back to Dashboard
        </button>

        {/* --- MAIN STRUCTURED LAYOUT CARD --- */}
       <div className="relative z-20 bg-[#111c30] border border-slate-800/80 rounded-3xl shadow-2xl overflow-hidden">
          {/* <div className="absolute inset-0 bg-gradient-to-b from-purple-500/0 to-purple-500/[0.01] pointer-events-none" /> */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-purple-500/0 to-purple-500/[0.01]" />

          {/* Dynamic Core Header */}
          <div className="bg-gradient-to-r from-blue-950/40 via-slate-900/80 to-purple-950/40 p-6 md:p-8 border-b border-slate-900">
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-wide flex items-center gap-3">
              <FaFileInvoiceDollar className="text-purple-400" /> Insurance Portal
            </h1>
            <p className="text-slate-500 text-xs mt-1">
              Initialize settlement architecture for Policy ID: <span className="font-mono text-slate-400">{policyId?.slice(0, 8)}...</span>
            </p>
          </div>

          <div className="relative z-30 p-6 md:p-8">
            <AnimatePresence mode="wait">
              {!docuBtn ? (
                /* --- FORM STAGE: SUBMIT CLAIM --- */
                <motion.form
                  key="claim-submission-stage"
                  onSubmit={handleSubmitClaim}
                  className="space-y-5"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                >
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Required Amount (₹)</label>
                    <div className="flex items-center bg-slate-950/50 border border-slate-900 rounded-xl px-4 py-3.5 focus-within:border-purple-500/50 transition-colors">
                      <input
                        type="number"
                        placeholder="Enter Claim Valuation"
                        className="relative z-50 w-full bg-transparent outline-none text-white font-mono text-sm placeholder:text-slate-600"
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
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Incident Date</label>
                    <div className="flex items-center bg-slate-950/50 border border-slate-900 rounded-xl px-4 py-3.5 focus-within:border-purple-500/50 transition-colors">
                      <input
                        type="date"
                        className="relative z-50 w-full bg-transparent outline-none text-white font-mono text-sm [color-scheme:dark]"
                        max={new Date().toISOString().split("T")[0]}
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
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Detailed Statement / Reason</label>
                    <div className="bg-slate-950/50 border border-slate-900 rounded-xl px-4 py-3.5 focus-within:border-purple-500/50 transition-colors">
                      <textarea
                        rows="4"
                        className="relative z-50 w-full bg-transparent outline-none text-slate-300 text-sm resize-none placeholder:text-slate-600 leading-relaxed"
                        value={formData.claimReason}
                        placeholder="Enter Claim Reason"
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            claimReason: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>

<button
  type="submit"
  disabled={claimLoading}
  className="relative z-50 w-full inline-flex items-center justify-center h-13 mt-4 rounded-xl font-bold text-xs uppercase tracking-wider text-purple-400 bg-purple-500/10 hover:bg-purple-600 hover:text-white border border-purple-500/20 hover:border-transparent transition-all duration-200 disabled:opacity-40 cursor-pointer"
>Submit Settlement Claim →</button>
                </motion.form>
              ) : (
                /* --- FORM STAGE: UPLOAD DOCUMENTS --- */
                <motion.div
                  key="document-upload-stage"
                  className="space-y-6"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="p-4 bg-emerald-500/[0.02] border border-emerald-500/10 rounded-2xl">
                    <h3 className="text-base font-bold text-emerald-400 flex items-center gap-2">
                      ✔ Claim Logged Successfully
                    </h3>
                    <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                      Core telemetry submitted. Securely upload verification records below to finalize pipeline activation.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Verification Payload</label>
                    {/* input को z-30 किया और टेक्स्ट कंटेनर को pointer-events-none किया ताकि क्लिक सीधे input पर लगे */}
                    <div className="border border-dashed border-slate-800 rounded-2xl p-6 bg-slate-950/30 flex flex-col items-center justify-center text-center group hover:border-purple-500/40 transition-colors relative cursor-pointer min-h-[140px]">
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png,.webp"
                        onChange={(e) => setFile(Array.from(e.target.files))}
                        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-30"
                      />
                      <div className="flex flex-col items-center justify-center pointer-events-none z-10">
                        <FaCloudUploadAlt size={34} className="text-slate-600 group-hover:text-purple-400 mb-2 transition-colors" />
                        <p className="text-xs font-medium text-slate-400">Click or Drag files to attach dossiers</p>
                        <p className="text-[10px] text-slate-600 mt-1 font-mono">PDF, JPG, PNG, WEBP max size configurations</p>
                      </div>
                    </div>
                  </div>

                  {/* Reactive Files Array List */}
                  {file.length > 0 && (
                    <div className="bg-slate-950/40 border border-slate-900 rounded-xl p-4 space-y-2 font-mono text-xs">
                      <p className="font-bold text-slate-400 flex items-center gap-1.5 mb-1">
                        <FaFileAlt className="text-purple-500" /> Target Payloads ({file.length}):
                      </p>
                      {file.map((f, index) => (
                        <div key={index} className="flex items-center justify-between py-1 border-b border-slate-900/40 text-slate-400">
                          <span className="truncate max-w-[85%]">↳ {f.name}</span>
                          <span className="text-[10px] text-slate-600">{(f.size / 1024 / 1024).toFixed(2)} MB</span>
                        </div>
                      ))}
                    </div>
                  )}

                 <button
  type="button"
  onClick={handleUpload}
  disabled={uploadLoading}
  className="relative z-50 w-full inline-flex items-center justify-center h-13 rounded-xl font-bold text-xs uppercase tracking-wider text-cyan-400 bg-cyan-500/10 hover:bg-cyan-600 hover:text-white border border-cyan-500/20 hover:border-transparent transition-all duration-200 disabled:opacity-40 cursor-pointer"
>Upload Document</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Embedded High Performance Animation Engine */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-25px) scale(1.02); }
        }
        .animate-float { animation: float 14s ease-in-out infinite; }
        .delay-2000 { animation-delay: 3s; }
      `}</style>
    </div>
  );
};

export default SubmitClaim;