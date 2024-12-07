import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/authContext";
import "./login.scss";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setCurrentUser } = useContext(AuthContext); // Access the context
  const navigate = useNavigate();

  // Check localStorage for token and user data when the component mounts
  useEffect(() => {
    const token = localStorage.getItem("token");
    const currentUser = localStorage.getItem("currentUser");

    if (token && currentUser) {
      setCurrentUser(JSON.parse(currentUser)); // Set the user from localStorage to the context
      axios.defaults.headers["Authorization"] = `Bearer ${token}`; // Set the axios authorization header
      navigate("/"); // Redirect to home page if the user is already logged in
    }
  }, [setCurrentUser, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
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
          <h1>Hello World.</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero cum,
            alias totam numquam ipsa exercitationem dignissimos, error nam,
            consequatur.
          </p>
          <span>Don't you have an account?</span>
          <button onClick={() => navigate("/register")}>Register</button>
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
        </div>
      </div>
    </div>
  );
};

export default Login;
