import React, { useState } from "react";
import {
  ExclamationCircleIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";

const Input = ({
  id,
  name,
  type = "text",
  label,
  placeholder = "",
  value,
  onChange,
  onBlur,
  error = null,
  helperText = null,
  icon = null,
  disabled = false,
  required = false,
  className = "",
  fullWidth = true,
  size = "md",
  variant = "outlined",
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Base styles
  const baseInputStyles =
    "rounded-lg bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";

  // Size styles
  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-5 py-3 text-lg",
  };

  // Variant styles
  const variantStyles = {
    outlined: "border border-gray-300 focus:border-blue-500",
    filled:
      "bg-gray-100 border border-transparent hover:bg-gray-200 focus:bg-white focus:border-blue-500",
    standard:
      "border-b border-gray-300 rounded-none px-0 focus:border-blue-500",
  };

  // Error styles
  const errorStyles = error
    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
    : "";

  // Disabled styles
  const disabledStyles = disabled
    ? "bg-gray-100 text-gray-500 cursor-not-allowed"
    : "";

  // Width styles
  const widthStyles = fullWidth ? "w-full" : "";

  // Icon styles
  const iconStyles = icon ? "pl-10" : "";

  // Password toggle styles
  const passwordToggleStyles = type === "password" ? "pr-10" : "";

  // Combine all input styles
  const inputStyles = `
    ${baseInputStyles}
    ${sizeStyles[size]}
    ${variantStyles[variant]}
    ${errorStyles}
    ${disabledStyles}
    ${widthStyles}
    ${iconStyles}
    ${passwordToggleStyles}
    ${className}
  `;

  // Container styles
  const containerStyles = `
    ${fullWidth ? "w-full" : ""}
    ${className}
  `;

  // Handle password visibility toggle
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Determine the actual input type
  const inputType =
    type === "password" ? (showPassword ? "text" : "password") : type;

  return (
    <div className={containerStyles}>
      {label && (
        <label
          htmlFor={id}
          className={`block text-sm font-medium mb-1 ${
            error ? "text-red-500" : "text-gray-700"
          }`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}

        <input
          id={id}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur && onBlur(e);
          }}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={inputStyles}
          {...props}
        />

        {type === "password" && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        )}

        {error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
          </div>
        )}
      </div>

      {(error || helperText) && (
        <p
          className={`mt-1 text-sm ${error ? "text-red-500" : "text-gray-500"}`}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
};

export default Input;
