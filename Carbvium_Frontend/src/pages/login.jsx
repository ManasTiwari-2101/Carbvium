import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import carImage from "../assets/ev-car.png";

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
      
      navigate("/dashboard");
      
    } catch (err) {
      setError("Network error. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center relative overflow-hidden">
      
      {/* Background Decorative Layer */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,_#22c55e,_transparent_40%)]"></div>

      {/* Login Card */}
      <div className="bg-white/20 backdrop-blur-md shadow-2xl rounded-2xl w-[400px] p-8 relative z-10 border border-white/30">

        {/* Logo */}
        <div className="flex items-center justify-center mb-6">
          <span className="text-2xl font-bold text-green-700">
            Carbvium
          </span>
        </div>

        {/* Welcome Text */}
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-2">
          {isSignUp ? "Welcome to Carbvium" : "Welcome Back"}
        </h2>
        <p className="text-gray-900 text-center mb-6">
          {isSignUp ? "Create an account to find your perfect eco-friendly vehicle." : "Login to find your perfect eco-friendly vehicle."}
        </p>

        {/* Username Input - Only for Sign Up */}
        {isSignUp && (
          <div className="relative mb-4">
            <FaUser className="absolute left-3 top-3 text-green-600" />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        )}

        {/* Email Input */}
        <div className="relative mb-4">
          <FaEnvelope className="absolute left-3 top-3 text-green-600" />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Password Input */}
        <div className="relative mb-4">
          <FaLock className="absolute left-3 top-3 text-green-600" />
          <input
          minLength={8}
          maxLength={15}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Confirm Password - Only for Sign Up */}
        {isSignUp && (
          <div className="relative mb-6">
            <FaLock className="absolute left-3 top-3 text-green-600" />
            <input
            minLength={8}
            maxLength={15}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              placeholder="Confirm Password"
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        )}

        {/* Forgot Password - Only for Login */}
        {!isSignUp && (
          <div className="text-right mb-6">
            <button className="text-sm font-bold text-green-800 hover:text-green-900 rounded transition duration-200 hover:cursor-pointer">
              Forgot Password?
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Login/Signup Button */}
        <button 
          onClick={isSignUp ? handleSignup : handleLogin}
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition duration-300 font-medium hover:cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? "Processing..." : isSignUp ? "Sign Up" : "Login"}
        </button>

        {/* Toggle Between Login and Signup */}
        <p className="text-center mt-6 text-gray-900">
          {isSignUp ? "Already have an account? " : "Don't have an account? "}
          <span 
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm text font-bold text-[#04673e] hover:text-green-900 rounded transition duration-200 hover:cursor-pointer"
          >
            {isSignUp ? "Login" : "Sign Up"}
          </span>
        </p>
      </div>

      {/* Car Image Background */}
      <img
        src={carImage}
        alt="EV Car"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
    </div>
  );
}