import { FaEnvelope, FaLock } from "react-icons/fa";
import carImage from "../assets/ev-car.png"; 

export default function Login() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center relative overflow-hidden">
      
      {/* Background Decorative Layer */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,_#22c55e,_transparent_40%)]"></div>

      {/* Login Card */}
      <div className="bg-white shadow-2xl rounded-2xl w-[400px] p-8 relative z-10">

        {/* Logo */}
        <div className="flex items-center justify-center mb-6">
          <span className="text-2xl font-bold text-green-700">
            Carbvium
          </span>
        </div>

        {/* Welcome Text */}
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-2">
          Welcome Back
        </h2>
        <p className="text-gray-500 text-center mb-6">
          Login to find your perfect eco-friendly vehicle.
        </p>

        {/* Email Input */}
        <div className="relative mb-4">
          <FaEnvelope className="absolute left-3 top-3 text-green-600" />
          <input
            type="email"
            placeholder="Email"
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Password Input */}
        <div className="relative mb-2">
          <FaLock className="absolute left-3 top-3 text-green-600" />
          <input
            type="password"
            placeholder="Password"
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Forgot Password */}
        <div className="text-right mb-6">
          <button className="text-sm text-green-600 hover:underline">
            Forgot Password?
          </button>
        </div>

        {/* Login Button */}
        <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition duration-300 font-medium">
          Login
        </button>

        {/* Signup Link */}
        <p className="text-center mt-6 text-gray-600">
          Don't have an account?{" "}
          <span className="text-green-600 font-semibold cursor-pointer hover:underline">
            Sign Up
          </span>
        </p>
      </div>

      {/* Car Image Right Bottom */}
      <img
        src={carImage}
        alt="EV Car"
        className="absolute bottom-10 right-10 w-60 hidden md:block"
      />
    </div>
  );
}