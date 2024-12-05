import { useState, useContext } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import axios from "axios";

const Comments = ({ comments, postId }) => {
  const { currentUser } = useContext(AuthContext);
  const [newComment, setNewComment] = useState("");
  const [commentError, setCommentError] = useState("");

  const handleSend = async () => {
    if (!newComment.trim()) {
      setCommentError("Comment cannot be empty.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("post_id", postId); // Attach the post ID here
      formData.append("content", newComment);

      const response = await axios.post(
        "http://127.0.0.1:8000/api/comments",
        formData
      );

      if (response.data.success) {
        setNewComment(""); // Clear input
        setCommentError(""); // Clear errors
        window.location.reload(); // Reload to fetch updated comments
      }
    } catch (error) {
      console.error("Failed to post comment:", error);
      setCommentError("Failed to post comment. Try again later.");
    }
  };

  return (
    <div className="comments">
  <div className="write">
    <img src={currentUser.profilePic} alt="Current User" />
    <input
      type="text"
      placeholder="Write a comment..."
      value={newComment}
      onChange={(e) => setNewComment(e.target.value)}
    />
    <button onClick={handleSend}>Send</button>
  </div>
  {commentError && <p className="error">{commentError}</p>}
  {comments.map((comment) => (
    <div className="comment" key={comment.id}>
      <img
        src={comment.user?.image || "default-avatar.jpg"} // Fallback to default image
        alt="Commenter"
      />
      <div className="info">
        {/* Access full_name from comment.user */}
        <span>{comment.user?.full_name || "Anonymous"}</span> 
        <p>{comment.content}</p>
      </div>
      <span className="date">1 hour ago</span> {/* Replace with actual date logic */}
    </div>
  ))}
</div>

  );
};

export default Comments;
