import { useEffect, useState } from "react";
import Post from "../post/Post";
import axios from "axios";
import "./SavedPosts.scss";

const SavedPosts = () => {
  const [savedPosts, setSavedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSavedPosts = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/show/3");
        
        if (res.data.data) {
          // Remove duplicates using Set based on post_id
          const uniquePosts = Array.from(
            new Set(res.data.data.map(post => post.post_id))
          ).map(postId => 
            res.data.data.find(post => post.post_id === postId)
          );
  
          const transformedPosts = uniquePosts.map(savedPost => ({
            ...savedPost,
            id: savedPost.post_id,
            content: savedPost.post_content,
            user: savedPost.post_user,
            comments: savedPost.post_comments,
            post_images: savedPost.post_images,
            isSaved: true,
            likes: savedPost.likes, // Include likes in the transformed post

          }));
  
          setSavedPosts(transformedPosts);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching saved posts:", error);
        setError(error);
        setIsLoading(false);
      }
    };
  
    fetchSavedPosts();
  }, []);

  if (isLoading) return <div>Loading saved posts...</div>;
  
  if (error) return (
    <div>
      <h2>Error loading saved posts</h2>
      <p>{error.toString()}</p>
    </div>
  );

  return (
    <div className="saved-posts">
      <div className="posts">
        {savedPosts.length === 0 ? (
          <div>No saved posts found</div>
        ) : (
          savedPosts.map((post) => (
            <Post 
              key={`saved-post-${post.like_id}`} 
              post={post} 
            />
          ))
        )}
      </div>
    </div>
  );
};

export default SavedPosts;