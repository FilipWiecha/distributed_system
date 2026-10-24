import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dumbbell, MoreVertical } from "lucide-react";
import type { ExerciseDto } from "../types/ExerciseDto";

interface ExerciseCardProps {
  exercise: ExerciseDto;
  backUrlSearch: string;
  onDelete: (id: string) => void;
}

export function ExerciseCard({
  exercise,
  backUrlSearch,
  onDelete,
}: ExerciseCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="card-item">
      <div className="card-header-top">
        <div className="card-header">
          <Dumbbell size={24} color="var(--color-primary)" />
          <h3>{exercise.name}</h3>
        </div>

        <button
          type="button"
          className="icon-btn"
          aria-label="Opcje wpisu"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <MoreVertical size={20} />
        </button>

        {isMenuOpen && (
          <>
            <div
              style={{ position: "fixed", inset: 0, zIndex: 9 }}
              onClick={() => setIsMenuOpen(false)}
            />
            <div className="card-actions-menu">
              <button
                onClick={() =>
                  navigate(`/exercise/${exercise.id}`, {
                    state: { exercise: exercise, search: backUrlSearch },
                  })
                }
              >
                Szczegóły / Edycja
              </button>
              <button
                className="delete-option"
                onClick={() => {
                  setIsMenuOpen(false);
                  if (exercise.id) onDelete(exercise.id);
                }}
              >
                Usuń
              </button>
            </div>
          </>
        )}
      </div>

      <p className="card-description">{exercise.description || "Brak opisu"}</p>

      <div className="card-footer">
        <Link
          to={`/exercise/${exercise.id}`}
          state={{ exercise: exercise, search: backUrlSearch }}
          className="button button-secondary"
        >
          Przejdź do szczegółów
        </Link>
      </div>
    </div>
  );
}
