
import React, { useContext } from "react";
import { createBrowserRouter, RouterProvider, Outlet, Navigate } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import LeftBar from "./components/leftBar/LeftBar";
import RightBar from "./components/rightBar/RightBar";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import { DarkModeContext } from "./context/darkModeContext";
import { AuthContext } from "./context/authContext"; // Wrap with AuthProvider
import axios from "axios"; // Add this import
import "./style.scss";
import { AuthProvider } from "./context/authContext";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Like from './pages/like/Like';  // Path to Likes.jsx
import Saved from "./pages/saved/Saved";


// Layout component
const Layout = () => {
  const { darkMode } = useContext(DarkModeContext);

  return (
    <div className={`theme-${darkMode ? "dark" : "light"}`}>
      <Navbar />
      <div style={{ display: "flex" }}>
        <LeftBar />
        <div style={{ flex: 6 }}>
          <Outlet />
        </div>
        <RightBar />
      </div>
    </div>
  );
};


// ProtectedRoute component to protect routes that need authentication
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useContext(AuthContext); // Access currentUser from context

  if (!currentUser) {
    return <Navigate to="/login" />; // Redirect to login if no user is logged in
  }
  return children;
};

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        { path: "/", element: <Home /> },
        { path: "/profile/:id", element: <Profile /> },
        { path: "/like", element: <Like /> },
        { path: "/save", element: <Saved /> },
      ],
    },
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    { path: "*", element: <div>Page not found</div> },
  ]);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
