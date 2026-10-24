import { useState, useEffect } from "react";
import { getWorkouts, searchWorkouts } from "../services/WorkoutService";
import type { WorkoutDto } from "../types/WorkoutDto";
import type { SliceResponse } from "../../../types/SliceResponse";

export function useFetchWorkouts(
  searchQuery: string,
  currentPage: number,
  setHasNext: (val: boolean) => void,
) {
  const [workouts, setWorkouts] = useState<WorkoutDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trigger, setTrigger] = useState(0);

  const refetch = () => setTrigger((prev) => prev + 1);

  useEffect(() => {
    const fetchWorkouts = async () => {
      setIsLoading(true);
      try {
        const data: SliceResponse<WorkoutDto> = searchQuery
          ? await searchWorkouts(searchQuery, currentPage)
          : await getWorkouts(currentPage);
        setWorkouts(data.content);
        setHasNext(data.hasNext);
        setError(null);
      } catch {
        setError("Błąd pobierania danych.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchWorkouts();
  }, [currentPage, searchQuery, setHasNext, trigger]);

  return { workouts, isLoading, error, refetch };
}
