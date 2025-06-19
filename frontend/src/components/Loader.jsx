import React from "react";
import { motion } from "framer-motion";

const Loader = ({
  type = "spinner",
  size = "md",
  color = "blue",
  fullScreen = false,
  text = null,
  className = "",
  ...props
}) => {
  // Size styles
  const sizeStyles = {
    sm: {
      spinner: "h-4 w-4",
      dots: "h-1.5 w-1.5",
      pulse: "h-6 w-6",
      bounce: "h-2 w-2",
      bar: "h-1",
    },
    md: {
      spinner: "h-8 w-8",
      dots: "h-2.5 w-2.5",
      pulse: "h-10 w-10",
      bounce: "h-3 w-3",
      bar: "h-1.5",
    },
    lg: {
      spinner: "h-12 w-12",
      dots: "h-3.5 w-3.5",
      pulse: "h-16 w-16",
      bounce: "h-4 w-4",
      bar: "h-2",
    },
  };

  // Color styles
  const colorStyles = {
    blue: "text-blue-600",
    gray: "text-gray-600",
    green: "text-green-600",
    red: "text-red-600",
    yellow: "text-yellow-600",
    indigo: "text-indigo-600",
    purple: "text-purple-600",
    pink: "text-pink-600",
  };

  // Container styles
  const containerStyles = fullScreen
    ? "fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50"
    : "flex items-center justify-center";

  // Spinner Loader
  const SpinnerLoader = () => (
    <div className="relative">
      <motion.svg
        className={`animate-spin ${sizeStyles[size].spinner} ${colorStyles[color]}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
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
      </motion.svg>
    </div>
  );

  // Dots Loader
  const DotsLoader = () => (
    <div className="flex space-x-2">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className={`${sizeStyles[size].dots} rounded-full ${colorStyles[color]}`}
          initial={{ opacity: 0.3 }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: index * 0.2,
            ease: "easeInOut",
          }}
        ></motion.div>
      ))}
    </div>
  );

  // Pulse Loader
  const PulseLoader = () => (
    <motion.div
      className={`${sizeStyles[size].pulse} rounded-full border-4 border-t-transparent border-b-transparent ${colorStyles[color]}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, rotate: 360 }}
      transition={{
        rotate: {
          duration: 1,
          ease: "linear",
          repeat: Infinity,
        },
        opacity: { duration: 0.3 },
      }}
    ></motion.div>
  );

  // Bounce Loader
  const BounceLoader = () => (
    <div className="flex space-x-2">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className={`${sizeStyles[size].bounce} rounded-full ${colorStyles[color]}`}
          initial={{ y: 0 }}
          animate={{ y: [0, -10, 0] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: index * 0.2,
            ease: "easeInOut",
          }}
        ></motion.div>
      ))}
    </div>
  );

  // Bar Loader
  const BarLoader = () => (
    <div className="flex space-x-1">
      {[0, 1, 2, 3, 4].map((index) => (
        <motion.div
          key={index}
          className={`${sizeStyles[size].bar} w-1.5 rounded-full ${colorStyles[color]}`}
          initial={{ height: 10 }}
          animate={{ height: [10, 30, 10] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: index * 0.1,
            ease: "easeInOut",
          }}
        ></motion.div>
      ))}
    </div>
  );

  // Render the selected loader type
  const renderLoader = () => {
    switch (type) {
      case "dots":
        return <DotsLoader />;
      case "pulse":
        return <PulseLoader />;
      case "bounce":
        return <BounceLoader />;
      case "bar":
        return <BarLoader />;
      case "spinner":
      default:
        return <SpinnerLoader />;
    }
  };

  return (
    <div className={`${containerStyles} ${className}`} {...props}>
      <div className="flex flex-col items-center">
        {renderLoader()}
        {text && (
          <p className={`mt-3 text-sm font-medium ${colorStyles[color]}`}>
            {text}
          </p>
        )}
      </div>
    </div>
  );
};

export default Loader;
