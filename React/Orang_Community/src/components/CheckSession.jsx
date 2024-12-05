import React, { useEffect, useContext, useState } from "react";
import { AuthContext } from "../context/authContext"; // Import the AuthContext

const CheckSession = () => {
  const { currentUser } = useContext(AuthContext); // Use context to get currentUser
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (currentUser) {
      setUser(currentUser); // Set the user state from context
    }
  }, [currentUser]); // Update user state when currentUser changes

  if (user) {
    return <div>Welcome, {user.full_name}</div>; // Show user details if logged in
  }

  return <div>Please log in</div>; // Show login message if no user
};

export default CheckSession;
