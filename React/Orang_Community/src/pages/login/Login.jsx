import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/authContext";
import "./login.scss";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setCurrentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const currentUser = localStorage.getItem("currentUser");

    if (token && currentUser) {
      setCurrentUser(JSON.parse(currentUser));
      axios.defaults.headers["Authorization"] = `Bearer ${token}`;
      navigate("/"); // Redirect if logged in
    }
  }, [setCurrentUser, navigate]);

  const validateForm = () => {
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError("Invalid email format.");
      return false;
    }
    if (!password.trim() || password.length < 6) {
      setError("Password must be at least 6 characters.");
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Reset error

    if (!validateForm()) return;

    try {
      const response = await axios.post("http://localhost:8000/api/login", {
        email,
        password,
      });
  
      if (response.data.status) {
        // Include the profile image URL if available
        const userWithImage = {
          ...response.data.user,
          profile_image_url: response.data.user.image
            ? `http://localhost:8000/uploads/profile/${response.data.user.image}` // Adjust the URL based on your backend setup
            : null, // Set null if no image
        };
  
        setCurrentUser(userWithImage); // Set user data in context
        localStorage.setItem("currentUser", JSON.stringify(userWithImage)); // Store user data with image URL
        localStorage.setItem("token", response.data.token); // Store token
        console.log("Logged in user data:", userWithImage);
  
        // Ensure the token is attached to axios requests
        axios.defaults.headers["Authorization"] = `Bearer ${response.data.token}`;
  
        navigate("/"); // Redirect to home page
      } else {
        setError(response.data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An unexpected error occurred. Please try again.");
    }
  };
  

  return (
    <div className="login">
      <div className="card">
        <div className="left">
          <h1>Welcome Back!</h1>
          <p>Log in to access exclusive features and stay connected with the community.</p>
          <span>Don't have an account?</span>
          <span
            className="register-text"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </div>
        <div className="right">
          <h1>Login</h1>
          <form onSubmit={handleLogin}>
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
            <button type="submit">Login</button>
          </form>
          {error && <p className="error">{error}</p>}
          <div className="register-link-mobile">
            <span className="register-now-mobile">Don't have an account? </span>
            <span
              className="register-text-mobile"
              onClick={() => navigate("/register")}
            >
              Register
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;