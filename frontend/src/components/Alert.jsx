import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const Alert = ({
  type = "info",
  title = null,
  message,
  icon = true,
  dismissible = true,
  autoClose = false,
  autoCloseTime = 5000,
  onClose = () => {},
  className = "",
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(true);

  // Auto close functionality
  useEffect(() => {
    if (autoClose && isVisible) {
      const timer = setTimeout(() => {
        handleClose();
      }, autoCloseTime);

      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseTime, isVisible]);

  // Handle close
  const handleClose = () => {
    setIsVisible(false);
    onClose();
  };

  // Alert type configurations
  const alertConfig = {
    success: {
      icon: <CheckCircleIcon className="h-5 w-5" />,
      bgColor: "bg-green-50",
      borderColor: "border-green-400",
      textColor: "text-green-800",
      iconColor: "text-green-400",
    },
    error: {
      icon: <XCircleIcon className="h-5 w-5" />,
      bgColor: "bg-red-50",
      borderColor: "border-red-400",
      textColor: "text-red-800",
      iconColor: "text-red-400",
    },
    warning: {
      icon: <ExclamationTriangleIcon className="h-5 w-5" />,
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-400",
      textColor: "text-yellow-800",
      iconColor: "text-yellow-400",
    },
    info: {
      icon: <InformationCircleIcon className="h-5 w-5" />,
      bgColor: "bg-blue-50",
      borderColor: "border-blue-400",
      textColor: "text-blue-800",
      iconColor: "text-blue-400",
    },
  };

  // Get the selected alert configuration
  const selectedAlert = alertConfig[type];

  // Animation variants
  const alertVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`rounded-md border-l-4 p-4 ${selectedAlert.bgColor} ${selectedAlert.borderColor} ${className}`}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={alertVariants}
          {...props}
        >
          <div className="flex items-start">
            {icon && (
              <div className={`flex-shrink-0 ${selectedAlert.iconColor}`}>
                {selectedAlert.icon}
              </div>
            )}
            <div className={`ml-3 flex-1 ${!icon ? "ml-0" : ""}`}>
              {title && (
                <h3
                  className={`text-sm font-medium ${selectedAlert.textColor}`}
                >
                  {title}
                </h3>
              )}
              <div
                className={`text-sm ${selectedAlert.textColor} ${
                  title ? "mt-2" : ""
                }`}
              >
                {message}
              </div>
            </div>
            {dismissible && (
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                  <button
                    type="button"
                    className={`inline-flex rounded-md p-1.5 ${selectedAlert.bgColor} ${selectedAlert.textColor} hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-${type}-50 focus:ring-${type}-500`}
                    onClick={handleClose}
                    aria-label="Dismiss"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Alert;
