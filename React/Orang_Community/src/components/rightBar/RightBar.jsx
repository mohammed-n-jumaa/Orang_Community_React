import { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import "./rightBar.scss";

const RightBar = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/activities");
        setActivities(response.data.activities); // Use the 'activities' array directly
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching activities");
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="rightBar">
      <div className="container">
        <div className="item">
          <span>Latest Activities</span>
          {activities.length > 0 ? (
            activities.map((activity, index) => (
              <div className="user" key={index}>
                <div className="userInfo">
                  {/* Display user profile image */}
                  <img
                    src={activity.user.profile_image_url}
                    alt={activity.user.name}
                    onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
                  />
                  <p>
                    <span>{activity.user.name}</span> {activity.description}
                  </p>
                </div>
                {/* Display formatted timestamp */}
                <span>{format(new Date(activity.createdAt), "PPpp")}</span>
              </div>
            ))
          ) : (
            <div className="noActivities">No activities found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RightBar;
