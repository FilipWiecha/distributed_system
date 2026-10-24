import { Type, AlignLeft } from "lucide-react";
import type { ExerciseDto } from "../types/ExerciseDto";

interface ExerciseFormProps {
  exercise: Partial<ExerciseDto>;
  onChange: (exercise: Partial<ExerciseDto>) => void;
}

export function ExerciseForm({ exercise, onChange }: ExerciseFormProps) {
  return (
    <>
      <div className="input-group">
        <label htmlFor="name">Nazwa ćwiczenia</label>
        <div className="input-with-icon">
          <Type className="icon-left" size={18} />
          <input
            id="name"
            type="text"
            value={exercise.name || ""}
            onChange={(e) => onChange({ ...exercise, name: e.target.value })}
            required
            maxLength={255}
          />
        </div>
      </div>

      <div className="input-group">
        <label htmlFor="description">Opis</label>
        <div className="input-with-icon" style={{ alignItems: "flex-start" }}>
          <AlignLeft className="icon-left" size={18} style={{ top: "12px" }} />
          <textarea
            id="description"
            value={exercise.description || ""}
            onChange={(e) =>
              onChange({ ...exercise, description: e.target.value })
            }
            maxLength={255}
            rows={4}
            style={{
              height: "100px",
              resize: "vertical",
              padding: "12px 12px 12px 40px",
            }}
          />
        </div>
      </div>
    </>
  );
}
