import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { HomeIcon } from "@heroicons/react/24/outline";

const NotFound = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <motion.div
        className="flex-grow flex flex-col items-center justify-center py-16 px-4 sm:px-6 lg:px-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-9xl font-extrabold text-blue-600">404</h1>
        </motion.div>

        <motion.h2
          className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Page Not Found
        </motion.h2>

        <motion.p
          className="text-lg text-gray-600 max-w-md mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
          >
            <HomeIcon className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
        </motion.div>

        <motion.div
          className="mt-16 relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <svg
            className="w-full max-w-lg mx-auto"
            viewBox="0 0 600 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M300 350C414.264 350 507 257.264 507 143C507 28.7359 414.264 -64 300 -64C185.736 -64 93 28.7359 93 143C93 257.264 185.736 350 300 350Z"
              fill="#F3F4F6"
            />
            <path
              d="M300 300C386.797 300 457 229.797 457 143C457 56.2029 386.797 -14 300 -14C213.203 -14 143 56.2029 143 143C143 229.797 213.203 300 300 300Z"
              fill="#E5E7EB"
            />
            <path
              d="M263 143L223 183M223 143L263 183"
              stroke="#4B5563"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <path
              d="M377 143L337 183M337 143L377 183"
              stroke="#4B5563"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <path
              d="M230 250C260 220 340 220 370 250"
              stroke="#4B5563"
              strokeWidth="10"
              strokeLinecap="round"
            />
          </svg>
        </motion.div>
      </motion.div>

      <Footer />
    </div>
  );
};

export default NotFound;
