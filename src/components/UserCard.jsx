import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { removeUserFromFeed } from "../utils/feedSlice";

const UserCard = ({ user }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success"); // success or error
  const [isAnimating, setIsAnimating] = useState(false);

  // Default user data
  const defaultUser = {
    _id: "6855ac4bc5f20f6e533013dc",
    firstName: "Harsha",
    lastName: "vardhan",
    skills: [],
    about: "This is default",
    photoURL:
      "https://images.wallpapersden.com/image/download/monkey-luffy-one-piece-hd-art_bWlqZm2UmZqaraWkpJRmbmdlrWZlbWU.jpg",
  };

  const userData = user || defaultUser;

  const showToastMessage = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handleSendRequest = async (status, userId) => {
    setIsLoading(true);
    setIsAnimating(true);

    try {
      const res = await axios.post(
        BASE_URL + "/request/send/" + status + "/" + userId,
        {},
        { withCredentials: true }
      );

      // Show success message
      const message =
        status === "interested" ? "Connection request sent!" : "User ignored";
      showToastMessage(message, "success");

      // Add animation delay before removing from feed
      setTimeout(() => {
        dispatch(removeUserFromFeed(userId));
      }, 500);
    } catch (err) {
      console.error("Error sending request:", err);
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to send request. Please try again.";
      showToastMessage(errorMessage, "error");
      setIsAnimating(false); // Reset animation if error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <div className="relative group">
        {/* Animated glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-violet-500 to-indigo-500 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500 animate-pulse"></div>

        {/* Main card */}
        <div
          className={`relative card bg-black/60 backdrop-blur-xl w-96 shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 border border-purple-500/30 hover:border-purple-400/50 rounded-3xl overflow-hidden ${
            isAnimating ? "animate-pulse scale-95 opacity-50" : ""
          }`}
        >
          {/* Animated background overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          <figure className="px-6 pt-6 relative z-10">
            <div className="relative">
              <img
                src={userData.photoURL}
                alt={`${userData.firstName} ${userData.lastName}`}
                className="rounded-2xl w-full h-48 object-cover ring-2 ring-purple-400/30 group-hover:ring-purple-400/60 transition-all duration-500"
              />
              {/* Image overlay effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </figure>

          <div className="card-body items-center text-center relative z-10 px-6 pb-6">
            {/* Name with gradient effect */}
            <h2 className="card-title text-2xl font-bold bg-gradient-to-r from-purple-300 via-violet-300 to-indigo-300 bg-clip-text text-transparent mb-3 group-hover:from-purple-200 group-hover:via-violet-200 group-hover:to-indigo-200 transition-all duration-500">
              {`${userData.firstName} ${userData.lastName}`}
            </h2>

            {/* About section */}
            <p className="text-gray-300 text-sm leading-relaxed mb-4 group-hover:text-gray-200 transition-colors duration-300">
              {userData.about}
            </p>

            {/* Skills section */}
            {userData.skills && userData.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3 justify-center mb-6">
                {userData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-xs font-medium bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-purple-200 border border-purple-400/30 rounded-full backdrop-blur-sm hover:from-purple-500/30 hover:to-indigo-500/30 hover:border-purple-400/50 transition-all duration-300 cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}

            {/* Action buttons */}
            <div className="card-actions justify-center mt-6 gap-3 w-full">
              <button
                onClick={() => handleSendRequest("ignored", userData._id)}
                disabled={isLoading}
                className={`btn bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-400 hover:to-pink-400 text-white border-none rounded-2xl px-8 py-3 font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-red-500/25 relative overflow-hidden ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    Pass
                  </>
                )}
              </button>

              <button
                onClick={() => handleSendRequest("interested", userData._id)}
                disabled={isLoading}
                className={`btn bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-500 hover:via-violet-500 hover:to-indigo-500 text-white border-none rounded-2xl px-8 py-3 font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-purple-500/25 relative overflow-hidden group/btn ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <span className="relative z-10 flex items-center">
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                      Connect
                    </>
                  )}
                </span>
                {/* Button shine effect */}
                {!isLoading && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                )}
              </button>
            </div>

            {/* Status indicator */}
            <div className="flex items-center justify-center mt-4 gap-2 text-xs text-purple-300">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50">
          <div
            className={`backdrop-blur-xl border rounded-2xl shadow-2xl px-6 py-4 flex items-center space-x-3 ${
              toastType === "success"
                ? "bg-green-900/80 border-green-400/30 text-green-300 shadow-green-500/20"
                : "bg-red-900/80 border-red-400/30 text-red-300 shadow-red-500/20"
            }`}
          >
            <svg
              className={`w-6 h-6 ${
                toastType === "success" ? "text-green-400" : "text-red-400"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {toastType === "success" ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              )}
            </svg>
            <span className="font-medium">{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserCard;
