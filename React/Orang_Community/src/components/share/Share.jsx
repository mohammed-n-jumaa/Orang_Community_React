import { useState, useContext } from "react";
import { AuthContext } from "../../context/authContext";
import axios from "axios"; // Import axios for API calls
import Image from "../../assets/img.png";
import "./share.scss";

const Share = () => {
  const { currentUser } = useContext(AuthContext);
  const [content, setContent] = useState(""); // State for post content
  const [files, setFiles] = useState([]); // State for uploaded image files
  const [imagePreviews, setImagePreviews] = useState([]); // State for image preview URLs
  const [error, setError] = useState(""); // State for error messages

  // Handle content change
  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  // Handle file change and create image previews
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = [];
    const previews = [];

    selectedFiles.forEach((file) => {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please upload a valid image file.");
        return;
      }

      // Check file size (e.g., limit to 10MB)
      if (file.size > 10485760) {
        setError("File size should not exceed 10MB.");
        return;
      }

      validFiles.push(file);
      previews.push(URL.createObjectURL(file));
    });

    setFiles(validFiles);
    setImagePreviews(previews);
    setError(""); // Clear error if files are valid
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content && files.length === 0) {
      setError("Please enter some content or select an image.");
      return;
    }

    const formData = new FormData();
    formData.append("content", content); // Append content

    files.forEach((file) => {
      formData.append("images[]", file); // Append each image
    });

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/posts/share", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Important for file upload
        },
      });

      if (response.data.success) {
        alert("Post created successfully!");
        setContent(""); // Clear content after successful post
        setFiles([]); // Clear files after successful post
        setImagePreviews([]); // Clear image previews
      }
    } catch (error) {
      console.error("Error creating post:", error);
      setError("There was an error creating the post.");
    }
  };

  return (
    <div className="share">
      <div className="container">
        <div className="top">
          <img src={currentUser.profilePic} alt="" />
          <input
            type="text"
            placeholder={`What's on your mind ${currentUser.name}?`}
            value={content}
            onChange={handleContentChange}
          />
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <input
              type="file"
              id="file"
              multiple
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <label htmlFor="file">
              <div className="item">
                <img src={Image} alt="" />
                <span>Add Images</span>
              </div>
            </label>
            {imagePreviews.length > 0 && (
              <div className="image-previews">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="image-preview">
                    <img
                      src={preview}
                      alt={`Preview ${index}`}
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
            {error && <div className="error-message">{error}</div>}
          </div>
          <div className="right">
            <button onClick={handleSubmit}>Share</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;
