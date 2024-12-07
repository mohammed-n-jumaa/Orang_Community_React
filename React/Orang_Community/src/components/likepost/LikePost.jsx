import { useEffect, useState, memo } from "react"; // Import memo correctly
import Post from "../post/Post";
import axios from "axios";
import "./LikePost.scss";

// Wrap the component with memo to prevent unnecessary re-renders
const LikePost = () => {
  const [likedPosts, setLikedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLikedPosts = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/display/3");

        console.log("Raw API Response:", res.data); // Log raw response

        if (res.data.data) {
          // Use map to create transformed posts
          const transformedPosts = res.data.data.map((likedPost) => ({
            ...likedPost,
            id: likedPost.post_id, // Unique identifier
            content: likedPost.post_content,
            user: likedPost.post_user,
            comments: likedPost.post_comments,
            post_images: likedPost.post_images,
            isLiked: true,
            likes: likedPost.likes || [], // Use the actual likes from the backend

          }));

          // Remove duplicates by `id` more efficiently
          const uniquePosts = Array.from(
            new Map(transformedPosts.map(post => [post.id, post])).values()
          );

          console.log("Unique Transformed Posts:", uniquePosts); // Log unique posts
          setLikedPosts(uniquePosts);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching liked posts:", error);
        setError(error);
        setIsLoading(false);
      }
    };

    fetchLikedPosts();
  }, []); // Empty dependency array ensures it runs only once

  if (isLoading) return <div>Loading liked posts...</div>;
  if (error) return <div>Error loading liked posts</div>;

  return (
    <div className="liked-posts">
      <div className="posts">
        {likedPosts.length === 0 ? (
          <div>No liked posts found</div>
        ) : (
          likedPosts.map((post) => (
            <Post 
              key={post.id} // Ensure unique key based on `id`
              post={post} 
            />
          ))
        )}
      </div>
    </div>
  );
};

// Wrap component with memo for optimization (optional, if prop-based re-renders occur)
export default memo(LikePost); 
