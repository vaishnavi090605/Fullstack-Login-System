import { useState } from "react";
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

  const [editMode, setEditMode] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);

  const createImageUrl = (imagePath) => {
    if (!imagePath) {
      return "";
    }

    // Already a complete online URL
    if (
      imagePath.startsWith("http://") ||
      imagePath.startsWith("https://") ||
      imagePath.startsWith("data:")
    ) {
      return imagePath;
    }

    // Backend returned /uploads/photo.jpg
    if (imagePath.startsWith("/")) {
      return `${API_URL}${imagePath}`;
    }

    // Backend returned uploads/photo.jpg
    return `${API_URL}/${imagePath}`;
  };

  const [profileImage, setProfileImage] = useState(
    createImageUrl(savedProfileImage)
  );

  const [showPasswordForm, setShowPasswordForm] =
    useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [darkMode, setDarkMode] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

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

    setSelectedFile(file);
  };

  const uploadProfileImage = async () => {
    if (!selectedFile) {
      alert("Please select a profile photo");
      return;
    }

    if (!email) {
      alert("User email is missing");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("email", email);
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
        console.log("Backend response:", response.data);
        alert(
          "Photo uploaded, but the image path was not returned by the backend"
        );
        return;
      }

      const completeImageUrl =
        createImageUrl(returnedImagePath);

      setProfileImage(`${completeImageUrl}?t=${Date.now()}`);


      localStorage.setItem(
        "profileImage",
        returnedImagePath
      );

      setSelectedFile(null);

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
    }
  };

  const handleUpdateProfile = async () => {
    if (!name.trim() || !email.trim()) {
      alert("Name and email are required");
      return;
    }

    try {
      const response = await axios.put(
        `${API_URL}/update-profile`,
        {
          name: name.trim(),
          email: email.trim(),
        }
      );

      const updatedName =
        response.data?.name || name.trim();

      const updatedEmail =
        response.data?.email || email.trim();

      setName(updatedName);
      setEmail(updatedEmail);

      localStorage.setItem("userName", updatedName);
      localStorage.setItem("userEmail", updatedEmail);

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

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword) {
      alert("Please enter old and new passwords");
      return;
    }

    if (newPassword.length < 4) {
      alert("New password must have at least 4 characters");
      return;
    }

    try {
      await axios.put(
        `${API_URL}/change-password`,
        {
          email,
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
        "Change password error:",
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

  return (
    <div
      className={
        darkMode
          ? "dashboard-page dark-mode"
          : "dashboard-page"
      }
    >
      <header className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome, {name || "User"}!</p>
        </div>

        <div className="header-buttons">
          <button
            className="theme-button"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>

          <button
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

          <div className="profile-photo-section">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="profile-image"
                key={profileImage}
                onError={(event) => {
                  console.error(
                    "Unable to load image:",
                    profileImage
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
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />

           <button
  type="button"
  className="primary-button"
  onClick={async () => {
    if (selectedFile) {
      await uploadProfileImage();
    }

    await handleUpdateProfile();
  }}
>
  Save Changes
</button>

            {selectedFile && (
              <p className="selected-file-name">
                Selected: {selectedFile.name}
              </p>
            )}
          </div>

          <div className="profile-details">
            <label>Name</label>

            <input
              type="text"
              value={name}
              disabled={!editMode}
              onChange={(event) =>
                setName(event.target.value)
              }
            />

            <label>Email</label>

            <input
              type="email"
              value={email}
              disabled={!editMode}
              onChange={(event) =>
                setEmail(event.target.value)
              }
            />

            {!editMode ? (
              <button
                className="primary-button"
                onClick={() => setEditMode(true)}
              >
                Edit Profile
              </button>
            ) : (
              <div className="profile-action-buttons">
                <button
                  className="primary-button"
                  onClick={handleUpdateProfile}
                >
                  Save Profile
                </button>

                <button
                  className="secondary-button"
                  onClick={() => {
                    setName(userName || "");
                    setEmail(userEmail || "");
                    setEditMode(false);
                  }}
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
              className="primary-button"
              onClick={() =>
                setShowPasswordForm(true)
              }
            >
              Change Password
            </button>
          ) : (
            <div className="password-form">
              <label>Old Password</label>

              <input
                type="password"
                value={oldPassword}
                onChange={(event) =>
                  setOldPassword(event.target.value)
                }
                placeholder="Enter old password"
              />

              <label>New Password</label>

              <input
                type="password"
                value={newPassword}
                onChange={(event) =>
                  setNewPassword(event.target.value)
                }
                placeholder="Enter new password"
              />

              <button
                className="primary-button"
                onClick={handleChangePassword}
              >
                Update Password
              </button>

              <button
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