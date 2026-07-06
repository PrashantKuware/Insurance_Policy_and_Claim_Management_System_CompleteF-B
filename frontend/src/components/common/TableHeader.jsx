import React from "react";

const TableHeader = ({ headers = [], className = "" }) => {
  return (
    <thead className={`table-header ${className}`}>
      <tr>
        {headers.map((h, i) => (
          <th key={i} className="px-6 py-4">
            {h}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;
