import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./register.scss";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [academy, setAcademy] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validate that passwords match before submitting
    if (password !== passwordConfirmation) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/api/register", {
        full_name: fullName, // Send full_name as per your API
        email,
        password,
        password_confirmation: passwordConfirmation, // Include password confirmation for backend validation
        academy,
      });

      alert("Registration successful!");
      window.location.href = "/login"; // Redirect to login page after successful registration
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message || "Registration failed. Please try again.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register">
      <div className="card">
        <div className="left">
          <h1>Lama Social.</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero cum,
            alias totam numquam ipsa exercitationem dignissimos, error nam,
            consequatur.
          </p>
          <span>Do you have an account?</span>
          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>
        <div className="right">
          <h1>Register</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
            />
            <select
              value={academy}
              onChange={(e) => setAcademy(e.target.value)}
              required
            >
              <option value="" disabled>
                Select Academy
              </option>
              <option value="Amman">Amman</option>
              <option value="Zarqa">Zarqa</option>
              <option value="Irbid">Irbid</option>
              <option value="Aqaba">Aqaba</option>
              <option value="Balqa">Balqa</option>
            </select>
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Registering..." : "Register"}
            </button>
          </form>
          {error && <p className="error">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default Register;
