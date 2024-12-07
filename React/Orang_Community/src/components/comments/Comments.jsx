import { useState, useContext } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import { formatDistanceToNow } from "date-fns"; // Import formatDistanceToNow
import { toast } from "react-toastify"; // Import toast from react-toastify
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS

const Comments = ({ comments, postId, setComments }) => {
  const { currentUser } = useContext(AuthContext);
  const [newComment, setNewComment] = useState("");
  const [commentError, setCommentError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!newComment.trim()) {
      setCommentError("Comment cannot be empty.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      const userId = JSON.parse(localStorage.getItem('currentUser')).id;

      formData.append("user_id", userId);
      formData.append("post_id", postId);
      formData.append("content", newComment);

      const response = await axios.post(
        "http://127.0.0.1:8000/api/comments",
        formData
      );

      if (response.data.success) {
        // Add the new comment to the existing comments list
        const newCommentData = response.data.comment;

        // Make sure the comment includes user data
        newCommentData.user = currentUser;  // Manually add the current user details

        setComments(prevComments => [newCommentData, ...prevComments]);

        setNewComment(""); // Clear input
        setCommentError(""); // Clear errors

        // Show success toast
        toast.success("Comment posted successfully!");
      }
    } catch (error) {
      console.error("Failed to post comment:", error);
      setCommentError("Failed to post comment. Try again later.");

      // Show error toast
      toast.error("Failed to post comment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="comments">
      <div className="write">
        <img src={currentUser.profile_image_url} alt="Current User" />
        <input
          type="text"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          disabled={loading}
        />
        <button 
          onClick={handleSend} 
          disabled={loading}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
      {commentError && <p className="error">{commentError}</p>}
      {comments.map((comment) => {
        console.log(comment); // Check the full structure of the comment
        return (
          <div className="comment" key={comment.id}>
            <img
              src={comment.user?.profile_image_url || "default-avatar.jpg"}
              alt="Commenter"
            />
            <div className="info">
              <span>{comment.user?.full_name || "Anonymous"}</span>
              <p>{comment.content}</p>
            </div>
            {/* Display the time ago for each comment */}
            <span className="date">
              {comment.created_at
                ? formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })
                : "30 min ago"}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default Comments;
