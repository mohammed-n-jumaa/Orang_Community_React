import { useEffect, useState, memo } from "react"; 
import Post from "../post/Post"; 
import axios from "axios"; 
import "./LikePost.scss"; 

const LikePost = () => { 
  const [likedPosts, setLikedPosts] = useState([]); 
  const [isLoading, setIsLoading] = useState(true); 
  const [error, setError] = useState(null);

  useEffect(() => { 
    const fetchLikedPosts = async () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
        // Use currentUser.id directly in the API request
        const res = await axios.get(`http://127.0.0.1:8000/api/display/${currentUser.id}`);
        
        console.log("Raw API Response:", res.data); // Log the raw response
        
        if (res.data.data) {
          // Map and transform the response data
          const transformedPosts = res.data.data.map((likedPost) => ({
            ...likedPost,
            id: likedPost.post_id, // Unique identifier
            content: likedPost.post_content,
            user: likedPost.post_user,
            comments: likedPost.post_comments,
            post_images: likedPost.post_images,
            isLiked: true,
            likes: likedPost.likes || [], // Ensure likes are included
          }));

          // Remove duplicates based on 'id' to ensure unique posts
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
  }, []); // Empty dependency array ensures the effect runs only once

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

// Wrap component with memo to optimize rendering
export default memo(LikePost); 
