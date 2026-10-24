import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postExercise } from "../../features/exercise/services/ExerciseService";
import type { ExerciseDto } from "../../features/exercise/types/ExerciseDto";
import { useApiValidation } from "../../hooks/useApiValidation";
import { PageLayout } from "../../components/layout/PageLayout";
import { ExerciseForm } from "../../features/exercise/components/ExerciseForm";
import { BackButton, SaveButton } from "../../components/common/Buttons";

export function ExerciseAddPage() {
  const navigate = useNavigate();
  const { handleApiError, clearErrors } = useApiValidation();

  const [exercise, setExercise] = useState<Partial<ExerciseDto>>({
    name: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: null, message: "" });
    clearErrors();

    const payload: Partial<ExerciseDto> = { ...exercise };
    (Object.keys(payload) as (keyof ExerciseDto)[]).forEach((key) => {
      if (payload[key] === "") delete payload[key];
    });

    try {
      await postExercise(payload as ExerciseDto);
      navigate("/exercise");
    } catch (error: unknown) {
      const { generalError } = handleApiError(error);
      setStatus({
        type: "error",
        message: generalError || "Wystąpił błąd podczas dodawania ćwiczenia.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="form-wrapper">
        <div className="top-nav">
          <BackButton to="/exercise" />
        </div>

        <div className="form-header">
          <h2>Nowe Ćwiczenie</h2>
          <p>Wprowadź szczegóły ćwiczenia.</p>
        </div>

        {status.type === "error" && (
          <div className="error-message">{status.message}</div>
        )}

        <form onSubmit={handleSubmit}>
          <ExerciseForm exercise={exercise} onChange={setExercise} />

          <div className="bottom-actions">
            <SaveButton isLoading={isLoading} text="Zapisz ćwiczenie" />
          </div>
        </form>
      </div>
    </PageLayout>
  );
}
