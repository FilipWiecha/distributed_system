import { SessionDialog } from "../sessions/SessionDialog";
interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  confirmText?: string;
}
export function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  isLoading,
  confirmText = "Usuń",
}: ConfirmModalProps) {
  if (!isOpen) return null;
  return (
    <SessionDialog title={title} onClose={onCancel} busy={isLoading}>
      <p className="session-confirm-copy">{message}</p>
      <div className="session-dialog-actions">
        <button
          className="button button-secondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          Anuluj
        </button>
        <button
          className="button button-danger"
          onClick={onConfirm}
          disabled={isLoading}
        >
          {isLoading ? "Przetwarzanie…" : confirmText}
        </button>
      </div>
    </SessionDialog>
  );
}
