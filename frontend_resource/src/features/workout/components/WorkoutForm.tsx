import { Type, AlignLeft, Calendar } from "lucide-react";
import type { WorkoutDto } from "../types/WorkoutDto";
import { AppDatePicker } from "../../../components/common/AppDatePicker";

interface WorkoutFormProps {
  workout: Partial<WorkoutDto>;
  onChange: (workout: Partial<WorkoutDto>) => void;
}

export function WorkoutForm({ workout, onChange }: WorkoutFormProps) {
  return (
    <>
      <div className="input-group">
        <label htmlFor="title">Tytuł treningu</label>
        <div className="input-with-icon">
          <Type className="icon-left" size={18} />
          <input
            id="title"
            type="text"
            value={workout.title || ""}
            onChange={(e) => onChange({ ...workout, title: e.target.value })}
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
            value={workout.description || ""}
            onChange={(e) =>
              onChange({ ...workout, description: e.target.value })
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

      <div className="input-group">
        <label htmlFor="startDate">Data rozpoczęcia</label>
        <div className="input-with-icon">
          <Calendar className="icon-left" size={18} />
          <AppDatePicker
            name="startDate"
            value={workout.startDate ? workout.startDate.slice(0, 16) : ""}
            onChange={(e) => onChange({ ...workout, startDate: e })}
            isRequired={true}
            withTime={true}
            className={"callendar"}
          />
        </div>
      </div>
    </>
  );
}
