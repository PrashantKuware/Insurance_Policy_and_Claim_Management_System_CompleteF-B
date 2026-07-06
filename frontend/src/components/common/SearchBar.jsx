import React, { memo } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";

const SearchBar = ({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
  onClear,
  onSubmit,
  id = "search-input",
  label,
}) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && onSubmit) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className={`relative flex items-center w-full md:w-80 ${className}`}>
      {label && (
        <label htmlFor={id} className="sr-only">
          {label}
        </label>
      )}
      <span className="absolute left-3.5 text-slate-400 pointer-events-none" aria-hidden="true">
        <FaSearch className="w-4 h-4" />
      </span>
      <input
        id={id}
        type="search"
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="search-input"
        aria-label={label || placeholder}
      />
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-3 icon-button p-1"
          aria-label="Clear search"
        >
          <FaTimes className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export default memo(SearchBar);
