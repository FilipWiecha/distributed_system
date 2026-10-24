import { PageHeader } from "../../components/layout/PageHeader";
import { useState } from "react";
import { useSlicePagination } from "../../hooks/useSlicePagination";
import { SearchBar } from "../../components/common/SearchBar";
import { PaginationControls } from "../../components/common/PaginationControls";
import { useFetchExercises } from "../../features/exercise/hooks/useFetchExercises";
import { deleteExercise } from "../../features/exercise/services/ExerciseService";
import { ExerciseCard } from "../../features/exercise/components/ExerciseCard";
import { ConfirmModal } from "../../components/common/ConfirmModal";
import { PageLayout } from "../../components/layout/PageLayout";

export function ExerciseListPage() {
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

  const { exercises, isLoading, error, refetch } = useFetchExercises(
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
      await deleteExercise(deleteId);
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
        title="Katalog ćwiczeń"
        actionLink="/exercise/new"
        actionText="Dodaj"
      />
      <SearchBar
        initialValue={searchQuery}
        onSearch={updateSearch}
        placeholder="Szukaj ćwiczenia..."
      />

      {isLoading && <p className="loading-state">Ładowanie...</p>}
      {error && <div className="error-message">{error}</div>}
      {!isLoading && exercises.length === 0 && !error && (
        <p className="empty-state">
          Brak ćwiczeń. Dodaj swoje pierwsze ćwiczenie.
        </p>
      )}

      <div className="card-grid">
        {exercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
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
        title="Usuwanie ćwiczenia"
        message="Czy na pewno chcesz usunąć to ćwiczenie? Operacji nie można cofnąć."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        isLoading={isDeleting}
      />
    </PageLayout>
  );
}
