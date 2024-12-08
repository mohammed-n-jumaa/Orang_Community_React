import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const initializeAuth = () => {
    try {
      const storedUser = localStorage.getItem("currentUser");
      const storedToken = localStorage.getItem("token");

      if (storedUser && storedToken) {
        const parsedUser = JSON.parse(storedUser);
        setCurrentUser(parsedUser);
        axios.defaults.headers["Authorization"] = `Bearer ${storedToken}`;
      }
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      localStorage.removeItem("currentUser");
      localStorage.removeItem("token");
    } finally {
      setLoading(false); // Ensure loading is set to false after initialization
    }
  };

  useEffect(() => {
    initializeAuth();

    const handleStorageChange = () => {
      initializeAuth();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
