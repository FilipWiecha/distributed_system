export interface PlanExerciseEntryDto {
  id?: string;
  targetSets: number;
  targetReps: number;
  training_plan_id?: string;
  exercise_id: string;
  exercise_name?: string;
}
