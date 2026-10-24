import { apiClient } from "../../../services/apiClient";
import type { SliceResponse } from "../../../types/SliceResponse";
import type { WorkoutDto } from "../types/WorkoutDto";
import type { WorkoutExerciseEntryDto } from "../types/WorkoutExerciseEntryDto";

const WORKOUT_BASE = import.meta.env.VITE_ENDPOINT_WORKOUT || "/workout";
const WORKOUT_EXERCISE_ENDPOINT =
  import.meta.env.VITE_ENDPOINT_WORKOUT_EXERCISE || "/exercises";

export const getWorkouts = async (
  pageNumber: number = 0,
): Promise<SliceResponse<WorkoutDto>> => {
  const response = await apiClient.get<SliceResponse<WorkoutDto>>(
    WORKOUT_BASE,
    {
      params: { page: pageNumber },
    },
  );
  return response.data;
};

export const getWorkoutById = async (id: string): Promise<WorkoutDto> => {
  const response = await apiClient.get<WorkoutDto>(`${WORKOUT_BASE}/${id}`, {
    withCredentials: true,
  });
  return response.data;
};

export const deleteWorkout = async (id: string): Promise<void> => {
  await apiClient.delete(`${WORKOUT_BASE}/${id}`, { withCredentials: true });
};

export const searchWorkouts = async (
  query: string,
  pageNumber: number = 0,
): Promise<SliceResponse<WorkoutDto>> => {
  const WORKOUT_SEARCH_ENDOINT =
    import.meta.env.VITE_ENDPOINT_WORKOUT_SEARCH || "/workout/search";

  const response = await apiClient.get<SliceResponse<WorkoutDto>>(
    `${WORKOUT_SEARCH_ENDOINT}`,
    {
      params: {
        query: query,
        page: pageNumber,
      },
      withCredentials: true,
    },
  );
  return response.data;
};

export const createWorkout = async (workout: WorkoutDto): Promise<void> => {
  await apiClient.post(
    WORKOUT_BASE,
    { ...workout, description: workout.description?.trim() || null },
    { withCredentials: true },
  );
};

export const updateWorkout = async (workout: WorkoutDto): Promise<void> => {
  await apiClient.patch(WORKOUT_BASE, workout, { withCredentials: true });
};
//${WORKOUT_EXERCISE_ENDPOINT}
export const addExerciseToWorkout = async (
  workoutId: string,
  entry: WorkoutExerciseEntryDto,
): Promise<void> => {
  await apiClient.post(
    `${WORKOUT_BASE}/${workoutId}${WORKOUT_EXERCISE_ENDPOINT}`,
    entry,
    { withCredentials: true },
  );
};

export const updateWorkoutExercise = async (
  workoutId: string,
  entryId: string,
  entry: WorkoutExerciseEntryDto,
): Promise<void> => {
  await apiClient.patch(
    `${WORKOUT_BASE}/${workoutId}${WORKOUT_EXERCISE_ENDPOINT}/${entryId}`,
    entry,
    { withCredentials: true },
  );
};

export const removeExerciseFromWorkout = async (
  workoutId: string,
  entryId: string,
): Promise<void> => {
  await apiClient.delete(
    `${WORKOUT_BASE}/${workoutId}${WORKOUT_EXERCISE_ENDPOINT}/${entryId}`,
    { withCredentials: true },
  );
};
