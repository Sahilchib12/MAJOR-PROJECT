import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./LandingPage.css"; // Import the CSS file
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  UserIcon,
  BriefcaseIcon,
  CheckBadgeIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline";

const LandingPage = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <motion.section
        className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-24 px-4 sm:px-6 lg:px-8"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <motion.h1
                className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                Find Your Dream Job with TalentHive
              </motion.h1>
              <motion.p
                className="text-xl mb-8 text-blue-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                Connecting talented professionals with top companies worldwide.
                Start your journey to career success today.
              </motion.p>
              <motion.div
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <Link
                  to="/jobs"
                  className="px-6 py-3 bg-white text-blue-700 rounded-lg shadow-lg font-medium hover:bg-blue-50 transition duration-300"
                >
                  <span className="flex items-center">
                    <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
                    Browse Jobs
                  </span>
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-3 bg-transparent border-2 border-white text-white rounded-lg shadow-lg font-medium hover:bg-white hover:text-blue-700 transition duration-300"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = "/register";
                  }}
                >
                  <span className="flex items-center">
                    <UserIcon className="h-5 w-5 mr-2" />
                    Sign Up
                  </span>
                </Link>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="hidden md:block"
            >
              <img
                src="https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                alt="Job search"
                className="rounded-lg shadow-2xl"
              />
            </motion.div>
          </div>
        </div>

        {/* Wave SVG */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
            className="w-full"
          >
            <path
              fill="#ffffff"
              fillOpacity="1"
              d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,138.7C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        className="py-16 px-4 sm:px-6 lg:px-8 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <p className="text-4xl font-bold text-blue-600">10K+</p>
              <p className="text-gray-600 mt-2">Active Jobs</p>
            </div>
            <div className="p-6">
              <p className="text-4xl font-bold text-blue-600">5K+</p>
              <p className="text-gray-600 mt-2">Companies</p>
            </div>
            <div className="p-6">
              <p className="text-4xl font-bold text-blue-600">25K+</p>
              <p className="text-gray-600 mt-2">Job Seekers</p>
            </div>
            <div className="p-6">
              <p className="text-4xl font-bold text-blue-600">8K+</p>
              <p className="text-gray-600 mt-2">Successful Hires</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* How It Works */}
      <motion.section
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12"
            variants={fadeIn}
          >
            How TalentHive Works
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              className="bg-white p-8 rounded-xl shadow-lg relative overflow-hidden"
              variants={fadeIn}
            >
              <div className="bg-blue-100 p-4 inline-block rounded-lg mb-6">
                <UserIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                1. Create Profile
              </h3>
              <p className="text-gray-600">
                Sign up and showcase your skills, experience, and career goals
                to stand out to employers.
              </p>
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-50 rounded-full opacity-50"></div>
            </motion.div>

            <motion.div
              className="bg-white p-8 rounded-xl shadow-lg relative overflow-hidden"
              variants={fadeIn}
            >
              <div className="bg-blue-100 p-4 inline-block rounded-lg mb-6">
                <BriefcaseIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                2. Apply for Jobs
              </h3>
              <p className="text-gray-600">
                Browse and apply to jobs that match your expertise, interests,
                and career aspirations.
              </p>
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-50 rounded-full opacity-50"></div>
            </motion.div>

            <motion.div
              className="bg-white p-8 rounded-xl shadow-lg relative overflow-hidden"
              variants={fadeIn}
            >
              <div className="bg-blue-100 p-4 inline-block rounded-lg mb-6">
                <CheckBadgeIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                3. Get Hired
              </h3>
              <p className="text-gray-600">
                Connect with recruiters, ace your interviews, and land your
                dream job with confidence.
              </p>
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-50 rounded-full opacity-50"></div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Featured Companies */}
      <motion.section
        className="py-20 px-4 sm:px-6 lg:px-8 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-4"
            variants={fadeIn}
          >
            Top Hiring Companies
          </motion.h2>
          <motion.p
            className="text-center text-gray-600 mb-12 max-w-3xl mx-auto"
            variants={fadeIn}
          >
            Join thousands of leading companies that use TalentHive to find
            exceptional talent
          </motion.p>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center justify-items-center"
            variants={staggerContainer}
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <motion.div
                key={i}
                className="grayscale hover:grayscale-0 transition duration-300"
                variants={fadeIn}
              >
                <img
                  src={`https://via.placeholder.com/150x80?text=Company${i}`}
                  alt={`Company ${i}`}
                  className="h-12"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Testimonials */}
      <motion.section
        className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12"
            variants={fadeIn}
          >
            What Our Users Say
          </motion.h2>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={staggerContainer}
          >
            <motion.div
              className="bg-white p-8 rounded-xl shadow-lg"
              variants={fadeIn}
            >
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                  <UserGroupIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Alex Johnson</h4>
                  <p className="text-gray-500 text-sm">Software Engineer</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "TalentHive helped me land my dream job at a top tech company!
                The personalized job recommendations were spot on, and the
                interview preparation resources were invaluable."
              </p>
              <div className="mt-4 flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="bg-white p-8 rounded-xl shadow-lg"
              variants={fadeIn}
            >
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                  <UserGroupIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Emily Davis</h4>
                  <p className="text-gray-500 text-sm">Marketing Manager</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "As someone transitioning to a new career field, TalentHive made
                the process so much easier. The platform's skill matching
                algorithm helped me find roles that aligned with my transferable
                skills."
              </p>
              <div className="mt-4 flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="bg-white p-8 rounded-xl shadow-lg"
              variants={fadeIn}
            >
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                  <BuildingOfficeIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Michael Brown</h4>
                  <p className="text-gray-500 text-sm">HR Director</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "From an employer perspective, TalentHive has revolutionized our
                hiring process. The quality of candidates we've found through
                the platform has been exceptional, saving us time and
                resources."
              </p>
              <div className="mt-4 flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Call to Action */}
      <motion.section
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-indigo-700 text-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-6"
            variants={fadeIn}
          >
            Ready to Take the Next Step in Your Career?
          </motion.h2>
          <motion.p
            className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto"
            variants={fadeIn}
          >
            Join thousands of professionals who have found their dream jobs
            through TalentHive. Sign up today and start your journey to success.
          </motion.p>
          <motion.div variants={fadeIn}>
            <Link
              to="/signup"
              className="px-8 py-4 bg-white text-blue-700 rounded-lg shadow-lg font-medium text-lg hover:bg-blue-50 transition duration-300 inline-block"
            >
              Get Started Now
            </Link>
          </motion.div>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
};

export default LandingPage;
