import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaPlusCircle, FaArrowLeft } from "react-icons/fa";
import PageLayout from "./common/PageLayout";
import PageHeader from "./common/PageHeader";
import FormInput from "./common/FormInput";
import FormSelect from "./common/FormSelect";
import FormTextarea from "./common/FormTextarea";
import PrimaryButton from "./common/PrimaryButton";
import SecondaryButton from "./common/SecondaryButton";
import GlassCard from "./common/GlassCard";
import { addProduct } from "../services/ProductService";

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    productName: "",
    productType: "",
    description: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const valErrors = {};
    if (!formData.productName.trim()) valErrors.productName = "Product name is required";
    if (!formData.productType) valErrors.productType = "Product type selection is required";
    if (!formData.description.trim()) valErrors.description = "Product description is required";

    if (Object.keys(valErrors).length > 0) {
      setErrors(valErrors);
      return;
    }

    setLoading(true);
    try {
      await addProduct(formData);
      toast.success("Insurance product category created successfully ✨");
      navigate("/allProducts");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <PageHeader
        title="Add Insurance Product"
        subtitle="Introduce a new category of coverage for policies and plans."
      />

      <div className="flex justify-center mt-2">
        <GlassCard hoverable={false} className="w-full max-w-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormInput
              label="Product Title"
              id="productName"
              name="productName"
              placeholder="e.g. Health Shield Plus"
              value={formData.productName}
              onChange={handleChange}
              error={errors.productName}
              required
            />

            <FormSelect
              label="Product Type Category"
              id="productType"
              name="productType"
              placeholder="Select category type"
              value={formData.productType}
              onChange={handleChange}
              options={["HEALTH", "LIFE", "VEHICLE", "PROPERTY"]}
              error={errors.productType}
              required
            />

            <FormTextarea
              label="Description Specs"
              id="description"
              name="description"
              placeholder="Define rules, bounds, and terms relating to this insurance category..."
              value={formData.description}
              onChange={handleChange}
              error={errors.description}
              required
            />

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200/50 dark:border-slate-800">
              <SecondaryButton
                onClick={() => navigate("/allProducts")}
                disabled={loading}
                icon={FaArrowLeft}
              >
                Cancel
              </SecondaryButton>
              <PrimaryButton
                type="submit"
                loading={loading}
                icon={FaPlusCircle}
              >
                Create Product
              </PrimaryButton>
            </div>
          </form>
        </GlassCard>
      </div>
    </PageLayout>
  );
};

export default AddProduct;
