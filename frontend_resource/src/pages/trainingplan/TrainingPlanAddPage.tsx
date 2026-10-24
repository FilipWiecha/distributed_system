import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { TrainingPlanDto } from "../../features/trainingplan/types/TrainingPlanDto";
import { createTrainingPlan } from "../../features/trainingplan/services/TrainingPlanService";
import { PageLayout } from "../../components/layout/PageLayout";
import { TrainingPlanForm } from "../../features/trainingplan/components/TrainingPlanForm";
import { BackButton, SaveButton } from "../../components/common/Buttons";

export function TrainingPlanAddPage() {
  const navigate = useNavigate();
  const [plan, setPlan] = useState<Partial<TrainingPlanDto>>({
    title: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await createTrainingPlan(plan as TrainingPlanDto);
      navigate("/trainingplan");
    } catch {
      setError("Błąd podczas zapisywania planu.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="form-wrapper">
        <div className="top-nav">
          <BackButton to="/trainingplan" />
        </div>

        <div className="form-header">
          <h2>Dodaj plan treningowy</h2>
          <p>Skonfiguruj podstawowe informacje.</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <TrainingPlanForm plan={plan} onChange={setPlan} />

          <div className="bottom-actions">
            <SaveButton isLoading={isLoading} text="Utwórz plan" />
          </div>
        </form>
      </div>
    </PageLayout>
  );
}
