import type { WorkoutExerciseEntryDto } from "./WorkoutExerciseEntryDto";

export interface WorkoutDto {
  id?: string;
  title: string;
  description: string;
  startDate?: string;
  exercises?: WorkoutExerciseEntryDto[];
}
