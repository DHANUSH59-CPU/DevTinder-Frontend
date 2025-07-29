import { useState } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [photoURL, setPhotoURL] = useState(user.photoURL || "");
  const [age, setAge] = useState(user.age || "");
  const [gender, setGender] = useState(user.gender || "");
  const [about, setAbout] = useState(user.about || "");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const [showToast, setShowToast] = useState(false);

  const saveProfile = async () => {
    //Clear Errors
    setError("");
    try {
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        {
          firstName,
          lastName,
          photoURL,
          age: age ? parseInt(age) : undefined,
          gender,
          about,
        },
        { withCredentials: true }
      );
      dispatch(addUser(res?.data?.data));
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "An error occurred"
      );
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="flex justify-center items-start min-h-screen p-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 w-full max-w-7xl">
          {/* Edit Form */}
          <div className="flex-1 max-w-md mx-auto lg:mx-0">
            <div className="relative group">
              {/* Animated glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-violet-500 to-indigo-500 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500 animate-pulse"></div>

              {/* Main form card */}
              <div className="relative bg-black/60 backdrop-blur-xl border border-purple-500/30 hover:border-purple-400/50 rounded-3xl shadow-2xl p-8 transition-all duration-500">
                {/* Animated background overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>

                <div className="relative z-10">
                  {/* Header */}
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-300 via-violet-300 to-indigo-300 bg-clip-text text-transparent mb-2">
                      Edit Profile
                    </h2>
                    <p className="text-gray-400 text-sm">
                      Update your developer profile
                    </p>
                    <div className="flex justify-center space-x-1 mt-3">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="space-y-6">
                    {/* First Name */}
                    <div>
                      <label className="block text-sm font-medium text-purple-200 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={firstName}
                        className="w-full px-4 py-3 border border-gray-600 bg-gray-800/50 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-300 focus:bg-gray-700/50 backdrop-blur-sm hover:border-gray-500"
                        placeholder="Enter your first name"
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </div>

                    {/* Last Name */}
                    <div>
                      <label className="block text-sm font-medium text-purple-200 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={lastName}
                        className="w-full px-4 py-3 border border-gray-600 bg-gray-800/50 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-300 focus:bg-gray-700/50 backdrop-blur-sm hover:border-gray-500"
                        placeholder="Enter your last name"
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>

                    {/* Photo URL */}
                    <div>
                      <label className="block text-sm font-medium text-purple-200 mb-2">
                        Photo URL
                      </label>
                      <input
                        type="text"
                        value={photoURL}
                        className="w-full px-4 py-3 border border-gray-600 bg-gray-800/50 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-300 focus:bg-gray-700/50 backdrop-blur-sm hover:border-gray-500"
                        placeholder="https://example.com/your-photo.jpg"
                        onChange={(e) => setPhotoURL(e.target.value)}
                      />
                    </div>

                    {/* Age and Gender Row */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* Age */}
                      <div>
                        <label className="block text-sm font-medium text-purple-200 mb-2">
                          Age
                        </label>
                        <input
                          type="number"
                          min="18"
                          max="100"
                          value={age}
                          className="w-full px-4 py-3 border border-gray-600 bg-gray-800/50 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-300 focus:bg-gray-700/50 backdrop-blur-sm hover:border-gray-500"
                          placeholder="25"
                          onChange={(e) => setAge(e.target.value)}
                        />
                      </div>

                      {/* Gender */}
                      <div>
                        <label className="block text-sm font-medium text-purple-200 mb-2">
                          Gender
                        </label>
                        <select
                          value={gender}
                          className="w-full px-4 py-3 border border-gray-600 bg-gray-800/50 text-white rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-300 focus:bg-gray-700/50 backdrop-blur-sm hover:border-gray-500"
                          onChange={(e) => setGender(e.target.value)}
                        >
                          <option value="" className="bg-gray-800">
                            Select Gender
                          </option>
                          <option value="male" className="bg-gray-800">
                            Male
                          </option>
                          <option value="female" className="bg-gray-800">
                            Female
                          </option>
                          <option value="other" className="bg-gray-800">
                            Other
                          </option>
                        </select>
                      </div>
                    </div>

                    {/* About */}
                    <div>
                      <label className="block text-sm font-medium text-purple-200 mb-2">
                        About
                      </label>
                      <textarea
                        value={about}
                        className="w-full px-4 py-3 border border-gray-600 bg-gray-800/50 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-300 focus:bg-gray-700/50 backdrop-blur-sm hover:border-gray-500 resize-none"
                        rows="4"
                        maxLength="500"
                        placeholder="Tell us about yourself, your skills, and what you're passionate about..."
                        onChange={(e) => setAbout(e.target.value)}
                      />
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-400">
                          {about.length}/500 characters
                        </span>
                        <div className="w-24 bg-gray-700 rounded-full h-1">
                          <div
                            className="bg-gradient-to-r from-purple-400 to-indigo-400 h-1 rounded-full transition-all duration-300"
                            style={{ width: `${(about.length / 500) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="mt-6 bg-red-900/30 border border-red-400/30 text-red-300 px-4 py-3 rounded-xl text-sm backdrop-blur-sm">
                      {error}
                    </div>
                  )}

                  {/* Save Button */}
                  <div className="mt-8">
                    <button
                      onClick={saveProfile}
                      className="w-full bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 text-white py-4 px-4 rounded-xl font-semibold hover:from-purple-500 hover:via-violet-500 hover:to-indigo-500 focus:ring-4 focus:ring-purple-400/30 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-purple-500/30 relative overflow-hidden group/btn"
                    >
                      <span className="relative z-10 flex items-center justify-center">
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
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Update Profile
                      </span>
                      {/* Button shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Card */}
          <div className="flex-1 max-w-md mx-auto lg:mx-0">
            <div className="sticky top-8">
              <div className="text-center mb-4">
                <h3 className="text-xl font-semibold text-purple-200 mb-2">
                  Live Preview
                </h3>
                <p className="text-gray-400 text-sm">
                  See how your profile looks
                </p>
              </div>
              <UserCard
                user={{ firstName, lastName, photoURL, age, gender, about }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Success Toast */}
      {showToast && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-green-900/80 backdrop-blur-xl border border-green-400/30 text-green-300 px-6 py-4 rounded-2xl shadow-2xl shadow-green-500/20 flex items-center space-x-3">
            <svg
              className="w-6 h-6 text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="font-medium">Profile updated successfully!</span>
          </div>
        </div>
      )}
    </div>
  );
};
export default EditProfile;
