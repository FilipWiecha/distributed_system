import { Button } from "./Button";
import { Brand } from "./Brand";

export function LoadingScreen() {
  return (
    <div className="state-frame">
      <header className="chrome-topbar">
        <Brand scope="account.mojprojekt.test" />
      </header>
      <main className="state-sheet">
        <div className="state-box" role="status">
          <h1>Weryfikacja sesji SSO</h1>
          <p>Sprawdzanie ważności poświadczeń w usłudze autoryzacji…</p>
          <div className="skeleton-rows" aria-hidden="true">
            <div className="skeleton-bar" />
            <div className="skeleton-bar short" />
          </div>
        </div>
      </main>
    </div>
  );
}

export function ConnectionError({
  message,
  retry,
}: {
  message: string;
  retry: () => void;
}) {
  return (
    <div className="state-frame">
      <header className="chrome-topbar">
        <Brand scope="account.mojprojekt.test" />
      </header>
      <main className="state-sheet">
        <div className="state-box">
          <div className="state-box-head">
            <h1>Brak odpowiedzi z bramy API</h1>
            <span className="pill neg">Offline</span>
          </div>
          <p role="alert">{message}</p>
          <p className="state-meta">
            Usługa autoryzacji (
            <code className="mono">account.mojprojekt.test/api</code>) jest
            chwilowo niedostępna. Spróbuj ponownie.
          </p>
          <div className="state-actions">
            <Button onClick={retry}>Spróbuj ponownie</Button>
            <a href="/login" className="button button-ghost">
              Przejdź do logowania
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
