import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MagnifyingGlassIcon,
  BriefcaseIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ClockIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon,
  DocumentIcon,
} from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";
import Navbar from "../components/Navbar";
import SimpleFooter from "../components/SimpleFooter";
import { jobseekerService, jobService } from "../utils/ApiService";
import { data } from "react-router-dom";
import ResumePreviewModal from "../components/ResumePreviewModal";

// Mock data for jobs
const MOCK_JOBS = [
  {
    id: 1,
    title: "Senior React Developer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    salary: "$120,000 - $150,000",
    type: "Full-time",
    skills: ["React", "JavaScript", "TypeScript", "Redux"],
    posted: "2 days ago",
    description:
      "We are looking for an experienced React developer to join our team and help build our next-generation web applications. The ideal candidate will have strong experience with React, Redux, and TypeScript.",
  },
  {
    id: 2,
    title: "UX/UI Designer",
    company: "DesignHub",
    location: "Remote",
    salary: "$90,000 - $110,000",
    type: "Full-time",
    skills: ["Figma", "Adobe XD", "UI Design", "User Research"],
    posted: "1 day ago",
    description:
      "Join our creative team as a UX/UI Designer to create beautiful and intuitive user interfaces for our clients. You'll be responsible for the entire design process from research to final implementation.",
  },
  {
    id: 3,
    title: "Backend Engineer",
    company: "DataSystems Ltd.",
    location: "New York, NY",
    salary: "$130,000 - $160,000",
    type: "Full-time",
    skills: ["Node.js", "Python", "MongoDB", "AWS"],
    posted: "3 days ago",
    description:
      "We're seeking a talented Backend Engineer to develop and maintain our server infrastructure. Experience with Node.js, Python, and cloud services is required.",
  },
  {
    id: 4,
    title: "Product Manager",
    company: "InnovateTech",
    location: "Boston, MA",
    salary: "$110,000 - $140,000",
    type: "Full-time",
    skills: ["Product Strategy", "Agile", "User Stories", "Roadmapping"],
    posted: "5 days ago",
    description:
      "Lead our product development efforts by defining product vision, strategy, and roadmap. You'll work closely with engineering, design, and marketing teams to deliver exceptional products.",
  },
  {
    id: 5,
    title: "DevOps Engineer",
    company: "CloudNine Solutions",
    location: "Remote",
    salary: "$125,000 - $155,000",
    type: "Full-time",
    skills: ["Docker", "Kubernetes", "CI/CD", "AWS", "Terraform"],
    posted: "1 week ago",
    description:
      "Help us build and maintain our cloud infrastructure and deployment pipelines. Strong experience with containerization, orchestration, and cloud platforms is essential.",
  },
  {
    id: 6,
    title: "Data Scientist",
    company: "AnalyticsPro",
    location: "Chicago, IL",
    salary: "$115,000 - $145,000",
    type: "Full-time",
    skills: ["Python", "Machine Learning", "SQL", "Data Visualization"],
    posted: "3 days ago",
    description:
      "Join our data science team to develop and implement machine learning models that drive business decisions. Strong analytical skills and experience with Python and ML frameworks required.",
  },
  {
    id: 7,
    title: "Frontend Developer",
    company: "WebWizards",
    location: "Austin, TX",
    salary: "$90,000 - $120,000",
    type: "Full-time",
    skills: ["JavaScript", "React", "HTML", "CSS", "Tailwind"],
    posted: "Just now",
    description:
      "Create responsive and interactive user interfaces for our web applications. Strong knowledge of modern JavaScript frameworks and CSS is required.",
  },
  {
    id: 8,
    title: "Mobile App Developer",
    company: "AppGenius",
    location: "Seattle, WA",
    salary: "$100,000 - $130,000",
    type: "Full-time",
    skills: ["React Native", "iOS", "Android", "JavaScript"],
    posted: "4 days ago",
    description:
      "Develop cross-platform mobile applications using React Native. Experience with both iOS and Android development is a plus.",
  },
  {
    id: 9,
    title: "QA Engineer",
    company: "QualityTech",
    location: "Denver, CO",
    salary: "$85,000 - $110,000",
    type: "Full-time",
    skills: ["Test Automation", "Selenium", "API Testing", "JIRA"],
    posted: "1 week ago",
    description:
      "Ensure the quality of our software products by designing and implementing test plans, test cases, and automated tests. Experience with test automation frameworks is required.",
  },
  {
    id: 10,
    title: "Technical Writer",
    company: "DocuMasters",
    location: "Remote",
    salary: "$75,000 - $95,000",
    type: "Full-time",
    skills: [
      "Technical Documentation",
      "API Documentation",
      "Markdown",
      "Content Strategy",
    ],
    posted: "2 weeks ago",
    description:
      "Create clear and concise technical documentation for our software products. Strong writing skills and the ability to explain complex technical concepts in simple terms are essential.",
  },
];

const JobSeekerDashboard = () => {
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    jobType: "",
    location: "",
    salary: "",
  });
  const [coverLetter, setCoverLetter] = useState("");
  const [showResumePreview, setShowResumePreview] = useState(false);
  const [useResume, setUseResume] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState(false);
  const [applicationError, setApplicationError] = useState("");

  // Add this function inside your component or in a separate utils file
  const getTimeAgo = (timestamp) => {
    if (!timestamp) return "Unknown date";

    const now = new Date();
    const postDate = new Date(timestamp);
    const diffTime = Math.abs(now - postDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    if (diffDays > 30) {
      const diffMonths = Math.floor(diffDays / 30);
      return diffMonths === 1 ? "1 month ago" : `${diffMonths} months ago`;
    } else if (diffDays > 0) {
      return diffDays === 1 ? "1 day ago" : `${diffDays} days ago`;
    } else if (diffHours > 0) {
      return diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`;
    } else if (diffMinutes > 0) {
      return diffMinutes === 1 ? "1 minute ago" : `${diffMinutes} minutes ago`;
    } else {
      return "Just now";
    }
  };

  // console.log(selectedJob);

  // Get user data and fetch jobs
  useEffect(() => {
    // Get user from localStorage
    const userData = JSON.parse(localStorage.getItem("user"));
    setUser(userData);

    // Simulate API call to fetch jobs
    const fetchJobs = async () => {
      try {
        const { data } = await jobService.getAllJobs();
        // console.log(data);
        setTimeout(() => {
          setJobs(data.data);
          setFilteredJobs(MOCK_JOBS);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching jobs:", error);
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
          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.skills.some((skill) =>
            skill.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    // Apply job type filter
    if (filters.jobType) {
      results = results.filter((job) => job.type === filters.jobType);
    }

    // Apply location filter
    if (filters.location) {
      results = results.filter((job) =>
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Apply salary filter
    if (filters.salary) {
      // This is a simplified example - in a real app, you'd parse the salary range
      results = results.filter((job) => job.salary.includes(filters.salary));
    }

    setFilteredJobs(results);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, filters, jobs]);

  // Get current jobs for pagination
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle job selection and apply modal
  const handleJobSelect = (job) => {
    setSelectedJob(job);
    setShowApplyModal(true);
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      jobType: "",
      location: "",
      salary: "",
    });
    setSearchTerm("");
  };

  // Get resume information
  const resumeUrl = user?.resume || null;
  const resumeName = user?.resume?.filename || "My Resume.pdf";

  // Handle resume preview
  const handleViewResume = (e) => {
    e.stopPropagation();
    setShowResumePreview(true);
  };

  // Handle navigation to profile for resume update
  const handleUpdateResume = () => {
    // Close the modal
    setShowResumePreview(false);

    // Navigate to profile page (you'll need to import useNavigate from react-router-dom)
    // const navigate = useNavigate();
    // navigate('/profile');

    // For now, just alert
    alert("To update your resume, please go to the Profile section");
  };

  // Handle application submission
  const handleSubmitApplication = async () => {
    if (!useResume) {
      alert("Please select to use your resume for this application");
      return;
    }

    setSubmitting(true);
    setApplicationError("");

    try {
      // Create application data
      const applicationData = {
        jobId: selectedJob._id || selectedJob.id,
        userId: user?._id,
        coverLetter: coverLetter,
        resume: resumeUrl, // Flag to use existing resume
      };

      // Call API to submit application
      const { data } = await jobseekerService.applyForJob(applicationData);
      console.log("Submitting application:", data);

      // Show success message
      setApplicationSuccess(true);

      // Close modal after delay
      setTimeout(() => {
        setShowApplyModal(false);
        resetApplicationForm();
      }, 2000);
    } catch (error) {
      console.error("Error submitting application:", error);
      setApplicationError(
        error.response?.data?.message ||
          "Failed to submit application. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Reset application form
  const resetApplicationForm = () => {
    setCoverLetter("");
    setUseResume(true);
    setApplicationSuccess(false);
    setApplicationError("");
  };

  // When closing application modal
  const closeApplicationModal = () => {
    setShowApplyModal(false);
    resetApplicationForm();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary text-black py-6 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <Navbar />
          {user && (
            <p className="mt-10">
              Welcome back, {user.name}! Find your perfect job match.
            </p>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Search and filter section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs, skills, or companies"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-white border rounded-xl hover:bg-gray-50"
            >
              <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-600" />
              <span className="text-gray-700">Filters</span>
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white p-4 rounded-xl shadow-md mb-4"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-gray-700">Filter Jobs</h3>
                <button
                  onClick={resetFilters}
                  className="text-sm text-primary hover:underline"
                >
                  Reset All
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Job Type
                  </label>
                  <select
                    name="jobType"
                    value={filters.jobType}
                    onChange={handleFilterChange}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="">All Types</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    placeholder="City, State, or Remote"
                    value={filters.location}
                    onChange={handleFilterChange}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Salary Range
                  </label>
                  <select
                    name="salary"
                    value={filters.salary}
                    onChange={handleFilterChange}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="">Any Salary</option>
                    <option value="$50,000">$50,000+</option>
                    <option value="$75,000">$75,000+</option>
                    <option value="$100,000">$100,000+</option>
                    <option value="$125,000">$125,000+</option>
                    <option value="$150,000">$150,000+</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Job listings */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold text-gray-800">
              {filteredJobs.length} Jobs Found
            </h2>
          </div>

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
                onClick={resetFilters}
                className="mt-2 text-primary hover:underline"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div>
              {currentJobs.map((job) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="p-6 border-b hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => handleJobSelect(job)}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="mb-4 md:mb-0">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {job.title}
                      </h3>
                      <p className="text-gray-600 mt-1">{job.companyName}</p>
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
                        <span className="flex items-center">
                          <MapPinIcon className="h-4 w-4 mr-1" />
                          {job.location}
                        </span>
                        <span className="flex items-center">
                          <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                          {job.salary}
                        </span>
                        <span className="flex items-center">
                          <BriefcaseIcon className="h-4 w-4 mr-1" />
                          {job.jobType}
                        </span>
                        <span className="flex items-center">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          {job.createdAt
                            ? getTimeAgo(job.createdAt)
                            : "Recently posted"}
                        </span>
                      </div>
                    </div>
                    <div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleJobSelect(job);
                        }}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-400/90 transition-colors"
                      >
                        Apply Now
                      </button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="p-4 flex justify-center">
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
                      // Show limited page numbers with ellipsis
                      if (
                        pageNumber === 1 ||
                        pageNumber === totalPages ||
                        (pageNumber >= currentPage - 1 &&
                          pageNumber <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={pageNumber}
                            onClick={() => paginate(pageNumber)}
                            className={`px-3 py-1 rounded-md ${
                              currentPage === pageNumber
                                ? "bg-primary text-gray-700"
                                : "text-gray-400 hover:bg-gray-100"
                            }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      } else if (
                        pageNumber === currentPage - 2 ||
                        pageNumber === currentPage + 2
                      ) {
                        return <span key={pageNumber}>...</span>;
                      }
                      return null;
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

      {/* Job Application Modal */}
      {showApplyModal && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b sticky top-0 bg-white z-10 flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  {selectedJob.title}
                </h3>
                <p className="text-gray-600">
                  {selectedJob.companyName} • {selectedJob.location}
                </p>
              </div>
              <button
                onClick={closeApplicationModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-2">Job Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <BriefcaseIcon className="h-5 w-5 text-gray-500 mr-2" />
                    <span>
                      <span className="font-medium">Job Type:</span>{" "}
                      {selectedJob.jobType}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <CurrencyDollarIcon className="h-5 w-5 text-gray-500 mr-2" />
                    <span>
                      <span className="font-medium">Salary:</span>{" "}
                      {selectedJob.salary}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="h-5 w-5 text-gray-500 mr-2" />
                    <span>
                      <span className="font-medium">Posted:</span>{" "}
                      {selectedJob.createdAt
                        ? getTimeAgo(selectedJob.createdAt)
                        : "Recently posted"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-2">Job Description</h4>
                <p className="text-gray-700">{selectedJob.description}</p>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-2">Required Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedJob.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="text-lg font-semibold mb-4">
                  Apply for this position
                </h4>

                {applicationSuccess && (
                  <div className="p-3 bg-green-100 text-green-800 rounded-lg mb-4">
                    Application submitted successfully! The employer will review
                    your application.
                  </div>
                )}

                {applicationError && (
                  <div className="p-3 bg-red-100 text-red-800 rounded-lg mb-4">
                    {applicationError}
                  </div>
                )}

                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cover Letter (Optional)
                    </label>
                    <textarea
                      rows="4"
                      placeholder="Tell us why you're a great fit for this role..."
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                    ></textarea>
                  </div>

                  {/* Resume Section */}
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="font-medium text-gray-800">Your Resume</h5>
                      <button
                        type="button"
                        onClick={handleViewResume}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        View Resume
                      </button>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center">
                        <DocumentIcon className="h-6 w-6 text-gray-500" />
                      </div>
                      <div className="flex-grow">
                        <p className="text-sm font-medium text-gray-700">
                          {resumeName}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          This resume was uploaded during your profile setup. To
                          update your resume, please go to your profile
                          settings.
                        </p>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="use-resume"
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                          checked={useResume}
                          onChange={(e) => setUseResume(e.target.checked)}
                        />
                        <label
                          htmlFor="use-resume"
                          className="ml-2 block text-sm text-gray-700"
                        >
                          Use this resume for my application
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={closeApplicationModal}
                      className="px-4 py-2 border border-gray-400 rounded-lg text-gray-700 hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmitApplication}
                      disabled={submitting}
                      className={`px-4 py-2 ${
                        submitting
                          ? "bg-gray-300"
                          : "bg-blue-700 hover:bg-blue-400/90"
                      } text-white rounded-lg flex items-center justify-center`}
                    >
                      {submitting ? (
                        <>
                          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Submitting...
                        </>
                      ) : (
                        "Submit Application"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Resume Preview Modal - using our new component */}
      <ResumePreviewModal
        isOpen={showResumePreview}
        onClose={() => setShowResumePreview(false)}
        resumeUrl={resumeUrl}
        resumeName={resumeName}
        canUpdate={true}
        onUpdateClick={handleUpdateResume}
      />

      <SimpleFooter />
    </div>
  );
};

export default JobSeekerDashboard;
