import "./profile.scss";
import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import { FaEnvelope, FaSchool, FaLinkedin } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Image from "../../assets/Orange.jfif"; // Default image


const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    academy: "",
    socialmedia: "",
    password: "",
    image: null,
  });
  const [posts, setPosts] = useState([]); // Store filtered posts
  const navigate = useNavigate();

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data);
        setFormData({
          full_name: response.data.full_name,
          email: response.data.email,
          academy: response.data.academy,
          socialmedia: response.data.socialmedia || "",
          password: "",
          image: null,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile", error);
        toast.error("Failed to load profile");
        setLoading(false);
        navigate("/login");
      }
    };

    fetchProfile();
  }, [navigate]);

  // Fetch posts filtered by user
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/index");
        const allPosts = response.data.data;
        const filteredPosts = allPosts.filter(
          (post) => post.user_id === user?.id
        );
        setPosts(filteredPosts);
      } catch (error) {
        console.error("Error fetching posts", error);
        toast.error("Failed to load posts");
      }
    };

    if (user) {
      fetchPosts();
    }
  }, [user]);

  // Loading state
  if (loading) return <div>Loading...</div>;

  // Toggle edit mode
  const handleEditToggle = () => setIsEditing(!isEditing);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle image file change
  const handleImageChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      image: e.target.files[0],
    }));
  };

  // Submit form data
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const formDataToSend = new FormData();

    for (let key in formData) {
      if (formData[key] !== null && formData[key] !== undefined) {
        formDataToSend.append(key, formData[key]);
      }
    }

    formDataToSend.append("id", user.id);

    try {
      const response = await axios.post("/profile/edit", formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setUser((prevUser) => ({
        ...prevUser,
        ...response.data.user,
      }));

      setIsEditing(false);
      toast.success(response.data.message || "Profile updated successfully!");
    } catch (error) {
      console.error("Error saving profile", error);
      const errorMessage =
        error.response?.data.message ||
        (error.response?.data.errors
          ? Object.values(error.response.data.errors)[0][0]
          : "An error occurred");
      toast.error(errorMessage);
    }
  };

  // Format time function
  const formatTime = (time) => {
    const now = new Date();
    const createdAt = new Date(time);
    const difference = Math.floor((now - createdAt) / (1000 * 60)); // in minutes
    if (difference < 60) return `${difference} minutes ago`;
    const hours = Math.floor(difference / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    return `${days} days ago`;
  };

  return (
    <div className="profile">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className="images">
        <img
          src={Image}
          alt="cover"
          className="cover"
        />
        <div className="profilePicWrapper">
          <img
            src={user?.profile_picture || "https://via.placeholder.com/150"}
            alt="profile"
            className="profilePic"
          />
        </div>
      </div>

      <div className="profileContainer">
        <div className="uInfo">
          <div className="center">
            <span className="userName">{user?.full_name}</span>
            <div className="info">
              <div
                className="infoItem"
                onClick={() => (window.location.href = `mailto:${user?.email}`)}
              >
                <FaEnvelope className="icon" />
              </div>
              <div className="infoItem">
                <FaSchool className="icon" />
                <span>{user?.academy}</span>
              </div>
              <div
                className="infoItem"
                onClick={() => window.open(user?.socialmedia, "_blank")}
              >
                <FaLinkedin className="icon" />
              </div>
            </div>
            <button className="editButton" onClick={handleEditToggle}>
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>
        </div>

        {isEditing && (
          <div className="modal">
            <form onSubmit={handleSubmit} className="editForm">
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Full Name"
                required
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
              />
              <select
                name="academy"
                value={formData.academy}
                onChange={handleChange}
                required
              >
                <option value="">Select Academy</option>
                <option value="Amman">Amman</option>
                <option value="Zarqa">Zarqa</option>
                <option value="Irbid">Irbid</option>
                <option value="Aqaba">Aqaba</option>
                <option value="Balqa">Balqa</option>
              </select>
              <input
                type="text"
                name="socialmedia"
                value={formData.socialmedia}
                onChange={handleChange}
                placeholder="Social Media"
              />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
              />
              <input
                type="file"
                name="image"
                onChange={handleImageChange}
                placeholder="Profile Image"
              />
              <button type="submit" className="submitButton">
                Save
              </button>
            </form>
          </div>
        )}

        <div className="userPosts">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.id} className="post">
                <div className="container">
                  <div className="user">
                    <div className="userInfo">
                      <img
                        src={post.user.profile_image_url || "https://via.placeholder.com/40"}
                        alt="user"
                      />
                      <div className="details">
                        <span className="name">{post.user.full_name}</span>
                        <span className="date">{formatTime(post.created_at)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="content">
                    <p>{post.content}</p>
                    {post.post_images.map((image) => (
                      <img
                        key={image.id}
                        src={image.image_url}
                        alt="post"
                        className="postImage"
                      />
                    ))}
                  </div>
                  <div className="actions">
                    <span className="like">Likes: {post.likes_count}</span>
                    <span className="">Comments: {post.comments_count}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No posts available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
