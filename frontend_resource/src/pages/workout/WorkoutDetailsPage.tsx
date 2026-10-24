import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  getWorkoutById,
  updateWorkout,
  deleteWorkout,
} from "../../features/workout/services/WorkoutService";
import type { WorkoutDto } from "../../features/workout/types/WorkoutDto";

import { WorkoutForm } from "../../features/workout/components/WorkoutForm";
import { WorkoutExerciseManager } from "../../features/workout/components/WorkoutExerciseManager";
import {
  BackButton,
  SaveButton,
  DeleteButton,
  EditButton,
} from "../../components/common/Buttons";
import { ConfirmModal } from "../../components/common/ConfirmModal";
import { PageLayout } from "../../components/layout/PageLayout";

export function WorkoutDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const backUrl = location.state?.search
    ? `/workout${location.state.search}`
    : "/workout";

  const [workout, setWorkout] = useState<WorkoutDto | undefined>(
    location.state?.workout as WorkoutDto | undefined,
  );
  const [isLoading, setIsLoading] = useState(workout === undefined);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkoutData = async () => {
    if (!id) return;
    try {
      const data = await getWorkoutById(id);
      setWorkout(data);
    } catch {
      setError("Nie znaleziono treningu.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    let active = true;
    getWorkoutById(id)
      .then((data) => {
        if (active) setWorkout(data);
      })
      .catch(() => {
        if (active) setError("Nie udało się pobrać treningu.");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  const handleUpdateInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workout) return;
    setIsSaving(true);
    setError(null);
    try {
      await updateWorkout(workout);
      await fetchWorkoutData();
      setIsEditing(false);
    } catch {
      setError("Błąd aktualizacji treningu.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    setIsDeleting(true);
    try {
      await deleteWorkout(id);
      navigate("/workout");
    } catch {
      setError("Błąd podczas usuwania treningu.");
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  if (isLoading && !workout)
    return (
      <PageLayout>
        <p>Ładowanie...</p>
      </PageLayout>
    );
  if (error && !workout)
    return (
      <PageLayout>
        <div className="error-message">{error}</div>
      </PageLayout>
    );
  if (!workout || !workout.id) return null;

  return (
    <PageLayout>
      <div className="form-wrapper">
        <div className="top-nav">
          {isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(false)}
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
          <h2>Szczegóły Treningu</h2>
        </div>

        {error && <div className="error-message">{error}</div>}

        {isEditing ? (
          <form onSubmit={handleUpdateInfo}>
            <WorkoutForm
              workout={workout}
              onChange={(updatedData) => setWorkout(updatedData as WorkoutDto)}
            />
            <div className="bottom-actions">
              <SaveButton isLoading={isSaving} text="Zapisz zmiany" />
            </div>
          </form>
        ) : (
          <div>
            <div className="read-only-field">
              <div className="read-only-label">Tytuł treningu</div>
              <p className="read-only-value">{workout.title}</p>
            </div>
            <div className="read-only-field">
              <div className="read-only-label">Opis</div>
              <p className="read-only-value">
                {workout.description || "Brak opisu"}
              </p>
            </div>
            <div className="read-only-field">
              <div className="read-only-label">Data rozpoczęcia</div>
              <p className="read-only-value">
                {workout.startDate
                  ? new Date(workout.startDate).toLocaleString()
                  : "Brak danych"}
              </p>
            </div>
          </div>
        )}

        <WorkoutExerciseManager
          workoutId={workout.id}
          exercises={workout.exercises || []}
          onWorkoutUpdated={fetchWorkoutData}
          isEditing={isEditing}
        />
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Usuwanie treningu"
        message={`Czy na pewno chcesz usunąć trening "${workout.title}"? Operacji nie można cofnąć.`}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        isLoading={isDeleting}
      />
    </PageLayout>
  );
}
