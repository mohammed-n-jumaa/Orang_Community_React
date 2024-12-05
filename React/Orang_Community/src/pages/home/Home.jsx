import { useState, useEffect } from "react";
import Stories from "../../components/stories/Stories";
import Posts from "../../components/posts/Posts";
import Share from "../../components/share/Share";
import axios from "axios";
import "./home.scss";

const Home = () => {
  const [posts, setPosts] = useState([]);

  // Function to fetch posts from the API
  const fetchPosts = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/index");
      if (res.data.success) {
        setPosts(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  // Fetch posts on initial render
  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="home">
      <Share fetchPosts={fetchPosts} />
      
      <Posts posts={posts} />
    </div>
  );
};

export default Home;
