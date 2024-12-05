import { createContext, useState, useEffect } from "react";
import axios from "axios"; // Add this import

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  // On initial load, check localStorage for the user and token
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    const storedToken = localStorage.getItem("token");
    
    if (storedUser && storedToken) {
      setCurrentUser(JSON.parse(storedUser));
      axios.defaults.headers["Authorization"] = `Bearer ${storedToken}`;
    }
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};