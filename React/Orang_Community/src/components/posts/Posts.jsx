import { useEffect, useState } from "react";
import Post from "../post/Post";
import axios from "axios";
import "./posts.scss";
import Navbar from "../navbar/Navbar";

const Posts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Fetch posts from the API
    const fetchPosts = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/index"); // Adjust the URL if needed
        if (res.data.success) {
          setPosts(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="posts">
      {posts.map((post) => (
        <>
        <Post post={post} key={post.id} />
        
        </>
      ))}
    </div>
  );
};

export default Posts;
