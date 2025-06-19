import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  UserIcon,
  DocumentTextIcon,
  PhoneIcon,
  MapPinIcon,
  BriefcaseIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import SimpleFooter from "../components/SimpleFooter";
import Navbar from "../components/Navbar";
import { authService, employerService } from "../utils/ApiService";
import axios from "axios";
import { completeProfileRoute } from "../utils/ApiRoutes";

const CompleteProfile = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState("jobseeker");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const [resumeFile, setResumeFile] = useState(null);

  const [formData, setFormData] = useState({
    // Common fields
    phone: "",
    location: "",

    // Employer fields
    companyName: "",
    industry: "",
    companySize: "",
    companyDescription: "",
  });

  useEffect(() => {
    // Get user data from localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.role) {
      setUserRole(user.role);
    } else {
      // Redirect to login if no user data
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setError("File size exceeds 5MB limit");
        return;
      }
      setResumeFile(file);
      setError("");
    }
  };

  // This function only handles the actual profile submission
  const submitProfile = async () => {
    setLoading(true);
    setError("");

    try {
      // Create form data for file upload and profile information
      const fdata = new FormData();

      // Add all form fields
      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          fdata.append(key, formData[key]);
        }
      });

      // Add resume file if job seeker
      if (userRole === "jobseeker" && resumeFile) {
        fdata.append("file", resumeFile);
        console.log(resumeFile);
      }

      // Different API calls based on user role
      if (userRole === "jobseeker") {
        const { data } = await axios.post(completeProfileRoute, fdata, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        });
        navigate("/job-seeker-dashboard");
      } else {
        // For employer, submit company profile data
        const companyData = {
          companyName: formData.companyName,
          industry: formData.industry,
          companySize: formData.companySize,
          description: formData.companyDescription,
          location: formData.location,
          phone: formData.phone,
        };

        await authService.completeProfile(companyData);
        navigate("/employer-dashboard");
      }
    } catch (err) {
      console.error("Profile completion error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to complete profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // This is now just preventing the default form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Don't do anything else here - prevents auto-submission
  };

  // This function will be called when "Complete Profile" button is clicked
  const handleCompleteProfile = () => {
    if (validateStep()) {
      submitProfile();
    }
  };

  const validateStep = () => {
    if (step === 1) {
      if (!formData.phone || !formData.location) {
        setError("Please fill in all required fields");
        return false;
      }
    } else if (step === 2) {
      if (userRole === "employer") {
        if (
          !formData.companyName ||
          !formData.industry ||
          !formData.companySize ||
          !formData.companyDescription
        ) {
          setError("Please fill in all required fields");
          return false;
        }
      } else if (userRole === "jobseeker" && !resumeFile) {
        setError("Please upload your resume");
        return false;
      }
    }

    setError("");
    return true;
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 mt-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="bg-primary py-6 px-8">
            <h2 className="text-2xl font-bold text-black">
              Complete Your Profile
            </h2>
            <p className="text-black-100 mt-1">
              {userRole === "jobseeker"
                ? "Help us match you with the perfect job opportunities"
                : "Set up your company profile to start posting jobs"}
            </p>

            {/* Progress indicator */}
            <div className="mt-6 flex items-center">
              <div
                className={`h-2 rounded-full flex-1 ${
                  step >= 1 ? "bg-blue-700" : "bg-blue-300"
                }`}
              ></div>
              <div className="mx-2"></div>
              <div
                className={`h-2 rounded-full flex-1 ${
                  step >= 2 ? "bg-blue-700" : "bg-blue-300"
                }`}
              ></div>
            </div>
          </div>

          <div className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Step 1: Basic Information (Common for both roles) */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">
                    Basic Information
                  </h3>

                  <div className="space-y-5">
                    <div className="relative">
                      <PhoneIcon className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>

                    <div className="relative">
                      <MapPinIcon className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="location"
                        placeholder="Location (City, Country)"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Role-specific information */}
              {step === 2 && userRole === "employer" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">
                    Company Information
                  </h3>

                  <div className="space-y-5">
                    <div className="relative">
                      <BriefcaseIcon className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="companyName"
                        placeholder="Company Name"
                        value={formData.companyName}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>

                    <div className="relative">
                      <TagIcon className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="industry"
                        placeholder="Industry (e.g., Technology, Healthcare)"
                        value={formData.industry}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>

                    <div className="relative">
                      <UserIcon className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <select
                        name="companySize"
                        value={formData.companySize}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent appearance-none bg-white"
                        required
                      >
                        <option value="">Company Size</option>
                        <option value="1-10">1-10 employees</option>
                        <option value="11-50">11-50 employees</option>
                        <option value="51-200">51-200 employees</option>
                        <option value="201-500">201-500 employees</option>
                        <option value="501+">501+ employees</option>
                      </select>
                    </div>

                    <div className="relative">
                      <textarea
                        name="companyDescription"
                        placeholder="Brief company description"
                        value={formData.companyDescription}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                        rows="4"
                        required
                      ></textarea>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Resume Upload (Job Seekers Only) */}
              {step === 2 && userRole === "jobseeker" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">
                    Upload Resume
                  </h3>

                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                    <DocumentTextIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />

                    <h4 className="text-lg font-medium text-gray-700 mb-2">
                      {resumeFile
                        ? resumeFile.name
                        : "Drag & drop your resume here"}
                    </h4>

                    <p className="text-sm text-gray-500 mb-4">
                      Supported formats: PDF, DOCX, DOC (Max 5MB)
                    </p>

                    <input
                      type="file"
                      id="resume"
                      name="resume"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    <label
                      htmlFor="resume"
                      className="inline-block px-6 py-2 bg-primary text-gray-700 rounded-lg cursor-pointer hover:bg-primary/90 transition-colors"
                    >
                      {resumeFile ? "Change File" : "Select File"}
                    </label>
                  </div>
                </motion.div>
              )}

              {/* Navigation buttons */}
              <div className="mt-8 flex justify-between">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Back
                  </button>
                ) : (
                  <div></div>
                )}

                {(userRole === "jobseeker" && step < 2) ||
                (userRole === "employer" && step < 2) ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-2 bg-primary border border-gray-300 text-black rounded-lg hover:bg-gray-50"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleCompleteProfile}
                    disabled={loading}
                    className="px-6 py-2 bg-primary border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center"
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700"
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
                        Processing...
                      </>
                    ) : (
                      "Complete Profile"
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </motion.div>
      </div>
      <SimpleFooter />
    </div>
  );
};

export default CompleteProfile;
