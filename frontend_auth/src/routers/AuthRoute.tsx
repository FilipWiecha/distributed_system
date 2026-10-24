import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { LoadingScreen, ConnectionError } from "../components/ui/StateScreen";
export function AuthRoute() {
  const { isAuthenticated, isLoading, sessionError, retrySession } = useAuth();
  if (isLoading) return <LoadingScreen />;
  if (sessionError)
    return <ConnectionError message={sessionError} retry={retrySession} />;
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
