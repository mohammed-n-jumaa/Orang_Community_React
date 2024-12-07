import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import BookmarkOutlinedIcon from "@mui/icons-material/BookmarkOutlined";
import axios from "axios";
import { PiOrangeFill } from "react-icons/pi";
import { PiOrange } from "react-icons/pi";


const Post = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);

  // Check if the post is liked by the current user
 

  // Format the time ago from `created_at`
  const createdAt = new Date(post.created_at);
  const timeAgo = isNaN(createdAt.getTime())
    ? "Invalid date"
    : formatDistanceToNow(createdAt, { addSuffix: true });

    


  // Handle like/unlike functionality
  const [Liked, setLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);

  useEffect(() => {
    const checkLikeStatus = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/check-like/${post.id}`);
        setLiked(response.data.isLiked);
      } catch (error) {
        console.error("Error checking like status:", error);
      }
    };

    checkLikeStatus();
  }, [post.id]);


  const handleLike = async () => {
    try {
      // Optimistically update the UI
      setLiked(!Liked);
      setLikesCount(currentCount => 
        Liked ? currentCount - 1 : currentCount + 1
      );
  
      const response = await axios.post(`http://127.0.0.1:8000/api/like/${post.id}`);
      const { isLiked, likesCount } = response.data;
  
      // Update state with server response
      setLiked(isLiked);
      setLikesCount(likesCount);
  
    } catch (error) {
      console.error("Error liking the post:", error);
      
      // Revert to the previous state if the request fails
      setLiked(Liked);
      setLikesCount(post.likes?.length || 0);
    }
  };
  
  // Handle save/unsave functionality

const [isSaved, setIsSaved] = useState(false);

useEffect(() => {
  const checkSavedStatus = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/check-saved/${post.id}`);
      setIsSaved(response.data.isSaved);
    } catch (error) {
      console.error("Error checking saved status:", error);
    }
  };

  checkSavedStatus();
}, [post.id]);

const handleSave = async () => {
  try {
    // Optimistically update the UI first
    setIsSaved(!isSaved);

    const response = await axios.post(`http://127.0.0.1:8000/api/save/${post.id}`);
    
    // Confirm the server-side state
    if (response.data.status === 'saved') {
      setIsSaved(true);
    } else if (response.data.status === 'unsaved') {
      setIsSaved(false);
    }
  } catch (error) {
    console.error("Error saving/unsaving post:", error);
    // Revert the state if the API call fails
    setIsSaved(isSaved);
  }
};

  return (
    <div className="post">
      <div className="container">
        {/* User Info */}
        <div className="user">
          <div className="userInfo">
            <img
              src={post.user?.image || "default-profile-pic.jpg"} // Default image fallback
              alt={`${post.user?.full_name}'s profile`}
            />
            <div className="details">
              <Link
                to={`/profile/${post.user?.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">{post.user?.full_name}</span>
              </Link>
              <span className="date">{timeAgo}</span>
            </div>
          </div>
          <MoreHorizIcon />
        </div>

        {/* Post Content */}
        <div className="content">
          <p>{post.content}</p>
          {post.post_images?.length > 0 && (
            <img
              src={post.post_images[0]?.image_url} // Display the first image from the post_images array
              alt="Post"
            />
          )}
        </div>

        {/* Post Info */}
        <div className="info">
        <div className="item" onClick={handleLike}>
          {Liked ? (
            <PiOrangeFill style={{ color: "#ff7f00", fontSize: "30px" }} />
          ) : (
            <PiOrange style={{ fontSize: "30px" }} />
          )}
      {likesCount} Likes
      </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            {post.comments?.length || 0} Comments
          </div>
          <div className="item" onClick={handleSave}>
              {isSaved ? <BookmarkOutlinedIcon /> : <BookmarkBorderOutlinedIcon />}
              {isSaved ? "Saved" : "Save"}
          </div>
        </div>

        {/* Comments Section */}
        {commentOpen && (
          <Comments comments={post.comments} postId={post.id} />
        )}
      </div>
    </div>
  );
};

export default Post;
