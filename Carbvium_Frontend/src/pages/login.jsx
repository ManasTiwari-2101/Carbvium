import { FaEnvelope, FaLock, FaUser, FaLeaf } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Login() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Clear error when switching between login and signup
  useEffect(() => {
    setError("");
  }, [isSignUp]);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!username || !email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8 || password.length > 15) {
      setError("Password must be between 8-15 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          username,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Signup failed");
        return;
      }

      // Signup successful, switch to login
      setError("");
      setUsername("");
      setPassword("");
      setConfirmPassword("");
      setEmail("");
      setIsSignUp(false);
      setError("Account created successfully! Please login.");

    } catch (err) {
      setError("Network error. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed");
        return;
      }

      // Login successful - store tokens and redirect
      localStorage.setItem("access_token", data.session.access_token);
      localStorage.setItem("refresh_token", data.session.refresh_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Replace login page in history with landing page, so back button goes to landing
      window.history.replaceState({}, "", "/");
      navigate("/dashboard");

    } catch (err) {
      setError("Network error. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#041f1d] to-[#0a3d38] flex-col justify-between p-12">
        <div>
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-2 cursor-pointer"
          >
            {/* <FaLeaf className="text-green-400 text-2xl" /> */}
            <span className="text-2xl font-bold text-white">🌿 Carbvium</span>
          </div>
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-white leading-tight">
            Make Sustainable<br />
            <span className="text-green-400">Vehicle Choices</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-md">
            Analyze the environmental impact of vehicles and choose the most eco-friendly option for your lifestyle.
          </p>
          <div className="flex gap-8 pt-4">
            <div>
              <div className="text-3xl font-bold text-green-400">100+</div>
              <div className="text-gray-400 text-sm">Vehicles Analyzed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-400">20+</div>
              <div className="text-gray-400 text-sm">Active Users</div>
            </div>
          </div>
        </div>

        <div className="text-gray-500 text-sm">
          {/* © 2026 Carbvium. All rights reserved. */}
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 bg-[#fafafa] flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">

          {/* Mobile Logo */}
          <div
            onClick={() => navigate("/")}
            className="lg:hidden flex items-center justify-center gap-2 mb-8 cursor-pointer"
          >
            <span className="text-2xl font-bold text-[#041f1d]">🌿 Carbvium</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {isSignUp ? "Create Account" : "Welcome back"}
            </h2>
            <p className="text-gray-500">
              {isSignUp
                ? "Enter your details to create your account"
                : "Enter your credentials to access your account"}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className={`mb-6 p-4 rounded-lg text-sm ${error.includes("successfully")
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-red-50 border border-red-200 text-red-700"
              }`}>
              {error}
            </div>
          )}

          <form onSubmit={isSignUp ? handleSignup : handleLogin}>
            {/* Username Input - Only for Sign Up */}
            {isSignUp && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#041f1d] focus:ring-1 focus:ring-[#041f1d] transition-all text-gray-900 placeholder-gray-400"
                  />
                </div>
              </div>
            )}

            {/* Email Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#041f1d] focus:ring-1 focus:ring-[#041f1d] transition-all text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  minLength={8}
                  maxLength={15}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#041f1d] focus:ring-1 focus:ring-[#041f1d] transition-all text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>

            {/* Confirm Password - Only for Sign Up */}
            {isSignUp && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    minLength={8}
                    maxLength={15}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    type="password"
                    placeholder="Confirm your password"
                    className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#041f1d] focus:ring-1 focus:ring-[#041f1d] transition-all text-gray-900 placeholder-gray-400"
                  />
                </div>
              </div>
            )}

            {/* Forgot Password - Only for Login */}
            {!isSignUp && (
              <div className="flex justify-end mb-6">
                <button
                  type="button"
                  className="text-sm text-[#041f1d] hover:text-green-700 font-medium transition-colors cursor-pointer"
                >
                  {/* Forgot password? */}
                </button>
              </div>
            )}

            {/* Login/Signup Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#041f1d] text-white py-3.5 rounded-lg hover:bg-[#0a3d38] transition-all duration-300 font-medium cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </span>
              ) : isSignUp ? "Create Account" : "Sign In"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-sm text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Toggle Between Login and Signup */}
          <p className="text-center text-gray-600">
            {isSignUp ? "Already have an account? " : "Don't have an account? "}
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-[#041f1d] hover:text-green-700 font-semibold transition-colors cursor-pointer"
            >
              {isSignUp ? "Sign In" : "Create Account"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}