import { useState } from "react";
import axios from "axios";
import "./Dashboard.css";

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

  const [profileImage, setProfileImage] = useState(
    savedProfileImage
      ? `https://fullstack-login-system-production.up.railway.app/register${savedProfileImage}`
      : ""
  );

  const [showPasswordForm, setShowPasswordForm] =
    useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    setSelectedFile(file);
    setProfileImage(URL.createObjectURL(file));
  };

  const uploadProfileImage = async () => {
    if (!selectedFile) {
      return;
    }

    const formData = new FormData();

    formData.append("email", email);
    formData.append("file", selectedFile);

    const response = await axios.post(
      "https://fullstack-login-system-production.up.railway.app/upload-profile-image",
      formData
    );

    if (response.data?.profileImage) {
      setProfileImage(
        `https://fullstack-login-system-production.up.railway.app/register${response.data.profileImage}`
      );
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        "https://fullstack-login-system-production.up.railway.app/update-profile",
        {
          name: name,
          email: email,
        }
      );

      if (!response.data) {
        alert("Profile Update Failed");
        return;
      }

      await uploadProfileImage();

      alert("Profile Updated Successfully");

      setEditMode(false);
      setSelectedFile(null);
    } catch (error) {
      console.log(error);
      alert("Profile Update Failed");
    }
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword) {
      alert("Please fill all password fields");
      return;
    }

    if (newPassword.length < 4) {
      alert(
        "New password must have at least 4 characters"
      );
      return;
    }

    try {
      const response = await axios.put(
        "https://fullstack-login-system-production.up.railway.app/change-password",
        {
          email: email,
          oldPassword: oldPassword,
          newPassword: newPassword,
        }
      );

      if (response.data === true) {
        alert("Password Changed Successfully");

        setOldPassword("");
        setNewPassword("");
        setShowPasswordForm(false);
      } else {
        alert("Old Password is Incorrect");
      }
    } catch (error) {
      console.log(error);
      alert("Password Change Failed");
    }
  };

  return (
    <div className={`dashboard-container ${darkMode ? "dark-mode" : ""}`}>
      <header className="dashboard-header">
        <div>
          <h2>My Dashboard</h2>
          <p>Welcome back, {name || "User"}!</p>
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
    onClick={onLogout}
  >
    Logout
  </button>

</div>
      </header>

      <section className="profile-section">
        {profileImage ? (
          <img
            src={profileImage}
            alt="Profile"
            className="profile-picture"
          />
        ) : (
          <div className="profile-icon">
            {(name || "U").charAt(0).toUpperCase()}
          </div>
        )}

        <div className="profile-details">
          {editMode ? (
            <>
              <input
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
              />

              <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
              />

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />

              <button
                className="save-button"
                onClick={handleUpdate}
              >
                Save Changes
              </button>

              <button
                className="cancel-button"
                onClick={() => setEditMode(false)}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <h3>{name || "User"}</h3>
              <p>{email || "Registered User"}</p>

              <button
                className="edit-button"
                onClick={() => setEditMode(true)}
              >
                Edit Profile
              </button>
            </>
          )}
        </div>
      </section>

      <section className="password-section">
        <button
          className="change-password-button"
          onClick={() =>
            setShowPasswordForm(!showPasswordForm)
          }
        >
          Change Password
        </button>

        {showPasswordForm && (
          <div className="password-form">
            <input
              type="password"
              placeholder="Enter old password"
              value={oldPassword}
              onChange={(event) =>
                setOldPassword(event.target.value)
              }
            />

            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(event) =>
                setNewPassword(event.target.value)
              }
            />

            <button
              className="save-button"
              onClick={handleChangePassword}
            >
              Save New Password
            </button>

            <button
              className="cancel-button"
              onClick={() => {
                setShowPasswordForm(false);
                setOldPassword("");
                setNewPassword("");
              }}
            >
              Cancel
            </button>
          </div>
        )}
      </section>

      <section className="statistics-section">
        <div className="stat-card">
          <h3>1</h3>
          <p>Active Account</p>
        </div>

        <div className="stat-card">
          <h3>100%</h3>
          <p>Profile Status</p>
        </div>

        <div className="stat-card">
          <h3>Successful</h3>
          <p>Login Status</p>
        </div>
      </section>

      <section className="welcome-section">
        <h2>Welcome to your account 🎉</h2>
        <p>
          Your profile is connected to the database.
        </p>
      </section>
    </div>
  );
}

export default Dashboard;