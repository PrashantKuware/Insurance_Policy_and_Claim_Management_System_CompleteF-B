import React from "react";

const TableRow = ({ children, className = "", onClick }) => {
  return (
    <tr
      onClick={onClick}
      className={`table-row ${onClick ? "cursor-pointer" : ""} ${className}`}
    >
      {children}
    </tr>
  );
};

export default TableRow;
