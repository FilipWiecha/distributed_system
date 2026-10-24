import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { AccountRedirect } from "./AccountRedirect";
export function ProtectedRoute() {
  const { isAuthenticated, isLoading, error, retry } = useAuth();
  const location = useLocation();
  if (isLoading)
    return (
      <div className="state-sheet">
        <div className="state-box" role="status">
          <h1>Sprawdzanie sesji</h1>
          <p>Łączenie z kontem…</p>
        </div>
      </div>
    );
  if (error)
    return (
      <div className="state-sheet">
        <div className="state-box">
          <h1>Nie udało się sprawdzić konta</h1>
          <p role="alert">{error}</p>
          <button className="button button-primary" onClick={retry}>
            Spróbuj ponownie
          </button>
        </div>
      </div>
    );
  if (!isAuthenticated)
    return (
      <AccountRedirect
        path="/login"
        returnPath={location.pathname + location.search + location.hash}
      />
    );
  return <Outlet />;
}
