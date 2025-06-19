export const host = `https://talenthive-backend.onrender.com`;

// Auth routes
export const loginRoute = `${host}/api/auth/users/signin`;
export const registerRoute = `${host}/api/auth/users/signup`;
export const completeProfileRoute = `${host}/api/auth/users/setProfile`;
export const userProfileRoute = `${host}/api/users/profile`;
export const isEmailVerifiedRoute = `${host}/api/auth/users/isEmailVerified`;
export const resendVerificationEmailRoute = `${host}/api/auth/users/resendVerificationEmail`;

// Job routes
export const jobsRoute = `${host}/api/jobs`;
export const applyJobRoute = `${host}/api/applications`;

// Employer routes
export const employerJobsRoute = `${host}/api/employer/jobs`;
export const companyProfileRoute = `${host}/api/employer/
company-profile`;
export const employerApplicationsRoute = `${host}/api/applications`;

// Admin routes
export const adminUsersRoute = `${host}/api/admin/users`;
export const adminJobsRoute = `${host}/api/admin/jobs`;
export const adminApplicationsRoute = `${host}/api/admin/applications`;
export const adminStatsRoute = `${host}/api/admin/stats`;
