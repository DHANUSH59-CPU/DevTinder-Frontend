import { useState } from "react";
import { Eye, EyeOff, Code, ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { addUser } from "../utils/userSlice";

const Signup = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1 - Required
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",

    // Step 2 - Personal
    age: "",
    gender: "",
    phone: "",
    dateOfBirth: "",

    // Step 3 - Profile
    photoURL: "",
    skills: [],
    about: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Validation functions
  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (
      formData.firstName.length < 3 ||
      formData.firstName.length > 25
    ) {
      newErrors.firstName = "First name must be 3-25 characters";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (formData.lastName.length < 3 || formData.lastName.length > 25) {
      newErrors.lastName = "Last name must be 3-25 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const validateStep2 = () => {
    const newErrors = {};

    if (
      formData.age &&
      (isNaN(formData.age) || formData.age < 18 || formData.age > 100)
    ) {
      newErrors.age = "Age must be between 18 and 100";
    }

    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors = {};

    if (formData.about && formData.about.length > 500) {
      newErrors.about = "About section cannot exceed 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  // Handle skills
  const addSkill = (skill) => {
    if (skill.trim() && !formData.skills.includes(skill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skill.trim()],
      }));
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  // Navigation functions
  const nextStep = () => {
    let isValid = false;

    switch (currentStep) {
      case 1:
        isValid = validateStep1();
        break;
      case 2:
        isValid = validateStep2();
        break;
      case 3:
        isValid = validateStep3();
        break;
      default:
        isValid = true;
    }

    if (isValid && currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  // Handle form submission
  const handleSubmit = async () => {
    if (!validateStep1() || !validateStep2() || !validateStep3()) {
      return;
    }

    setIsLoading(true);

    try {
      const submitData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      };

      // Add optional fields only if provided
      if (formData.age) submitData.age = parseInt(formData.age);
      if (formData.gender) submitData.gender = formData.gender;
      if (formData.phone) submitData.phone = formData.phone;
      if (formData.dateOfBirth) submitData.dateOfBirth = formData.dateOfBirth;
      if (formData.photoURL) submitData.photoURL = formData.photoURL;
      if (formData.skills.length > 0) submitData.skills = formData.skills;
      if (formData.about) submitData.about = formData.about;

      const response = await axios.post(BASE_URL + "/signup", submitData);

      // Success - now automatically log the user in
      try {
        const loginResponse = await axios.post(
          BASE_URL + "/login",
          {
            email: formData.email,
            password: formData.password,
          },
          { withCredentials: true }
        );

        if (loginResponse.status === 200) {
          // Store user data in Redux
          dispatch(addUser(loginResponse.data));
          // Success message and redirect to feed
          alert(
            "Welcome to DevTinder! Your account has been created successfully."
          );
          navigate("/");
        }
      } catch (loginError) {
        // If auto-login fails, redirect to login page
        alert("Account created successfully! Please login to continue.");
        navigate("/login");
      }
    } catch (error) {
      console.error("Signup error:", error);
      const errorMessage =
        error.response?.data || "Signup failed. Please try again.";
      setErrors({ submit: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  // Password strength checker
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, text: "", color: "" };

    let strength = 0;
    if (password.length >= 6) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const levels = [
      { text: "Very Weak", color: "text-red-500" },
      { text: "Weak", color: "text-orange-500" },
      { text: "Fair", color: "text-yellow-500" },
      { text: "Good", color: "text-blue-500" },
      { text: "Strong", color: "text-green-500" },
    ];

    return { strength, ...levels[Math.min(strength, 4)] };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 rounded-2xl mb-6 shadow-2xl shadow-purple-500/30 border border-purple-400/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-transparent animate-pulse"></div>
            <Code className="w-10 h-10 text-white relative z-10" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Join DevTinder</h1>
          <p className="text-gray-300 text-lg">Enter the Developer Matrix</p>
        </div>
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    step < currentStep
                      ? "bg-green-500 border-green-500 text-white"
                      : step === currentStep
                      ? "bg-purple-600 border-purple-600 text-white"
                      : "border-gray-600 text-gray-400"
                  }`}
                >
                  {step < currentStep ? <Check className="w-5 h-5" /> : step}
                </div>
                {step < 3 && (
                  <div
                    className={`w-16 h-1 mx-2 transition-all duration-300 ${
                      step < currentStep ? "bg-green-500" : "bg-gray-600"
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <span className="text-gray-300 text-sm">
              Step {currentStep} of 3:{" "}
              {currentStep === 1
                ? "Basic Information"
                : currentStep === 2
                ? "Personal Details"
                : "Profile Setup"}
            </span>
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-gray-900/90 border border-gray-700/50 rounded-3xl shadow-2xl p-8 relative">
          <div className="space-y-6 relative z-10">
            {/* Global Error Message */}
            {errors.submit && (
              <div className="bg-red-900/30 border border-red-400/30 text-red-300 px-4 py-3 rounded-xl text-sm">
                {errors.submit}
              </div>
            )}

            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white text-center mb-6">
                  Basic Information
                </h2>

                {/* First Name */}
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-200 mb-3"
                  >
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    className={`w-full px-4 py-4 border bg-gray-800 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-300 focus:bg-gray-700 ${
                      errors.firstName
                        ? "border-red-500"
                        : "border-gray-600 hover:border-gray-500"
                    }`}
                    placeholder="Enter your first name"
                    disabled={isLoading}
                  />
                  {errors.firstName && (
                    <p className="text-red-400 text-sm mt-2">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-200 mb-3"
                  >
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    className={`w-full px-4 py-4 border bg-gray-800 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-300 focus:bg-gray-700 ${
                      errors.lastName
                        ? "border-red-500"
                        : "border-gray-600 hover:border-gray-500"
                    }`}
                    placeholder="Enter your last name"
                    disabled={isLoading}
                  />
                  {errors.lastName && (
                    <p className="text-red-400 text-sm mt-2">
                      {errors.lastName}
                    </p>
                  )}
                </div>
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-200 mb-3"
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`w-full px-4 py-4 border bg-gray-800 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-300 focus:bg-gray-700 ${
                      errors.email
                        ? "border-red-500"
                        : "border-gray-600 hover:border-gray-500"
                    }`}
                    placeholder="developer@example.com"
                    disabled={isLoading}
                  />
                  {errors.email && (
                    <p className="text-red-400 text-sm mt-2">{errors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-200 mb-3"
                  >
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      className={`w-full px-4 py-4 border bg-gray-800 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-300 focus:bg-gray-700 pr-12 ${
                        errors.password
                          ? "border-red-500"
                          : "border-gray-600 hover:border-gray-500"
                      }`}
                      placeholder="Create a strong password"
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
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              passwordStrength.strength <= 1
                                ? "bg-red-500"
                                : passwordStrength.strength <= 2
                                ? "bg-orange-500"
                                : passwordStrength.strength <= 3
                                ? "bg-yellow-500"
                                : passwordStrength.strength <= 4
                                ? "bg-blue-500"
                                : "bg-green-500"
                            }`}
                            style={{
                              width: `${
                                (passwordStrength.strength / 5) * 100
                              }%`,
                            }}
                          ></div>
                        </div>
                        <span className={`text-sm ${passwordStrength.color}`}>
                          {passwordStrength.text}
                        </span>
                      </div>
                    </div>
                  )}
                  {errors.password && (
                    <p className="text-red-400 text-sm mt-2">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-200 mb-3"
                  >
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        handleInputChange("confirmPassword", e.target.value)
                      }
                      className={`w-full px-4 py-4 border bg-gray-800 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-300 focus:bg-gray-700 pr-12 ${
                        errors.confirmPassword
                          ? "border-red-500"
                          : "border-gray-600 hover:border-gray-500"
                      }`}
                      placeholder="Confirm your password"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-400 text-sm mt-2">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>
            )}
            {/* Step 2: Personal Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white text-center mb-6">
                  Personal Details
                </h2>
                <p className="text-gray-400 text-center mb-6">
                  Help others find you (optional)
                </p>

                {/* Age and Gender Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Age */}
                  <div>
                    <label
                      htmlFor="age"
                      className="block text-sm font-medium text-gray-200 mb-3"
                    >
                      Age
                    </label>
                    <input
                      type="number"
                      id="age"
                      min="18"
                      max="100"
                      value={formData.age}
                      onChange={(e) => handleInputChange("age", e.target.value)}
                      className={`w-full px-4 py-4 border bg-gray-800 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-300 focus:bg-gray-700 ${
                        errors.age
                          ? "border-red-500"
                          : "border-gray-600 hover:border-gray-500"
                      }`}
                      placeholder="25"
                      disabled={isLoading}
                    />
                    {errors.age && (
                      <p className="text-red-400 text-sm mt-2">{errors.age}</p>
                    )}
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-3">
                      Gender
                    </label>
                    <div className="space-y-2">
                      {["male", "female", "other"].map((gender) => (
                        <label
                          key={gender}
                          className="flex items-center cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="gender"
                            value={gender}
                            checked={formData.gender === gender}
                            onChange={(e) =>
                              handleInputChange("gender", e.target.value)
                            }
                            className="w-4 h-4 text-purple-500 bg-gray-800 border-gray-600 focus:ring-purple-400 focus:ring-2"
                            disabled={isLoading}
                          />
                          <span className="ml-3 text-gray-300 capitalize">
                            {gender}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-200 mb-3"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className={`w-full px-4 py-4 border bg-gray-800 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-300 focus:bg-gray-700 ${
                      errors.phone
                        ? "border-red-500"
                        : "border-gray-600 hover:border-gray-500"
                    }`}
                    placeholder="1234567890"
                    disabled={isLoading}
                  />
                  {errors.phone && (
                    <p className="text-red-400 text-sm mt-2">{errors.phone}</p>
                  )}
                </div>

                {/* Date of Birth */}
                <div>
                  <label
                    htmlFor="dateOfBirth"
                    className="block text-sm font-medium text-gray-200 mb-3"
                  >
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={(e) =>
                      handleInputChange("dateOfBirth", e.target.value)
                    }
                    className="w-full px-4 py-4 border border-gray-600 bg-gray-800 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-300 focus:bg-gray-700 hover:border-gray-500"
                    disabled={isLoading}
                  />
                </div>
              </div>
            )}
            {/* Step 3: Profile Setup */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white text-center mb-6">
                  Profile Setup
                </h2>
                <p className="text-gray-400 text-center mb-6">
                  Make your profile stand out (optional)
                </p>

                {/* Profile Photo URL */}
                <div>
                  <label
                    htmlFor="photoURL"
                    className="block text-sm font-medium text-gray-200 mb-3"
                  >
                    Profile Photo URL
                  </label>
                  <input
                    type="url"
                    id="photoURL"
                    value={formData.photoURL}
                    onChange={(e) =>
                      handleInputChange("photoURL", e.target.value)
                    }
                    className="w-full px-4 py-4 border border-gray-600 bg-gray-800 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-300 focus:bg-gray-700 hover:border-gray-500"
                    placeholder="https://example.com/your-photo.jpg"
                    disabled={isLoading}
                  />
                  {formData.photoURL && (
                    <div className="mt-4 flex justify-center">
                      <img
                        src={formData.photoURL}
                        alt="Profile preview"
                        className="w-24 h-24 rounded-full object-cover border-2 border-purple-400"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Skills */}
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-3">
                    Skills
                  </label>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Type a skill and press Enter"
                      className="w-full px-4 py-4 border border-gray-600 bg-gray-800 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-300 focus:bg-gray-700 hover:border-gray-500"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addSkill(e.target.value);
                          e.target.value = "";
                        }
                      }}
                      disabled={isLoading}
                    />
                    {formData.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 text-sm font-medium bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-purple-200 border border-purple-400/30 rounded-full"
                          >
                            {skill}
                            <button
                              type="button"
                              onClick={() => removeSkill(skill)}
                              className="ml-2 text-purple-300 hover:text-white transition-colors duration-200"
                              disabled={isLoading}
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* About */}
                <div>
                  <label
                    htmlFor="about"
                    className="block text-sm font-medium text-gray-200 mb-3"
                  >
                    About Me
                  </label>
                  <textarea
                    id="about"
                    rows="4"
                    value={formData.about}
                    onChange={(e) => handleInputChange("about", e.target.value)}
                    className={`w-full px-4 py-4 border bg-gray-800 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-300 focus:bg-gray-700 resize-none ${
                      errors.about
                        ? "border-red-500"
                        : "border-gray-600 hover:border-gray-500"
                    }`}
                    placeholder="Tell others about yourself, your interests, and what you're looking for..."
                    disabled={isLoading}
                  />
                  <div className="flex justify-between items-center mt-2">
                    {errors.about && (
                      <p className="text-red-400 text-sm">{errors.about}</p>
                    )}
                    <span
                      className={`text-sm ml-auto ${
                        formData.about.length > 450
                          ? "text-red-400"
                          : formData.about.length > 400
                          ? "text-yellow-400"
                          : "text-gray-400"
                      }`}
                    >
                      {formData.about.length}/500
                    </span>
                  </div>
                </div>
              </div>
            )}
            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-6">
              {/* Back Button */}
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1 || isLoading}
                className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  currentStep === 1 || isLoading
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-gray-700 text-white hover:bg-gray-600 transform hover:scale-105"
                }`}
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </button>

              {/* Next/Submit Button */}
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={isLoading}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-purple-500 hover:via-violet-500 hover:to-indigo-500 focus:ring-4 focus:ring-purple-400/30 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  Next
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="flex items-center px-8 py-3 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:from-green-500 hover:via-emerald-500 hover:to-teal-500 focus:ring-4 focus:ring-green-400/30 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      Create Account
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Login Link */}
          <div className="text-center mt-8 pt-6 border-t border-gray-700">
            <p className="text-gray-300">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-purple-400 hover:text-purple-300 font-semibold transition-colors duration-200 underline decoration-dotted"
                disabled={isLoading}
                style={{
                  cursor: "pointer",
                  pointerEvents: "auto",
                  position: "relative",
                  zIndex: 99999,
                }}
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
