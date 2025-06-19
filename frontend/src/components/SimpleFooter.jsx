import React from "react";
import { Link } from "react-router-dom";

const SimpleFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 py-4 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-2 md:mb-0">
            <p className="text-sm text-gray-600">
              &copy; {currentYear} TalentHive. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-6">
            <Link
              to="/privacy"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Privacy
            </Link>
            <Link
              to="/terms"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Terms
            </Link>
            <Link
              to="/help"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Help Center
            </Link>
            <Link
              to="/contact"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SimpleFooter;
