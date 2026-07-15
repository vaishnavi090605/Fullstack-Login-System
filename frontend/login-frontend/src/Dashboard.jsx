import { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";

const API_URL =
  "https://fullstack-login-system-production.up.railway.app";

function Dashboard({
  userName,
  userEmail,
  savedProfileImage,
  onLogout,
}) {
  const [name, setName] = useState(userName || "");
  const [email, setEmail] = useState(userEmail || "");

  const [originalName, setOriginalName] = useState(
    userName || ""
  );
  const [originalEmail, setOriginalEmail] = useState(
    userEmail || ""
  );

  const [editMode, setEditMode] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [uploadingPhoto, setUploadingPhoto] =
    useState(false);

  const [showPasswordForm, setShowPasswordForm] =
    useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [darkMode, setDarkMode] = useState(false);

  const createImageUrl = (imagePath) => {
    if (!imagePath) {
      return "";
    }

    if (
      imagePath.startsWith("http://") ||
      imagePath.startsWith("https://") ||
      imagePath.startsWith("data:") ||
      imagePath.startsWith("blob:")
    ) {
      return imagePath;
    }

    if (imagePath.startsWith("/")) {
      return `${API_URL}${imagePath}`;
    }

    return `${API_URL}/${imagePath}`;
  };

  const initialImage =
    savedProfileImage ||
    localStorage.getItem("profileImage") ||
    "";

  const [profileImage, setProfileImage] = useState(
    createImageUrl(initialImage)
  );

  useEffect(() => {
    const storedDarkMode =
      localStorage.getItem("darkMode") === "true";

    setDarkMode(storedDarkMode);
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "darkMode",
      String(darkMode)
    );
  }, [darkMode]);

  useEffect(() => {
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5 MB");
      event.target.value = "";
      return;
    }

    if (previewImage) {
      URL.revokeObjectURL(previewImage);
    }

    const temporaryUrl = URL.createObjectURL(file);

    setSelectedFile(file);
    setPreviewImage(temporaryUrl);
  };

  const uploadProfileImage = async () => {
    if (!selectedFile) {
      alert("Please choose a profile photo");
      return;
    }

    if (!email.trim()) {
      alert("User email is missing");
      return;
    }

    try {
      setUploadingPhoto(true);

      const formData = new FormData();

      formData.append("email", email.trim());
      formData.append("file", selectedFile);

      const response = await axios.post(
        `${API_URL}/upload-profile-image`,
        formData
      );

      const returnedImagePath =
        response.data?.profileImage ||
        response.data?.profile_image ||
        response.data?.imageUrl ||
        response.data?.imagePath;

      if (!returnedImagePath) {
        console.log(
          "Backend upload response:",
          response.data
        );

        alert(
          "Photo uploaded, but the backend did not return the image path"
        );

        return;
      }

      const completeImageUrl =
        createImageUrl(returnedImagePath);

      const separator =
        completeImageUrl.includes("?") ? "&" : "?";

      setProfileImage(
        `${completeImageUrl}${separator}t=${Date.now()}`
      );

      localStorage.setItem(
        "profileImage",
        returnedImagePath
      );

      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }

      setPreviewImage("");
      setSelectedFile(null);

      const fileInput = document.getElementById(
        "profile-photo-input"
      );

      if (fileInput) {
        fileInput.value = "";
      }

      alert("Profile photo updated successfully");
    } catch (error) {
      console.error(
        "Profile photo upload error:",
        error.response?.data || error
      );

      alert(
        error.response?.data?.message ||
          "Profile photo upload failed"
      );
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleUpdateProfile = async () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedEmail) {
      alert("Name and email are required");
      return;
    }

    try {
      const response = await axios.put(
        `${API_URL}/update-profile`,
        {
          name: trimmedName,
          email: trimmedEmail,
        }
      );

      const updatedName =
        response.data?.name || trimmedName;

      const updatedEmail =
        response.data?.email || trimmedEmail;

      setName(updatedName);
      setEmail(updatedEmail);

      setOriginalName(updatedName);
      setOriginalEmail(updatedEmail);

      localStorage.setItem(
        "userName",
        updatedName
      );

      localStorage.setItem(
        "userEmail",
        updatedEmail
      );

      setEditMode(false);

      alert("Profile updated successfully");
    } catch (error) {
      console.error(
        "Profile update error:",
        error.response?.data || error
      );

      alert(
        error.response?.data?.message ||
          "Profile update failed"
      );
    }
  };

  const handleCancelEdit = () => {
    setName(originalName);
    setEmail(originalEmail);
    setEditMode(false);
  };

  const handleChangePassword = async () => {
    if (!oldPassword.trim() || !newPassword.trim()) {
      alert("Please enter old and new passwords");
      return;
    }

    if (newPassword.length < 4) {
      alert(
        "New password must have at least 4 characters"
      );
      return;
    }

    try {
      await axios.put(
        `${API_URL}/change-password`,
        {
          email: email.trim(),
          oldPassword,
          newPassword,
        }
      );

      setOldPassword("");
      setNewPassword("");
      setShowPasswordForm(false);

      alert("Password changed successfully");
    } catch (error) {
      console.error(
        "Password change error:",
        error.response?.data || error
      );

      alert(
        error.response?.data?.message ||
          "Password change failed"
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("profileImage");

    if (onLogout) {
      onLogout();
    }
  };

  const displayedImage =
    previewImage || profileImage;

  return (
    <div
      className={
        darkMode
          ? "dashboard-page dark-mode"
          : "dashboard-page"
      }
    >
      <header className="dashboard-header">
        <div className="welcome-section">
          <h1>Dashboard</h1>
          <p>Welcome, {name || "User"}!</p>
        </div>

        <div className="header-buttons">
          <button
            type="button"
            className="theme-button"
            onClick={() =>
              setDarkMode((current) => !current)
            }
          >
            {darkMode
              ? "☀️ Light Mode"
              : "🌙 Dark Mode"}
          </button>

          <button
            type="button"
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        <section className="profile-card">
          <h2>My Profile</h2>

          <div className="profile-photo-area">
            <div className="profile-photo-section">
              {displayedImage ? (
                <img
                  src={displayedImage}
                  alt="Profile"
                  className="profile-image"
                  onError={(event) => {
                    console.error(
                      "Unable to load image:",
                      displayedImage
                    );

                    event.currentTarget.style.display =
                      "none";
                  }}
                />
              ) : (
                <div className="profile-placeholder">
                  👤
                </div>
              )}

              <input
                id="profile-photo-input"
                className="profile-file-input"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>

            {selectedFile && (
              <p className="selected-file-name">
                Selected: {selectedFile.name}
              </p>
            )}

            <button
              type="button"
              className="photo-save-button"
              onClick={uploadProfileImage}
              disabled={
                !selectedFile || uploadingPhoto
              }
            >
              {uploadingPhoto
                ? "Uploading..."
                : "Save Photo"}
            </button>
          </div>

          <div className="profile-details">
            <label htmlFor="profile-name">
              Name
            </label>

            <input
              id="profile-name"
              type="text"
              value={name}
              disabled={!editMode}
              onChange={(event) =>
                setName(event.target.value)
              }
            />

            <label htmlFor="profile-email">
              Email
            </label>

            <input
              id="profile-email"
              type="email"
              value={email}
              disabled={!editMode}
              onChange={(event) =>
                setEmail(event.target.value)
              }
            />

            {!editMode ? (
              <button
                type="button"
                className="primary-button"
                onClick={() => setEditMode(true)}
              >
                Edit Profile
              </button>
            ) : (
              <div className="profile-action-buttons">
                <button
                  type="button"
                  className="primary-button"
                  onClick={handleUpdateProfile}
                >
                  Save Profile
                </button>

                <button
                  type="button"
                  className="secondary-button"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </section>

        <section className="password-card">
          <h2>Password Settings</h2>

          {!showPasswordForm ? (
            <button
              type="button"
              className="primary-button"
              onClick={() =>
                setShowPasswordForm(true)
              }
            >
              Change Password
            </button>
          ) : (
            <div className="password-form">
              <label htmlFor="old-password">
                Old Password
              </label>

              <input
                id="old-password"
                type="password"
                value={oldPassword}
                onChange={(event) =>
                  setOldPassword(event.target.value)
                }
                placeholder="Enter old password"
              />

              <label htmlFor="new-password">
                New Password
              </label>

              <input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(event) =>
                  setNewPassword(event.target.value)
                }
                placeholder="Enter new password"
              />

              <div className="password-action-buttons">
                <button
                  type="button"
                  className="primary-button"
                  onClick={handleChangePassword}
                >
                  Update Password
                </button>

                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => {
                    setOldPassword("");
                    setNewPassword("");
                    setShowPasswordForm(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </section>

        <section className="statistics-section">
          <div className="stat-card">
            <h3>Account</h3>
            <p>Active</p>
          </div>

          <div className="stat-card">
            <h3>Profile</h3>
            <p>
              {profileImage
                ? "Photo Added"
                : "Photo Not Added"}
            </p>
          </div>

          <div className="stat-card">
            <h3>Security</h3>
            <p>Password Protected</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;