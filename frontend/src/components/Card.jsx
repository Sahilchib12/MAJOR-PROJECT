import React from "react";
import { motion } from "framer-motion";

const Card = ({
  children,
  className = "",
  variant = "default",
  hover = false,
  onClick = null,
  padding = "default",
  ...props
}) => {
  // Base styles
  const baseStyles = "rounded-lg overflow-hidden";

  // Variant styles
  const variantStyles = {
    default: "bg-white shadow",
    outlined: "bg-white border border-gray-200",
    elevated: "bg-white shadow-lg",
    colored: "bg-blue-50",
    flat: "bg-gray-50",
  };

  // Padding styles
  const paddingStyles = {
    none: "",
    small: "p-3",
    default: "p-6",
    large: "p-8",
  };

  // Hover styles
  const hoverStyles = hover
    ? "transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
    : "";

  // Combine all styles
  const cardStyles = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${paddingStyles[padding]}
    ${hoverStyles}
    ${className}
  `;

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
    hover: hover
      ? { y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }
      : {},
  };

  return (
    <motion.div
      className={cardStyles}
      onClick={onClick}
      initial="hidden"
      animate="visible"
      whileHover={hover ? "hover" : undefined}
      variants={cardVariants}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Card Header component
Card.Header = ({ children, className = "", ...props }) => {
  return (
    <div className={`mb-4 ${className}`} {...props}>
      {children}
    </div>
  );
};

// Card Body component
Card.Body = ({ children, className = "", ...props }) => {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
};

// Card Footer component
Card.Footer = ({ children, className = "", ...props }) => {
  return (
    <div
      className={`mt-4 pt-4 border-t border-gray-100 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// Card Title component
Card.Title = ({ children, className = "", ...props }) => {
  return (
    <h3
      className={`text-xl font-semibold text-gray-800 ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
};

// Card Subtitle component
Card.Subtitle = ({ children, className = "", ...props }) => {
  return (
    <h4 className={`text-sm text-gray-500 mt-1 ${className}`} {...props}>
      {children}
    </h4>
  );
};

// Card Image component
Card.Image = ({ src, alt = "", className = "", ...props }) => {
  return (
    <div className="w-full overflow-hidden">
      <img
        src={src}
        alt={alt}
        className={`w-full object-cover ${className}`}
        {...props}
      />
    </div>
  );
};

export default Card;
