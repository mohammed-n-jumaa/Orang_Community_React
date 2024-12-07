import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  // Function to initialize user and token from local storage
  const initializeAuth = () => {
    try {
      const storedUser = localStorage.getItem("currentUser");
      const storedToken = localStorage.getItem("token");

      if (storedUser && storedToken) {
        const parsedUser = JSON.parse(storedUser);

        // Optionally, validate the token (e.g., check expiry)
        setCurrentUser(parsedUser);
        axios.defaults.headers["Authorization"] = `Bearer ${storedToken}`;
      }
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      localStorage.removeItem("currentUser");
      localStorage.removeItem("token");
    }
  };

  // Run once on component mount
  useEffect(() => {
    initializeAuth();

    // Optionally, listen for changes to localStorage
    const handleStorageChange = () => {
      initializeAuth();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Update local storage whenever currentUser changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
