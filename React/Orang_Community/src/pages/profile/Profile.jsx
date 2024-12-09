import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import { FaEnvelope, FaLinkedin } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Image from "../../assets/Orange.jfif"; // Default image
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import "./profile.scss";
import { faPenToSquare, faTimes } from '@fortawesome/free-solid-svg-icons';

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
  const [activePostId, setActivePostId] = useState(null); // For managing active post menu
  const [isDeleting, setIsDeleting] = useState(false); // For managing delete action state
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

  // Fetch user posts
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

    if (user) fetchPosts();
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
      if (formData[key]) {
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

  // Close the modal without submitting
  const handleClose = () => {
    setIsEditing(false);
  };

  // Format time function
  const formatTime = (time) => {
    const now = new Date();
    const createdAt = new Date(time);
    const difference = Math.floor((now - createdAt) / (1000 * 60));
    if (difference < 60) return `${difference} minutes ago`;
    const hours = Math.floor(difference / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    return `${days} days ago`;
  };

// Handle force delete post (حذف دائم)
const handleForceDeletePost = async (postId) => {

  const result = await Swal.fire({
    title: ' Are You Sure ',
    text: "This post will be deleted.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes , Delete',
    cancelButtonText: 'Cancle',
    reverseButtons: true
  });

  if (result.isConfirmed) {
    setIsDeleting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/posts/${postId}/force-delete`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPosts(posts.filter((post) => post.id !== postId)); 
      Swal.fire('Deleted!', 'Post deleted successfully', 'success');
    } catch (error) {
      Swal.fire('mistake!','Failed to delete post', 'error');
    } finally {
      setIsDeleting(false);
      setActivePostId(null); 
    }
  } else {
    Swal.fire('Canceled', 'The post has not been deleted', 'info');
  }
};


  // Toggle post menu visibility
  const handleTogglePostMenu = (postId) => {
    if (activePostId === postId) {
      setActivePostId(null);  // Close the menu if clicked again on the same post
    } else {
      setActivePostId(postId);  // Open the menu for the clicked post
    }
  };

  return (
    <div className="user-dashboard">
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

      <div className="media-container">
        <img src={Image} alt="cover" className="cover-image" />
        <img 
          src={user?.profile_picture || "https://via.placeholder.com/150"} 
          alt="profile" 
          className="avatar" 
        />
      </div>

      <div className="user-container">
        <div className="user-overview">
          <div className="action-section">
            <button className="edit-button" onClick={handleEditToggle}>
              <FontAwesomeIcon icon={isEditing ? faTimes : faPenToSquare} />
            </button>
          </div>

          <div className="user-details">
            <span>{user?.full_name}</span>
            
            <div className="user-stats">
              <div className="stat-item">
                <FaEnvelope />
                <span>Contact</span>
                <span className="hover-text">Send E-mail</span>
              </div>
              
              <div className="stat-item">
                <FontAwesomeIcon icon={faLocationDot} />
                <span>{user?.academy}</span>
                <span className="hover-text">Academy Location</span>
              </div>
              
              <div 
                className="stat-item" 
                onClick={() => window.open(user?.socialmedia, "_blank")}
              >
                <FaLinkedin />
                <span>LinkedIn</span>
                <span className="hover-text">Visit LinkedIn</span>
              </div>
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="modal">
            <form onSubmit={handleSubmit} className="edit-form">
              <label htmlFor="full_name">Full Name</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Full Name"
                required
              />

              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
              />

              <label htmlFor="academy">Academy</label>
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

              <label htmlFor="socialmedia">LinkedIn URL</label>
              <input
                type="text"
                name="socialmedia"
                value={formData.socialmedia}
                onChange={handleChange}
                placeholder="Social Media"
              />

              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
              />

              <label htmlFor="image">Profile Image</label>
              <input type="file" name="image" onChange={handleImageChange} />

              <div className="button-container">
                <button type="submit" className="submit-button save">
                  Save
                </button>
                <button 
                  type="button" 
                  className="submit-button close" 
                  onClick={handleClose}
                >
                  Close
                </button>
              </div>
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
            <div className="moreOptions" onClick={() => handleTogglePostMenu(post.id)}>
              &#8226;&#8226;&#8226;
            </div>
            {activePostId === post.id && (
              <div className="moreOptionsMenu active">
                <button onClick={() => handleForceDeletePost(post.id)} disabled={isDeleting}>
                  {isDeleting ? "delete..." : "Delete"}
                </button>
              </div>
            )}
          </div>
          <div className="content">
            <p>{post.content}</p>
            {post.post_images.map((image) => (
              <img key={image.id} src={image.image_url} alt="post" className="postImage" />
            ))}
          </div>
          <div className="actions">
            <span className="like">Likes {post.likes_count}</span>
            <span className="">Comments {post.comments_count}</span>
          </div>
        </div>
      </div>
    ))
  ) : (
    <p>No posts Yet!</p>
  )}
</div>

      </div>
    </div>
  );
};

export default Profile;  
