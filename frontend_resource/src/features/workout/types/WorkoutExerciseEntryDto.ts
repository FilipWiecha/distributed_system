export interface WorkoutExerciseEntryDto {
  id?: string;
  actualSets: number;
  actualReps: number;
  workout_id?: string;
  exercise_id: string;
  exercise_name?: string;
}
