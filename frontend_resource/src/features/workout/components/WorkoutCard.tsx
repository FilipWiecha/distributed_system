import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Activity, MoreVertical } from "lucide-react";
import type { WorkoutDto } from "../types/WorkoutDto";

interface WorkoutCardProps {
  workout: WorkoutDto;
  backUrlSearch: string;
  onDelete: (id: string) => void;
}

export function WorkoutCard({
  workout,
  backUrlSearch,
  onDelete,
}: WorkoutCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="card-item">
      <div className="card-header-top">
        <div className="card-header">
          <Activity size={24} color="var(--color-primary)" />
          <h3>{workout.title}</h3>
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
                  navigate(`/workout/${workout.id}`, {
                    state: { workout: workout, search: backUrlSearch },
                  })
                }
              >
                Szczegóły / Edycja
              </button>
              <button
                className="delete-option"
                onClick={() => {
                  setIsMenuOpen(false);
                  if (workout.id) onDelete(workout.id);
                }}
              >
                Usuń
              </button>
            </div>
          </>
        )}
      </div>

      <p className="card-description" style={{ marginBottom: "8px" }}>
        {workout.description || "Brak opisu"}
      </p>
      {workout.startDate && (
        <p
          style={{
            color: "var(--color-text-light-muted)",
            fontSize: "12px",
            margin: "0 0 0px 0",
          }}
        >
          Data: {new Date(workout.startDate).toLocaleString()}
        </p>
      )}

      <div className="card-footer">
        <Link
          to={`/workout/${workout.id}`}
          state={{ workout: workout, search: backUrlSearch }}
          className="button button-secondary"
        >
          Przejdź do szczegółów
        </Link>
      </div>
    </div>
  );
}
