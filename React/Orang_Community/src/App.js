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

// Layout component
const Layout = () => {
  const { darkMode } = useContext(DarkModeContext); // Dark mode context

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
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/profile/:id",
          element: <Profile />,
        },
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
      element: <div>Page not found</div>, // Display a simple 404 message or a custom 404 page component
    },
  ]);

  return (
    <AuthProvider> {/* Wrap the app with AuthProvider */}
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
