import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy } from "react";

// const Login = lazy(() => import("../Pages/auth/Login"));
// const LandingPage = lazy(() => import("../Pages/auth/LandingPage"));
// const Admin = lazy(() => import("../Pages/admin/Admin"));

// import LandingPage from "../Pages/LandingPage";
const LandingPage = lazy(() => import("../Pages/LandingPage"))
const AuthLayout = lazy(() => import("../layouts/AuthLayout"))
// import AuthLayout from "../layouts/AuthLayout";
// import Login from "../Pages/auth/Login";
const Login = lazy(() => import("../Pages/auth/Login"))
const Dashboard = lazy(() => import("../Pages/admin/Dashboard"))
// import Dashboard from "../Pages/admin/Dashboard";
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

  // مسیر ریشه (بدون اسلاگ): هیچ مهمونی مشخص نیست، پس همیشه پیام نامعتبر بودن
  // لینک نشون داده میشه. استایل کامل صفحه (بک‌گراند تیره + وسط‌چین) رو خودمون
  // اینجا می‌دیم چون این مسیر از LandingPage استفاده نمی‌کنه و صفحه‌ی جدا خودشه.
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