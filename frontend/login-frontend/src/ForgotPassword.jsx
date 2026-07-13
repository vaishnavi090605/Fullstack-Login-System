import { useState } from "react";
import axios from "axios";
import "./App.css";

function ForgotPassword({ onBack }) {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleReset = async (event) => {
    event.preventDefault();

    if (newPassword.length < 4) {
      alert("Password must have at least 4 characters");
      return;
    }

    try {
      const response = await axios.put(
        "http://localhost:8080/forgot-password",
        {
          email: email,
          newPassword: newPassword,
        }
      );

      if (response.data === true) {
        alert("Password Reset Successfully");
        onBack();
      } else {
        alert("Email Not Found");
      }
    } catch (error) {
      console.log(error);
      alert("Password Reset Failed");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Reset Password</h1>
        <p>Enter your registered email</p>

        <form onSubmit={handleReset}>
          <label>Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label>New Password</label>

          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(event) =>
              setNewPassword(event.target.value)
            }
            required
          />

          <button type="submit">
            Reset Password
          </button>
        </form>

        <button
          type="button"
          className="switch-button"
          onClick={onBack}
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}

export default ForgotPassword;