import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Button = ({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  className = "",
  to = null,
  onClick = null,
  disabled = false,
  isLoading = false,
  icon = null,
  iconPosition = "left",
  fullWidth = false,
  ...props
}) => {
  // Base styles
  const baseStyles =
    "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2";

  // Size styles
  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
    xl: "px-8 py-4 text-xl",
  };

  // Variant styles
  const variantStyles = {
    primary:
      "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 shadow-md",
    secondary:
      "bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-500",
    outline:
      "bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500",
    danger:
      "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-md",
    success:
      "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 shadow-md",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-500",
  };

  // Disabled styles
  const disabledStyles = "opacity-60 cursor-not-allowed pointer-events-none";

  // Full width style
  const widthStyle = fullWidth ? "w-full" : "";

  // Combine all styles
  const buttonStyles = `
    ${baseStyles}
    ${sizeStyles[size]}
    ${variantStyles[variant]}
    ${disabled || isLoading ? disabledStyles : ""}
    ${widthStyle}
    ${className}
  `;

  // Loading spinner
  const LoadingSpinner = () => (
    <svg
      className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );

  // Button content
  const buttonContent = (
    <>
      {isLoading && <LoadingSpinner />}
      {icon && iconPosition === "left" && !isLoading && (
        <span className="mr-2">{icon}</span>
      )}
      {children}
      {icon && iconPosition === "right" && !isLoading && (
        <span className="ml-2">{icon}</span>
      )}
    </>
  );

  // Animation variants
  const buttonVariants = {
    hover: { scale: 1.03 },
    tap: { scale: 0.97 },
  };

  // Render as Link if 'to' prop is provided
  if (to) {
    return (
      <motion.div whileHover="hover" whileTap="tap" variants={buttonVariants}>
        <Link to={to} className={buttonStyles} {...props}>
          {buttonContent}
        </Link>
      </motion.div>
    );
  }

  // Render as button
  return (
    <motion.button
      type={type}
      className={buttonStyles}
      onClick={onClick}
      disabled={disabled || isLoading}
      whileHover={!disabled && !isLoading ? "hover" : undefined}
      whileTap={!disabled && !isLoading ? "tap" : undefined}
      variants={buttonVariants}
      {...props}
    >
      {buttonContent}
    </motion.button>
  );
};

export default Button;
