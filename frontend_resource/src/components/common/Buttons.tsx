import { Link } from "react-router-dom";
import { ArrowLeft, Save, Trash2, Edit2, Plus } from "lucide-react";
export const BackButton = ({ to }: { to: string }) => (
  <Link to={to} className="button button-secondary">
    <ArrowLeft size={16} />
    Wróć
  </Link>
);
export const SaveButton = ({
  isLoading,
  text = "Zapisz",
}: {
  isLoading?: boolean;
  text?: string;
}) => (
  <button type="submit" className="button button-primary" disabled={isLoading}>
    <Save size={16} />
    {isLoading ? "Zapisywanie…" : text}
  </button>
);
export const DeleteButton = ({
  onClick,
  isLoading,
}: {
  onClick: () => void;
  isLoading?: boolean;
}) => (
  <button
    type="button"
    className="button button-danger"
    disabled={isLoading}
    onClick={onClick}
  >
    <Trash2 size={16} />
    Usuń
  </button>
);
export const EditButton = ({ onClick }: { onClick: () => void }) => (
  <button type="button" className="button button-secondary" onClick={onClick}>
    <Edit2 size={16} />
    Edytuj
  </button>
);
export const AddButton = ({
  to,
  text = "Dodaj",
}: {
  to: string;
  text?: string;
}) => (
  <Link to={to} className="button button-primary">
    <Plus size={16} />
    {text}
  </Link>
);
