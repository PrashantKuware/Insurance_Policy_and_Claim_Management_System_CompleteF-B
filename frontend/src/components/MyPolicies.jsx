import React, { useEffect, useState } from "react";
import { getAllPoliciesByCustomer } from "../services/policyService";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";

const MyPolicies = () => {
  const [policyData, setPolicyData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getMyPolicies = async () => {
    try {
      setLoading(true);
      const data = await getAllPoliciesByCustomer();
      setPolicyData(data || []);
    } catch (error) {
      toast.error("Failed To Load Policies ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMyPolicies();
  }, []);

  return (
    <div
      className="
      p-8
      rounded-[32px]
      bg-white/45
      backdrop-blur-2xl
      border border-white/70
      shadow-[0_20px_60px_rgba(0,0,0,0.08)]
      "
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            My Policies
          </h2>

          <p className="text-slate-500 mt-1">
            View and manage your purchased insurance plans
          </p>
        </div>

        <NavLink
          to="/customer/policies"
          className="
          px-5 py-3
          rounded-2xl
          bg-gradient-to-r
          from-blue-500
          to-indigo-600
          text-white
          font-semibold
          shadow-lg
          hover:scale-105
          transition-all
          "
        >
          View All →
        </NavLink>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex gap-6 overflow-x-auto pb-2">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="
              min-w-[280px]
              h-[220px]
              rounded-[28px]
              bg-white/60
              animate-pulse
              "
            />
          ))}
        </div>
      ) : policyData.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-5xl mb-3">📄</div>

          <h3 className="text-xl font-semibold text-slate-700">
            No Policies Found
          </h3>

          <p className="text-slate-500 mt-2">
            Purchase a policy to see it here.
          </p>
        </div>
      ) : (
        <div className="flex gap-6 overflow-x-auto pb-3">
          {policyData.slice(0, 4).map((ele) => (
            <div
              key={ele.policyId}
              className="
              min-w-[240px]
              bg-white/65
              backdrop-blur-2xl
              border border-white/80
              rounded-[28px]
              p-6
              shadow-[0_15px_35px_rgba(0,0,0,0.08)]
              hover:-translate-y-2
              hover:shadow-[0_25px_50px_rgba(0,0,0,0.12)]
              transition-all duration-300
              "
            >
              {/* Top Section */}
              <div className="flex justify-between items-start mb-5">
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-500">
                    Insurance Plan
                  </p>

                  <h3 className="text-xl font-bold text-slate-800 mt-2">
                    {ele.planName}
                  </h3>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    ele.policyStatus === "ACTIVE"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {ele.policyStatus}
                </span>
              </div>

              {/* Details */}
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">
                    Policy ID
                  </span>

                  <span className="font-semibold text-slate-800">
                    #{ele.policyId}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">
                    Premium Paid
                  </span>

                  <span className="font-semibold text-slate-800">
                    ₹{ele.totalPremiumPaid}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">
                    Status
                  </span>

                  <span
                    className={`font-semibold ${
                      ele.policyStatus === "ACTIVE"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {ele.policyStatus}
                  </span>
                </div>
              </div>

              {/* Button */}
              <NavLink
                to={`/policy/${ele.policyId}`}
                className="
                mt-6
                block
                text-center
                py-3
                rounded-2xl
                bg-gradient-to-r
                from-blue-500
                to-indigo-600
                text-white
                font-semibold
                hover:opacity-90
                transition-all
                "
              >
                View Details
              </NavLink>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPolicies;