import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  UserIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EnvelopeIcon,
  ChartBarIcon,
  EyeIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

// Mock data for admin dashboard
const MOCK_STATS = {
  totalUsers: 1250,
  totalJobs: 450,
  totalEmployers: 120,
  totalApplications: 3200,
  newUsersToday: 25,
  newJobsToday: 12,
  userGrowth: 15, // percentage
  jobGrowth: 8, // percentage
  applicationGrowth: -3, // percentage
  recentUsers: [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "jobseeker",
      joinedAt: "2023-03-15T10:30:00",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "employer",
      joinedAt: "2023-03-15T09:45:00",
    },
    {
      id: 3,
      name: "Robert Johnson",
      email: "robert@example.com",
      role: "jobseeker",
      joinedAt: "2023-03-14T16:20:00",
    },
    {
      id: 4,
      name: "Emily Davis",
      email: "emily@example.com",
      role: "employer",
      joinedAt: "2023-03-14T14:10:00",
    },
    {
      id: 5,
      name: "Michael Wilson",
      email: "michael@example.com",
      role: "jobseeker",
      joinedAt: "2023-03-14T11:05:00",
    },
  ],
  recentJobs: [
    {
      id: 1,
      title: "Senior React Developer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      postedAt: "2023-03-15T11:20:00",
    },
    {
      id: 2,
      title: "UX/UI Designer",
      company: "DesignHub",
      location: "Remote",
      postedAt: "2023-03-15T10:15:00",
    },
    {
      id: 3,
      title: "Backend Engineer",
      company: "DataSystems Ltd.",
      location: "New York, NY",
      postedAt: "2023-03-14T16:45:00",
    },
    {
      id: 4,
      title: "Product Manager",
      company: "InnovateTech",
      location: "Boston, MA",
      postedAt: "2023-03-14T14:30:00",
    },
    {
      id: 5,
      title: "DevOps Engineer",
      company: "CloudNine Solutions",
      location: "Remote",
      postedAt: "2023-03-14T09:50:00",
    },
  ],
  popularJobCategories: [
    { name: "Software Development", count: 120, percentage: 26.7 },
    { name: "Design", count: 85, percentage: 18.9 },
    { name: "Marketing", count: 65, percentage: 14.4 },
    { name: "Data Science", count: 55, percentage: 12.2 },
    { name: "Project Management", count: 45, percentage: 10.0 },
    { name: "Others", count: 80, percentage: 17.8 },
  ],
  monthlyApplications: [
    { month: "Jan", count: 210 },
    { month: "Feb", count: 250 },
    { month: "Mar", count: 320 },
    { month: "Apr", count: 290 },
    { month: "May", count: 350 },
    { month: "Jun", count: 410 },
    { month: "Jul", count: 390 },
    { month: "Aug", count: 420 },
    { month: "Sep", count: 480 },
    { month: "Oct", count: 520 },
    { month: "Nov", count: 490 },
    { month: "Dec", count: 550 },
  ],
};

const AdminPanel = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    // Simulate API call to fetch admin stats
    setTimeout(() => {
      setStats(MOCK_STATS);
      setLoading(false);
    }, 1000);
  }, []);

  // Format date to readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary text-white py-6 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
          <p className="mt-2">
            Welcome to the admin panel. Monitor and manage your job portal.
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8 border-b">
          <div className="flex flex-wrap -mb-px">
            <button
              className={`mr-4 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "overview"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </button>
            <button
              className={`mr-4 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "users"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("users")}
            >
              Users
            </button>
            <button
              className={`mr-4 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "jobs"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("jobs")}
            >
              Jobs
            </button>
            <button
              className={`mr-4 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "applications"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("applications")}
            >
              Applications
            </button>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-xl shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Users</p>
                    <h3 className="text-2xl font-bold text-gray-800 mt-1">
                      {stats.totalUsers.toLocaleString()}
                    </h3>
                    <div className="flex items-center mt-2">
                      <span
                        className={`flex items-center text-xs ${
                          stats.userGrowth >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {stats.userGrowth >= 0 ? (
                          <ArrowTrendingUpIcon className="h-3 w-3 mr-1" />
                        ) : (
                          <ArrowTrendingDownIcon className="h-3 w-3 mr-1" />
                        )}
                        {Math.abs(stats.userGrowth)}% this month
                      </span>
                    </div>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <UserIcon className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-xl shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Jobs</p>
                    <h3 className="text-2xl font-bold text-gray-800 mt-1">
                      {stats.totalJobs.toLocaleString()}
                    </h3>
                    <div className="flex items-center mt-2">
                      <span
                        className={`flex items-center text-xs ${
                          stats.jobGrowth >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {stats.jobGrowth >= 0 ? (
                          <ArrowTrendingUpIcon className="h-3 w-3 mr-1" />
                        ) : (
                          <ArrowTrendingDownIcon className="h-3 w-3 mr-1" />
                        )}
                        {Math.abs(stats.jobGrowth)}% this month
                      </span>
                    </div>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <BriefcaseIcon className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-xl shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Employers</p>
                    <h3 className="text-2xl font-bold text-gray-800 mt-1">
                      {stats.totalEmployers.toLocaleString()}
                    </h3>
                    <div className="flex items-center mt-2">
                      <span className="flex items-center text-xs text-gray-500">
                        {(
                          (stats.totalEmployers / stats.totalUsers) *
                          100
                        ).toFixed(1)}
                        % of users
                      </span>
                    </div>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <BuildingOfficeIcon className="h-6 w-6 text-purple-600" />
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
                      {stats.totalApplications.toLocaleString()}
                    </h3>
                    <div className="flex items-center mt-2">
                      <span
                        className={`flex items-center text-xs ${
                          stats.applicationGrowth >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {stats.applicationGrowth >= 0 ? (
                          <ArrowTrendingUpIcon className="h-3 w-3 mr-1" />
                        ) : (
                          <ArrowTrendingDownIcon className="h-3 w-3 mr-1" />
                        )}
                        {Math.abs(stats.applicationGrowth)}% this month
                      </span>
                    </div>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-full">
                    <EnvelopeIcon className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Charts and Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Monthly Applications Chart */}
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Monthly Applications
                </h3>
                <div className="h-64 flex items-end space-x-2">
                  {stats.monthlyApplications.map((month) => {
                    const maxCount = Math.max(
                      ...stats.monthlyApplications.map((m) => m.count)
                    );
                    const height = (month.count / maxCount) * 100;
                    return (
                      <div
                        key={month.month}
                        className="flex-1 flex flex-col items-center"
                      >
                        <div className="w-full flex justify-center">
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${height}%` }}
                            transition={{ duration: 1, delay: 0.1 }}
                            className="w-5/6 bg-primary rounded-t-md"
                          ></motion.div>
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                          {month.month}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Job Categories */}
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Popular Job Categories
                </h3>
                <div className="space-y-4">
                  {stats.popularJobCategories.map((category) => (
                    <div key={category.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700">{category.name}</span>
                        <span className="text-gray-500">
                          {category.count} jobs ({category.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${category.percentage}%` }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className="bg-primary h-2 rounded-full"
                        ></motion.div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
              {/* Recent Users */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-4 border-b flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Recent Users
                  </h3>
                  <span className="text-sm text-primary">
                    {stats.newUsersToday} new today
                  </span>
                </div>
                <div className="divide-y">
                  {stats.recentUsers.map((user) => (
                    <div key={user.id} className="p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="bg-gray-100 p-2 rounded-full mr-3">
                            <UserIcon className="h-5 w-5 text-gray-500" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">
                              {user.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {user.email}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span
                            className={`inline-block px-2 py-1 text-xs rounded-full ${
                              user.role === "jobseeker"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {user.role === "jobseeker"
                              ? "Job Seeker"
                              : "Employer"}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            <ClockIcon className="inline-block h-3 w-3 mr-1" />
                            {formatDate(user.joinedAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t bg-gray-50">
                  <button className="text-sm text-primary hover:underline">
                    View All Users
                  </button>
                </div>
              </div>

              {/* Recent Jobs */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-4 border-b flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Recent Jobs
                  </h3>
                  <span className="text-sm text-primary">
                    {stats.newJobsToday} new today
                  </span>
                </div>
                <div className="divide-y">
                  {stats.recentJobs.map((job) => (
                    <div key={job.id} className="p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="bg-gray-100 p-2 rounded-full mr-3">
                            <BriefcaseIcon className="h-5 w-5 text-gray-500" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">
                              {job.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              {job.company} • {job.location}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">
                            <ClockIcon className="inline-block h-3 w-3 mr-1" />
                            {formatDate(job.postedAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t bg-gray-50">
                  <button className="text-sm text-primary hover:underline">
                    View All Jobs
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              User Management
            </h3>
            <p className="text-gray-600">
              This section would contain a complete user management interface
              with filtering, searching, and actions like edit, delete, and ban
              users.
            </p>
          </div>
        )}

        {/* Jobs Tab */}
        {activeTab === "jobs" && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Job Management
            </h3>
            <p className="text-gray-600">
              This section would contain a complete job management interface
              with filtering, searching, and actions like approve, reject, and
              feature jobs.
            </p>
          </div>
        )}

        {/* Applications Tab */}
        {activeTab === "applications" && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Application Management
            </h3>
            <p className="text-gray-600">
              This section would contain a complete application management
              interface with filtering, searching, and statistics about
              application trends.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
