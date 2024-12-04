import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom"; // Correct import
import axios from "axios"; // Use configured Axios instance
import { AuthContext } from "../../context/authContext"; // Import AuthContext
import "./login.scss";
// export { AuthProvider };

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate(); // Correct usage of useNavigate
  const { setCurrentUser } = useContext(AuthContext); // Access setCurrentUser from AuthContext

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/login", {
        email,
        password,
      });
  
      console.log("Response from API:", response.data);
  
      if (response.data.status) {
        setCurrentUser(response.data.user); // Store user in context
        localStorage.setItem("currentUser", JSON.stringify(response.data.user)); 
        localStorage.setItem("token", response.data.token); // Store token
        navigate("/"); // Redirect after successful login
  
        // Navigate to home or dashboard
        navigate("/"); 
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
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>
          {error && <p className="error">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default Login;
