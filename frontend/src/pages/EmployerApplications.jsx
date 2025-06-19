import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  EyeIcon,
  ArrowPathIcon,
  FunnelIcon,
  CheckCircleIcon,
  XCircleIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import Navbar from "../components/Navbar";
import SimpleFooter from "../components/SimpleFooter";
import Card from "../components/Card";
import Button from "../components/Button";
import Modal from "../components/Modal";
import Input from "../components/Input";
import Alert from "../components/Alert";
import Loader from "../components/Loader";
import Pagination from "../components/Pagination";
import { employerService } from "../utils/ApiService";

const EmployerApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    status: "all", // all, pending, reviewed, rejected, accepted
    jobId: "", // filter by specific job
  });
  const [showFilters, setShowFilters] = useState(false);
  const [employerJobs, setEmployerJobs] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchApplications = async (page = 1, filters = {}) => {
    setLoading(true);
    try {
      const response = await employerService.getApplications({
        page,
        ...filters,
      });
      // console.log("Applications response:", response.data);
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

  const fetchEmployerJobs = async () => {
    try {
      const response = await employerService.getJobs({
        limit: 100, // Get all jobs for filtering
      });
      setEmployerJobs(response.data.data);
    } catch (err) {
      console.error("Error fetching employer jobs:", err);
    }
  };

  useEffect(() => {
    fetchApplications(currentPage, filters);
    fetchEmployerJobs();
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

  const handleViewDetails = (application) => {
    setSelectedApplication(application);
    setShowDetailsModal(true);
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    setActionLoading(true);
    try {
      const { data } = await employerService.updateApplicationStatus(
        applicationId,
        {
          status: newStatus.toLowerCase(),
        }
      );
      // console.log("Status update response:", data);

      // Update the application in the list
      setApplications(
        applications.map((app) =>
          app._id === applicationId ? { ...app, status: newStatus } : app
        )
      );

      setSuccess(`Application marked as ${newStatus.toLowerCase()}`);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error("Error updating application status:", err);
      setError("Failed to update application status. Please try again.");

      // Clear error message after 3 seconds
      setTimeout(() => {
        setError("");
      }, 3000);
    } finally {
      setActionLoading(false);
    }
  };

  const handleProvideFeedback = (application) => {
    setSelectedApplication(application);
    setFeedback(application.feedback || "");
    setShowFeedbackModal(true);
  };

  const handleSubmitFeedback = async () => {
    if (!selectedApplication) return;

    setActionLoading(true);
    try {
      await employerService.updateApplicationFeedback(selectedApplication._id, {
        feedback,
      });

      // Update the application in the list
      setApplications(
        applications.map((app) =>
          app._id === selectedApplication._id ? { ...app, feedback } : app
        )
      );

      setSuccess("Feedback submitted successfully");
      setShowFeedbackModal(false);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error("Error submitting feedback:", err);
      setError("Failed to submit feedback. Please try again.");

      // Clear error message after 3 seconds
      setTimeout(() => {
        setError("");
      }, 3000);
    } finally {
      setActionLoading(false);
    }
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
                Manage Applications
              </h1>
              <p className="text-gray-600 mt-2">
                Review and respond to candidates who applied to your jobs
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
            </div>
          </div>

          {error && <Alert type="error" message={error} className="mb-6" />}

          {success && (
            <Alert type="success" message={success} className="mb-6" />
          )}

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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    <option value="all">All Statuses</option>
                    <option value="applied">Applied</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="rejected">Rejected</option>
                    <option value="accepted">Accepted</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="jobId"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Job
                  </label>
                  <select
                    id="jobId"
                    name="jobId"
                    value={filters.jobId}
                    onChange={handleFilterChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">All Jobs</option>
                    {employerJobs.map((job) => (
                      <option key={job._id} value={job._id}>
                        {job.title}
                      </option>
                    ))}
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
                    {/* Application Info */}
                    <div className="flex-grow p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">
                            {application.userDetails.name}
                          </h3>
                          <p className="text-gray-600 mt-1">
                            Applied for:{" "}
                            <span className="font-medium">
                              {application.jobDetails.title}
                            </span>
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

                        <div>
                          <p className="text-sm text-gray-500">Contact</p>
                          <p className="text-gray-700">
                            {application.userDetails.email}
                          </p>
                          {application.phone && (
                            <p className="text-gray-700">
                              {application.userDetails.phone}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="mt-6 flex flex-wrap gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(application)}
                          className="flex items-center"
                        >
                          <EyeIcon className="h-4 w-4 mr-2" />
                          View Details
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleProvideFeedback(application)}
                          className="flex items-center"
                        >
                          <DocumentTextIcon className="h-4 w-4 mr-2" />
                          {application.feedback
                            ? "Edit Feedback"
                            : "Add Feedback"}
                        </Button>

                        {application.status === "applied" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleStatusChange(application._id, "Reviewed")
                            }
                            disabled={actionLoading}
                            className="flex items-center"
                          >
                            Mark as Reviewed
                          </Button>
                        )}

                        {(application.status === "applied" ||
                          application.status === "reviewed") && (
                          <>
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() =>
                                handleStatusChange(application._id, "Accepted")
                              }
                              disabled={actionLoading}
                              className="flex items-center"
                            >
                              <CheckCircleIcon className="h-4 w-4 mr-2" />
                              Accept
                            </Button>

                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() =>
                                handleStatusChange(application._id, "Rejected")
                              }
                              disabled={actionLoading}
                              className="flex items-center"
                            >
                              <XCircleIcon className="h-4 w-4 mr-2" />
                              Reject
                            </Button>
                          </>
                        )}
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
                You haven't received any applications yet. Make sure your job
                listings are active and visible to candidates.
              </p>
              <Button variant="primary" as={Link} to="/employer/jobs">
                Manage Jobs
              </Button>
            </div>
          )}
        </motion.div>
      </main>

      {/* Application Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="Application Details"
        size="lg"
      >
        {selectedApplication && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Candidate Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="text-gray-900 font-medium">
                      {selectedApplication.userDetails.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-900">
                      {selectedApplication.userDetails.email}
                    </p>
                  </div>
                  {selectedApplication.phone && (
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="text-gray-900">
                        {selectedApplication.userDetails.phone}
                      </p>
                    </div>
                  )}
                  {selectedApplication.portfolio && (
                    <div>
                      <p className="text-sm text-gray-500">Portfolio</p>
                      <a
                        href={selectedApplication.portfolio}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {selectedApplication.portfolio}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Application Details
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Applied For</p>
                    <p className="text-gray-900 font-medium">
                      {selectedApplication.jobDetails.title}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Applied On</p>
                    <p className="text-gray-900">
                      {formatDate(selectedApplication.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        selectedApplication.status
                      )}`}
                    >
                      {selectedApplication.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Resume</p>
                    <a
                      href={selectedApplication.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Resume
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Cover Letter
              </h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-gray-700 whitespace-pre-line">
                  {selectedApplication.coverLetter}
                </p>
              </div>
            </div>

            {selectedApplication.additionalInfo && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Additional Information
                </h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-gray-700 whitespace-pre-line">
                    {selectedApplication.additionalInfo}
                  </p>
                </div>
              </div>
            )}

            {selectedApplication.feedback && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Your Feedback
                </h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-gray-700 whitespace-pre-line">
                    {selectedApplication.feedback}
                  </p>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowDetailsModal(false)}
              >
                Close
              </Button>

              {(selectedApplication.status === "applied" ||
                selectedApplication.status === "reviewed") && (
                <>
                  <Button
                    variant="success"
                    onClick={() => {
                      handleStatusChange(selectedApplication._id, "Accepted");
                      setShowDetailsModal(false);
                    }}
                    disabled={actionLoading}
                  >
                    <CheckCircleIcon className="h-5 w-5 mr-2" />
                    Accept Candidate
                  </Button>

                  <Button
                    variant="danger"
                    onClick={() => {
                      handleStatusChange(selectedApplication._id, "Rejected");
                      setShowDetailsModal(false);
                    }}
                    disabled={actionLoading}
                  >
                    <XCircleIcon className="h-5 w-5 mr-2" />
                    Reject Candidate
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Feedback Modal */}
      <Modal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        title="Provide Feedback"
        size="md"
      >
        <div className="p-6">
          <p className="text-gray-600 mb-4">
            Provide feedback to the candidate about their application. This
            feedback will be visible to the candidate.
          </p>

          <div className="mb-6">
            <label
              htmlFor="feedback"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Feedback
            </label>
            <textarea
              id="feedback"
              rows={6}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter your feedback for the candidate..."
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowFeedbackModal(false)}
            >
              Cancel
            </Button>

            <Button
              variant="primary"
              onClick={handleSubmitFeedback}
              disabled={actionLoading}
            >
              Submit Feedback
            </Button>
          </div>
        </div>
      </Modal>

      <SimpleFooter />
    </div>
  );
};

export default EmployerApplications;
