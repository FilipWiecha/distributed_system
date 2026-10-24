import { localDateTime } from "../../lib/localDateTime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createWorkout } from "../../features/workout/services/WorkoutService";
import type { WorkoutDto } from "../../features/workout/types/WorkoutDto";

import { WorkoutForm } from "../../features/workout/components/WorkoutForm";
import { BackButton, SaveButton } from "../../components/common/Buttons";
import { PageLayout } from "../../components/layout/PageLayout";

export function WorkoutAddPage() {
  const navigate = useNavigate();
  const [workout, setWorkout] = useState<Partial<WorkoutDto>>({
    title: "",
    description: "",
    startDate: localDateTime(),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await createWorkout(workout as WorkoutDto);
      navigate("/workout");
    } catch {
      setError("Błąd podczas zapisywania treningu.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="form-wrapper">
        <div className="top-nav">
          <BackButton to="/workout" />
        </div>

        <div className="form-header">
          <h2>Nowy Trening</h2>
          <p>Wprowadź podstawowe dane treningu.</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <WorkoutForm workout={workout} onChange={setWorkout} />

          <div className="bottom-actions">
            <SaveButton isLoading={isLoading} text="Utwórz trening" />
          </div>
        </form>
      </div>
    </PageLayout>
  );
}
