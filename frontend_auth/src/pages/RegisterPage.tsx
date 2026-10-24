import { useState } from "react";
import type { SubmitEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthLayout } from "../components/layout/AuthLayout";
import { Button } from "../components/ui/Button";
import { Field } from "../components/ui/Field";
import { Notice } from "../components/ui/Notice";
import { postRegister } from "../features/auth/services/AuthService";
import type RegisterRequest from "../features/auth/types/RegisterRequest";

export function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState<RegisterRequest>({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    birthDate: "",
  });
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update =
    (name: keyof RegisterRequest) =>
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setData((previous) => ({ ...previous, [name]: event.target.value }));

  const today = new Date();
  today.setDate(today.getDate() - 1);
  const maxDate = today.toISOString().slice(0, 10);
  const passwordBytes = new TextEncoder().encode(data.password).length;

  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setError(null);
    if (data.password !== confirm) {
      setError("Podane hasła muszą być identyczne.");
      return;
    }
    if (passwordBytes > 72) {
      setError(
        "Hasło przekracza limit 72 bajtów UTF-8 wymagany przez algorytm bcrypt.",
      );
      return;
    }
    if (
      ![data.firstName, data.lastName].every((name) =>
        /^\p{L}[\p{L} '-]*$/u.test(name.trim()),
      )
    ) {
      setError(
        "Imię i nazwisko mogą zawierać wyłącznie litery, spacje, apostrof i myślnik.",
      );
      return;
    }
    setBusy(true);
    const result = await postRegister({
      registerData: {
        ...data,
        username: data.username.trim(),
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email: data.email.trim(),
      },
    });
    if (result.success)
      navigate("/login" + location.search, {
        replace: true,
        state: { registered: true },
      });
    else setError(result.error || "Nie udało się utworzyć konta.");
    setBusy(false);
  }

  return (
    <AuthLayout register>
      <div className="auth-heading">
        <div className="auth-heading-top">
          <h1>Rejestracja konta</h1>
          <span className="pill">Nowa tożsamość</span>
        </div>
        <p>
          Utwórz konto do zarządzania profilem i korzystania z aplikacji Gym.
        </p>
      </div>

      <form className="auth-form register-form" onSubmit={submit}>
        {error && <Notice tone="error">{error}</Notice>}
        <div className="form-grid">
          <Field
            label="Imię"
            name="firstName"
            value={data.firstName}
            onChange={update("firstName")}
            autoComplete="given-name"
            placeholder="np. Aleksandra"
            required
            minLength={2}
            maxLength={50}
          />
          <Field
            label="Nazwisko"
            name="lastName"
            value={data.lastName}
            onChange={update("lastName")}
            autoComplete="family-name"
            placeholder="np. Nowak"
            required
            minLength={2}
            maxLength={50}
          />
        </div>
        <Field
          label="Adres e-mail"
          name="email"
          type="email"
          value={data.email}
          onChange={update("email")}
          autoComplete="email"
          placeholder="aleksandra.nowak@mojprojekt.test"
          required
          maxLength={255}
        />
        <div className="form-grid">
          <Field
            label="Nazwa użytkownika"
            name="username"
            value={data.username}
            onChange={update("username")}
            autoComplete="username"
            placeholder="aleksandra_nowak"
            required
            pattern="[a-zA-Z0-9_]+"
            title="Litery łacińskie, cyfry i podkreślenie"
            minLength={3}
            maxLength={50}
          />
          <Field
            label="Data urodzenia"
            name="birthDate"
            type="date"
            value={data.birthDate}
            onChange={update("birthDate")}
            autoComplete="bday"
            required
            max={maxDate}
          />
        </div>
        <Field
          label="Hasło"
          name="password"
          type="password"
          value={data.password}
          onChange={update("password")}
          autoComplete="new-password"
          placeholder="Minimum 12 znaków"
          required
          minLength={12}
          maxLength={72}
        />
        <div
          className={
            "password-requirement" +
            (data.password.length >= 12 && passwordBytes <= 72
              ? " requirement-met"
              : "")
          }
        >
          <span>
            {data.password.length >= 12
              ? "Wymagana długość osiągnięta."
              : "Minimum 12 znaków, unikalna fraza."}
          </span>
          <span className="num mono">{passwordBytes} / 72 B</span>
        </div>
        <Field
          label="Powtórz hasło"
          name="confirmPassword"
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          autoComplete="new-password"
          placeholder="Powtórz hasło"
          required
          maxLength={72}
        />
        <Button type="submit" className="button-full" busy={busy}>
          {busy ? "Tworzenie konta…" : "Utwórz konto SSO"}
        </Button>
      </form>

      <p className="auth-switch">
        Masz już utworzone konto?{" "}
        <Link to={"/login" + location.search} className="text-link">
          Przejdź do logowania
        </Link>
      </p>
    </AuthLayout>
  );
}
