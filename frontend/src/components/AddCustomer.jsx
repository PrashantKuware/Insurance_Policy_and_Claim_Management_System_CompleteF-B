
import { motion } from "framer-motion";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaCity,
  FaMap,
  FaHashtag,
  FaUser,
  FaUsers,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { addCustomer } from "../services/CustomerService";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Country, State, City } from "country-state-city";


// background

const BackgroundOrbs = () => {
  return (
    <>
      <div className="orb orb1"></div>
      <div className="orb orb2"></div>
      <div className="orb orb3"></div>
      <div className="orb orb4"></div>
    </>
  );
};

const AddCustomer = () => {

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const indianStates = State.getStatesOfCountry("IN");
    setStates(indianStates);
  }, []);


  const handleStateChange = (e) => {
    const stateCode = e.target.value;

    const selectedState = states.find((state) => state.isoCode === stateCode);

    setFormData({
      ...formData,
      state: selectedState.name,
      city: "",
    });

    const cityList = City.getCitiesOfState("IN", stateCode);

    setCities(cityList);
  };

  const [formData, setFormData] = useState({
    dateOfBirth: "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
    nomineeName: "",
    nomineeRelation: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = await addCustomer(formData);

      console.log(data);

      toast.success("Customer Added Successfully ✅");

      setFormData({
        dateOfBirth: "",
        address: "",
        city: "",
        state: "",
        pinCode: "",
        nomineeName: "",
        nomineeRelation: "",
      });
      setTimeout(() => navigate("/customerdashboard"), 800);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Unable To Add Customer ❌",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#eceef2] overflow-hidden">
      <div className="absolute inset-0 animate-spin-slow opacity-40">
        <div className="w-[200%] h-[200%] bg-[radial-gradient(circle,#dcefff_0%,transparent_25%),radial-gradient(circle,#b9daf5_0%,transparent_25%)]" />
      </div>

      <BackgroundOrbs />

      <motion.div
        className="relative z-10 w-[700px] p-10 rounded-[35px]
        backdrop-blur-[35px] bg-white/30 border border-white/40
        shadow-[0_20px_60px_rgba(0,0,0,0.08)]"
        initial={{ opacity: 0, scale: 0.7, y: 80 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl font-bold text-center text-[#243447]">
          Add Customer
        </h1>

        <p className="text-center mt-3 mb-8 text-gray-500">
          Complete Customer Information
        </p>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          {/* DOB */}
          <div className="flex items-center gap-3 p-4 rounded-xl bg-white/40">
            <FaCalendarAlt />
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="w-full bg-transparent outline-none"
              required
            />
          </div>

          {/* Address */}
          <div className="flex items-center gap-3 p-4 rounded-xl bg-white/40">
            <FaMapMarkerAlt />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              className="w-full bg-transparent outline-none"
              required
            />
          </div>

          {/* State */}
          <div className="flex items-center gap-3 p-4 rounded-xl bg-white/40">
            <FaMap />
            <select
              value={
                states.find(
                  s => s.name === formData.state
                )?.isoCode || ""
              }
              onChange={handleStateChange}
              className="w-full bg-transparent outline-none"
              required
            >
              <option value="">
                Select State
              </option>

              {states.map((state) => (
                <option
                  key={state.isoCode}
                  value={state.isoCode}
                >
                  {state.name}
                </option>
              ))}
            </select>
          </div>

          {/* City */}
          <div className="flex items-center gap-3 p-4 rounded-xl bg-white/40">
            <FaCity />
            <select
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full bg-transparent outline-none"
              required
            >
              <option value="">Select City</option>

              {cities.map((city) => (
                <option key={city.name} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>

          {/* Pin Code */}
          <div className="flex items-center gap-3 p-4 rounded-xl bg-white/40">
            <FaHashtag />
            <input
              type="text"
              name="pinCode"
              placeholder="Pin Code"
              value={formData.pinCode}
              onChange={handleChange}
              className="w-full bg-transparent outline-none"
              required
            />
          </div>

          {/* Nominee Name */}
          <div className="flex items-center gap-3 p-4 rounded-xl bg-white/40">
            <FaUser />
            <input
              type="text"
              name="nomineeName"
              placeholder="Nominee Name"
              value={formData.nomineeName}
              onChange={handleChange}
              className="w-full bg-transparent outline-none"
              required
            />
          </div>

          {/* Nominee Relation */}
          <div className="col-span-2 flex items-center gap-3 p-4 rounded-xl bg-white/40">
            <FaUsers />
            <input
              type="text"
              name="nomineeRelation"
              placeholder="Nominee Relation"
              value={formData.nomineeRelation}
              onChange={handleChange}
              className="w-full bg-transparent outline-none"
              required
            />
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            className="col-span-2 h-14 rounded-xl text-lg font-semibold
            bg-gradient-to-r from-[#d2e6ff] to-[#a7ccff]"
            whileHover={{ scale: loading ? 1 : 1.03 }}
            whileTap={{ scale: loading ? 1 : 0.95 }}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
            ) : (
              "Add Customer →"
            )}
          </motion.button>
        </form>
      </motion.div>

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
    </div>
  );
};

export default AddCustomer;
