import axios from "axios";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";

const Navbar = () => {
  const user = useSelector((store) => store.user);
  // console.log(user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const res = await axios.post(
      BASE_URL + "/logout",
      {},
      { withCredentials: true }
    );
    dispatch(removeUser());
    navigate("/login");
  };

  return (
    <div className="navbar bg-black/20 backdrop-blur-xl border-b border-purple-500/20 shadow-2xl relative z-20">
      {/* Animated glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-indigo-500/5 animate-pulse"></div>

      <div className="navbar-start relative z-10">
        <Link
          to="/"
          className="btn btn-ghost text-xl flex items-center gap-3 text-white hover:bg-purple-500/20 transition-all duration-300 group"
        >
          <div className="relative">
            <img
              src="https://cdn-icons-png.flaticon.com/512/10329/10329496.png"
              alt="DevTinder Logo"
              className="w-8 h-8 object-contain filter brightness-0 invert group-hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.8)] transition-all duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-indigo-400 opacity-0 group-hover:opacity-20 rounded-full blur-sm transition-opacity duration-300"></div>
          </div>
          <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent font-bold tracking-wide">
            DevTinder
          </span>
        </Link>
      </div>

      <div className="navbar-end relative z-10">
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar hover:bg-purple-500/20 transition-all duration-300 group relative"
          >
            {user && (
              <div className="w-10 h-10 rounded-full ring-2 ring-purple-400/30 group-hover:ring-purple-400/60 transition-all duration-300 relative overflow-hidden">
                <img
                  alt="User Avatar"
                  src={
                    user
                      ? user.photoURL
                      : "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  }
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            )}
          </div>
          {user && (
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-black/80 backdrop-blur-xl border border-purple-500/30 rounded-2xl z-50 mt-3 w-56 p-3 shadow-2xl shadow-purple-500/20"
            >
              <li>
                <Link
                  to={"/profile"}
                  className="justify-between text-white hover:bg-purple-500/20 rounded-xl transition-all duration-300 group px-4 py-3"
                >
                  <span className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-purple-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Profile
                  </span>
                  <span className="badge bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-none text-xs">
                    New
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to={"/connections"}
                  className="text-white hover:bg-purple-500/20 rounded-xl transition-all duration-300 px-4 py-3"
                >
                  <span className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-purple-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Connections
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to={"/requests"}
                  className="text-white hover:bg-purple-500/20 rounded-xl transition-all duration-300 px-4 py-3"
                >
                  <span className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-purple-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    Requests
                  </span>
                </Link>
              </li>
              <li>
                <a className="text-white hover:bg-purple-500/20 rounded-xl transition-all duration-300 px-4 py-3">
                  <span className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-purple-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Settings
                  </span>
                </a>
              </li>
              <div className="divider my-2 border-purple-500/20"></div>
              <li>
                <a
                  onClick={handleSignOut}
                  className="text-red-300 hover:bg-red-500/20 hover:text-red-200 rounded-xl transition-all duration-300 px-4 py-3"
                >
                  <span className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Logout
                  </span>
                </a>
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
