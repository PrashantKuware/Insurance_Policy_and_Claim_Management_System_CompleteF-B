import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaSave, FaArrowLeft } from "react-icons/fa";
import { State, City } from "country-state-city";
import PageLayout from "./common/PageLayout";
import PageHeader from "./common/PageHeader";
import FormInput from "./common/FormInput";
import FormSelect from "./common/FormSelect";
import PrimaryButton from "./common/PrimaryButton";
import SecondaryButton from "./common/SecondaryButton";
import GlassCard from "./common/GlassCard";
import LoadingSpinner from "./common/LoadingSpinner";
import { getCurrentUser } from "../services/userService";
import { createCustomerProfile } from "../services/CustomerService";

const AddCustomer = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetchingUser, setFetchingUser] = useState(true);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    dateOfBirth: "",
    address: "",
    state: "",
    city: "",
    pinCode: "",
    nomineeName: "",
    nomineeRelation: "",
  });

  const [errors, setErrors] = useState({});
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  // Fetch logged-in user profile details
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();
        setFormData((prev) => ({
          ...prev,
          fullName: user.fullName || "",
          email: user.email || "",
          mobileNumber: user.mobileNumber || "",
        }));

        // Load India states (Country code "IN")
        const indiaStates = State.getStatesOfCountry("IN") || [];
        setStates(indiaStates);
      } catch (err) {
        toast.error("Failed to load user credentials. Please log in again.");
        navigate("/");
      } finally {
        setFetchingUser(false);
      }
    };
    fetchUser();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleStateChange = (e) => {
    const stateIsoCode = e.target.value;
    const selectedStateObj = states.find((s) => s.isoCode === stateIsoCode);
    const stateName = selectedStateObj ? selectedStateObj.name : "";

    setFormData((prev) => ({
      ...prev,
      state: stateName,
      city: "", // reset city
    }));

    if (stateIsoCode) {
      const stateCities = City.getCitiesOfState("IN", stateIsoCode) || [];
      setCities(stateCities);
    } else {
      setCities([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const valErrors = {};
    if (!formData.dateOfBirth) valErrors.dateOfBirth = "Date of Birth is required";
    if (!formData.address.trim()) valErrors.address = "Residential address is required";
    if (!formData.state) valErrors.state = "State selection is required";
    if (!formData.city) valErrors.city = "City selection is required";
    if (!formData.pinCode.trim()) valErrors.pinCode = "Pin Code is required";
    if (!formData.nomineeName.trim()) valErrors.nomineeName = "Nominee name is required";
    if (!formData.nomineeRelation.trim()) valErrors.nomineeRelation = "Nominee relation is required";

    if (Object.keys(valErrors).length > 0) {
      setErrors(valErrors);
      return;
    }

    setLoading(true);
    try {
      await createCustomerProfile(formData);
      toast.success("Customer profile registered successfully! ✨");
      navigate("/customerdashboard");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to save profile details");
    } finally {
      setLoading(false);
    }
  };

  if (fetchingUser) return <LoadingSpinner fullPage message="Loading profile..." />;

  const stateOptions = states.map((s) => ({ label: s.name, value: s.isoCode }));
  const cityOptions = cities.map((c) => ({ label: c.name, value: c.name }));

  return (
    <PageLayout>
      <PageHeader
        title="Complete Customer Profile"
        subtitle="Complete your profile info to purchase coverage policies."
      />

      <div className="flex justify-center mt-2">
        <GlassCard hoverable={false} className="w-full max-w-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label="Full Name"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                disabled
              />

              <FormInput
                label="Email Address"
                id="email"
                name="email"
                value={formData.email}
                disabled
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label="Mobile Number"
                id="mobileNumber"
                name="mobileNumber"
                value={formData.mobileNumber}
                disabled
              />

              <FormInput
                label="Date of Birth"
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                error={errors.dateOfBirth}
                required
              />
            </div>

            <FormTextarea
              label="Residential Address"
              id="address"
              name="address"
              placeholder="123 Main St, Apartment 4B"
              value={formData.address}
              onChange={handleChange}
              error={errors.address}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormSelect
                label="State"
                id="state"
                name="state"
                placeholder="Select State"
                value={states.find((s) => s.name === formData.state)?.isoCode || ""}
                onChange={handleStateChange}
                options={stateOptions}
                error={errors.state}
                required
              />

              <FormSelect
                label="City"
                id="city"
                name="city"
                placeholder="Select City"
                value={formData.city}
                onChange={handleChange}
                options={cityOptions}
                error={errors.city}
                required
                disabled={!formData.state}
              />
            </div>

            <FormInput
              label="Pin Code"
              id="pinCode"
              name="pinCode"
              placeholder="e.g. 400001"
              value={formData.pinCode}
              onChange={handleChange}
              error={errors.pinCode}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-blue-50/20 dark:bg-slate-850/50 border border-slate-100 dark:border-slate-800/80 p-4 rounded-xl">
              <FormInput
                label="Nominee Name"
                id="nomineeName"
                name="nomineeName"
                placeholder="e.g. Mary Doe"
                value={formData.nomineeName}
                onChange={handleChange}
                error={errors.nomineeName}
                required
              />

              <FormInput
                label="Nominee Relation"
                id="nomineeRelation"
                name="nomineeRelation"
                placeholder="e.g. Spouse, Child"
                value={formData.nomineeRelation}
                onChange={handleChange}
                error={errors.nomineeRelation}
                required
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200/50 dark:border-slate-800">
              <SecondaryButton
                onClick={() => navigate("/customerdashboard")}
                disabled={loading}
                icon={FaArrowLeft}
              >
                Cancel
              </SecondaryButton>
              <PrimaryButton
                type="submit"
                loading={loading}
                icon={FaSave}
              >
                Register Profile
              </PrimaryButton>
            </div>
          </form>
        </GlassCard>
      </div>
    </PageLayout>
  );
};

export default AddCustomer;
