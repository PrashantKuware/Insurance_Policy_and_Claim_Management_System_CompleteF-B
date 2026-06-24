// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import { toast } from "react-toastify";

// import {
//     sendEmailOtp,
//     sendMobileOtp,
//     createAgent,
// } from "../services/userService";
// import { useNavigate } from "react-router-dom";

// const AddAgent = () => {
//     const navigate = useNavigate();
//     const {
//         register,
//         handleSubmit,
//         formState: { errors },
//     } = useForm();

//     const [emailTimer, setEmailTimer] = useState(0);
//     const [mobileTimer, setMobileTimer] = useState(0);

//     const startEmailTimer = () => {
//         setEmailTimer(60);

//         const interval = setInterval(() => {
//             setEmailTimer((prev) => {
//                 if (prev <= 1) {
//                     clearInterval(interval);
//                     return 0;
//                 }
//                 return prev - 1;
//             });
//         }, 1000);
//     };

//     const startMobileTimer = () => {
//         setMobileTimer(60);

//         const interval = setInterval(() => {
//             setMobileTimer((prev) => {
//                 if (prev <= 1) {
//                     clearInterval(interval);
//                     return 0;
//                 }
//                 return prev - 1;
//             });
//         }, 1000);
//     };

//     const handleEmailOtp = async (email) => {
//         if (!email) return toast.error("Email required");

//         try {
//             await sendEmailOtp(email);
//             toast.success("Email OTP sent 🚀");
//             startEmailTimer();
//         } catch {
//             toast.error("Failed to send email OTP");
//         }
//     };

//     const handleMobileOtp = async (mobile) => {
//         if (!mobile) return toast.error("Mobile required");

//         try {
//             await sendMobileOtp(mobile);
//             toast.success("Mobile OTP sent 🚀");
//             startMobileTimer();
//         } catch {
//             toast.error("Failed to send mobile OTP");
//         }
//     };

//     const onSubmit = async (data) => {
//         const loading = toast.loading("Creating agent...");

//         try {
//             await createAgent(data);

//             toast.update(loading, {
//                 render: "Agent created successfully 🎉",
//                 type: "success",
//                 isLoading: false,
//                 autoClose: 2000,
//             });

//             setTimeout(() => {
//                 navigate("/admindashboard");
//             }, 1000);

//         } catch {
//             toast.update(loading, {
//                 render: "Something went wrong ❌",
//                 type: "error",
//                 isLoading: false,
//                 autoClose: 2000,
//             });
//         }
//     };

//     return (
//         <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
//             <div className="w-full max-w-xl bg-white shadow-lg rounded-xl p-6">

//                 <h2 className="text-2xl font-bold text-center mb-6">
//                     Add New Agent
//                 </h2>

//                 <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

//                     <div>
//                         <input
//                             {...register("fullName", { required: "Name required" })}
//                             placeholder="Full Name"
//                             className="w-full border p-2 rounded"
//                         />
//                         <p className="text-red-500 text-sm">
//                             {errors.fullName?.message}
//                         </p>
//                     </div>

//                     <div className="flex gap-2">
//                         <input
//                             {...register("email", { required: true })}
//                             placeholder="Email"
//                             className="w-full border p-2 rounded"
//                         />

//                         <button
//                             type="button"
//                             disabled={emailTimer > 0}
//                             onClick={(e) =>
//                                 handleEmailOtp(e.target.form.email.value)
//                             }
//                             className="bg-blue-500 text-white px-3 rounded disabled:bg-gray-400"
//                         >
//                             {emailTimer > 0 ? `${emailTimer}s` : "Send OTP"}
//                         </button>
//                     </div>

//                     <input
//                         {...register("emailOtp", { required: true })}
//                         placeholder="Email OTP"
//                         className="w-full border p-2 rounded"
//                     />

//                     <div className="flex gap-2">
//                         <input
//                             {...register("mobileNumber", { required: true })}
//                             placeholder="Mobile Number"
//                             className="w-full border p-2 rounded"
//                         />

//                         <button
//                             type="button"
//                             disabled={mobileTimer > 0}
//                             onClick={(e) =>
//                                 handleMobileOtp(e.target.form.mobileNumber.value)
//                             }
//                             className="bg-green-500 text-white px-3 rounded disabled:bg-gray-400"
//                         >
//                             {mobileTimer > 0 ? `${mobileTimer}s` : "Send OTP"}
//                         </button>
//                     </div>

//                     <input
//                         {...register("mobileOtp", { required: true })}
//                         placeholder="Mobile OTP"
//                         className="w-full border p-2 rounded"
//                     />

//                     <input
//                         type="password"
//                         {...register("password", { required: true })}
//                         placeholder="Password"
//                         className="w-full border p-2 rounded"
//                     />

//                     <button className="w-full bg-black text-white py-2 rounded hover:bg-gray-800">
//                         Create Agent
//                     </button>

//                 </form>
//             </div>
//         </div>
//     );
// };

// export default AddAgent;

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  sendEmailOtp,
  sendMobileOtp,
  createAgent,
} from "../services/userService";
import { useNavigate } from "react-router-dom";

const AddAgent = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [emailTimer, setEmailTimer] = useState(0);
  const [mobileTimer, setMobileTimer] = useState(0);

  /* ORBS */
  const Orbs = () => (
    <>
      <div className="absolute w-[320px] h-[320px] bg-blue-200/50 rounded-full blur-3xl top-[-60px] left-[30%]" />
      <div className="absolute w-[150px] h-[150px] bg-blue-300/40 rounded-full blur-2xl top-[15%] right-[20%]" />
      <div className="absolute w-[220px] h-[220px] bg-blue-200/40 rounded-full blur-3xl bottom-[15%] left-[10%]" />
      <div className="absolute w-[180px] h-[180px] bg-blue-300/40 rounded-full blur-2xl bottom-[10%] right-[10%]" />
    </>
  );

  /* TIMER HELPERS */
  const startTimer = (setter) => {
    setter(60);

    const interval = setInterval(() => {
      setter((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleEmailOtp = async (email) => {
    if (!email) return toast.error("Email required");

    try {
      await sendEmailOtp(email);
      toast.success("Email OTP sent 🚀");
      startTimer(setEmailTimer);
    } catch {
      toast.error("Failed to send email OTP");
    }
  };

  const handleMobileOtp = async (mobile) => {
    if (!mobile) return toast.error("Mobile required");

    try {
      await sendMobileOtp(mobile);
      toast.success("Mobile OTP sent 🚀");
      startTimer(setMobileTimer);
    } catch {
      toast.error("Failed to send mobile OTP");
    }
  };

  const onError = (errors) => {
    const firstError = Object.values(errors)[0];

    toast.error(
      firstError?.message || "Please fill all required fields"
    );
  };

  const onSubmit = async (data) => {
    const loading = toast.loading("Creating agent...");

    try {
      await createAgent(data);

      toast.update(loading, {
        render: "Agent created successfully 🎉",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      setTimeout(() => navigate("/admindashboard"), 800);

    } catch (error) {
      toast.update(loading, {
        render: error.message || "Something went wrong ❌",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#eceef2] overflow-hidden p-4">

      {/* ORBS */}
      <Orbs />

      {/* CARD */}
      <div className="relative z-10 w-full max-w-xl p-10 rounded-[35px]
      backdrop-blur-3xl bg-white/30 border border-white/40 shadow-xl">

        <h2 className="text-3xl font-bold text-center text-[#243447]">
          Add New Agent
        </h2>

        <p className="text-center text-gray-600 mt-2 mb-6">
          Secure OTP Verified Agent Creation
        </p>

        <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4">

          {/* NAME */}
          <div>
            <input
              {...register("fullName", {
                required: "Full Name is required",
              })}
              placeholder="Full Name"
              className="w-full p-4 rounded-xl bg-white/40 outline-none"
            />

            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* EMAIL */}
          <div className="flex gap-2">
            <input
              {...register("email", {
                required: "Email is required",
              })}
              placeholder="Email"
              className="w-full p-4 rounded-xl bg-white/40 outline-none"
            />

            <button
              type="button"
              disabled={emailTimer > 0}
              onClick={(e) =>
                handleEmailOtp(e.target.form.email.value)
              }
              className="px-4 rounded-xl bg-blue-300 text-white font-semibold disabled:bg-gray-400"
            >
              {emailTimer > 0 ? `${emailTimer}s` : "Send OTP"}
            </button>
          </div>

          {errors.email && (
            <p className="text-red-500 text-sm">
              {errors.email.message}
            </p>
          )}

          {/* EMAIL OTP */}
          <div>
            <input
              {...register("emailOtp", {
                required: "Email OTP is required",
              })}
              placeholder="Email OTP"
              className="w-full p-4 rounded-xl bg-white/40 outline-none"
            />

            {errors.emailOtp && (
              <p className="text-red-500 text-sm mt-1">
                {errors.emailOtp.message}
              </p>
            )}
          </div>

          {/* MOBILE */}
          <div className="flex gap-2">
            <input
              {...register("mobileNumber", {
                required: "Mobile Number is required",
              })}
              placeholder="Mobile Number"
              className="w-full p-4 rounded-xl bg-white/40 outline-none"
            />

            <button
              type="button"
              disabled={mobileTimer > 0}
              onClick={(e) =>
                handleMobileOtp(
                  e.target.form.mobileNumber.value
                )
              }
              className="px-4 rounded-xl bg-green-300 text-white font-semibold disabled:bg-gray-400"
            >
              {mobileTimer > 0 ? `${mobileTimer}s` : "Send OTP"}
            </button>
          </div>

          {errors.mobileNumber && (
            <p className="text-red-500 text-sm">
              {errors.mobileNumber.message}
            </p>
          )}

          {/* MOBILE OTP */}
          <div>
            <input
              {...register("mobileOtp", {
                required: "Mobile OTP is required",
              })}
              placeholder="Mobile OTP"
              className="w-full p-4 rounded-xl bg-white/40 outline-none"
            />

            {errors.mobileOtp && (
              <p className="text-red-500 text-sm mt-1">
                {errors.mobileOtp.message}
              </p>
            )}
          </div>

          {/* PASSWORD */}
          <div>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message:
                    "Password must be at least 6 characters",
                },
              })}
              placeholder="Password"
              className="w-full p-4 rounded-xl bg-white/40 outline-none"
            />

            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* SUBMIT */}
          <button
            className="w-full h-[55px] rounded-xl font-semibold text-lg
            bg-gradient-to-r from-blue-200 to-blue-300 hover:scale-105 transition"
          >
            Create Agent
          </button>

        </form>
      </div>
    </div>
  );
};

export default AddAgent;