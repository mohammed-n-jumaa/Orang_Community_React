
import React, { useContext } from "react";
import { createBrowserRouter, RouterProvider, Outlet, Navigate } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import LeftBar from "./components/leftBar/LeftBar";
import RightBar from "./components/rightBar/RightBar";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import 'react-toastify/dist/ReactToastify.css';

import { DarkModeContext } from "./context/darkModeContext";
import { AuthContext } from "./context/authContext";
import { AuthProvider } from "./context/authContext";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Like from './pages/like/Like';  // Path to Likes.jsx
import Saved from "./pages/saved/Saved";


import "./style.scss";
import PostDetail from "./components/postDetail/postDetail";

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
  const { currentUser } = useContext(AuthContext);

  if (!currentUser) {
    return <Navigate to="/login" />;
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
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/profile/:id",
          element: <Profile />,
        },
        {
          path: "/post/:postId", // Add the new route for post details
          element: <PostDetail />,
        },
        { path: "/like", element: <Like /> },
        { path: "/save", element: <Saved /> },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "*", // Catch-all route for 404 errors
      element: <div>Page not found</div>,
    },
  ]);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
