import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeftIcon,
  PencilIcon,
  EyeIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import Navbar from "../../components/Navbar";
import SimpleFooter from "../../components/SimpleFooter";
import Button from "../../components/Button";
import Alert from "../../components/Alert";
import Loader from "../../components/Loader";
import Modal from "../../components/Modal";
import JobForm from "../../components/JobForm";
import JobApplications from "../../components/JobApplications";
import { employerService } from "../../utils/ApiService";

const EmployerJobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState("details"); // details or applications

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      try {
        const response = await employerService.getJob(id);
        setJob(response.data.data);
      } catch (err) {
        console.error("Error fetching job:", err);
        setError(
          err.response?.data?.message ||
            "Failed to load job details. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleUpdateJob = async (updatedJobData) => {
    try {
      const response = await employerService.updateJob(id, updatedJobData);
      setJob(response.data.data);
      setSuccess("Job updated successfully!");
      setShowEditModal(false);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update job. Please try again."
      );
    }
  };

  const handleStatusUpdate = async () => {
    // Refresh job data to get updated applications
    try {
      const response = await employerService.getJob(id);
      setJob(response.data.data);
      setSuccess("Application status updated successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to refresh job data. Please try again."
      );
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        {loading ? (
          <div className="py-16 text-center">
            <Loader text="Loading job details..." />
          </div>
        ) : error ? (
          <div className="py-16 max-w-3xl mx-auto">
            <Alert type="error" message={error} />
            <div className="mt-8 text-center">
              <Button variant="outline" onClick={() => navigate(-1)}>
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Go Back
              </Button>
            </div>
          </div>
        ) : job ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header with back button */}
            <div className="mb-6 flex items-center">
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
                className="mr-4"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Back
              </Button>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex-1">
                {job.title}
              </h1>
              <Button
                variant="outline"
                onClick={() => setShowEditModal(true)}
                className="ml-4"
              >
                <PencilIcon className="h-5 w-5 mr-2" />
                Edit Job
              </Button>
            </div>

            {success && (
              <Alert type="success" message={success} className="mb-6" />
            )}

            {/* Tabs */}
            <div className="mb-6 border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab("details")}
                  className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "details"
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <EyeIcon className="h-5 w-5 mr-2 inline-block" />
                  Job Details
                </button>
                <button
                  onClick={() => setActiveTab("applications")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === "applications"
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <UserGroupIcon className="h-5 w-5 mr-2" />
                  Applications
                  {job.applications && job.applications.length > 0 && (
                    <span className="ml-2 bg-primary text-white text-xs rounded-full px-2 py-1">
                      {job.applications.length}
                    </span>
                  )}
                </button>
              </nav>
            </div>

            {/* Content based on active tab */}
            {activeTab === "details" ? (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Main content */}
                  <div className="lg:col-span-2">
                    <div className="mb-6">
                      <h2 className="text-lg font-medium text-gray-900 mb-4">
                        Job Description
                      </h2>
                      <div className="prose prose-blue max-w-none">
                        <p className="whitespace-pre-line">{job.description}</p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h2 className="text-lg font-medium text-gray-900 mb-4">
                        Required Skills
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        {job.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Sidebar */}
                  <div className="lg:col-span-1">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Job Overview
                      </h3>
                      <ul className="space-y-4">
                        <li className="flex items-start">
                          <span className="w-32 text-sm text-gray-500">
                            Company:
                          </span>
                          <span className="flex-1 text-sm font-medium">
                            {job.companyName}
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="w-32 text-sm text-gray-500">
                            Location:
                          </span>
                          <span className="flex-1 text-sm">{job.location}</span>
                        </li>
                        <li className="flex items-start">
                          <span className="w-32 text-sm text-gray-500">
                            Experience:
                          </span>
                          <span className="flex-1 text-sm">
                            {job.experience}
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="w-32 text-sm text-gray-500">
                            Posted On:
                          </span>
                          <span className="flex-1 text-sm">
                            {formatDate(job.createdAt)}
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="w-32 text-sm text-gray-500">
                            Status:
                          </span>
                          <span
                            className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                              job.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {job.isActive ? "Active" : "Inactive"}
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="w-32 text-sm text-gray-500">
                            Applications:
                          </span>
                          <span className="flex-1 text-sm font-medium">
                            {job.applications?.length || 0} applications
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <JobApplications job={job} onStatusUpdate={handleStatusUpdate} />
            )}
          </motion.div>
        ) : (
          <div className="py-16 text-center">
            <p className="text-gray-600 mb-8">Job not found</p>
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Go Back
            </Button>
          </div>
        )}
      </main>

      {/* Edit Job Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Job"
        size="lg"
      >
        <JobForm
          initialData={job}
          isEdit={true}
          onSuccess={handleUpdateJob}
          onCancel={() => setShowEditModal(false)}
        />
      </Modal>

      <SimpleFooter />
    </div>
  );
};

export default EmployerJobDetail;
