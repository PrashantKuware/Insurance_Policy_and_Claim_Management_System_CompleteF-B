export const formatCurrency = (amount, options = {}) => {
  const num = Number(amount);
  if (Number.isNaN(num)) return "₹0";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
    ...options,
  }).format(num);
};

export default formatCurrency;
