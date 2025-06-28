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
    <div className="navbar bg-base-300 shadow-sm">
      <div className="navbar-start">
        <a className="btn btn-ghost text-xl flex items-center gap-2">
          <img
            src="https://cdn-icons-png.flaticon.com/512/10329/10329496.png"
            alt="DevTinder Logo"
            className="w-8 h-8 object-contain"
          />
          DevTinder
        </a>
      </div>
      <div className="navbar-end">
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            {user && (
              <div className="w-10 rounded-full">
                <img
                  alt="User Avatar"
                  src={
                    user
                      ? user.photoURL
                      : "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  }
                />
              </div>
            )}
          </div>
          {user && (
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link to={"/profile"} className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </Link>
              </li>
              <li>
                <a>Settings</a>
              </li>
              <li>
                <a onClick={handleSignOut}>Logout</a>
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
