import { useState } from "react";
import { Eye, EyeOff, Code } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { addUser } from "../utils/userSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignupClick = () => {
    alert(
      "Signup functionality coming soon! Please contact admin for account creation."
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await axios.post(
        BASE_URL + "/login",
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      if (res.status === 200) {
        dispatch(addUser(res.data));
        navigate("/");
      }
    } catch (err) {
      console.log(err);
      setError(err.response?.data || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 flex items-center justify-center p-4">
      {/* Simple gradient background instead of Three.js */}

      <div className="w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 rounded-2xl mb-6 shadow-2xl shadow-purple-500/30 border border-purple-400/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-transparent animate-pulse"></div>
            <Code className="w-10 h-10 text-white relative z-10" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">DevTinder</h1>
          <p className="text-gray-300 text-lg">Enter the Developer Realm</p>
          <div className="flex justify-center space-x-1 mt-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-gray-900/90 border border-gray-700/50 rounded-3xl shadow-2xl p-8 relative">
          {/* Removed animated border glow that might interfere with clicks */}

          <div className="space-y-6 relative z-10">
            {/* Error Message */}
            {error && (
              <div className="bg-red-900/30 border border-red-400/30 text-red-300 px-4 py-3 rounded-xl text-sm backdrop-blur-sm">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-200 mb-3"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-4 border border-gray-600 bg-gray-800 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-300 focus:bg-gray-700 backdrop-blur-sm hover:border-gray-500"
                placeholder="developer@example.com"
                required
                disabled={isLoading}
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-200 mb-3"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-4 border border-gray-600 bg-gray-800 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-300 focus:bg-gray-700 pr-12 backdrop-blur-sm hover:border-gray-500"
                  placeholder="Enter your secret code"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-purple-500 bg-gray-800 border-gray-600 rounded focus:ring-purple-400 focus:ring-2"
                  disabled={isLoading}
                />
                <label
                  htmlFor="remember"
                  className="ml-3 text-sm text-gray-300"
                >
                  Remember me
                </label>
              </div>
              <button
                type="button"
                className="text-sm text-gray-400 hover:text-white font-medium transition-colors duration-200 disabled:opacity-50"
                disabled={isLoading}
              >
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 text-white py-4 px-4 rounded-xl font-semibold hover:from-purple-500 hover:via-violet-500 hover:to-indigo-500 focus:ring-4 focus:ring-purple-400/30 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden"
            >
              <span className="relative z-10">
                {isLoading ? "Signing In..." : "Enter Developer Mode"}
              </span>
              {!isLoading && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="my-8 flex items-center">
            <div className="flex-1 border-t border-gray-600"></div>
            <span className="px-6 text-sm text-gray-400 bg-black/20 rounded-full backdrop-blur-sm">
              or
            </span>
            <div className="flex-1 border-t border-gray-600"></div>
          </div>

          {/* Sign Up Link */}
          <div
            className="text-center"
            style={{ position: "relative", zIndex: 10000 }}
          >
            <p className="text-gray-300">
              New to the developer community?{" "}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSignupClick();
                }}
                className="text-purple-400 hover:text-purple-300 font-semibold transition-colors duration-200 disabled:opacity-50 underline decoration-dotted cursor-pointer pointer-events-auto relative z-50"
                disabled={isLoading}
                style={{
                  cursor: "pointer !important",
                  pointerEvents: "auto !important",
                  position: "relative",
                  zIndex: 99999,
                  display: "inline-block",
                  background: "transparent",
                  border: "none",
                }}
              >
                Join the matrix
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-400">
          <p>
            By accessing the portal, you agree to our{" "}
            <span className="text-gray-300">Developer Code</span> and{" "}
            <span className="text-gray-300">Privacy Protocol</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
