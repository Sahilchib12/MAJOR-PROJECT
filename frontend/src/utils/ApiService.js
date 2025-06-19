import axios from "axios";
import {
  loginRoute,
  registerRoute,
  completeProfileRoute,
  jobsRoute,
  employerJobsRoute,
  applyJobRoute,
  userProfileRoute,
  companyProfileRoute,
  resendVerificationEmailRoute,
  isEmailVerifiedRoute,
  employerApplicationsRoute,
} from "./ApiRoutes";

// Create axios instance with default config
const api = axios.create({
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors (token expired)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: async (credentials) => {
    return api.post(loginRoute, credentials);
  },

  register: async (userData) => {
    return api.post(registerRoute, userData);
  },

  completeProfile: async (profileData) => {
    return api.post(completeProfileRoute, profileData);
  },

  getUserProfile: async () => {
    return api.get(userProfileRoute);
  },

  updateUserProfile: async (profileData) => {
    return api.put(userProfileRoute, profileData);
  },

  isEmailVerified: async () => {
    return api.get(isEmailVerifiedRoute);
  },

  resendVerificationEmail: async () => {
    return api.get(resendVerificationEmailRoute);
  },
};

// Job services
export const jobService = {
  getAllJobs: async (params) => {
    return api.get(`${jobsRoute}/recommended`, { params });
  },

  getJobById: async (jobId) => {
    return api.get(`${jobsRoute}/${jobId}`);
  },

  applyForJob: async (jobId, applicationData) => {
    return api.post(`${applyJobRoute}/${jobId}`, applicationData);
  },

  getUserApplications: async () => {
    return api.get(`${applyJobRoute}/user`);
  },
};

// Employer services
export const employerService = {
  createJob: async (jobData) => {
    return api.post(`${jobsRoute}/create`, jobData);
  },

  updateJob: async (jobId, jobData) => {
    return api.put(`${jobsRoute}/${jobId}`, jobData);
  },

  getJobs: async (params) => {
    return api.get(jobsRoute, { params });
  },

  getJob: async (jobId) => {
    return api.get(`${jobsRoute}/${jobId}`);
  },

  deleteJob: async (jobId) => {
    return api.delete(`${jobsRoute}/${jobId}`);
  },

  getApplications: async (params) => {
    return api.get(`${employerApplicationsRoute}/employer-applications`);
  },

  updateApplicationStatus: async (applicationId, status) => {
    return api.put(
      `${employerApplicationsRoute}/${applicationId}/status`,
      status
    );
  },

  getCompanyProfile: async () => {
    return api.get(companyProfileRoute);
  },

  updateCompanyProfile: async (profileData) => {
    return api.put(companyProfileRoute, profileData);
  },
};

// Jobseeker services
export const jobseekerService = {
  getRecommendedJobs: async (params) => {
    return api.get(`${jobsRoute}/recommended`, { params });
  },

  getJob: async (jobId) => {
    return api.get(`${jobsRoute}/${jobId}`);
  },

  applyForJob: async (applicationData) => {
    return api.post(
      `${employerApplicationsRoute}/${applicationData.jobId}/apply`,
      applicationData
    );
  },

  getUserApplications: async () => {
    return api.get(`${employerApplicationsRoute}/my-applications`);
  },
};

// Admin services
export const adminService = {
  getAllUsers: async (params) => {
    return api.get("/api/admin/users", { params });
  },

  getAllJobs: async (params) => {
    return api.get("/api/admin/jobs", { params });
  },

  getAllApplications: async (params) => {
    return api.get("/api/admin/applications", { params });
  },

  getDashboardStats: async () => {
    return api.get("/api/admin/stats");
  },
};

export default api;
