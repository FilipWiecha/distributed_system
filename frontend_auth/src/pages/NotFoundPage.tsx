import { Link } from "react-router-dom";
import { Brand } from "../components/ui/Brand";

export function NotFoundPage() {
  return (
    <div className="state-frame">
      <header className="chrome-topbar">
        <Brand scope="account.mojprojekt.test" />
      </header>
      <main className="state-sheet">
        <div className="state-box">
          <div className="state-box-head">
            <h1>Nie odnaleziono zasobu w tej subdomenie</h1>
            <span className="pill mono num">HTTP 404</span>
          </div>
          <p>
            Podana ścieżka nie istnieje w module konta (
            <code className="mono">account.mojprojekt.test</code>). Sprawdź
            adres lub wróć do głównego panelu tożsamości.
          </p>
          <div className="state-actions">
            <Link className="button button-primary" to="/">
              Przejdź do przeglądu konta
            </Link>
            <Link className="button button-secondary" to="/login">
              Ekran logowania SSO
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
