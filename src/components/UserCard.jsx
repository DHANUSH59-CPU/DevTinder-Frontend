import React from "react";

const UserCard = ({ user }) => {
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

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <div className="relative group">
        {/* Animated glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-violet-500 to-indigo-500 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500 animate-pulse"></div>

        {/* Main card */}
        <div className="relative card bg-black/60 backdrop-blur-xl w-96 shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 border border-purple-500/30 hover:border-purple-400/50 rounded-3xl overflow-hidden">
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
              <button className="btn bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-400 hover:to-pink-400 text-white border-none rounded-2xl px-8 py-3 font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-red-500/25">
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
              </button>

              <button className="btn bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-500 hover:via-violet-500 hover:to-indigo-500 text-white border-none rounded-2xl px-8 py-3 font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-purple-500/25 relative overflow-hidden group/btn">
                <span className="relative z-10 flex items-center">
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
                </span>
                {/* Button shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
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
    </div>
  );
};

export default UserCard;
