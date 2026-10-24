import { useState } from "react";
import { Plus, Trash2, Activity, Loader2, MoveRight } from "lucide-react";
import { useWorkoutExercises } from "../hooks/useWorkoutExercises";
import type { WorkoutExerciseEntryDto } from "../types/WorkoutExerciseEntryDto";
import { ExerciseSelector } from "../../../components/common/ExerciseSelector";
import { ConfirmModal } from "../../../components/common/ConfirmModal";
import { useNavigate } from "react-router-dom";

interface WorkoutExerciseManagerProps {
  workoutId: string;
  exercises: WorkoutExerciseEntryDto[];
  onWorkoutUpdated: () => void;
  isLoadingList?: boolean;
  isEditing?: boolean;
}

export function WorkoutExerciseManager({
  workoutId,
  exercises,
  onWorkoutUpdated,
  isLoadingList,
  isEditing,
}: WorkoutExerciseManagerProps) {
  const navigation = useNavigate();

  const { addExercise, removeExercise, isWorking, error } = useWorkoutExercises(
    workoutId,
    onWorkoutUpdated,
  );

  const [newEntry, setNewEntry] = useState<Partial<WorkoutExerciseEntryDto>>({
    actualSets: 3,
    actualReps: 10,
    exercise_id: "",
    exercise_name: "",
  });

  const [deleteEntryId, setDeleteEntryId] = useState<string | null>(null);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntry.exercise_id) {
      alert("Proszę najpierw wyszukać i wybrać ćwiczenie.");
      return;
    }

    await addExercise(newEntry as WorkoutExerciseEntryDto);
    setNewEntry({
      actualSets: 3,
      actualReps: 10,
      exercise_id: "",
      exercise_name: "",
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteEntryId) return;
    try {
      await removeExercise(deleteEntryId);
      setDeleteEntryId(null);
    } catch {
      // Błąd jest łapany w hooku
    }
  };

  return (
    <div className="entries-section">
      <div className="entries-title">
        <Activity size={20} color="var(--color-primary)" />
        <h3>Wykonane ćwiczenia</h3>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* --- LISTA ĆWICZEŃ --- */}
      <div className="entries-list">
        {isLoadingList ? (
          <div className="loading-state">
            <Loader2 className="animate-spin" size={22} />
            <span>Odświeżanie listy ćwiczeń...</span>
          </div>
        ) : exercises.length === 0 ? (
          <p className="empty-state">
            Brak wprowadzonych ćwiczeń dla tego treningu.
          </p>
        ) : (
          exercises.map((entry) => (
            <div key={entry.id} className="entry-row">
              <div>
                <p className="entry-name">
                  {entry.exercise_name ||
                    "Nazwa niedostępna (Brak na backendzie)"}
                </p>
                <p className="entry-meta">
                  Wykonano: {entry.actualSets} serie × {entry.actualReps}{" "}
                  powtórzeń
                </p>
              </div>
              {isEditing ? (
                <button
                  type="button"
                  onClick={() => entry.id && setDeleteEntryId(entry.id)}
                  disabled={isWorking}
                  className="btn-danger btn-icon"
                  aria-label="Usuń ćwiczenie z treningu"
                >
                  <Trash2 size={16} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    navigation(`/exercise/${entry.exercise_id}`, {
                      state: {
                        search: `/workout/${workoutId}`,
                      },
                    })
                  }
                  disabled={isWorking}
                  className="btn-secondary btn-icon"
                  aria-label="Usuń ćwiczenie z treningu"
                >
                  <MoveRight size={16} />
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* --- FORMULARZ DODAWANIA --- */}
      {isEditing && (
        <div className="entry-add">
          <h4>Dodaj nowe ćwiczenie</h4>

          <div style={{ marginBottom: "16px" }}>
            <span className="field-label">1. Wyszukaj i wybierz ćwiczenie</span>
            <ExerciseSelector
              onSelect={(exercise) =>
                setNewEntry({
                  ...newEntry,
                  exercise_id: exercise.id,
                  exercise_name: exercise.name,
                })
              }
            />
          </div>

          <form
            onSubmit={handleAdd}
            className={`entry-form ${newEntry.exercise_id ? "" : "is-idle"}`}
          >
            <div className="input-group grow-2">
              <label htmlFor="selected-exercise">Wybrane ćwiczenie</label>
              <input
                id="selected-exercise"
                type="text"
                value={newEntry.exercise_name || "Brak (wybierz powyżej)"}
                readOnly
              />
            </div>
            <div className="input-group grow-1">
              <label htmlFor="entry-sets">Serie</label>
              <input
                id="entry-sets"
                type="number"
                min="1"
                value={newEntry.actualSets}
                onChange={(e) =>
                  setNewEntry({
                    ...newEntry,
                    actualSets: parseInt(e.target.value),
                  })
                }
                required
                disabled={!newEntry.exercise_id}
              />
            </div>
            <div className="input-group grow-1">
              <label htmlFor="entry-reps">Powtórzenia</label>
              <input
                id="entry-reps"
                type="number"
                min="1"
                value={newEntry.actualReps}
                onChange={(e) =>
                  setNewEntry({
                    ...newEntry,
                    actualReps: parseInt(e.target.value),
                  })
                }
                required
                disabled={!newEntry.exercise_id}
              />
            </div>
            <button
              type="submit"
              className="btn-primary"
              disabled={isWorking || !newEntry.exercise_id}
            >
              <Plus size={16} /> Dodaj
            </button>
          </form>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteEntryId}
        title="Usuwanie ćwiczenia"
        message="Czy na pewno chcesz usunąć to ćwiczenie z treningu?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteEntryId(null)}
        isLoading={isWorking}
      />
    </div>
  );
}
