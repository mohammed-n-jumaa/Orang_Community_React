import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "../../assets/img.png"; // Default image
import "./share.scss";

const Share = ({ setPosts, posts, fetchPosts }) => {
  const { currentUser } = useContext(AuthContext);
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [profilePic, setProfilePic] = useState(Image);

  // Fetch the user's profile image when the component mounts
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/index`);
       
        if (response.data?.data?.[0]?.user) {
          const user = response.data.data[0].user;
          setProfilePic(user.profile_image_url || Image);
        } else {
          setProfilePic(Image);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setProfilePic(Image);
      }
    };

    if (currentUser?.id) {
      fetchUserProfile();
    }
  }, [currentUser]);

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = [];
    const previews = [];

    selectedFiles.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        setError("Please upload a valid image file.");
        return;
      }

      if (file.size > 10485760) {
        setError("File size should not exceed 10MB.");
        return;
      }

      validFiles.push(file);
      previews.push(URL.createObjectURL(file));
    });

    setFiles(validFiles);
    setImagePreviews(previews);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content && files.length === 0) {
      toast.error("Please enter some content or select an image.");
      return;
    }
    const userId = JSON.parse(localStorage.getItem('currentUser')).id;
    const formData = new FormData();
    formData.append('user_id',  userId)
    formData.append("content", content);
    files.forEach((file) => formData.append("images[]", file));

    try {
      setLoading(true);
      const response = await axios.post(
        "http://127.0.0.1:8000/api/posts/share",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.success) {
        await fetchPosts(); // Fetch updated posts
        toast.success("Post created successfully!");
        setContent("");
        setFiles([]);
        setImagePreviews([]);
      } else {
        toast.error(response.data.message || "Failed to create post.");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("There was an error creating the post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="share">
        <div className="container">
          <div className="top">
            <img
              src={currentUser?.profile_image_url}
              alt="Profile"
              style={{ width: "50px", height: "50px", borderRadius: "50%" }}
            />
            <input
              type="text"
              placeholder={`What's on your mind ${currentUser?.full_name}?`}
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
                  <img src={Image} alt="Add" />
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
            </div>
            <div className="right">
              <button onClick={handleSubmit} disabled={loading}>
                {loading ? "Posting..." : "Share"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};

export default Share;
