import { useState, useEffect } from "react";
import Post from "../post/Post";
import "./posts.scss";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const Posts = ({ initialPosts = [] }) => {
  const [posts, setPosts] = useState(initialPosts);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (initialPosts) {
      setPosts(initialPosts);
      setIsLoading(false);
    }
  }, [initialPosts]);

  // Always show loading when posts are empty
  if (isLoading || posts.length === 0) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        height="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="posts">
      {posts.map((post) => (
        <Post post={post} key={post.id} />
      ))}
    </div>
  );
};

export default Posts;