import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { gymReturnTo } from "../lib/returnTo";
import { useAuth } from "../context/useAuth";
import { LoadingScreen } from "../components/ui/StateScreen";
export function GuestRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const returnTo = gymReturnTo(location.search);
  useEffect(() => {
    if (isAuthenticated && returnTo) window.location.replace(returnTo);
  }, [isAuthenticated, returnTo]);
  return isLoading || (isAuthenticated && returnTo) ? (
    <LoadingScreen />
  ) : isAuthenticated ? (
    <Navigate to="/" replace />
  ) : (
    <Outlet />
  );
}
