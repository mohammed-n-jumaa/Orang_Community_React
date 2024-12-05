// src/pages/Profile/Profile.js
import "./like.scss";
import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";
import Posts from "../../components/posts/Posts"

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // استدعاء بيانات المستخدم من API
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token"); // الحصول على التوكن من localStorage
        const response = await axios.get("/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile", error);
        navigate("/login"); // إذا كان هناك خطأ، قم بتوجيه المستخدم إلى صفحة تسجيل الدخول
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="profile">
      <div className="images">
        <img
          src="https://images.pexels.com/photos/13440765/pexels-photo-13440765.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="cover"
          className="cover"
        />
        <img
          src={user.profile_picture} // استخدام الصورة الشخصية للمستخدم من API
          alt="profile"
          className="profilePic"
        />
      </div>
      <div className="profileContainer">
        <div className="uInfo">
        
          <div className="center">
            <span className="name">{user.name}</span>
            <div className="info">
           
            </div>
            <button className="editButton">Edit Profile</button>
          </div>
      
        </div>
        <Posts />
      </div>
    </div>
  );
};

export default Profile;
