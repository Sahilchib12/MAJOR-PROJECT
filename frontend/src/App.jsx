import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./App.css";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ConfirmEmail from "./pages/ConfirmEmail";
import CompleteProfile from "./pages/CompleteProfile";
import AdminPanel from "./pages/AdminPanel";
import JobSeekerDashboard from "./pages/JobSeekerDashboard";
import EmployerDashboard from "./pages/EmployerDashboard";
import JobSearch from "./pages/JobSearch";
import MyApplications from "./pages/MyApplications";
import CompanyProfile from "./pages/CompanyProfile";
import EmployerJobs from "./pages/EmployerJobs";
import EmployerApplications from "./pages/EmployerApplications";
import PostJob from "./pages/PostJob";
import NotFound from "./pages/NotFound";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/confirm-email" element={<ConfirmEmail />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />

        {/* Job Seeker Routes */}
        <Route path="/job-seeker-dashboard" element={<JobSeekerDashboard />} />
        <Route path="/jobs" element={<JobSearch />} />
        <Route path="/my-applications" element={<MyApplications />} />

        {/* Employer Routes */}
        <Route path="/employer-dashboard" element={<EmployerDashboard />} />
        <Route path="/employer/company-profile" element={<CompanyProfile />} />
        <Route path="/employer/jobs" element={<EmployerJobs />} />
        <Route path="/employer/applications" element={<EmployerApplications />} />
        <Route path="/post-job" element={<PostJob />} />

        {/* Admin Routes */}
        <Route path="/admin-panel" element={<AdminPanel />} />

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
