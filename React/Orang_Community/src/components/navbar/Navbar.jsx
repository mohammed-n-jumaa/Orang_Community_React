
import "./navbar.scss";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Link } from "react-router-dom";
import { useContext, useState, useEffect, useRef } from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import { AuthContext } from "../../context/authContext";
import axios from "axios";

const Navbar = () => {
  const { toggle, darkMode } = useContext(DarkModeContext);
  const { currentUser } = useContext(AuthContext);

  // State for search functionality
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const searchRef = useRef(null);

  // Handle search input
  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 2) {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/search-users?query=${query}`
        );
        setSearchResults(response.data.data || []);
        setIsDropdownVisible(true);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    } else {
      setSearchResults([]);
      setIsDropdownVisible(false);
    }
  };

  // Hide dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsDropdownVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Clear search and hide dropdown on user click
  const handleUserClick = () => {
    setSearchQuery("");
    setSearchResults([]);
    setIsDropdownVisible(false);
  };

  return (
    <div className="navbar">
      <div className="left">
      <img 
          src="https://yo.orange.jo/sites/default/files/logo_1.png" 
          alt="Logo" 
          className="logo-img" 
        />
        <Link to="/" style={{ textDecoration: "none"}}>
          <span className="logo-text">Community</span>
        </Link>

        {darkMode ? (
          <WbSunnyOutlinedIcon onClick={toggle} />
        ) : (
          <DarkModeOutlinedIcon onClick={toggle} />
        )}

        {/* Search Box */}
        <div className="search" ref={searchRef}>
          <SearchOutlinedIcon />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearch}
          />
          {/* Search Results Dropdown */}
          {isDropdownVisible && searchResults.length > 0 && (
            <div className="search-results">
              <ul>
                {searchResults.map((user) => (
                  <li key={user.id} onClick={handleUserClick}>
                    <Link
                      to={`/profile/${user.id}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        textDecoration: "none",
                      }}
                    >
                      <img
                        src={user.image_url || "/default-avatar.png"}
                        alt={user.full_name}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                      <span>{user.full_name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="right">
        <div className="user">
          {currentUser ? (
            <>
              <img
                src={currentUser?.profile_image_url || "/default-avatar.png"}
                alt={currentUser.full_name}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
              <span>{currentUser.full_name}</span>
            </>
          ) : (
            <span>Loading...</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;