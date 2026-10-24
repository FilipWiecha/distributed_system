import { useState } from "react";
import { Plus, Trash2, List, MoveRight, Loader2 } from "lucide-react";
import { usePlanExercises } from "../hooks/usePlanExercises";
import type { PlanExerciseEntryDto } from "../types/PlanExerciseEntryDto";
import { ExerciseSelector } from "../../../components/common/ExerciseSelector";
import { ConfirmModal } from "../../../components/common/ConfirmModal";
import { useNavigate } from "react-router-dom";

interface PlanExerciseManagerProps {
  planId: string;
  exercises: PlanExerciseEntryDto[];
  onPlanUpdated: () => void;
  isLoadingList?: boolean;
  isEditing: boolean;
}

export function PlanExerciseManager({
  planId,
  exercises,
  onPlanUpdated,
  isLoadingList,
  isEditing,
}: PlanExerciseManagerProps) {
  const navigate = useNavigate();

  const { addExercise, removeExercise, isWorking, error } = usePlanExercises(
    planId,
    onPlanUpdated,
  );

  const [newEntry, setNewEntry] = useState<Partial<PlanExerciseEntryDto>>({
    targetSets: 3,
    targetReps: 10,
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

    await addExercise(newEntry as PlanExerciseEntryDto);
    setNewEntry({
      targetSets: 3,
      targetReps: 10,
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
      // Error jest obsługiwany w hooku
    }
  };

  return (
    <div
      style={{
        marginTop: "40px",
        borderTop: "1px solid var(--color-border)",
        paddingTop: "24px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "24px",
        }}
      >
        <List size={20} color="var(--color-primary)" />
        <h3 style={{ margin: 0 }}>Ćwiczenia w planie</h3>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* --- LISTA ĆWICZEŃ --- */}
      <div style={{ marginBottom: "40px" }}>
        {isLoadingList ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "32px",
              color: "var(--color-text-muted)",
            }}
          >
            <Loader2
              className="animate-spin"
              size={24}
              style={{ marginRight: "8px" }}
            />
            <span>Odświeżanie listy ćwiczeń...</span>
          </div>
        ) : exercises.length === 0 ? (
          <p
            style={{
              color: "var(--color-text-muted)",
              fontSize: "14px",
              textAlign: "center",
              padding: "24px",
              backgroundColor: "var(--color-bg-light)",
              borderRadius: "6px",
              border: "1px dashed var(--color-border)",
            }}
          >
            Ten plan nie ma jeszcze dodanych ćwiczeń.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {exercises.map((entry) => (
              <div
                key={entry.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "16px",
                  border: "1px solid var(--color-border)",
                  borderRadius: "6px",
                  background: "var(--color-bg-light)",
                }}
              >
                <div>
                  <p
                    style={{
                      margin: "0 0 6px 0",
                      fontWeight: 500,
                      fontSize: "14px",
                    }}
                  >
                    {entry.exercise_name ||
                      "Nazwa niedostępna (Brak na backendzie)"}
                  </p>
                  <p
                    style={{
                      margin: 0,
                      color: "var(--color-text-muted)",
                      fontSize: "12px",
                    }}
                  >
                    Zalecane: {entry.targetSets} serie × {entry.targetReps}{" "}
                    powtórzeń
                  </p>
                </div>

                {isEditing ? (
                  <button
                    type="button"
                    onClick={() => entry.id && setDeleteEntryId(entry.id)}
                    disabled={isWorking}
                    className="btn-danger"
                    style={{ padding: "8px" }}
                  >
                    <Trash2 size={16} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/exercise/${entry.exercise_id}`, {
                        state: {
                          search: `/trainingplan/${planId}`,
                        },
                      })
                    }
                    disabled={isWorking}
                    className="btn-secondary"
                    style={{ padding: "8px" }}
                  >
                    <MoveRight size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- FORMULARZ DODAWANIA --- */}
      {isEditing && (
        <div
          style={{
            borderTop: "1px solid var(--color-border)",
            paddingTop: "24px",
          }}
        >
          <h4
            style={{
              margin: "0 0 16px 0",
              fontSize: "16px",
              color: "var(--color-text-main)",
            }}
          >
            Dodaj nowe ćwiczenie do planu
          </h4>

          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                fontSize: "13px",
                fontWeight: 500,
                color: "var(--color-text-main)",
                marginBottom: "8px",
                display: "block",
              }}
            >
              1. Wyszukaj i wybierz ćwiczenie:
            </label>
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
            <div className="input-group" style={{ flex: 2, marginBottom: 0 }}>
              <label style={{ fontSize: "12px" }}>Wybrane ćwiczenie</label>
              <input
                type="text"
                value={newEntry.exercise_name || "Brak (Wybierz powyżej)"}
                readOnly
                style={{
                  padding: "10px 12px",
                  border: "1px solid var(--color-border)",
                  borderRadius: "6px",
                  width: "100%",
                  backgroundColor: "var(--color-bg-light)",
                  color: "var(--color-text-muted)",
                }}
              />
            </div>
            <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
              <label style={{ fontSize: "12px" }}>Serie</label>
              <input
                type="number"
                min="1"
                value={newEntry.targetSets}
                onChange={(e) =>
                  setNewEntry({
                    ...newEntry,
                    targetSets: parseInt(e.target.value),
                  })
                }
                required
                disabled={!newEntry.exercise_id}
                style={{
                  padding: "10px 12px",
                  border: "1px solid var(--color-border)",
                  borderRadius: "6px",
                  width: "100%",
                }}
              />
            </div>
            <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
              <label style={{ fontSize: "12px" }}>Powt.</label>
              <input
                type="number"
                min="1"
                value={newEntry.targetReps}
                onChange={(e) =>
                  setNewEntry({
                    ...newEntry,
                    targetReps: parseInt(e.target.value),
                  })
                }
                required
                disabled={!newEntry.exercise_id}
                style={{
                  padding: "10px 12px",
                  border: "1px solid var(--color-border)",
                  borderRadius: "6px",
                  width: "100%",
                }}
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
        title="Usuwanie ćwiczenia z planu"
        message="Czy na pewno chcesz usunąć to ćwiczenie z tego planu?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteEntryId(null)}
        isLoading={isWorking}
      />
    </div>
  );
}
