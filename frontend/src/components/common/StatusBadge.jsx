import React from "react";

const StatusBadge = ({ status, className = "" }) => {
  const getStatusClass = (s) => {
    const val = String(s).toUpperCase().trim();
    if (val === "ACTIVE" || val === "TRUE" || val === "APPROVED" || val === "PAID") {
      return "status-active";
    }
    if (val === "INACTIVE" || val === "FALSE" || val === "REJECTED" || val === "CANCELLED" || val === "WITHDRAWN") {
      return "status-inactive";
    }
    return "status-pending";
  };

  const getLabel = (s) => {
    const val = String(s).toUpperCase().trim();
    if (val === "TRUE") return "Active";
    if (val === "FALSE") return "Inactive";
    return s;
  };

  return (
    <span className={`badge ${getStatusClass(status)} ${className}`}>
      {getLabel(status)}
    </span>
  );
};

export default StatusBadge;
