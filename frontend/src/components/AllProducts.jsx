import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import PageLayout from "./common/PageLayout";
import PageHeader from "./common/PageHeader";
import DataTable from "./common/DataTable";
import TableHeader from "./common/TableHeader";
import TableRow from "./common/TableRow";
import StatusBadge from "./common/StatusBadge";
import ActionButtons from "./common/ActionButtons";
import SearchBar from "./common/SearchBar";
import FilterDropdown from "./common/FilterDropdown";
import Pagination from "./common/Pagination";
import LoadingSpinner, { TableSkeleton } from "./common/LoadingSpinner";
import DetailsModal from "./common/DetailsModal";
import ConfirmationModal from "./common/ConfirmationModal";
import FormInput from "./common/FormInput";
import FormSelect from "./common/FormSelect";
import FormTextarea from "./common/FormTextarea";
import PrimaryButton from "./common/PrimaryButton";
import SecondaryButton from "./common/SecondaryButton";
import GlassCard from "./common/GlassCard";
import { getAllProducts, addProduct, updateProduct, deactivateProduct, activateProduct } from "../services/ProductService";

const AllProducts = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);

  // Search & Filters
  const [searchId, setSearchId] = useState("");
  const [selectedType, setSelectedType] = useState("");

  // Modals state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  const [editProduct, setEditProduct] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ productName: "", productType: "", description: "" });
  const [editErrors, setEditErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Deactivate / Activate state
  const [toggleId, setToggleId] = useState(null);
  const [toggleState, setToggleState] = useState(null); // 'activate' or 'deactivate'
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getAllProducts(page, size);
      setProducts(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      toast.error("Failed to load products list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, size]);

  const handleDetailsClick = (product) => {
    setSelectedProduct(product);
    setIsDetailsOpen(true);
  };

  const handleEditClick = (product) => {
    setEditProduct(product);
    setEditForm({
      productName: product.productName,
      productType: product.productType,
      description: product.description,
    });
    setEditErrors({});
    setIsEditOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
    setEditErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const valErrors = {};
    if (!editForm.productName.trim()) valErrors.productName = "Product name is required";
    if (!editForm.productType) valErrors.productType = "Product type selection is required";
    if (!editForm.description.trim()) valErrors.description = "Product description is required";

    if (Object.keys(valErrors).length > 0) {
      setEditErrors(valErrors);
      return;
    }

    setSubmitting(true);
    try {
      await updateProduct(editProduct.productId, {
        ...editForm,
        status: editProduct.active,
      });
      toast.success("Product updated successfully ✨");
      setIsEditOpen(false);
      fetchProducts();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to edit product");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleClick = (productId, state) => {
    setToggleId(productId);
    setToggleState(state);
    setIsConfirmOpen(true);
  };

  const handleToggleConfirm = async () => {
    setSubmitting(true);
    try {
      if (toggleState === "deactivate") {
        await deactivateProduct(toggleId);
        toast.warning("Product deactivated successfully ⛔");
      } else {
        await activateProduct(toggleId);
        toast.success("Product activated successfully ✨");
      }
      setIsConfirmOpen(false);
      fetchProducts();
    } catch (err) {
      toast.error(err?.response?.data?.message || `Failed to ${toggleState} product`);
    } finally {
      setSubmitting(false);
    }
  };

  // Client-side search and filters
  const filteredProducts = products.filter((prod) => {
    const matchesSearch = searchId.trim() === "" || String(prod.productId) === searchId.trim();
    const matchesType = selectedType === "" || prod.productType === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <PageLayout>
      <PageHeader
        title="Products Registry"
        subtitle="Configure active coverage structures and type definitions."
      />

      {/* Filter Bar */}
      <GlassCard className="p-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <SearchBar
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Filter by Product ID..."
              onClear={() => setSearchId("")}
            />
            <FilterDropdown
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              options={[
                { label: "All Types", value: "" },
                { label: "HEALTH", value: "HEALTH" },
                { label: "LIFE", value: "LIFE" },
                { label: "VEHICLE", value: "VEHICLE" },
                { label: "PROPERTY", value: "PROPERTY" },
              ]}
              label="Product Type"
            />
          </div>
        </div>
      </GlassCard>

      {/* Grid Table */}
      <GlassCard padding={false}>
        <DataTable>
          <TableHeader headers={["Product ID", "Product Name", "Type", "Status", "Actions"]} />
          <tbody>
            {loading ? (
              <TableSkeleton rows={size} cols={5} />
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((prod) => (
                <TableRow key={prod.productId}>
                  <td className="px-6 py-4 text-xs font-bold text-slate-800 dark:text-white">
                    #{prod.productId}
                  </td>
                  <td className="px-6 py-4 text-xs font-semibold text-slate-700 dark:text-slate-200">
                    {prod.productName}
                  </td>
                  <td className="px-6 py-4 text-xs font-semibold">
                    <span className="inline-block px-2.5 py-1 text-[10px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400 rounded-full">
                      {prod.productType}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-semibold">
                    <StatusBadge status={prod.active} />
                  </td>
                  <td className="px-6 py-4">
                    <ActionButtons
                      onDetails={() => handleDetailsClick(prod)}
                      onEdit={() => handleEditClick(prod)}
                      onActivate={!prod.active ? () => handleToggleClick(prod.productId, "activate") : null}
                      onDeactivate={prod.active ? () => handleToggleClick(prod.productId, "deactivate") : null}
                    />
                  </td>
                </TableRow>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-12 text-center text-xs font-semibold text-slate-400">
                  No matching product records.
                </td>
              </tr>
            )}
          </tbody>
        </DataTable>

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          pageSize={size}
          onPageSizeChange={setSize}
        />
      </GlassCard>

      {/* Details Modal */}
      <DetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        title="Insurance Product Specs"
      >
        {selectedProduct && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Product ID</span>
                <p className="text-sm font-bold text-slate-800 dark:text-white">#{selectedProduct.productId}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Category Type</span>
                <p className="text-sm font-bold text-slate-800 dark:text-white">{selectedProduct.productType}</p>
              </div>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Product Title</span>
              <p className="text-sm font-bold text-slate-850 dark:text-slate-200">{selectedProduct.productName}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Coverage Description</span>
              <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed bg-slate-50 dark:bg-slate-850 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                {selectedProduct.description}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Status</span>
                <div>
                  <StatusBadge status={selectedProduct.active} />
                </div>
              </div>
            </div>
          </div>
        )}
      </DetailsModal>

      {/* Edit Modal */}
      <DetailsModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Modify Product Parameters"
      >
        <form onSubmit={handleEditSubmit} className="space-y-5">
          <FormInput
            label="Product Name"
            id="productName"
            name="productName"
            placeholder="Product Title"
            value={editForm.productName}
            onChange={handleEditChange}
            error={editErrors.productName}
            required
          />

          <FormSelect
            label="Product Category Type"
            id="productType"
            name="productType"
            placeholder="Select type"
            value={editForm.productType}
            onChange={handleEditChange}
            options={["HEALTH", "LIFE", "VEHICLE", "PROPERTY"]}
            error={editErrors.productType}
            required
          />

          <FormTextarea
            label="Product Description"
            id="description"
            name="description"
            placeholder="Detailed policy coverage rules..."
            value={editForm.description}
            onChange={handleEditChange}
            error={editErrors.description}
            required
          />

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200/50 dark:border-slate-800">
            <SecondaryButton onClick={() => setIsEditOpen(false)} disabled={submitting}>
              Cancel
            </SecondaryButton>
            <PrimaryButton type="submit" loading={submitting}>
              Save Changes
            </PrimaryButton>
          </div>
        </form>
      </DetailsModal>

      {/* Confirm Deactivate / Activate Dialog */}
      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleToggleConfirm}
        isDanger={toggleState === "deactivate"}
        title={toggleState === "deactivate" ? "Deactivate Product" : "Activate Product"}
        message={
          toggleState === "deactivate"
            ? "Are you sure you want to deactivate this product? Existing policy plans under this product category will no longer be purchasable by clients."
            : "Are you sure you want to activate this product? This category and its corresponding policy plans will become visible to customers immediately."
        }
        confirmLabel={toggleState === "deactivate" ? "Deactivate" : "Activate"}
        loading={submitting}
      />
    </PageLayout>
  );
};

export default AllProducts;
