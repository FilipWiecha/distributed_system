import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dumbbell, MoreVertical } from "lucide-react";
import type { TrainingPlanDto } from "../types/TrainingPlanDto";

interface TrainingPlanCardProps {
  plan: TrainingPlanDto;
  backUrlSearch: string;
  onDelete: (id: string) => void;
}

export function TrainingPlanCard({
  plan,
  backUrlSearch,
  onDelete,
}: TrainingPlanCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="card-item">
      <div className="card-header-top">
        <div className="card-header">
          <Dumbbell size={24} color="var(--color-primary)" />
          <h3>{plan.title}</h3>
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
                  navigate(`/trainingplan/${plan.id}`, {
                    state: { trainingPlan: plan, search: backUrlSearch },
                  })
                }
              >
                Szczegóły / Edycja
              </button>
              <button
                className="delete-option"
                onClick={() => {
                  setIsMenuOpen(false);
                  if (plan.id) onDelete(plan.id);
                }}
              >
                Usuń
              </button>
            </div>
          </>
        )}
      </div>

      <p className="card-description">{plan.description || "Brak opisu"}</p>

      <div className="card-footer">
        <Link
          to={`/trainingplan/${plan.id}`}
          state={{ trainingPlan: plan, search: backUrlSearch }}
          className="button button-secondary"
        >
          Przejdź do szczegółów
        </Link>
      </div>
    </div>
  );
}
