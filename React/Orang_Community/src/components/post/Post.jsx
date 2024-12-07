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
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";

const Post = ({ post, showFullComments = false }) => {
  const navigate = useNavigate();
  const [commentOpen, setCommentOpen] = useState(showFullComments);
  const [showMoreImages, setShowMoreImages] = useState(false);
  const [comments, setComments] = useState(post.comments || []);

  // Determine if post is liked (mock for now)
  const liked = false;

  // Calculate time ago for the post's creation date
  const timeAgo = formatDistanceToNow(new Date(post.created_at), {
    addSuffix: true,
  });

  // Determine which comments to display
  const displayComments = showFullComments ? comments : comments.slice(0, 0);

  // Navigate to detailed post view
  const handleShowMoreComments = () => {
    navigate(`/post/${post.id}`);
  };

  return (
    <div className="post">
      <div className="container">
        {/* User Information */}
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

        {/* Post Content */}
        <div className="content">
          <p>{post.content}</p>

          {/* Post Images */}
          {post.post_images?.length > 0 && (
            <div className="post-images">
              <img
                src={post.post_images[0]?.image_url}
                alt={`Post Image 1`}
                className="post-image"
              />
              {showMoreImages &&
                post.post_images.slice(1).map((image, index) => (
                  <img
                    key={index}
                    src={image.image_url}
                    alt={`Post Image ${index + 2}`}
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

        {/* Post Interaction Info */}
        <div className="info">
          <div className="item">
            {liked ? <FavoriteOutlinedIcon /> : <FavoriteBorderOutlinedIcon />}
            {post.likes?.length || 0} Likes
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            {comments.length} Comments
          </div>
          <div className="item">
            <BookmarkBorderOutlinedIcon />
            Save
          </div>
        </div>

        {/* Comments Section */}
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
