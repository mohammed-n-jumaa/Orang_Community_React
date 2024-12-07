import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Post from '../post/Post';
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const PostDetail = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/posts/${postId}`);
        setPost(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch post details');
        setLoading(false);
      }
    };

    fetchPostDetails();
  }, [postId]);

  if (loading) {
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

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="post-detail">
      {post && <Post post={post} showFullComments={true} />}
    </div>
  );
};

export default PostDetail;
