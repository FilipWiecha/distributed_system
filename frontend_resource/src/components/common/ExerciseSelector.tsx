import { useState, useEffect } from "react";
import { Search, Plus } from "lucide-react";
import {
  searchExercises,
  getExercises,
} from "../../features/exercise/services/ExerciseService";
import type { ExerciseDto } from "../../features/exercise/types/ExerciseDto";

interface ExerciseSelectorProps {
  onSelect: (exercise: ExerciseDto) => void;
}

export function ExerciseSelector({ onSelect }: ExerciseSelectorProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ExerciseDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const timeout = 500;

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const data = query
          ? await searchExercises(query, 0)
          : await getExercises(0);
        setResults(data.content);
      } catch (error) {
        console.error("Błąd wyszukiwania ćwiczeń", error);
      } finally {
        setIsLoading(false);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchResults();
    }, timeout);
    return () => clearTimeout(delayDebounce);
  }, [query, timeout]);

  return (
    <div className="selector">
      <div className="input-with-icon">
        <Search className="icon-left" size={18} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Szukaj ćwiczenia do dodania..."
        />
      </div>

      <div className="selector-list">
        {isLoading ? (
          <p className="selector-empty">Szukanie...</p>
        ) : results.length === 0 ? (
          <p className="selector-empty">Brak wyników.</p>
        ) : (
          results.map((ex) => (
            <div key={ex.id} className="selector-row">
              <span>{ex.name}</span>
              <button
                type="button"
                onClick={() => onSelect(ex)}
                className="btn-secondary"
              >
                <Plus size={14} /> Wybierz
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
