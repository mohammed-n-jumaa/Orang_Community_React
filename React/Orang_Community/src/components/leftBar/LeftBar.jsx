import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { FaHome, FaUserCircle, FaHeart, FaBookmark, FaSignOutAlt } from "react-icons/fa";
import "./leftBar.scss";

const LeftBar = () => {
  const { currentUser, setCurrentUser } = useContext(AuthContext); // Assuming you have a function to update user context
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear token and user data from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");  // Remove any other related user data from localStorage

    // Update context to reflect the logged-out state
    setCurrentUser(null);

    // Redirect to the login page
    navigate("/login");
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
              <Link to="/login" onClick={handleLogout} className="link">Logout</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftBar;
