import axios from "axios";
import { useState } from "react";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        "https://fullstack-login-system-production.up.railway.app/register",
        {
          name: name,
          email: email,
          password: password,
        }
      );

      alert("Registration Successful");
      console.log(response.data);
    } catch (error) {
      alert("Registration Failed");
      console.log(error);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Create Account</h1>
        <p>Register to continue</p>

        <form onSubmit={handleRegister}>
          <label>Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}

export default Register;