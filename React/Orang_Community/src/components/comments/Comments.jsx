import { useContext } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";

const Comments = ({ comments }) => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="comments">
      {/* Input for writing a new comment */}
      <div className="write">
        <img src={currentUser.profilePic} alt="Current User" />
        <input type="text" placeholder="Write a comment..." />
        <button>Send</button>
      </div>
      {/* Render each comment */}
      {comments.map((comment) => (
        <div className="comment" key={comment.id}>
          <img
            src={comment.user?.profilePicture || "default-avatar.jpg"}
            alt="Commenter"
          />
          <div className="info">
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
