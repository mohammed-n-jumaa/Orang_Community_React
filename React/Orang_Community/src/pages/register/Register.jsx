import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import styles for Toastify
import "./register.scss";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [academy, setAcademy] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const validateField = (field, value) => {
    const errors = { ...validationErrors };

    if (field === "fullName" && !value.trim()) {
      errors.fullName = "Full Name is required.";
    } else if (field === "email" && (!value.trim() || !/\S+@\S+\.\S+/.test(value))) {
      errors.email = "Invalid email format.";
    } else if (field === "password" && value.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    } else if (field === "passwordConfirmation" && value !== password) {
      errors.passwordConfirmation = "Passwords do not match.";
    } else {
      delete errors[field];
    }

    setValidationErrors(errors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (Object.keys(validationErrors).length > 0) {
      setError("Please fix the validation errors.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/api/register", {
        full_name: fullName,
        email,
        password,
        password_confirmation: passwordConfirmation,
        academy,
      });

      // Show success toast
      toast.success("Registration successful!");
      window.location.href = "/login";
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message || "Registration failed. Please try again.");
      } else {
        setError("An unexpected error occurred.");
      }

      // Show error toast
      toast.error(error.response?.data?.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleButtonClick = () => {
    // Show the toast when the "Register" button is clicked
    toast.info("Account has been created");
  };

  return (
    <div className="register">
      <div className="card">
        <div className="left">
          <h1>Welcome!</h1>
          <p>
            Join our community and explore amazing features designed just for you.
          </p>
          <span>Already have an account?</span>
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
              onChange={(e) => {
                setFullName(e.target.value);
                validateField("fullName", e.target.value);
              }}
            />
            {validationErrors.fullName && <p className="error">{validationErrors.fullName}</p>}

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                validateField("email", e.target.value);
              }}
            />
            {validationErrors.email && <p className="error">{validationErrors.email}</p>}

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                validateField("password", e.target.value);
              }}
            />
            {validationErrors.password && <p className="error">{validationErrors.password}</p>}

            <input
              type="password"
              placeholder="Confirm Password"
              value={passwordConfirmation}
              onChange={(e) => {
                setPasswordConfirmation(e.target.value);
                validateField("passwordConfirmation", e.target.value);
              }}
            />
            {validationErrors.passwordConfirmation && (
              <p className="error">{validationErrors.passwordConfirmation}</p>
            )}

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

            <button
              type="submit"
              disabled={isLoading}
              onClick={handleButtonClick} // Trigger toast on button click
            >
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
