"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();

  // Step 1: Request OTP
  const [email, setEmail] = useState("");
  // Step 2 & 3: Reset Password
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorType, setErrorType] = useState(""); // "email", "otp", "password", etc.

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    if (!email) {
      setMessage("Email is required");
      setErrorType("email");
      return;
    }

    setLoading(true);
    setMessage("");
    setErrorType("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || "OTP sent to your email.");
        setErrorType("success");
        setTimeout(() => {
          setStep(2);
          setMessage("");
          setErrorType("");
        }, 1500);
      } else {
        setMessage(data.message || "Failed to send OTP.");
        setErrorType("email");
      }
    } catch {
      setMessage("Something went wrong. Please try again.");
      setErrorType("general");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!otp) {
      setMessage("OTP is required");
      setErrorType("otp");
      return;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters");
      setErrorType("password");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      setErrorType("confirmPassword");
      return;
    }

    setLoading(true);
    setMessage("");
    setErrorType("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          otp,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Reset failed");
        setErrorType(data.message?.toLowerCase().includes("otp") ? "otp" : "general");
        return;
      }

      setMessage(data.message || "Password reset successful");
      setErrorType("success");

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error) {
      console.error("Reset password error", error);
      setMessage("Something went wrong. Please try again.");
      setErrorType("general");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-white">
            {step === 1 ? "Forgot Password" : "Reset Password"}
          </h2>
          <p className="mt-2 text-sm text-gray-300">
            {step === 1
              ? "Enter your email to receive a One-Time Password"
              : "Enter the OTP sent to your email and your new password"}
          </p>
        </div>

        {/* Card */}
        <div className="bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700">

          {step === 1 ? (
            <form onSubmit={handleRequestOTP} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  aria-required="true"
                  className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors ${errorType === "email" ? "border-red-500 focus:border-red-500" : "border-gray-600"
                    }`}
                  placeholder="Enter your registered email"
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                aria-live="polite"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-700 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-800 transition disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 flex justify-center items-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending OTP...
                  </>
                ) : (
                  "Send OTP"
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-5">
              {/* OTP */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  One-Time Password (OTP)
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.trim())}
                  required
                  className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white font-mono tracking-wider focus:ring-2 focus:ring-blue-500 outline-none transition-colors ${errorType === "otp" ? "border-red-500 focus:border-red-500" : "border-gray-600"
                    }`}
                  placeholder="Enter 6-digit OTP"
                  disabled={loading}
                  maxLength={6}
                />
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none pr-10 transition-colors ${errorType === "password" ? "border-red-500 focus:border-red-500" : "border-gray-600"
                      }`}
                    placeholder="Enter new password"
                    disabled={loading}
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none pr-10 transition-colors ${errorType === "confirmPassword" ? "border-red-500 focus:border-red-500" : "border-gray-600"
                      }`}
                    placeholder="Confirm new password"
                    disabled={loading}
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 focus:outline-none"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-700 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-800 transition disabled:opacity-50 flex justify-center items-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying & Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                  disabled={loading}
                >
                  Didn't receive code? Resend
                </button>
              </div>
            </form>
          )}

          {message && (
            <div className={`mt-4 p-3 rounded-lg text-sm text-center ${errorType === "success" ? "bg-green-900/30 text-green-400 border border-green-800" :
              "bg-red-900/30 text-red-400 border border-red-800"
              }`}>
              {message}
            </div>
          )}

          <div className="text-center mt-6">
            <Link
              href="/login"
              className="text-sm text-blue-400 hover:text-blue-300 focus:outline-none focus:underline rounded-sm transition-colors"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}