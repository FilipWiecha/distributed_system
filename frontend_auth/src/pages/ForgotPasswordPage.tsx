import { Link } from "react-router-dom";
import { AuthLayout } from "../components/layout/AuthLayout";
export function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <div className="auth-heading">
        <h1>Odzyskiwanie dostępu</h1>
        <p>
          Resetowanie zapomnianego hasła nie jest obsługiwane. Jeśli jesteś
          zalogowany i znasz obecne hasło, możesz je zmienić w ustawieniach
          konta.
        </p>
      </div>
      <Link className="button button-secondary" to="/login">
        Wróć do logowania
      </Link>
    </AuthLayout>
  );
}
