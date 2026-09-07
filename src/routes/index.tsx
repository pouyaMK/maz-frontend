import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy } from "react";

const LandingPage = lazy(() => import("../Pages/LandingPage"));
const AuthLayout = lazy(() => import("../layouts/AuthLayout"));
const Login = lazy(() => import("../Pages/auth/Login"));
const Dashboard = lazy(() => import("../Pages/admin/Dashboard"));

import { getToken } from "../lib/api";

function RequireAuth({ children }: { children: React.ReactNode }) {
  const token = getToken();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

const router = createBrowserRouter([
  {
    path: "/login",
    element: <AuthLayout />,
    errorElement: <div>Page Not Found</div>,
    children: [
      {
        index: true,
        element: <Login />,
      },
    ],
  },

  {
    path: "/admin",
    element: (
      <RequireAuth>
        <Dashboard />
      </RequireAuth>
    ),
    errorElement: <div>Page Not Found</div>,
  },

  {
    path: "/:slug",
    element: <LandingPage />,
    errorElement: <div>Page Not Found</div>,
  },

  {
    path: "/",
    element: (
      <div
        style={{
          minHeight: "100vh",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#02205f",
          direction: "rtl",
          textAlign: "center",
          padding: 40,
          color: "#ffffff",
          fontSize: "1.125rem",
          boxSizing: "border-box",
        }}
      >
        لینک دعوت‌نامه شما معتبر نیست.
      </div>
    ),
  },
]);

export default router;