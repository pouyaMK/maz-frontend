import { createBrowserRouter } from "react-router-dom"

import LandingPage from "../Pages/LandingPage"
import AuthLayout from "../layouts/AuthLayout"
import Login from "../Pages/auth/Login"
import Dashboard from "../Pages/admin/Dashboard"

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
    errorElement: <div>Page Not Found</div>,
  },

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
    element: <Dashboard />,
    errorElement: <div>Page Not Found</div>,
  },
])

export default router