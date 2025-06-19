import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Navbar from "../components/Navbar";
import SimpleFooter from "../components/SimpleFooter";
import JobCard from "../components/JobCard";
import Button from "../components/Button";
import Input from "../components/Input";
import Modal from "../components/Modal";
import JobApplicationForm from "../components/JobApplicationForm";
import Alert from "../components/Alert";
import Loader from "../components/Loader";
import Pagination from "../components/Pagination";
import { jobService } from "../utils/ApiService";

const JobSearch = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    location: "",
    type: "",
    category: "",
    experience: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);

  const fetchJobs = async (page = 1, query = "", filters = {}) => {
    setLoading(true);
    try {
      const response = await jobService.getAllJobs({
        page,
        query,
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
    fetchJobs(currentPage, searchQuery, filters);
  }, [currentPage]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchJobs(1, searchQuery, filters);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleApplyFilters = () => {
    setCurrentPage(1);
    fetchJobs(1, searchQuery, filters);
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    setFilters({
      location: "",
      type: "",
      category: "",
      experience: "",
    });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleApplyClick = (jobId) => {
    const job = jobs.find((j) => j._id === jobId);
    setSelectedJob(job);
    setShowApplicationModal(true);
  };

  const handleApplicationSuccess = () => {
    setShowApplicationModal(false);
    setSuccess(`Successfully applied to ${selectedJob.title}!`);

    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccess("");
    }, 3000);
  };

  // Job categories for filter dropdown
  const jobCategories = [
    "Technology",
    "Healthcare",
    "Finance",
    "Education",
    "Marketing",
    "Sales",
    "Customer Service",
    "Administrative",
    "Engineering",
    "Design",
    "Legal",
    "Human Resources",
    "Other",
  ];

  // Job types for filter dropdown
  const jobTypes = [
    "Full-time",
    "Part-time",
    "Contract",
    "Temporary",
    "Internship",
    "Remote",
  ];

  // Experience levels for filter dropdown
  const experienceLevels = [
    "Entry Level",
    "Mid Level",
    "Senior Level",
    "Manager",
    "Director",
    "Executive",
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Find Your Dream Job
            </h1>
            <p className="text-gray-600 mt-2">
              Search through thousands of job listings to find the perfect match
              for your skills
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <form
              onSubmit={handleSearch}
              className="flex flex-col md:flex-row gap-3"
            >
              <div className="flex-grow">
                <Input
                  type="text"
                  placeholder="Job title, keywords, or company"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  }
                  className="w-full"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center justify-center"
                >
                  <FunnelIcon className="h-5 w-5 mr-2" />
                  Filters
                </Button>

                <Button
                  type="submit"
                  variant="primary"
                  className="flex-shrink-0"
                >
                  Search
                </Button>
              </div>
            </form>
          </div>

          {/* Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white p-6 rounded-lg shadow-sm mb-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-gray-900">Filter Jobs</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Location
                  </label>
                  <Input
                    id="location"
                    name="location"
                    type="text"
                    placeholder="City, state, or remote"
                    value={filters.location}
                    onChange={handleFilterChange}
                  />
                </div>

                <div>
                  <label
                    htmlFor="type"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Job Type
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={filters.type}
                    onChange={handleFilterChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">All Types</option>
                    {jobTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">All Categories</option>
                    {jobCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="experience"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Experience Level
                  </label>
                  <select
                    id="experience"
                    name="experience"
                    value={filters.experience}
                    onChange={handleFilterChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">All Levels</option>
                    {experienceLevels.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={handleClearFilters}>
                  Clear Filters
                </Button>
                <Button variant="primary" onClick={handleApplyFilters}>
                  Apply Filters
                </Button>
              </div>
            </motion.div>
          )}

          {error && <Alert type="error" message={error} className="mb-6" />}

          {success && (
            <Alert type="success" message={success} className="mb-6" />
          )}

          {/* Active Filters Display */}
          {Object.values(filters).some((value) => value) && (
            <div className="mb-6 flex flex-wrap gap-2">
              {Object.entries(filters).map(([key, value]) => {
                if (!value) return null;
                return (
                  <div
                    key={key}
                    className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center"
                  >
                    <span className="capitalize">
                      {key}: {value}
                    </span>
                    <button
                      onClick={() => {
                        setFilters((prev) => ({
                          ...prev,
                          [key]: "",
                        }));
                        // Re-fetch with updated filters
                        fetchJobs(1, searchQuery, {
                          ...filters,
                          [key]: "",
                        });
                      }}
                      className="ml-2 text-blue-500 hover:text-blue-700"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
              <button
                onClick={() => {
                  handleClearFilters();
                  fetchJobs(1, searchQuery, {
                    location: "",
                    type: "",
                    category: "",
                    experience: "",
                  });
                }}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Job Results */}
          {loading ? (
            <div className="py-12">
              <Loader text="Searching for jobs..." />
            </div>
          ) : jobs.length > 0 ? (
            <div>
              <p className="text-gray-600 mb-4">
                Found {jobs.length} job{jobs.length !== 1 ? "s" : ""} matching
                your criteria
              </p>

              <div className="space-y-6">
                {jobs.map((job) => (
                  <JobCard
                    key={job._id}
                    job={job}
                    showApplyButton={true}
                    onApply={() => handleApplyClick(job._id)}
                  />
                ))}
              </div>

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
              <p className="text-gray-600">
                Try adjusting your search criteria or removing some filters.
              </p>
            </div>
          )}
        </motion.div>
      </main>

      {/* Job Application Modal */}
      <Modal
        isOpen={showApplicationModal}
        onClose={() => setShowApplicationModal(false)}
        title={`Apply to ${selectedJob?.title || "Job"}`}
        size="lg"
      >
        {selectedJob && (
          <div className="p-4">
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900">
                {selectedJob.title}
              </h3>
              <p className="text-gray-600">
                {selectedJob.company} • {selectedJob.location}
              </p>
            </div>

            <JobApplicationForm
              jobId={selectedJob._id}
              onSuccess={handleApplicationSuccess}
              onCancel={() => setShowApplicationModal(false)}
            />
          </div>
        )}
      </Modal>

      <SimpleFooter />
    </div>
  );
};

export default JobSearch;
