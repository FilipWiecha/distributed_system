import { useState, useEffect } from "react";
import {
  getTrainingPlans,
  searchTrainingPlans,
} from "../services/TrainingPlanService";
import type { TrainingPlanDto } from "../types/TrainingPlanDto";
import type { SliceResponse } from "../../../types/SliceResponse";

export function useFetchTrainingPlans(
  searchQuery: string,
  currentPage: number,
  setHasNext: (val: boolean) => void,
) {
  const [plans, setPlans] = useState<TrainingPlanDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trigger, setTrigger] = useState(0);

  const refetch = () => setTrigger((prev) => prev + 1);

  useEffect(() => {
    const fetchPlans = async () => {
      setIsLoading(true);
      try {
        const data: SliceResponse<TrainingPlanDto> = searchQuery
          ? await searchTrainingPlans(searchQuery, currentPage)
          : await getTrainingPlans(currentPage);
        setPlans(data.content);
        setHasNext(data.hasNext);
        setError(null);
      } catch {
        setError("Błąd pobierania danych.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlans();
  }, [currentPage, searchQuery, setHasNext, trigger]);

  return { plans, isLoading, error, refetch };
}
