import { useState, useEffect } from "react";
import type { ExerciseDto } from "../types/ExerciseDto";
import type { SliceResponse } from "../../../types/SliceResponse";
import { getExercises, searchExercises } from "../services/ExerciseService";

export function useFetchExercises(
  searchQuery: string,
  currentPage: number,
  setHasNext: (val: boolean) => void,
) {
  const [exercises, setExercises] = useState<ExerciseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trigger, setTrigger] = useState(0);

  const refetch = () => setTrigger((prev) => prev + 1);

  useEffect(() => {
    const fetchExercises = async () => {
      setIsLoading(true);
      try {
        const data: SliceResponse<ExerciseDto> = searchQuery
          ? await searchExercises(searchQuery, currentPage)
          : await getExercises(currentPage);
        setExercises(data.content);
        setHasNext(data.hasNext);
        setError(null);
      } catch {
        setError("Błąd pobierania danych.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchExercises();
  }, [currentPage, searchQuery, setHasNext, trigger]);

  return { exercises, isLoading, error, refetch };
}
