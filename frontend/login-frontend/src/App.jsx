import axios from "axios";
import { useState } from "react";

import "./App.css";
import Register from "./Register";
import Dashboard from "./Dashboard";
import ForgotPassword from "./ForgotPassword";

function App() {
  const [showRegister, setShowRegister] = useState(false);
  const [showForgotPassword, setShowForgotPassword] =
    useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [profileImage, setProfileImage] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8080/login",
        {
          email: email,
          password: password,
        }
      );

      if (response.data) {
        alert("Login Successful");

        setUserName(response.data.name || "");
        setProfileImage(response.data.profileImage || "");
        setIsLoggedIn(true);
      } else {
        alert("Invalid Email or Password");
      }
    } catch (error) {
      console.log(error);
      alert("Server Error");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName("");
    setProfileImage("");
    setEmail("");
    setPassword("");
    setShowRegister(false);
    setShowForgotPassword(false);
  };

  if (isLoggedIn) {
    return (
      <Dashboard
        userName={userName}
        userEmail={email}
        savedProfileImage={profileImage}
        onLogout={handleLogout}
      />
    );
  }

  if (showForgotPassword) {
    return (
      <ForgotPassword
        onBack={() => setShowForgotPassword(false)}
      />
    );
  }

  if (showRegister) {
    return (
      <div>
        <Register />

        <button
          className="switch-button"
          onClick={() => setShowRegister(false)}
        >
          Back to Login
        </button>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Welcome</h1>
        <h1> Back</h1>
        <p>Login to continue</p>

        <form onSubmit={handleLogin}>
          <label>Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            required
          />

          <label>Password</label>

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            required
          />
          <button
  type="button"
  onClick={() => setShowPassword(!showPassword)}
>
  {showPassword ? "Hide" : "Show"}
</button>

          <button type="submit">
            Login
          </button>
        </form>

        <button
          type="button"
          className="forgot-button"
          onClick={() => setShowForgotPassword(true)}
        >
          Forgot Password?
        </button>

        <button
          type="button"
          className="switch-button"
          onClick={() => setShowRegister(true)}
        >
          Create New Account
        </button>
      </div>
    </div>
  );
}

export default App;