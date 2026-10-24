import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import {
  getExercise,
  patchExercise,
  deleteExercise,
} from "../../features/exercise/services/ExerciseService";
import type { ExerciseDto } from "../../features/exercise/types/ExerciseDto";
import { useApiValidation } from "../../hooks/useApiValidation";

import {
  BackButton,
  SaveButton,
  DeleteButton,
  EditButton,
} from "../../components/common/Buttons";
import { ConfirmModal } from "../../components/common/ConfirmModal";
import { PageLayout } from "../../components/layout/PageLayout";
import { ExerciseForm } from "../../features/exercise/components/ExerciseForm";

export function ExerciseDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { handleApiError, clearErrors } = useApiValidation();

  const searchParam = location.state?.search || "";
  const isQueryString = searchParam.startsWith("?");

  const backUrl = isQueryString
    ? `/exercise${searchParam}`
    : searchParam || "/exercise";

  const [exercise, setExercise] = useState<ExerciseDto | undefined>(
    location.state?.exercise as ExerciseDto | undefined,
  );
  const [isLoading, setIsLoading] = useState(exercise === undefined);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [status, setStatus] = useState<{
    type: "error" | "success" | null;
    message: string;
  }>({ type: null, message: "" });

  useEffect(() => {
    if (!id) return;
    let active = true;
    getExercise(id)
      .then((data) => {
        if (active) setExercise(data);
      })
      .catch(() => {
        if (active)
          setStatus({
            type: "error",
            message: "Nie udało się pobrać ćwiczenia.",
          });
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!exercise) return;
    setIsSaving(true);
    setStatus({ type: null, message: "" });
    clearErrors();

    const payload: Partial<ExerciseDto> = { ...exercise };
    (Object.keys(payload) as (keyof ExerciseDto)[]).forEach((key) => {
      if (payload[key] === "") delete payload[key];
    });

    try {
      await patchExercise(payload as ExerciseDto);
      const updated = await getExercise(exercise.id as string);
      setExercise(updated);
      setIsEditing(false);
      setStatus({ type: "success", message: "Zapisano zmiany." });
    } catch (error: unknown) {
      const { generalError } = handleApiError(error);
      setStatus({
        type: "error",
        message: generalError || "Błąd aktualizacji ćwiczenia.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    setIsDeleting(true);
    try {
      await deleteExercise(id);
      navigate("/exercise");
    } catch {
      setStatus({ type: "error", message: "Błąd podczas usuwania." });
      setIsDeleteModalOpen(false);
      setIsDeleting(false);
    }
  };

  if (isLoading && !exercise)
    return (
      <PageLayout>
        <p>Ładowanie...</p>
      </PageLayout>
    );
  if (status.type === "error" && !exercise)
    return (
      <PageLayout>
        <div className="error-message">{status.message}</div>
      </PageLayout>
    );
  if (!exercise) return null;

  return (
    <PageLayout>
      <div className="form-wrapper">
        <div className="top-nav">
          {isEditing ? (
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setStatus({ type: null, message: "" });
              }}
              className="btn-secondary"
            >
              <ArrowLeft size={16} /> Anuluj edycję
            </button>
          ) : (
            <BackButton to={backUrl} />
          )}

          {!isEditing && (
            <div className="page-header-actions">
              <EditButton onClick={() => setIsEditing(true)} />
              <DeleteButton onClick={() => setIsDeleteModalOpen(true)} />
            </div>
          )}
        </div>

        <div className="form-header">
          <h2>Szczegóły Ćwiczenia</h2>
        </div>

        {status.type === "error" && (
          <div className="error-message">{status.message}</div>
        )}
        {status.type === "success" && (
          <div className="success-banner">{status.message}</div>
        )}

        {isEditing ? (
          <form onSubmit={handleUpdate}>
            <ExerciseForm
              exercise={exercise}
              onChange={(updatedData) =>
                setExercise(updatedData as ExerciseDto)
              }
            />
            <div className="bottom-actions">
              <SaveButton isLoading={isSaving} text="Zapisz zmiany" />
            </div>
          </form>
        ) : (
          <div>
            <div className="read-only-field">
              <div className="read-only-label">Nazwa ćwiczenia</div>
              <p className="read-only-value">{exercise.name}</p>
            </div>
            <div className="read-only-field">
              <div className="read-only-label">Opis</div>
              <p className="read-only-value">
                {exercise.description || "Brak opisu"}
              </p>
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Usuwanie ćwiczenia"
        message={`Czy na pewno chcesz usunąć ćwiczenie "${exercise.name}"? Operacji nie można cofnąć.`}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        isLoading={isDeleting}
      />
    </PageLayout>
  );
}
