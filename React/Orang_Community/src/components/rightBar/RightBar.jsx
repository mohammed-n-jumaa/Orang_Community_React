import { useState, useEffect } from "react";
import axios from "axios";
import "./rightBar.scss";

const RightBar = () => {
  const [activities, setActivities] = useState([]); // State to store activities
  const [loading, setLoading] = useState(true); // State to show loading spinner
  const [error, setError] = useState(null); // State to handle errors

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/activities");
        const activitiesArray = Object.values(response.data); // Convert object to array
        setActivities(activitiesArray);
        setLoading(false);
      } catch (err) {
        setError("Error fetching activities");
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="rightBar">
      <div className="container">
        <div className="item">
          <span>Latest Activities</span>
          {activities.length > 0 ? (
            activities.map((activity, index) => (
              <div className="user" key={index}>
                <div className="userInfo">
                  <img
                    src={activity.user.image || "https://via.placeholder.com/150"}
                    alt={activity.user.full_name}
                  />
                  <p>
                    <span>{activity.user.full_name}</span> {activity.description}
                  </p>
                </div>
                <span>{new Date(activity.createdAt).toLocaleString()}</span>
              </div>
            ))
          ) : (
            <div>No activities found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RightBar;
