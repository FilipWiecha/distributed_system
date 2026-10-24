import { useRef, useState } from "react";
import type { SubmitEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { SessionDialog } from "../sessions/SessionDialog";
import { Field } from "../ui/Field";
import { Button } from "../ui/Button";
import { Notice } from "../ui/Notice";
import { useAuth } from "../../context/useAuth";
import {
  deleteAccount,
  deletionError,
  validateDeletionPassword,
} from "../../features/user/service/DeleteAccountService";

export function DeleteAccountDialog({ onClose }: { onClose: () => void }) {
  const { invalidateSession, userInfo } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pending = useRef(false);
  const feedback = useRef<HTMLDivElement>(null);

  function showError(message: string) {
    setError(message);
    requestAnimationFrame(() => feedback.current?.focus());
  }

  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending.current) return;

    const validation = validateDeletionPassword(password);
    if (validation) {
      showError(validation);
      return;
    }

    if (!confirmed) {
      showError(
        "Potwierdź, że chcesz usunąć konto i zakończyć wszystkie sesje.",
      );
      return;
    }

    pending.current = true;
    setBusy(true);
    setError(null);

    try {
      await deleteAccount(password);
      setPassword("");
      invalidateSession();
      navigate("/login", { replace: true, state: { accountDeleted: true } });
    } catch (failure) {
      setPassword("");
      setConfirmed(false);

      if (axios.isAxiosError(failure) && failure.response?.status === 401) {
        invalidateSession();
        navigate("/login", { replace: true });
      } else showError(deletionError(failure));
    } finally {
      pending.current = false;
      setBusy(false);
    }
  }
  return (
    <SessionDialog title="Usunąć konto?" onClose={onClose} busy={busy}>
      <p className="session-confirm-copy">
        Konto <strong>@{userInfo?.username}</strong> zostanie dezaktywowane, a
        wszystkie jego sesje zakończone. Utracisz dostęp do konta. Ta operacja
        nie usuwa fizycznie danych z systemu.
      </p>

      <div ref={feedback} tabIndex={-1}>
        {error && <Notice tone="error">{error}</Notice>}
      </div>

      <form onSubmit={submit} className="delete-account-form">
        <Field
          label="Obecne hasło"
          name="deleteAccountPassword"
          type="password"
          autoComplete="current-password"
          required
          maxLength={72}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          disabled={busy}
        />

        <label className="delete-account-confirm">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(event) => setConfirmed(event.target.checked)}
            required
            disabled={busy}
          />
          <span>
            Potwierdzam usunięcie konta i zakończenie wszystkich sesji.
          </span>
        </label>

        <div className="session-dialog-actions">
          <Button variant="secondary" onClick={onClose} disabled={busy}>
            Anuluj
          </Button>

          <Button
            type="submit"
            variant="danger"
            busy={busy}
            disabled={!confirmed || !password}
          >
            {busy ? "Usuwanie konta…" : "Usuń moje konto"}
          </Button>
        </div>
      </form>
    </SessionDialog>
  );
}
