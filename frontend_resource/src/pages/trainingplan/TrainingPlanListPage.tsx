import { PageHeader } from "../../components/layout/PageHeader";
import { useState } from "react";
import { useSlicePagination } from "../../hooks/useSlicePagination";
import { SearchBar } from "../../components/common/SearchBar";
import { PaginationControls } from "../../components/common/PaginationControls";
import { useFetchTrainingPlans } from "../../features/trainingplan/hooks/useFetchTrainingPlans";
import { deleteTrainingPlan } from "../../features/trainingplan/services/TrainingPlanService";
import { TrainingPlanCard } from "../../features/trainingplan/components/TrainingPlanCard";
import { ConfirmModal } from "../../components/common/ConfirmModal";
import { PageLayout } from "../../components/layout/PageLayout";

export function TrainingPlanListPage() {
  const {
    currentPage,
    searchQuery,
    hasNext,
    setHasNext,
    nextPage,
    prevPage,
    hasPrev,
    updateSearch,
    backUrlSearch,
  } = useSlicePagination();

  const { plans, isLoading, error, refetch } = useFetchTrainingPlans(
    searchQuery,
    currentPage,
    setHasNext,
  );

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await deleteTrainingPlan(deleteId);
      refetch();
    } catch (err) {
      console.error("Błąd usuwania", err);
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  return (
    <PageLayout>
      <PageHeader
        title="Plany treningowe"
        actionLink="/trainingplan/new"
        actionText="Dodaj"
      />
      <SearchBar
        initialValue={searchQuery}
        onSearch={updateSearch}
        placeholder="Szukaj planu po tytule..."
      />

      {isLoading && <p className="loading-state">Ładowanie...</p>}
      {error && <div className="error-message">{error}</div>}

      {!isLoading && plans.length === 0 && !error && (
        <p className="empty-state">Brak planów. Utwórz swój pierwszy plan.</p>
      )}

      <div className="card-grid">
        {plans.map((plan) => (
          <TrainingPlanCard
            key={plan.id}
            plan={plan}
            backUrlSearch={backUrlSearch}
            onDelete={setDeleteId}
          />
        ))}
      </div>

      <PaginationControls
        onPrev={prevPage}
        onNext={nextPage}
        disablePrev={!hasPrev}
        disableNext={!hasNext}
      />

      <ConfirmModal
        isOpen={!!deleteId}
        title="Usuwanie planu"
        message="Czy na pewno chcesz usunąć ten plan? Operacji nie można cofnąć."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        isLoading={isDeleting}
      />
    </PageLayout>
  );
}
