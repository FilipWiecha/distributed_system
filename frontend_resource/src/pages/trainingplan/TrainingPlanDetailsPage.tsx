import { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  getTrainingPlanById,
  updateTrainingPlan,
  deleteTrainingPlan,
} from "../../features/trainingplan/services/TrainingPlanService";
import type { TrainingPlanDto } from "../../features/trainingplan/types/TrainingPlanDto";
import { PageLayout } from "../../components/layout/PageLayout";
import { TrainingPlanForm } from "../../features/trainingplan/components/TrainingPlanForm";
import { PlanExerciseManager } from "../../features/trainingplan/components/PlanExerciseManager";
import {
  BackButton,
  SaveButton,
  DeleteButton,
  EditButton,
} from "../../components/common/Buttons";
import { ConfirmModal } from "../../components/common/ConfirmModal";

export function TrainingPlanDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const backUrl = location.state?.search
    ? `/trainingplan${location.state.search}`
    : "/trainingplan";

  const [plan, setPlan] = useState<TrainingPlanDto | undefined>(
    location.state?.trainingPlan as TrainingPlanDto | undefined,
  );
  const [isLoading, setIsLoading] = useState(plan === undefined);
  const [isRefreshingList, setIsRefreshingList] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshExercisesList = async () => {
    if (!id) return;
    setIsRefreshingList(true);
    try {
      const data = await getTrainingPlanById(id);
      setPlan(data);
    } catch {
      setError("Błąd odświeżania planu.");
    } finally {
      setIsRefreshingList(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    let active = true;
    getTrainingPlanById(id)
      .then((data) => {
        if (active) setPlan(data);
      })
      .catch(() => {
        if (active) setError("Nie udało się pobrać planu.");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  const handleUpdatePlanInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plan) return;
    setIsSaving(true);
    setError(null);
    try {
      await updateTrainingPlan(plan);
      await refreshExercisesList();
      setIsEditing(false);
    } catch {
      setError("Błąd aktualizacji planu.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePlan = async () => {
    if (!id) return;
    setIsDeleting(true);
    try {
      await deleteTrainingPlan(id);
      navigate("/trainingplan");
    } catch {
      setError("Błąd podczas usuwania planu.");
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  if (isLoading && !plan)
    return (
      <PageLayout>
        <p>Ładowanie...</p>
      </PageLayout>
    );
  if (error && !plan)
    return (
      <PageLayout>
        <div className="error-message">{error}</div>
      </PageLayout>
    );
  if (!plan || !plan.id) return null;

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
          <h2>Szczegóły Planu</h2>
        </div>

        {error && <div className="error-message">{error}</div>}

        {isEditing ? (
          <form onSubmit={handleUpdatePlanInfo}>
            <TrainingPlanForm
              plan={plan}
              onChange={(updatedData) =>
                setPlan(updatedData as TrainingPlanDto)
              }
            />
            <div className="bottom-actions">
              <SaveButton isLoading={isSaving} text="Zapisz zmiany" />
            </div>
          </form>
        ) : (
          <div>
            <div className="read-only-field">
              <div className="read-only-label">Tytuł planu</div>
              <p className="read-only-value">{plan.title}</p>
            </div>
            <div className="read-only-field">
              <div className="read-only-label">Opis planu</div>
              <p className="read-only-value">
                {plan.description || "Brak opisu"}
              </p>
            </div>
          </div>
        )}

        <PlanExerciseManager
          planId={plan.id}
          exercises={plan.exercises || []}
          onPlanUpdated={refreshExercisesList}
          isLoadingList={isRefreshingList}
          isEditing={isEditing}
        />
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Usuwanie planu"
        message={`Czy na pewno chcesz usunąć plan "${plan.title}"? Operacji nie można cofnąć.`}
        onConfirm={handleDeletePlan}
        onCancel={() => setIsDeleteModalOpen(false)}
        isLoading={isDeleting}
      />
    </PageLayout>
  );
}
