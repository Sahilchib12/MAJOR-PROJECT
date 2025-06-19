import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { EnvelopeIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { authService } from "../utils/ApiService";

const ConfirmEmail = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [countdown, setCountdown] = useState(5);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [checkingConfirmation, setCheckingConfirmation] = useState(true);

  useEffect(() => {
    // Get user data from localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.email) {
      setEmail(user.email);
    } else {
      // If no user data, redirect to login
      navigate("/login");
      return;
    }

    // Check if email is confirmed
    const checkConfirmation = async () => {
      setCheckingConfirmation(true);
      try {
        const { data } = await authService.isEmailVerified();
        // console.log(data.data.isEmailVerified);
        if (data.data.isEmailVerified) {
          setIsConfirmed(true);
        }
      } catch (error) {
        console.error("Error checking email confirmation:", error);
      } finally {
        setCheckingConfirmation(false);
      }
    };

    // Call the check function
    checkConfirmation();

    // Poll for confirmation status every 10 seconds
    const confirmationInterval = setInterval(checkConfirmation, 10000);

    // Auto redirect to profile completion after countdown only if confirmed
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (isConfirmed) {
            navigate("/complete-profile");
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      clearInterval(confirmationInterval);
    };
  }, [navigate, isConfirmed]);

  const handleResendEmail = async () => {
    setResendDisabled(true);
    setResendCountdown(60);

    try {
      await authService.resendVerificationEmail();
      // Show success notification (could use a toast library here)
    } catch (error) {
      console.error("Error resending confirmation email:", error);
      // Show error notification
    }

    // Countdown for resend button
    const resendTimer = setInterval(() => {
      setResendCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(resendTimer);
          setResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-primary/10 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div
              className={`p-4 rounded-full ${
                isConfirmed ? "bg-green-100" : "bg-blue-100"
              }`}
            >
              {isConfirmed ? (
                <CheckCircleIcon className="h-12 w-12 text-green-600" />
              ) : (
                <EnvelopeIcon className="h-12 w-12 text-primary" />
              )}
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-800">
            {isConfirmed ? "Email Confirmed!" : "Check Your Email"}
          </h2>
          <p className="text-gray-600 mt-2">
            {isConfirmed
              ? "Your email has been successfully verified."
              : "We've sent a confirmation link to:"}
          </p>
          {!isConfirmed && (
            <p className="text-primary font-medium mt-1">{email}</p>
          )}
        </div>

        {!isConfirmed && (
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-700">
              Please click the link in your email to verify your account. If you
              don't see it, check your spam folder.
            </p>
          </div>
        )}

        <div className="space-y-4">
          {!isConfirmed && (
            <button
              onClick={handleResendEmail}
              disabled={resendDisabled || checkingConfirmation}
              className={`w-full py-3 rounded-xl font-medium border border-primary transition-all flex items-center justify-center ${
                resendDisabled || checkingConfirmation
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-primary hover:bg-primary/5"
              }`}
            >
              {resendDisabled
                ? `Resend Email (${resendCountdown}s)`
                : checkingConfirmation
                ? "Checking confirmation status..."
                : "Resend Confirmation Email"}
            </button>
          )}

          <Link
            to="/login"
            className="block w-full py-3 text-center rounded-xl font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-all"
          >
            Back to Login
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-center text-sm text-gray-600"
        >
          {isConfirmed ? (
            <>
              <p>Continuing to profile completion in {countdown} seconds...</p>
              <button
                onClick={() => navigate("/complete-profile")}
                className="text-primary font-medium hover:underline mt-1"
              >
                Continue Now
              </button>
            </>
          ) : (
            <p>Waiting for email confirmation...</p>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ConfirmEmail;
