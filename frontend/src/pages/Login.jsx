import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
// import { loginUser } from "../features/auth/authSlice";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { loginRoute } from "../utils/ApiRoutes";
import jobs from "../assets/jobs.jpg";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  // const dispatch = useDispatch();
  // const navigate = useNavigate();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data } = await axios.post(loginRoute, formData);
    // console.log("Login response", response.data);
    localStorage.setItem("token", data.data.accessToken);
    localStorage.setItem("user", JSON.stringify(data.data.user));

    if (data.data.user.role === "jobseeker") {
      navigate("/job-seeker-dashboard");
    }
    if (data.data.user.role === "employer") {
      navigate("/employer-dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-primary/10 relative">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={jobs}
          alt="Job Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-30" />{" "}
        {/* Gradient overlay */}
      </div>
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-primary">Welcome Back!</h2>
          <p className="text-[#19b1d3] mt-2">
            Continue your adventure—just sign in!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <EnvelopeIcon className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="Email"
                className="w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                onChange={handleChange}
                name="email"
              />
            </div>
            <div className="relative">
              <LockClosedIcon className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                placeholder="Password"
                className="w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                onChange={handleChange}
                name="password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-black py-3 rounded-xl font-semibold hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
          >
            Sign In
          </button>
        </form>

        <div className="mt-8 text-center">
          <span className="text-[#19b1d3]">New here? </span>
          <Link
            to="/register"
            className="text-secondary font-semibold hover:underline"
          >
            Create Account
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
// import React from "react";
// import { useState } from "react";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleLogin = () => {
//     console.log("Login with", email, password);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//       <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
//         <h2 className="text-2xl font-bold mb-4">Login</h2>
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="w-full mb-4 px-4 py-2 border rounded-lg"
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="w-full mb-4 px-4 py-2 border rounded-lg"
//         />
//         <button
//           onClick={handleLogin}
//           className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg"
//         >
//           Login
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Login;
