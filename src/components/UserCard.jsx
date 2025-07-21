import React, { useState } from "react";
import {
  Heart,
  X,
  Sparkle,
  MapPin,
  Camera,
  Coffee,
  Mountain,
} from "lucide-react";

const UserCard = () => {
  const [isLiked, setIsLiked] = useState(null);

  const handleInterested = () => {
    setIsLiked(true);
    setTimeout(() => setIsLiked(null), 1000);
  };

  const handleIgnore = () => {
    setIsLiked(false);
    setTimeout(() => setIsLiked(null), 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              background: `radial-gradient(circle, rgba(${
                Math.random() > 0.5 ? "124, 58, 237" : "99, 102, 241"
              }, ${Math.random() * 0.3 + 0.1}) 0%, transparent 70%)`,
              filter: "blur(40px)",
              opacity: 0.3,
              animation: `pulse ${Math.random() * 5 + 5}s infinite alternate`,
            }}
          />
        ))}
      </div>

      <div
        className={`bg-gray-900/80 backdrop-blur-2xl border border-purple-500/30 w-80 max-w-sm rounded-3xl overflow-hidden transform transition-all duration-700 relative z-10 ${
          isLiked === true
            ? "rotate-12 scale-95 opacity-50"
            : isLiked === false
            ? "-rotate-12 scale-95 opacity-50"
            : "hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/30"
        }`}
        style={{
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        }}
      >
        {/* Card glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-purple-400/5 rounded-3xl pointer-events-none" />

        {/* Profile Image */}
        <figure className="relative h-48 group">
          <img
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
            alt="Profile"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Image overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          {/* Age Badge */}
          <div className="absolute top-4 right-4 bg-black/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold border border-purple-500/50 shadow-lg flex items-center">
            <Sparkle className="w-3 h-3 mr-1 text-purple-400" />
            25
          </div>
          {/* Location */}
          <div className="absolute bottom-4 left-4 bg-black/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium border border-purple-500/30 shadow-lg flex items-center">
            <MapPin className="w-3 h-3 mr-1 text-purple-300" />2 miles away
          </div>
        </figure>

        {/* Profile Info */}
        <div className="p-6 space-y-4 relative z-10">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1 tracking-tight flex items-center">
              Sarah Johnson
              <span className="ml-2 text-xs bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text">
                PRO
              </span>
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed mt-2 font-medium">
              Adventure seeker and coffee enthusiast. Always looking for new
              experiences and connections!
            </p>

            {/* Interests */}
            <div className="flex flex-wrap gap-2 mt-5">
              <div className="bg-gray-800/80 backdrop-blur border border-purple-500/20 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg flex items-center">
                <Camera className="w-3 h-3 mr-1.5 text-purple-300" />
                Photography
              </div>
              <div className="bg-gray-800/80 backdrop-blur border border-purple-500/20 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg flex items-center">
                <Mountain className="w-3 h-3 mr-1.5 text-purple-300" />
                Hiking
              </div>
              <div className="bg-gray-800/80 backdrop-blur border border-purple-500/20 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg flex items-center">
                <Coffee className="w-3 h-3 mr-1.5 text-purple-300" />
                Coffee
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between gap-3 pt-5">
            <button
              onClick={handleIgnore}
              className="flex-1 flex items-center justify-center px-4 py-3 bg-gray-800 hover:bg-gray-700/90 border border-red-500/30 hover:border-red-500/50 shadow-lg text-red-400 hover:text-red-300 rounded-xl font-medium text-sm transition-all duration-300 group"
            >
              <X className="w-5 h-5 mr-2 group-hover:scale-125 transition-transform" />
              Ignore
            </button>

            <button
              onClick={handleInterested}
              className="flex-1 flex items-center justify-center px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0 shadow-lg text-white rounded-xl font-medium text-sm transition-all duration-300 group"
              style={{
                boxShadow: "0 4px 20px rgba(168, 85, 247, 0.5)",
              }}
            >
              <Heart className="w-5 h-5 mr-2 group-hover:scale-125 transition-transform fill-white" />
              Interested
            </button>
          </div>
        </div>

        {/* Like/Pass Overlay */}
        {isLiked !== null && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <div
              className={`text-3xl font-black tracking-wide transform rotate-12 border-4 rounded-xl px-6 py-3 backdrop-blur-md ${
                isLiked
                  ? "text-purple-300 border-purple-300/70 bg-purple-900/30 shadow-purple-400/50"
                  : "text-red-300 border-red-300/70 bg-red-900/30 shadow-red-400/50"
              } shadow-xl animate-bounce-in`}
            >
              {isLiked ? "LIKED" : "PASSED"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;
