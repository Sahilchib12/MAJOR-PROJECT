import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  PlusIcon,
  FunnelIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import Navbar from "../components/Navbar";
import SimpleFooter from "../components/SimpleFooter";
import JobCard from "../components/JobCard";
import Button from "../components/Button";
import Modal from "../components/Modal";
import JobForm from "../components/JobForm";
import Alert from "../components/Alert";
import Loader from "../components/Loader";
import Pagination from "../components/Pagination";
import { employerService } from "../utils/ApiService";

const EmployerJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    status: "all", // all, active, expired
  });
  const [showFilters, setShowFilters] = useState(false);

  const fetchJobs = async (page = 1, filters = {}) => {
    setLoading(true);
    try {
      const response = await employerService.getJobs({
        page,
        ...filters,
      });
      setJobs(response.data.data);
      setTotalPages(response.data.totalPages || 1);
      setCurrentPage(response.data.currentPage || 1);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError("Failed to load jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(currentPage, filters);
  }, [currentPage, filters]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleCreateJob = (jobData) => {
    setJobs([jobData, ...jobs]);
    setShowCreateModal(false);
    setSuccess("Job created successfully!");

    // Refresh the job list to get the latest data
    fetchJobs(1, filters);

    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccess("");
    }, 3000);
  };

  const handleEditJob = (jobId) => {
    const job = jobs.find((j) => j._id === jobId);
    setEditingJob(job);
  };

  const handleUpdateJob = (updatedJob) => {
    setJobs(jobs.map((job) => (job._id === updatedJob._id ? updatedJob : job)));
    setEditingJob(null);
    setSuccess("Job updated successfully!");

    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccess("");
    }, 3000);
  };

  const handleDeleteClick = (jobId) => {
    const job = jobs.find((j) => j._id === jobId);
    setJobToDelete(job);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!jobToDelete) return;

    try {
      await employerService.deleteJob(jobToDelete._id);
      setJobs(jobs.filter((job) => job._id !== jobToDelete._id));
      setSuccess("Job deleted successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error("Error deleting job:", err);
      setError("Failed to delete job. Please try again.");

      // Clear error message after 3 seconds
      setTimeout(() => {
        setError("");
      }, 3000);
    } finally {
      setShowDeleteModal(false);
      setJobToDelete(null);
    }
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
    fetchJobs(currentPage, filters);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Jobs</h1>
              <p className="text-gray-600 mt-2">
                Create, edit, and manage your job listings
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
                onClick={() => setShowCreateModal(true)}
                className="flex items-center justify-center"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Post New Job
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
              <h3 className="font-medium text-gray-700 mb-3">Filter Jobs</h3>
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
                    <option value="all">All Jobs</option>
                    <option value="active">Active Jobs</option>
                    <option value="expired">Expired Jobs</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {loading ? (
            <div className="py-12">
              <Loader text="Loading jobs..." />
            </div>
          ) : jobs.length > 0 ? (
            <div className="space-y-6">
              {jobs.map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  showEditButton={true}
                  showDeleteButton={true}
                  onEdit={() => handleEditJob(job._id)}
                  onDelete={() => handleDeleteClick(job._id)}
                />
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
                No jobs found
              </h3>
              <p className="text-gray-600 mb-6">
                You haven't posted any jobs yet. Create your first job listing
                to attract talent.
              </p>
              <Button
                variant="primary"
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Post New Job
              </Button>
            </div>
          )}
        </motion.div>
      </main>

      {/* Create Job Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Post a New Job"
        size="lg"
      >
        <JobForm
          onSuccess={handleCreateJob}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>

      {/* Edit Job Modal */}
      <Modal
        isOpen={!!editingJob}
        onClose={() => setEditingJob(null)}
        title="Edit Job"
        size="lg"
      >
        {editingJob && (
          <JobForm
            initialData={editingJob}
            isEdit={true}
            onSuccess={handleUpdateJob}
            onCancel={() => setEditingJob(null)}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Deletion"
        size="sm"
      >
        <div className="p-4">
          <p className="text-gray-700 mb-6">
            Are you sure you want to delete the job "{jobToDelete?.title}"? This
            action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>

      <SimpleFooter />
    </div>
  );
};

export default EmployerJobs;
