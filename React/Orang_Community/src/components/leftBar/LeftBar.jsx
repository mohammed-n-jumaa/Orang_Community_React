import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { FaHome, FaUserCircle, FaHeart, FaBookmark, FaSignOutAlt } from "react-icons/fa";
import axios from "axios";
import "./leftBar.scss";

const LeftBar = () => {
  const { currentUser, setCurrentUser } = useContext(AuthContext); // Assuming you have a function to update user context
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Send a logout request to the backend
      await axios.post("http://localhost:8000/api/logout", {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // Clear token from localStorage and update context
      localStorage.removeItem("token");
      setCurrentUser(null); // Clear user context

      // Redirect to login page
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="leftBar">
      <div className="container">
        <div className="menu">
          <div className="item">
            <div className="icon-wrapper">
              <FaHome className="icon" />
              <Link to="/" className="link">Home</Link>
            </div>
          </div>

          <div className="item">
            <div className="icon-wrapper">
              <FaUserCircle className="icon" />
              <Link to={`/profile/${currentUser?.id}`} className="link">Profile</Link>
            </div>
          </div>

          <div className="item">
            <div className="icon-wrapper">
              <FaHeart className="icon" />
              <Link to="/like" className="link">Like</Link>
            </div>
          </div>

          <div className="item">
            <div className="icon-wrapper">
              <FaBookmark className="icon" />
              <Link to="/save" className="link">Saved</Link>
            </div>
          </div>

          <div className="item">
            <div className="icon-wrapper">
              <FaSignOutAlt className="icon" />
              <a href="#" onClick={handleLogout} className="link">
                Logout
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftBar;