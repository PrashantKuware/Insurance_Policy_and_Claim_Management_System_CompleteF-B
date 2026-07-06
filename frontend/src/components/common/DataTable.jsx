import React from "react";

const DataTable = ({ children, className = "" }) => {
  return (
    <div className={`table-card w-full overflow-x-auto ${className}`}>
      <table className="w-full text-left border-collapse">
        {children}
      </table>
    </div>
  );
};

export default DataTable;
