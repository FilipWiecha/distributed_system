import type { PlanExerciseEntryDto } from "./PlanExerciseEntryDto";

export interface TrainingPlanDto {
  id?: string;
  title: string;
  description: string;
  exercises?: PlanExerciseEntryDto[];
}
