"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/auth/authContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";

const SignupForm = () => {
  const { register, isAuthenticated } = useAuth();
  const router = useRouter();

  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!credentials.username || !credentials.password || !credentials.confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (credentials.password !== credentials.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (credentials.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      const result = await register(credentials.username, credentials.password);

      if (result?.success) {
        toast.success("Account created successfully 🎉");
        router.push("/login");
      } else {
        toast.error(result?.message || "Registration failed");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* Username */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Username
        </label>
        <input
          type="text"
          name="username"
          value={credentials.username}
          onChange={onChange}
          className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg"
          placeholder="Enter username"
          required
        />
      </div>

      {/* Password */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Password
        </label>
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          value={credentials.password}
          onChange={onChange}
          className="w-full px-4 py-3 pr-12 bg-gray-700 text-white border border-gray-600 rounded-lg"
          placeholder="Enter password"
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-11 text-gray-400 hover:text-white"
        >
          {showPassword ? "🙈" : "👁️"}
        </button>
      </div>

      {/* Confirm Password */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Confirm Password
        </label>
        <input
          type={showConfirmPassword ? "text" : "password"}
          name="confirmPassword"
          value={credentials.confirmPassword}
          onChange={onChange}
          className="w-full px-4 py-3 pr-12 bg-gray-700 text-white border border-gray-600 rounded-lg"
          placeholder="Confirm password"
          required
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-3 top-11 text-gray-400 hover:text-white"
        >
          {showConfirmPassword ? "🙈" : "👁️"}
        </button>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-green-600 to-blue-700 py-3 rounded-lg text-white font-medium"
      >
        {isLoading ? "Creating Account..." : "Create Account"}
      </button>

      {/* Login Link */}
      <p className="text-center text-gray-300 text-sm">
        Already have an account?{" "}
        <Link href="/login" className="text-green-400 hover:underline">
          Login
        </Link>
      </p>
    </form>
  );
};

export default function Signup() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700">
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          Create Account
        </h2>
        <SignupForm />
      </div>
    </div>
  );
}
