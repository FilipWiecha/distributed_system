import { PageHeader } from "../../components/layout/PageHeader";
import { useState } from "react";
import { useSlicePagination } from "../../hooks/useSlicePagination";
import { SearchBar } from "../../components/common/SearchBar";
import { PaginationControls } from "../../components/common/PaginationControls";
import { useFetchWorkouts } from "../../features/workout/hooks/useFetchWorkouts";
import { deleteWorkout } from "../../features/workout/services/WorkoutService";
import { WorkoutCard } from "../../features/workout/components/WorkoutCard";
import { ConfirmModal } from "../../components/common/ConfirmModal";
import { PageLayout } from "../../components/layout/PageLayout";

export function WorkoutListPage() {
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

  const { workouts, isLoading, error, refetch } = useFetchWorkouts(
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
      await deleteWorkout(deleteId);
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
        title="Dziennik treningów"
        actionLink="/workout/new"
        actionText="Dodaj"
      />
      <SearchBar
        initialValue={searchQuery}
        onSearch={updateSearch}
        placeholder="Szukaj treningu po tytule..."
      />

      {isLoading && <p className="loading-state">Ładowanie...</p>}
      {error && <div className="error-message">{error}</div>}

      {!isLoading && workouts.length === 0 && !error && (
        <p className="empty-state">
          Brak treningów. Rozpocznij swój pierwszy trening.
        </p>
      )}

      <div className="card-grid">
        {workouts.map((workout) => (
          <WorkoutCard
            key={workout.id}
            workout={workout}
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
        title="Usuwanie treningu"
        message="Czy na pewno chcesz usunąć ten trening? Operacji nie można cofnąć."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        isLoading={isDeleting}
      />
    </PageLayout>
  );
}
