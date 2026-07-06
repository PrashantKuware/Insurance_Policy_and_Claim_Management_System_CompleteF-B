import React, { forwardRef } from "react";

const FormSelect = forwardRef(
  (
    {
      label,
      id,
      options = [],
      placeholder = "Select an option",
      value,
      onChange,
      error,
      required = false,
      className = "",
      disabled = false,
      name,
      selectClassName = "",
      ...props
    },
    ref
  ) => {
    const fieldId = id || name;

    return (
      <div className={`input-group ${className}`}>
        {label && (
          <label
            htmlFor={fieldId}
            className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
          >
            {label} {required && <span className="text-red-500" aria-hidden="true">*</span>}
          </label>
        )}
        <select
          ref={ref}
          id={fieldId}
          name={name || fieldId}
          disabled={disabled}
          required={required}
          className={`select-field ${
            error
              ? "border-red-500 hover:border-red-500 focus:border-red-500 focus:ring-red-500/20"
              : ""
          } ${selectClassName}`}
          {...(value !== undefined ? { value } : {})}
          {...(onChange !== undefined ? { onChange } : {})}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => {
            const optVal = typeof opt === "object" ? opt.value : opt;
            const optLbl = typeof opt === "object" ? opt.label : opt;
            return (
              <option key={optVal} value={optVal}>
                {optLbl}
              </option>
            );
          })}
        </select>
        {error && (
          <p id={`${fieldId}-error`} className="text-xs font-semibold text-red-500 mt-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormSelect.displayName = "FormSelect";

export default FormSelect;
