import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setUser(userData);
    }
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Check if the current route is the landing page
  const isLandingPage = location.pathname === "/";

  // Determine navigation links based on user role
  const getNavLinks = () => {
    if (!user) {
      return [
        // { name: "Home", path: "/" },
        // { name: "Find Jobs", path: "/jobs" },
        // { name: "For Employers", path: "/employers" },
        // { name: "About Us", path: "/about" },
      ];
    }

    if (user.role === "jobseeker") {
      return [
        { name: "Dashboard", path: "/job-seeker-dashboard" },
        // { name: "Find Jobs", path: "/jobs" },
        { name: "My Applications", path: "/my-applications" },
        { name: "Profile", path: "/profile" },
      ];
    }

    if (user.role === "employer") {
      return [
        { name: "Dashboard", path: "/employer-dashboard" },
        { name: "Post a Job", path: "/post-job" },
        { name: "Applications", path: "/employer/applications" },
        { name: "Company Profile", path: "/employer/company-profile" },
      ];
    }

    if (user.role === "admin") {
      return [
        { name: "Admin Panel", path: "/admin-panel" },
        { name: "Users", path: "/admin-panel?tab=users" },
        { name: "Jobs", path: "/admin-panel?tab=jobs" },
        { name: "Applications", path: "/admin-panel?tab=applications" },
      ];
    }

    return [];
  };

  const navLinks = getNavLinks();

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || !isLandingPage
          ? "bg-white shadow-md py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span
              className={`text-2xl font-bold ${
                isScrolled || !isLandingPage ? "text-primary" : "text-white"
              }`}
            >
              TalentHive
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`font-medium ${
                  isScrolled || !isLandingPage
                    ? "text-gray-700 hover:text-primary"
                    : "text-white hover:text-blue-200"
                } transition-colors`}
              >
                {link.name}
              </Link>
            ))}

            {/* Auth Buttons */}
            {!user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className={`font-medium ${
                    isScrolled || !isLandingPage
                      ? "text-gray-700 hover:text-primary"
                      : "text-white hover:text-blue-200"
                  } transition-colors`}
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <UserCircleIcon
                    className={`h-6 w-6 mr-2 ${
                      isScrolled || !isLandingPage
                        ? "text-gray-700"
                        : "text-white"
                    }`}
                  />
                  <span
                    className={`font-medium ${
                      isScrolled || !isLandingPage
                        ? "text-gray-700"
                        : "text-white"
                    }`}
                  >
                    {user.name}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-red-500 hover:text-red-700 transition-colors"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5 mr-1" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className={`p-2 rounded-md ${
                isScrolled || !isLandingPage
                  ? "text-gray-700 hover:bg-gray-100"
                  : "text-white hover:bg-white/10"
              }`}
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-white border-t"
        >
          <div className="px-4 py-2 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="block py-2 text-gray-700 hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}

            {/* Auth Buttons for Mobile */}
            {!user ? (
              <div className="pt-2 border-t border-gray-200 mt-2">
                <Link
                  to="/login"
                  className="block py-2 text-gray-700 hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="block py-2 mt-2 bg-primary text-white rounded-lg text-center hover:bg-primary/90"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="pt-2 border-t border-gray-200 mt-2">
                <div className="py-2 text-gray-700">
                  <UserCircleIcon className="h-5 w-5 inline-block mr-2" />
                  {user.name}
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center py-2 text-red-500 hover:text-red-700"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5 mr-1" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
