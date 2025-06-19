import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  EyeIcon,
  ArrowPathIcon,
  FunnelIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Navbar from "../components/Navbar";
import SimpleFooter from "../components/SimpleFooter";
import Card from "../components/Card";
import Button from "../components/Button";
import Alert from "../components/Alert";
import Loader from "../components/Loader";
import Pagination from "../components/Pagination";
import { jobseekerService, jobService } from "../utils/ApiService";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    status: "all", // all, pending, reviewed, rejected, accepted
  });
  const [showFilters, setShowFilters] = useState(false);
  // Add new state for modal
  const [selectedJob, setSelectedJob] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Function to handle opening the job details modal
  const handleViewJob = (application) => {
    setSelectedJob(application.jobDetails);
    setShowModal(true);
  };

  // Function to close modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedJob(null);
  };

  const fetchApplications = async (page = 1, filters = {}) => {
    setLoading(true);
    try {
      const response = await jobseekerService.getUserApplications({
        page,
        ...filters,
      });
      console.log("Fetched applications:", response.data.data);
      setApplications(response.data.data);
      setTotalPages(response.data.totalPages || 1);
      setCurrentPage(response.data.currentPage || 1);
    } catch (err) {
      console.error("Error fetching applications:", err);
      setError("Failed to load applications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications(currentPage, filters);
  }, [currentPage, filters]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleRefresh = () => {
    fetchApplications(currentPage, filters);
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Helper function to get status badge color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "applied":
        return "bg-yellow-100 text-yellow-800";
      case "reviewed":
        return "bg-blue-100 text-blue-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8 mt-16 pl-20 pr-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                My Applications
              </h1>
              <p className="text-gray-600 mt-2">
                Track and manage your job applications
              </p>
            </div>

            <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-center"
              >
                <FunnelIcon className="h-5 w-5 mr-2" />
                Filters
              </Button>

              <Button
                variant="outline"
                onClick={handleRefresh}
                className="flex items-center justify-center"
              >
                <ArrowPathIcon className="h-5 w-5 mr-2" />
                Refresh
              </Button>

              <Button
                variant="primary"
                as={Link}
                to="/jobs"
                className="flex items-center justify-center"
              >
                Find More Jobs
              </Button>
            </div>
          </div>

          {error && <Alert type="error" message={error} className="mb-6" />}

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white p-4 rounded-lg shadow-sm mb-6"
            >
              <h3 className="font-medium text-gray-700 mb-3">
                Filter Applications
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="all">All Applications</option>
                    <option value="applied">Applied</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="rejected">Rejected</option>
                    <option value="accepted">Accepted</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {loading ? (
            <div className="py-12">
              <Loader text="Loading applications..." />
            </div>
          ) : applications.length > 0 ? (
            <div className="space-y-6">
              {applications.map((application) => (
                <Card
                  key={application._id}
                  variant="default"
                  className="overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Job Info */}
                    <div className="flex-grow p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">
                            {application.jobDetails.title}
                          </h3>
                          <p className="text-gray-600 mt-1">
                            {application.jobDetails.companyName} •{" "}
                            {application.jobDetails.location}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            application.status
                          )}`}
                        >
                          {application.status}
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Applied on</p>
                          <p className="text-gray-700">
                            {formatDate(application.createdAt)}
                          </p>
                        </div>

                        {application.lastUpdated && (
                          <div>
                            <p className="text-sm text-gray-500">
                              Last updated
                            </p>
                            <p className="text-gray-700">
                              {formatDate(application.lastUpdated)}
                            </p>
                          </div>
                        )}
                      </div>

                      {application.feedback && (
                        <div className="mt-4">
                          <p className="text-sm text-gray-500">Feedback</p>
                          <p className="text-gray-700 mt-1">
                            {application.feedback}
                          </p>
                        </div>
                      )}

                      <div className="mt-6 flex flex-wrap gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewJob(application)}
                          className="flex items-center"
                        >
                          <EyeIcon className="h-4 w-4 mr-2" />
                          View Job
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}

              {totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No applications found
              </h3>
              <p className="text-gray-600 mb-6">
                You haven't applied to any jobs yet. Start your job search to
                find opportunities.
              </p>
              <Button variant="primary" as={Link} to="/jobs">
                Find Jobs
              </Button>
            </div>
          )}
        </motion.div>
      </main>

      {/* Job details modal */}
      <AnimatePresence>
        {showModal && selectedJob && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start p-6 border-b">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedJob.title}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {selectedJob.companyName} • {selectedJob.location}
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="p-6">
                {/* Job details content */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Salary
                    </h3>
                    <p className="text-gray-900">
                      {selectedJob.salary
                        ? String(selectedJob.salary)
                        : "Not specified"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Employment Type
                    </h3>
                    <p className="text-gray-900">
                      {selectedJob.jobType
                        ? String(selectedJob.jobType)
                        : "Not specified"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Experience Level
                    </h3>
                    <p className="text-gray-900">
                      {selectedJob.experience
                        ? String(selectedJob.experience)
                        : "Not specified"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Location
                    </h3>
                    <p className="text-gray-900">{selectedJob.location}</p>
                  </div>
                </div>

                {selectedJob.description && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Description
                    </h3>
                    <p className="text-gray-700 whitespace-pre-line">
                      {selectedJob.description}
                    </p>
                  </div>
                )}

                {selectedJob.requirements && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Requirements
                    </h3>
                    <p className="text-gray-700 whitespace-pre-line">
                      {selectedJob.requirements}
                    </p>
                  </div>
                )}

                {selectedJob.responsibilities && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Responsibilities
                    </h3>
                    <p className="text-gray-700 whitespace-pre-line">
                      {selectedJob.responsibilities}
                    </p>
                  </div>
                )}
              </div>

              <div className="p-6 border-t">
                <Button
                  variant="outline"
                  onClick={closeModal}
                  className="w-full"
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <SimpleFooter />
    </div>
  );
};

export default MyApplications;
