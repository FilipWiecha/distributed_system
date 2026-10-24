import { apiClient } from "../../../services/apiClient";
import type { SliceResponse } from "../../../types/SliceResponse";
import type { TrainingPlanDto } from "../types/TrainingPlanDto";
import type { PlanExerciseEntryDto } from "../types/PlanExerciseEntryDto";

const TRAININGPLAN_BASE =
  import.meta.env.VITE_ENDPOINT_TRAININGPLAN || "/trainingplan";
const PLANEXERCISE_ENDPOINT =
  import.meta.env.VITE_ENDPOINT_TRAININGPLAN_EXERCISE || "/exercises";

export const getTrainingPlans = async (
  pageNumber: number = 0,
): Promise<SliceResponse<TrainingPlanDto>> => {
  const response = await apiClient.get<SliceResponse<TrainingPlanDto>>(
    TRAININGPLAN_BASE,
    {
      params: { page: pageNumber },
      withCredentials: true,
    },
  );
  return response.data;
};

export const getTrainingPlanById = async (
  id: string,
): Promise<TrainingPlanDto> => {
  const response = await apiClient.get<TrainingPlanDto>(
    `${TRAININGPLAN_BASE}/${id}`,
    { withCredentials: true },
  );
  return response.data;
};

export const deleteTrainingPlan = async (id: string): Promise<void> => {
  await apiClient.delete(`${TRAININGPLAN_BASE}/${id}`, {
    withCredentials: true,
  });
};

export const searchTrainingPlans = async (
  query: string,
  pageNumber: number = 0,
): Promise<SliceResponse<TrainingPlanDto>> => {
  const SEARCH_ENDPOINT =
    import.meta.env.VITE_ENDPOINT_TRAININGPLAN_SEARCH || "/trainingplan/search";
  const response = await apiClient.get<SliceResponse<TrainingPlanDto>>(
    `${SEARCH_ENDPOINT}`,
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

export const createTrainingPlan = async (
  plan: TrainingPlanDto,
): Promise<void> => {
  await apiClient.post(TRAININGPLAN_BASE, plan, { withCredentials: true });
};

export const updateTrainingPlan = async (
  plan: TrainingPlanDto,
): Promise<void> => {
  await apiClient.patch(TRAININGPLAN_BASE, plan, { withCredentials: true });
};

export const addExerciseToPlan = async (
  planId: string,
  entry: PlanExerciseEntryDto,
): Promise<void> => {
  await apiClient.post(
    `${TRAININGPLAN_BASE}/${planId}${PLANEXERCISE_ENDPOINT}`,
    entry,
    { withCredentials: true },
  );
};

export const updatePlanExercise = async (
  planId: string,
  entryId: string,
  entry: PlanExerciseEntryDto,
): Promise<void> => {
  await apiClient.patch(
    `${TRAININGPLAN_BASE}/${planId}${PLANEXERCISE_ENDPOINT}/${entryId}`,
    entry,
    { withCredentials: true },
  );
};

export const removeExerciseFromPlan = async (
  planId: string,
  entryId: string,
): Promise<void> => {
  await apiClient.delete(
    `${TRAININGPLAN_BASE}/${planId}${PLANEXERCISE_ENDPOINT}/${entryId}`,
    { withCredentials: true },
  );
};
