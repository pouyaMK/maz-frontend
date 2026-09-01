import { createBrowserRouter, Navigate } from "react-router-dom";

import LandingPage from "../Pages/LandingPage";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../Pages/auth/Login";
import Dashboard from "../Pages/admin/Dashboard";
import { getToken } from "../lib/api";

// یه گارد خیلی ساده: اگه توکن نبود میفرسته لاگین
// (چک واقعی/انقضای توکن سمت بک‌اند انجام میشه، /api/auth/me هم برای اعتبارسنجی موجوده)
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

  // مسیر داینامیک هر مهمون: mos.ir/pouya-madankar
  // این باید آخرین route باشه چون هر چیزی غیر از /login و /admin رو می‌گیره
  {
    path: "/:slug",
    element: <LandingPage />,
    errorElement: <div>Page Not Found</div>,
  },

  {
    path: "/",
    element: <div style={{ direction: "rtl", textAlign: "center", padding: 40 }}>
      لینک دعوت‌نامه شما معتبر نیست.
    </div>,
  },
]);

export default router;