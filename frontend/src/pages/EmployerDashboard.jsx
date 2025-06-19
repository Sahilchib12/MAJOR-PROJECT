import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MagnifyingGlassIcon,
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  CalendarIcon,
  UserGroupIcon,
  EyeIcon,
  BriefcaseIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SimpleFooter from "../components/SimpleFooter";
import JobForm from "../components/JobForm";
import { employerService } from "../utils/ApiService";

// Mock data for posted jobs
const MOCK_JOBS = [
  {
    id: 1,
    title: "Senior React Developer",
    applications: 12,
    views: 245,
    status: "Active",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$120,000 - $150,000",
    posted: "2023-03-15",
    description:
      "We are looking for an experienced React developer to join our team and help build our next-generation web applications.",
    requirements: [
      "5+ years of experience with React",
      "Strong knowledge of JavaScript and TypeScript",
      "Experience with state management libraries (Redux, MobX)",
      "Understanding of responsive design principles",
    ],
  },
  {
    id: 2,
    title: "UX/UI Designer",
    applications: 8,
    views: 189,
    status: "Active",
    location: "Remote",
    type: "Full-time",
    salary: "$90,000 - $110,000",
    posted: "2023-03-10",
    description:
      "Join our creative team as a UX/UI Designer to create beautiful and intuitive user interfaces for our clients.",
    requirements: [
      "3+ years of experience in UX/UI design",
      "Proficiency with design tools (Figma, Adobe XD)",
      "Portfolio showcasing your design process",
      "Experience with user research and testing",
    ],
  },
  {
    id: 3,
    title: "Backend Engineer",
    applications: 5,
    views: 120,
    status: "Active",
    location: "New York, NY",
    type: "Full-time",
    salary: "$130,000 - $160,000",
    posted: "2023-03-05",
    description:
      "We're seeking a talented Backend Engineer to develop and maintain our server infrastructure.",
    requirements: [
      "4+ years of experience in backend development",
      "Proficiency with Node.js and Python",
      "Experience with MongoDB and SQL databases",
      "Knowledge of AWS or other cloud platforms",
    ],
  },
  {
    id: 4,
    title: "Product Manager",
    applications: 15,
    views: 310,
    status: "Closed",
    location: "Boston, MA",
    type: "Full-time",
    salary: "$110,000 - $140,000",
    posted: "2023-02-20",
    description:
      "Lead our product development efforts by defining product vision, strategy, and roadmap.",
    requirements: [
      "5+ years of product management experience",
      "Strong analytical and problem-solving skills",
      "Experience with Agile methodologies",
      "Excellent communication and leadership abilities",
    ],
  },
  {
    id: 5,
    title: "DevOps Engineer",
    applications: 3,
    views: 95,
    status: "Active",
    location: "Remote",
    type: "Full-time",
    salary: "$125,000 - $155,000",
    posted: "2023-03-01",
    description:
      "Help us build and maintain our cloud infrastructure and deployment pipelines.",
    requirements: [
      "3+ years of DevOps experience",
      "Proficiency with Docker and Kubernetes",
      "Experience with CI/CD pipelines",
      "Knowledge of infrastructure as code (Terraform, CloudFormation)",
    ],
  },
];

const EmployerDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPostJobModal, setShowPostJobModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [applicants, setApplicants] = useState([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [dateFilter, setDateFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [newJob, setNewJob] = useState({
    title: "",
    companyName: "",
    location: "",
    description: "",
    skills: "",
    experience: "Entry Level",
    isActive: true,
  });

  // Get user data and fetch jobs
  useEffect(() => {
    // Get user from localStorage
    const userData = JSON.parse(localStorage.getItem("user"));
    setUser(userData);

    // Fetch jobs from API
    const fetchJobs = async () => {
      try {
        const response = await employerService.getJobs();
        setJobs(response.data.data || []);
        setFilteredJobs(response.data.data || []);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError("Failed to load jobs. Please try again.");
        // Fallback to mock data if API fails
        setJobs(MOCK_JOBS);
        setFilteredJobs(MOCK_JOBS);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Filter jobs based on search term and filters
  useEffect(() => {
    let results = jobs;

    // Apply search term filter
    if (searchTerm) {
      results = results.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply date filter
    if (dateFilter !== "all") {
      const now = new Date();
      const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
      const ninetyDaysAgo = new Date(now.setDate(now.getDate() - 90));

      results = results.filter((job) => {
        const jobDate = new Date(job.posted || job.createdAt);
        if (dateFilter === "30days") {
          return jobDate >= thirtyDaysAgo;
        } else if (dateFilter === "90days") {
          return jobDate >= ninetyDaysAgo;
        }
        return true;
      });
    }

    // Apply status filter
    if (statusFilter !== "all") {
      results = results.filter(
        (job) =>
          job.status?.toLowerCase() === statusFilter.toLowerCase() ||
          (statusFilter === "active" && job.isActive) ||
          (statusFilter === "closed" && !job.isActive)
      );
    }

    setFilteredJobs(results);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, dateFilter, statusFilter, jobs]);

  // Get current jobs for pagination
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle job creation via JobForm
  const handleCreateJob = async (jobData) => {
    try {
      // const response = await employerService.createJob(jobData);
      // Add the new job to the list
      setJobs([jobData, ...jobs]);
      setSuccess("Job created successfully!");
      setShowPostJobModal(false);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to create job. Please try again."
      );
    }
  };

  // Handle job deletion
  const handleDeleteJob = async () => {
    if (!selectedJob) return;

    try {
      await employerService.deleteJob(selectedJob._id);
      setJobs(jobs.filter((job) => job._id !== selectedJob._id));
      setFilteredJobs(
        filteredJobs.filter((job) => job._id !== selectedJob._id)
      );
      setSuccess("Job deleted successfully!");
      setShowDeleteModal(false);
      setSelectedJob(null);
    } catch (err) {
      setError("Failed to delete job. Please try again.");
    }
  };

  // Handle edit job navigation
  const handleEditJob = (job) => {
    setSelectedJob(job);
    setShowPostJobModal(true);
  };

  // Handle update job
  const handleUpdateJob = async (updatedJob) => {
    try {
      const response = await employerService.updateJob(
        selectedJob._id,
        updatedJob
      );
      setJobs(
        jobs.map((job) =>
          job._id === selectedJob._id ? response.data.data : job
        )
      );
      setFilteredJobs(
        filteredJobs.map((job) =>
          job._id === selectedJob._id ? response.data.data : job
        )
      );
      setSuccess("Job updated successfully!");
      setShowPostJobModal(false);
      setSelectedJob(null);
    } catch (err) {
      setError("Failed to update job. Please try again.");
    }
  };

  // Add this function to handle viewing job details and applicants
  const handleViewJob = async (job) => {
    setSelectedJob(job);
    setShowJobDetails(true);
    setLoadingApplicants(true);

    try {
      const response = await employerService.getJob(job._id);
      setSelectedJob(response.data.data);
      setApplicants(response.data.data.applications || []);
    } catch (err) {
      setError("Failed to load job details. Please try again.");
    } finally {
      setLoadingApplicants(false);
    }
  };

  // Add this component for the job details modal
  const JobDetailsModal = ({ job, applicants, onClose, loading }) => {
    if (!job) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">{job.title}</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <p className="flex items-center text-gray-600">
                  <BriefcaseIcon className="h-5 w-5 mr-2" />
                  {job.companyName}
                </p>
                <p className="flex items-center text-gray-600">
                  <MapPinIcon className="h-5 w-5 mr-2" />
                  {job.location}
                </p>
                <p className="flex items-center text-gray-600">
                  <CurrencyDollarIcon className="h-5 w-5 mr-2" />
                  {job.salary || "Not specified"}
                </p>
              </div>
              <div className="space-y-2">
                <p className="flex items-center text-gray-600">
                  <ClockIcon className="h-5 w-5 mr-2" />
                  Posted: {new Date(job.createdAt).toLocaleDateString()}
                </p>
                <p className="flex items-center text-gray-600">
                  <UserGroupIcon className="h-5 w-5 mr-2" />
                  {applicants.length} Applicants
                </p>
                <p className="flex items-center text-gray-600">
                  <EyeIcon className="h-5 w-5 mr-2" />
                  {job.views || 0} Views
                </p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Job Description</h3>
              <p className="text-gray-700 whitespace-pre-line">
                {job.description}
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills?.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Applicants</h3>
              {loading ? (
                <div className="text-center py-4">Loading applicants...</div>
              ) : applicants.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  No applicants yet
                </div>
              ) : (
                <div className="space-y-4">
                  {applicants.map((applicant) => (
                    <div
                      key={applicant._id}
                      className="border rounded-lg p-4 hover:bg-gray-50"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">
                            {applicant.user?.name}
                          </h4>
                          <p className="text-gray-600">
                            {applicant.user?.email}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            applicant.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : applicant.status === "accepted"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {applicant.status}
                        </span>
                      </div>
                      <div className="mt-2">
                        <a
                          href={applicant.resume}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          View Resume
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Update the job card rendering to include the view button
  const renderJobCard = (job) => (
    <div
      key={job._id}
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
          <p className="text-gray-600 mb-1">{job.companyName}</p>
          <p className="text-gray-600 mb-4">{job.location}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm ${
            job.isActive
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {job.isActive ? "Active" : "Closed"}
        </span>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center space-x-4">
          <span className="flex items-center text-gray-600">
            <UserGroupIcon className="h-5 w-5 mr-1" />
            {job.applications?.length || 0} Applicants
          </span>
          <span className="flex items-center text-gray-600">
            <EyeIcon className="h-5 w-5 mr-1" />
            {job.views || 0} Views
          </span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => handleViewJob(job)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
            title="View Details"
          >
            <EyeIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => handleEditJob(job)}
            className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-full"
            title="Edit Job"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => {
              setSelectedJob(job);
              setShowDeleteModal(true);
            }}
            className="p-2 text-red-600 hover:bg-red-50 rounded-full"
            title="Delete Job"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );

  // Add the delete confirmation modal
  const DeleteConfirmationModal = ({ onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-semibold mb-4">Delete Job</h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this job posting? This action cannot
          be undone.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* <Navbar /> */}
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-primary text-gray-700 py-6 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <Navbar />
            {user && (
              <p className="mt-10 ">
                Welcome back, {user.name}! Manage your job listings and track
                applications.
              </p>
            )}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 ">
          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"> */}
          {/* <motion.div
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-xl shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Active Jobs</p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-1">
                    {
                      jobs.filter(
                        (job) => job.isActive || job.status === "Active"
                      ).length
                    }
                  </h3>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <BriefcaseIcon className="h-6 w-6 text-primary" />
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-xl shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Applications</p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-1">
                    {jobs.reduce(
                      (total, job) =>
                        total +
                        (job.applications?.length || job.applications || 0),
                      0
                    )}
                  </h3>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <UserGroupIcon className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </motion.div> */}

          {/* <motion.div
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-xl shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Views</p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-1">
                    {jobs.reduce((total, job) => total + (job.views || 0), 0)}
                  </h3>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <EyeIcon className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </motion.div> */}
          {/* </div> */}

          {/* Job Listings Section */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
            <div className="p-6 border-b flex flex-col md:flex-row md:items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 md:mb-0">
                Your Job Listings
              </h2>
              <button
                onClick={() => {
                  setSelectedJob(null);
                  setShowPostJobModal(true);
                }}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-300/90 transition-colors"
              >
                <PlusIcon className="h-5 w-5" />
                <span>Post New Job</span>
              </button>
            </div>

            {/* Error and Success messages */}
            {error && (
              <div className="p-4 bg-red-100 text-red-700 border-l-4 border-red-500">
                {error}
              </div>
            )}
            {success && (
              <div className="p-4 bg-green-100 text-green-700 border-l-4 border-green-500">
                {success}
              </div>
            )}

            {/* Filters and Search */}
            <div className="p-4 border-b bg-gray-50">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search job titles or locations"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div className="flex flex-col md:flex-row gap-2">
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="all">All Dates</option>
                    <option value="30days">Last 30 Days</option>
                    <option value="90days">Last 90 Days</option>
                  </select>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Job Listings Table */}
            {loading ? (
              <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
                <p className="mt-2 text-gray-600">Loading jobs...</p>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-600">
                  No jobs found matching your criteria.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setDateFilter("all");
                    setStatusFilter("all");
                  }}
                  className="mt-2 text-primary hover:underline"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Job Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Posted Date
                      </th>
                      {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Applications */}
                      {/* </th> */}
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentJobs.map((job) => (
                      <motion.tr
                        key={job._id || job.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {job.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {job.location}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {job.posted ||
                              new Date(job.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        {/* <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {job.applications?.length || job.applications || 0}
                          </div>
                        </td> */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              job.status === "Active" || job.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {job.status ||
                              (job.isActive ? "Active" : "Inactive")}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                            onClick={() => handleEditJob(job)}
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-900"
                            onClick={() => {
                              setSelectedJob(job);
                              setShowDeleteModal(true);
                            }}
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="px-6 py-4 flex justify-center">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => paginate(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-md ${
                          currentPage === 1
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <ChevronLeftIcon className="h-5 w-5" />
                      </button>

                      {[...Array(totalPages)].map((_, index) => {
                        const pageNumber = index + 1;
                        return (
                          <button
                            key={pageNumber}
                            onClick={() => paginate(pageNumber)}
                            className={`px-3 py-1 rounded-md ${
                              currentPage === pageNumber
                                ? "bg-primary text-white"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      })}

                      <button
                        onClick={() =>
                          paginate(Math.min(totalPages, currentPage + 1))
                        }
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-md ${
                          currentPage === totalPages
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <ChevronRightIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Post Job Modal */}
        {showPostJobModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b sticky top-0 bg-white z-10 flex justify-between items-start">
                <h3 className="text-xl font-bold text-gray-800">
                  {selectedJob ? "Edit Job" : "Post a New Job"}
                </h3>
                <button
                  onClick={() => {
                    setShowPostJobModal(false);
                    setSelectedJob(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="p-6">
                <JobForm
                  initialData={selectedJob}
                  onSuccess={(jobData) => {
                    if (selectedJob) {
                      handleUpdateJob(jobData);
                    } else {
                      handleCreateJob(jobData);
                    }
                  }}
                  onCancel={() => {
                    setShowPostJobModal(false);
                    setSelectedJob(null);
                  }}
                  isEdit={!!selectedJob}
                />
              </div>
            </motion.div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedJob && (
          <DeleteConfirmationModal
            onConfirm={handleDeleteJob}
            onCancel={() => {
              setShowDeleteModal(false);
              setSelectedJob(null);
            }}
          />
        )}

        {/* Add JobDetailsModal */}
        {showJobDetails && (
          <JobDetailsModal
            job={selectedJob}
            applicants={applicants}
            onClose={() => {
              setShowJobDetails(false);
              setSelectedJob(null);
              setApplicants([]);
            }}
            loading={loadingApplicants}
          />
        )}
      </div>
      <SimpleFooter />
    </>
  );
};

export default EmployerDashboard;
