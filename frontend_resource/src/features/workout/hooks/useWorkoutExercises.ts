import { useState } from "react";
import {
  addExerciseToWorkout,
  removeExerciseFromWorkout,
  updateWorkoutExercise,
} from "../services/WorkoutService";
import type { WorkoutExerciseEntryDto } from "../types/WorkoutExerciseEntryDto";

export function useWorkoutExercises(workoutId: string, onSuccess: () => void) {
  const [isWorking, setIsWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addExercise = async (entry: WorkoutExerciseEntryDto) => {
    setIsWorking(true);
    setError(null);
    try {
      await addExerciseToWorkout(workoutId, entry);
      onSuccess();
    } catch {
      setError("Wystąpił błąd podczas dodawania ćwiczenia.");
    } finally {
      setIsWorking(false);
    }
  };

  const updateExercise = async (
    entryId: string,
    entry: WorkoutExerciseEntryDto,
  ) => {
    setIsWorking(true);
    setError(null);
    try {
      await updateWorkoutExercise(workoutId, entryId, entry);
      onSuccess();
    } catch {
      setError("Wystąpił błąd podczas aktualizacji ćwiczenia.");
    } finally {
      setIsWorking(false);
    }
  };

  const removeExercise = async (entryId: string) => {
    setIsWorking(true);
    setError(null);
    try {
      await removeExerciseFromWorkout(workoutId, entryId);
      onSuccess();
    } catch {
      setError("Wystąpił błąd podczas usuwania ćwiczenia.");
      throw new Error();
    } finally {
      setIsWorking(false);
    }
  };

  return { addExercise, updateExercise, removeExercise, isWorking, error };
}
