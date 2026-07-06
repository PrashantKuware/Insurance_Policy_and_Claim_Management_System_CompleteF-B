import React, { forwardRef } from "react";

const FormInput = forwardRef(
  (
    {
      label,
      id,
      type = "text",
      placeholder,
      value,
      onChange,
      error,
      required = false,
      className = "",
      disabled = false,
      name,
      inputClassName = "",
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
        <input
          ref={ref}
          type={type}
          id={fieldId}
          name={name || fieldId}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? `${fieldId}-error` : undefined}
          className={`input-field ${
            error
              ? "border-red-500 hover:border-red-500 focus:border-red-500 focus:ring-red-500/20"
              : ""
          } ${inputClassName}`}
          {...(value !== undefined ? { value } : {})}
          {...(onChange !== undefined ? { onChange } : {})}
          {...props}
        />
        {error && (
          <p id={`${fieldId}-error`} className="text-xs font-semibold text-red-500 mt-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

export default FormInput;
