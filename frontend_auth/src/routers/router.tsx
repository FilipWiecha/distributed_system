import { SessionsPage } from "../pages/SessionsPage";
import { createBrowserRouter } from "react-router-dom";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { ForgotPasswordPage } from "../pages/ForgotPasswordPage";
import { HomePage } from "../pages/HomePage";
import { UserPage } from "../pages/UserPage";
import { SettingsPage } from "../pages/SettingsPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { AccountLayout } from "../components/layout/AccountLayout";
import { GuestRoute } from "./GuestRoute";
import { AuthRoute } from "./AuthRoute";
export const router = createBrowserRouter([
  {
    element: <AuthRoute />,
    children: [
      {
        element: <AccountLayout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: "/profile", element: <UserPage /> },
          { path: "/settings", element: <SettingsPage /> },
          { path: "/sessions", element: <SessionsPage /> },
        ],
      },
    ],
  },
  {
    element: <GuestRoute />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/forgot-password", element: <ForgotPasswordPage /> },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
]);
