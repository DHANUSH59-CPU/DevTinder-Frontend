import React, { useState } from "react";
import { Heart, X } from "lucide-react";

const UserCard = () => {
  const [isLiked, setIsLiked] = useState(null);

  const handleInterested = () => {
    setIsLiked(true);
    // Add swipe animation or card removal logic here
    setTimeout(() => setIsLiked(null), 1000);
  };

  const handleIgnore = () => {
    setIsLiked(false);
    // Add swipe animation or card removal logic here
    setTimeout(() => setIsLiked(null), 1000);
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-secondary/10 rounded-full blur-xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-accent/10 rounded-full blur-xl animate-pulse delay-1000"></div>
      </div>
      <div
        className={`card bg-base-100 backdrop-blur-xl border border-base-content/10 w-72 max-w-sm shadow-2xl shadow-base-content/20 rounded-3xl overflow-hidden transform transition-all duration-700 relative ${
          isLiked === true
            ? "rotate-12 scale-95 opacity-50"
            : isLiked === false
            ? "-rotate-12 scale-95 opacity-50"
            : "hover:scale-105 hover:shadow-base-content/30"
        }`}
      >
        {/* Card glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 rounded-3xl"></div>
        {/* Profile Image */}
        <figure className="relative h-40">
          <img
            src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
            alt="Profile"
            className="w-full h-full object-cover"
          />
          {/* Image overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
          {/* Age Badge */}
          <div className="absolute top-4 right-4 bg-base-100/95 backdrop-blur-sm text-base-content px-4 py-2 rounded-full text-sm font-bold border border-base-content/10 shadow-xl">
            25
          </div>
        </figure>

        {/* Profile Info */}
        <div className="card-body p-5 space-y-3 relative z-10">
          <div>
            <h2 className="text-2xl font-bold text-base-content mb-1 tracking-wide">
              Sarah Johnson
            </h2>
            <p className="text-base-content/60 text-sm flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              2 miles away
            </p>
            <p className="text-base-content/80 text-sm leading-relaxed mt-3 font-medium">
              Love hiking, photography, and coffee shops! 🌟
            </p>

            {/* Interests */}
            <div className="flex flex-wrap gap-2 mt-4">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg transform hover:scale-105 transition-transform hover:shadow-blue-500/30">
                Photo
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg transform hover:scale-105 transition-transform hover:shadow-purple-500/30">
                Travel
              </div>
              <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg transform hover:scale-105 transition-transform hover:shadow-amber-500/30">
                Coffee
              </div>
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg transform hover:scale-105 transition-transform hover:shadow-green-500/30">
                Hiking
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 pt-4">
            <button
              onClick={handleIgnore}
              className="btn btn-sm px-6 py-3 bg-base-200 hover:bg-base-300 border-2 border-error/50 hover:border-error/70 shadow-lg text-error hover:text-error/90 transform hover:scale-105 transition-all duration-300 rounded-2xl font-semibold"
            >
              <X className="w-4 h-4 mr-2" />
              Ignore
            </button>

            <button
              onClick={handleInterested}
              className="btn btn-sm px-6 py-3 bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 hover:from-pink-600 hover:via-rose-600 hover:to-red-600 border-0 shadow-xl text-white transform hover:scale-105 transition-all duration-300 rounded-2xl font-semibold"
              style={{
                boxShadow:
                  "0 10px 25px rgba(239, 68, 68, 0.4), 0 4px 10px rgba(239, 68, 68, 0.3)",
              }}
            >
              <Heart className="w-4 h-4 mr-2 fill-current" />
              Interested
            </button>
          </div>
        </div>

        {/* Like/Pass Overlay */}
        {isLiked !== null && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <div
              className={`text-4xl font-black transform rotate-12 border-4 rounded-2xl px-8 py-4 backdrop-blur-sm ${
                isLiked
                  ? "text-success border-success bg-success/20 shadow-success/50"
                  : "text-error border-error bg-error/20 shadow-error/50"
              } shadow-2xl animate-bounce`}
            >
              {isLiked ? "INTERESTED" : "IGNORED"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;
