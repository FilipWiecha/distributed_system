import { apiClient } from "../../../services/apiClient";
import type { SliceResponse } from "../../../types/SliceResponse";
import type { ExerciseDto } from "../types/ExerciseDto";

const ENDPOINT_EXERCISE = import.meta.env.VITE_ENDPOINT_EXERCISE || "/exercise";

export const getExercises = async (
  pageNumber: number = 0,
): Promise<SliceResponse<ExerciseDto>> => {
  const response = await apiClient.get<SliceResponse<ExerciseDto>>(
    ENDPOINT_EXERCISE,
    {
      params: { page: pageNumber },
      withCredentials: true,
    },
  );
  return response.data;
};

export const searchExercises = async (
  query: string,
  pageNumber: number = 0,
): Promise<SliceResponse<ExerciseDto>> => {
  const response = await apiClient.get<SliceResponse<ExerciseDto>>(
    `${ENDPOINT_EXERCISE}/search`,
    {
      params: { query, page: pageNumber },
      withCredentials: true,
    },
  );
  return response.data;
};

export const getExercise = async (id: string): Promise<ExerciseDto> => {
  const response = await apiClient.get<ExerciseDto>(
    `${ENDPOINT_EXERCISE}/${id}`,
    { withCredentials: true },
  );
  return response.data;
};

export const deleteExercise = async (id: string): Promise<void> => {
  await apiClient.delete(`${ENDPOINT_EXERCISE}/${id}`, {
    withCredentials: true,
  });
};

export const postExercise = async (exercise: ExerciseDto): Promise<void> => {
  await apiClient.post(ENDPOINT_EXERCISE, exercise, { withCredentials: true });
};

export const patchExercise = async (exercise: ExerciseDto): Promise<void> => {
  await apiClient.patch(ENDPOINT_EXERCISE, exercise, { withCredentials: true });
};
