import { useState } from "react";
import type { SubmitEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthLayout } from "../components/layout/AuthLayout";
import { Button } from "../components/ui/Button";
import { Field } from "../components/ui/Field";
import { Notice } from "../components/ui/Notice";
import { useAuth } from "../context/useAuth";

export function LoginPage() {
  const { logInUser } = useAuth();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    const result = await logInUser({
      loginData: { username: username.trim(), password },
    });
    if (!result.success) setError(result.error || "Nie udało się zalogować.");
    setBusy(false);
  }

  return (
    <AuthLayout>
      <div className="auth-heading">
        <div className="auth-heading-top">
          <h1>Logowanie do konta</h1>
          <span className="pill">SSO</span>
        </div>
        <p>
          Wprowadź poświadczenia, aby przejść do panelu konta i aplikacji Gym.
        </p>
      </div>

      {location.state?.accountDeleted && (
        <Notice tone="success">
          Konto zostało dezaktywowane, a wszystkie jego sesje zakończone.
        </Notice>
      )}
      {location.state?.registered && (
        <Notice tone="success">
          Konto zostało utworzone. Możesz zalogować się poniżej.
        </Notice>
      )}

      <form onSubmit={submit} className="auth-form">
        {error && <Notice tone="error">{error}</Notice>}
        <Field
          label="Nazwa użytkownika"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Twoja nazwa użytkownika"
          autoComplete="username"
          required
          minLength={2}
          maxLength={50}
          autoCapitalize="none"
        />
        <Field
          label="Hasło"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Co najmniej 12 znaków"
          autoComplete="current-password"
          required
          maxLength={72}
        />
        <Button type="submit" busy={busy} className="button-full">
          {busy ? "Weryfikacja poświadczeń…" : "Zaloguj się do konta"}
        </Button>
      </form>

      <p className="auth-switch">
        Nie posiadasz jeszcze konta w systemie?{" "}
        <Link to={"/register" + location.search} className="text-link">
          Utwórz konto
        </Link>
      </p>
    </AuthLayout>
  );
}
