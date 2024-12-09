import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import BookmarkOutlinedIcon from "@mui/icons-material/BookmarkOutlined";
import { Link, useNavigate } from "react-router-dom";
import Comments from "../comments/Comments";
import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import axios from "axios";
import { PiOrangeFill } from "react-icons/pi";
import { PiOrange } from "react-icons/pi";

const Post = ({ post, showFullComments = false }) => {
  const navigate = useNavigate();
  const [commentOpen, setCommentOpen] = useState(showFullComments);
  const [showMoreImages, setShowMoreImages] = useState(false);
  const [comments, setComments] = useState(post.comments || []);

  const createdAt = new Date(post.created_at);
  const timeAgo = isNaN(createdAt.getTime())
    ? "Invalid date"
    : formatDistanceToNow(createdAt, { addSuffix: true });

  const [Liked, setLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {
    const checkLikeStatus = async () => {
      try {
        // Make sure currentUser exists before using it
        if (currentUser?.id) {
          const response = await axios.get(
            `http://127.0.0.1:8000/api/check-like/${post.id}`, 
            { params: { user_id: currentUser.id } } // Pass user_id as query parameter
          );
          setLiked(response.data.isLiked); // Update like status
        }
      } catch (error) {
        console.error("Error checking like status:", error);
      }
    };
  
    // Trigger the check when post ID or currentUser ID changes
    if (currentUser?.id) {
      checkLikeStatus();
    }
  }, [post.id, currentUser?.id]);
  

  const handleLike = async () => {
    try {
      setLiked(!Liked);
      setLikesCount((currentCount) => (Liked ? currentCount - 1 : currentCount + 1));
  
      // Get user ID from localStorage
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  
      // Ensure that currentUser is available before making the API call
      if (currentUser?.id) {
        const response = await axios.post(
          `http://127.0.0.1:8000/api/like/${post.id}/${currentUser.id}`
        );
  
        const { isLiked, likesCount } = response.data;
        setLiked(isLiked);
        setLikesCount(likesCount);
      } else {
        console.error('User is not logged in');
      }
    } catch (error) {
      console.error('Error liking the post:', error);
      setLiked(Liked);
      setLikesCount(post.likes?.length || 0);
    }
  };
  

  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const checkSavedStatus = async () => {
      try {
        // Ensure currentUser exists
        if (currentUser?.id) {
          const response = await axios.get(`http://127.0.0.1:8000/api/check-saved/${post.id}`, {
            params: { user_id: currentUser?.id }
          });
          setIsSaved(response.data.isSaved);
        }
      } catch (error) {
        console.error("Error checking saved status:", error);
      }
    };

    // Check saved status if user is logged in
    if (currentUser?.id) {
      checkSavedStatus();
    }
  }, [post.id, currentUser?.id]);

  const handleSave = async () => {
    try {
      // Update saved status in UI first
      setIsSaved(!isSaved);
      
      // Make API call to save/unsave the post
      const response = await axios.post(
        `http://127.0.0.1:8000/api/save/${post.id}/${currentUser?.id}`
      );
      if (response.data.status === "saved") {
        setIsSaved(true);
      } else if (response.data.status === "unsaved") {
        setIsSaved(false);
      }
    } catch (error) {
      console.error("Error saving/unsaving post:", error);
      setIsSaved(isSaved); // Rollback on error
    }
  };

  const displayComments = showFullComments ? comments : comments.slice(0, 0);

  const handleShowMoreComments = () => {
    navigate(`/post/${post.id}`);
  };

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img
              src={post.user?.profile_image_url || "default-profile-pic.jpg"}
              alt={`${post.user?.full_name || "User"}'s profile`}
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

        <div className="content">
          <p>{post.content}</p>

          {post.post_images?.length > 0 && (
            <div className="post-images">
              <img
                src={post.post_images[0]?.image_url}
                alt={post.post_images[0]?.description}
                className="post-image"
              />
              {showMoreImages &&
                post.post_images.slice(1).map((image, index) => (
                  <img
                    key={index}
                    src={image.image_url}
                    alt={image.description}
                    className="post-image"
                  />
                ))}
              {post.post_images.length > 1 && (
                <button
                  className="show-more-btn"
                  onClick={() => setShowMoreImages(!showMoreImages)}
                >
                  {showMoreImages ? "Show Less" : "+ Show More"}
                </button>
              )}
            </div>
          )}
        </div>

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
            {comments.length} Comments
          </div>
          <div className="item" onClick={handleSave}>
            {isSaved ? <BookmarkOutlinedIcon /> : <BookmarkBorderOutlinedIcon />}
            {isSaved ? "Saved" : "Save"}
          </div>
        </div>

        {(commentOpen || showFullComments) && (
          <>
            <Comments
              comments={displayComments}
              postId={post.id}
              setComments={setComments}
            />
            {!showFullComments && comments.length > 0 && (
              <div
                className="show-more-comments"
                onClick={handleShowMoreComments}
                style={{
                  color: "blue",
                  cursor: "pointer",
                  textAlign: "center",
                  marginTop: "10px",
                }}
              >
                Show {comments.length - 0} more comments
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Post;
