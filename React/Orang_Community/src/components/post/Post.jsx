import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import BookmarkOutlinedIcon from "@mui/icons-material/BookmarkOutlined";

const Post = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);

  // Check if the post is liked by the current user (placeholder for now)
  const liked = false;

  // Format the time ago from `created_at`
  const timeAgo = formatDistanceToNow(new Date(post.created_at), {
    addSuffix: true, // Adds "ago" at the end
  });

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
          <div className="item">
            {liked ? <FavoriteOutlinedIcon /> : <FavoriteBorderOutlinedIcon />}
            {post.likes?.length || 0} Likes
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            {post.comments?.length || 0} Comments
          </div>
          <div className="item">
            <BookmarkBorderOutlinedIcon />
            Save
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
