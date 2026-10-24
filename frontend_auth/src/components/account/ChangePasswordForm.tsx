import { useRef, useState } from "react";
import type { SubmitEvent } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Field } from "../ui/Field";
import { Button } from "../ui/Button";
import { Notice } from "../ui/Notice";
import {
  changePassword,
  passwordChangeError,
  validatePasswordChange,
} from "../../features/user/service/PasswordService";
import { useAuth } from "../../context/useAuth";

export function ChangePasswordForm({ onClose }: { onClose: () => void }) {
  const { invalidateSession } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [busy, setBusy] = useState(false);
  const pending = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const feedback = useRef<HTMLDivElement>(null);

  function focusFeedback() {
    requestAnimationFrame(() => feedback.current?.focus());
  }

  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (pending.current) return;

    const data = { currentPassword, newPassword };
    const validation = validatePasswordChange(data, confirmation);

    if (validation) {
      setError(validation);
      focusFeedback();
      return;
    }

    pending.current = true;
    setBusy(true);
    setError(null);

    try {
      await changePassword(data);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmation("");
      setSuccess(true);
      focusFeedback();
    } catch (failure) {
      if (axios.isAxiosError(failure) && failure.response?.status === 401)
        invalidateSession();
      else {
        setError(passwordChangeError(failure));
        focusFeedback();
      }
    } finally {
      pending.current = false;
      setBusy(false);
    }
  }

  return (
    <div className="password-change-panel" id="password-change-panel">
      <header>
        <h3>Zmień hasło</h3>
        <p>Użyj unikalnej frazy składającej się z co najmniej 12 znaków.</p>
      </header>

      <div ref={feedback} tabIndex={-1}>
        {error && <Notice tone="error">{error}</Notice>}
        {success && (
          <Notice tone="success">
            Hasło zostało zmienione. Pozostałe sesje nie zostały wylogowane.
            Możesz nimi zarządzać na stronie
            <Link className="text-link" to="/sessions">
              Urządzenia i sesje
            </Link>
            .
          </Notice>
        )}
      </div>

      {success ? (
        <Button variant="secondary" onClick={onClose}>
          Gotowe
        </Button>
      ) : (
        <form onSubmit={submit} className="password-change-form">
          <Field
            label="Obecne hasło"
            name="currentPassword"
            type="password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            required
            maxLength={72}
            disabled={busy}
            autoFocus
          />

          <Field
            label="Nowe hasło"
            name="newPassword"
            type="password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            required
            minLength={12}
            maxLength={72}
            disabled={busy}
            hint="Co najmniej 12 znaków, maksymalnie 72 bajty."
          />

          <Field
            label="Powtórz nowe hasło"
            name="confirmNewPassword"
            type="password"
            autoComplete="new-password"
            value={confirmation}
            onChange={(event) => setConfirmation(event.target.value)}
            required
            maxLength={72}
            disabled={busy}
          />

          <div className="password-change-actions">
            <Button variant="secondary" onClick={onClose} disabled={busy}>
              Anuluj
            </Button>

            <Button type="submit" busy={busy}>
              {busy ? "Zapisywanie…" : "Zapisz nowe hasło"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
