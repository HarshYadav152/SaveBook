"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth/authContext";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, loading, checkUserAuthentication } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    profileImage: "",
    firstName: "",
    lastName: "",
    bio: "",
    location: "",
    phone: "",
    email: "",
    gender: "",
    dob: ""
  });

  const [imagePreview, setImagePreview] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});

  // Validators
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^[6-9]\d{9}$/.test(phone); // Indian 10-digit

  useEffect(() => {
    if (user) {
      setFormData({
        profileImage: user.profileImage || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        bio: user.bio || "",
        location: user.location || "",
        phone: user.phone || "",
        email: user.email || "",
        gender: user.gender || "",
        dob: user.dob ? user.dob.substring(0, 10) : ""
      });
      setImagePreview(user.profileImage || "");
      setIsDataLoaded(true);
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Live validation
    if (name === "email") {
      setErrors((prev) => ({
        ...prev,
        email: value ? (validateEmail(value) ? "" : "Invalid email address") : ""
      }));
    }
    if (name === "phone") {
      setErrors((prev) => ({
        ...prev,
        phone: value ? (validatePhone(value) ? "" : "Invalid phone number") : ""
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setErrors((prev) => ({
        ...prev,
        email: value ? (validateEmail(value) ? "" : "Invalid email address") : ""
      }));
    }
    if (name === "phone") {
      setErrors((prev) => ({
        ...prev,
        phone: value ? (validatePhone(value) ? "" : "Invalid phone number") : ""
      }));
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match("image.*")) {
        setError("Please select an image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("File size exceeds 5MB limit");
        return;
      }

      setMessage("Uploading image...");
      const fd = new FormData();
      fd.append("image", file);

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: fd,
          credentials: "include"
        });
        const result = await response.json();
        if (result.success) {
          setImagePreview(result.imageUrl);
          setFormData((prev) => ({ ...prev, profileImage: result.imageUrl }));
          setMessage("Image uploaded successfully!");
          setError("");
          setTimeout(() => setMessage(""), 2000);
        } else {
          setError(result.message || "Failed to upload image");
        }
      } catch (err) {
        setError("An error occurred while uploading the image");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    // Final validation gate
    if (errors.email || errors.phone) {
      setError("Please fix validation errors before submitting.");
      return;
    }

    try {
      const response = await fetch("/api/auth/update-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include"
      });
      const data = await response.json();

      if (data.success) {
        setMessage("Profile updated successfully!");
        setFormData({
          profileImage: data.user.profileImage,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          bio: data.user.bio,
          location: data.user.location,
          phone: data.user.phone,
          email: data.user.email,
          gender: data.user.gender,
          dob: data.user.dob ? data.user.dob.substring(0, 10) : ""
        });
        setImagePreview(data.user.profileImage);

        if (checkUserAuthentication) {
          await checkUserAuthentication();
        }

        setTimeout(() => setIsEditing(false), 500);
        setTimeout(() => setMessage(""), 2000);
      } else {
        setError(data.message || "Failed to update profile");
      }
    } catch (err) {
      setError("An error occurred while updating profile");
    }
  };

  if (loading || !isDataLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  const handleEditClick = () => setIsEditing(true);

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (user) {
      setFormData({
        profileImage: user.profileImage || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        bio: user.bio || "",
        location: user.location || "",
        phone: user.phone || "",
        email: user.email || "",
        gender: user.gender || "",
        dob: user.dob ? user.dob.substring(0, 10) : ""
      });
      setImagePreview(user.profileImage || "");
      setErrors({});
      setError("");
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden">
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              {isEditing ? "Edit Profile" : "Your Profile"}
            </h1>

            {message && (
              <div className="p-3 mb-4 bg-green-500 text-white rounded-lg">
                {message}
              </div>
            )}
            {error && (
              <div className="p-3 mb-4 bg-red-500 text-white rounded-lg">
                {error}
              </div>
            )}

            {!isEditing ? (
              <div className="space-y-6">
                {/* Avatar + username */}
                <div className="flex flex-col items-center mb-6">
                  <div className="w-24 h-24 rounded-full bg-gray-200 border-4 border-white dark:border-gray-600 shadow-lg overflow-hidden mb-4">
                    {user?.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                        <span className="text-3xl">
                          {user?.username?.charAt(0)?.toUpperCase() || "U"}
                        </span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                    {user?.username || "N/A"}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-gray-700 dark:text-gray-300">
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
                    <strong>Full Name</strong>
                    <p>{user.firstName || "N/A"} {user.lastName || ""}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
                    <strong>Email</strong>
                    <p>{user.email || "N/A"}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
                    <strong>Phone</strong>
                    <p>{user.phone || "N/A"}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
                    <strong>Gender</strong>
                    <p>{user.gender || "N/A"}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
                    <strong>Date of Birth</strong>
                    <p>{user.dob ? new Date(user.dob).toLocaleDateString() : "N/A"}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
                    <strong>Location</strong>
                    <p>{user.location || "N/A"}</p>
                  </div>
                  <div className="sm:col-span-2 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
                    <strong>Bio</strong>
                    <p>{user.bio || "N/A"}</p>
                  </div>
                </div>

                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            ) : isDataLoaded ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Avatar upload */}
                <div className="flex flex-col items-center mb-8">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full bg-gray-200 border-4 border-white dark:border-gray-700 shadow-lg overflow-hidden">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Profile Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                          <span className="text-4xl">
                            {user?.username?.charAt(0)?.toUpperCase() || "U"}
                          </span>
                        </div>
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors shadow-lg">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                </div>

                {/* Username (read-only) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Username
                  </label>
                  <div className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                    {user?.username || "N/A"}
                  </div>
                </div>

                {/* Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName || ""}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName || ""}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio || ""}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Tell us about yourself"
                  ></textarea>
                </div>

                {/* Contact info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white ${errors.email ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`}
                      placeholder="Email"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white ${errors.phone ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`}
                      placeholder="Phone"
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>
                </div>

                {/* Gender, DOB, Location */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location || ""}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter your location"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    Update Profile
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}