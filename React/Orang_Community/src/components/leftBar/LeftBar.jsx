import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { FaHome, FaUserCircle, FaHeart, FaBookmark, FaSignOutAlt } from "react-icons/fa"; // Font Awesome Icons
import "./leftBar.scss";
import "./leftBar.scss";
import Friends from "../../assets/1.png";
import Groups from "../../assets/2.png";
import Market from "../../assets/3.png";
import Watch from "../../assets/4.png";
import Memories from "../../assets/5.png";
import Events from "../../assets/6.png";
import Gaming from "../../assets/7.png";
import Gallery from "../../assets/8.png";
import Videos from "../../assets/9.png";
import Messages from "../../assets/10.png";
import Tutorials from "../../assets/11.png";
import Courses from "../../assets/12.png";
import Fund from "../../assets/13.png";


const LeftBar = () => {
  const { currentUser } = useContext(AuthContext);

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
              <Link to={`/profile/${currentUser.id}`} className="link">Profile</Link>
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
              <Link to="/" className="link">Logout</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftBar;