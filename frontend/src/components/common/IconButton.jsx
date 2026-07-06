import React from "react";

const IconButton = ({
  icon: Icon,
  onClick,
  title,
  type = "button",
  disabled = false,
  className = "",
  size = "md",
  ...props
}) => {
  const sizeClass = size === "sm" ? "p-2" : size === "lg" ? "p-3" : "p-2.5";
  const iconSize = size === "sm" ? "w-3.5 h-3.5" : size === "lg" ? "w-5 h-5" : "w-4 h-4";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
      className={`icon-button ${sizeClass} ${className}`}
      {...props}
    >
      {Icon && <Icon className={iconSize} aria-hidden="true" />}
    </button>
  );
};

export default IconButton;
