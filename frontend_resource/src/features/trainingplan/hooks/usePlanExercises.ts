import { useState } from "react";
import {
  addExerciseToPlan,
  removeExerciseFromPlan,
  updatePlanExercise,
} from "../services/TrainingPlanService";
import type { PlanExerciseEntryDto } from "../types/PlanExerciseEntryDto";

export function usePlanExercises(planId: string, onSuccess: () => void) {
  const [isWorking, setIsWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addExercise = async (entry: PlanExerciseEntryDto) => {
    setIsWorking(true);
    setError(null);
    try {
      await addExerciseToPlan(planId, entry);
      onSuccess();
    } catch {
      setError("Wystąpił błąd podczas dodawania ćwiczenia.");
    } finally {
      setIsWorking(false);
    }
  };

  const updateExercise = async (
    entryId: string,
    entry: PlanExerciseEntryDto,
  ) => {
    setIsWorking(true);
    setError(null);
    try {
      await updatePlanExercise(planId, entryId, entry);
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
      await removeExerciseFromPlan(planId, entryId);
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
