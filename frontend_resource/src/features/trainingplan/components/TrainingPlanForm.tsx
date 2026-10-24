import { Type, AlignLeft } from "lucide-react";
import type { TrainingPlanDto } from "../types/TrainingPlanDto";

interface TrainingPlanFormProps {
  plan: Partial<TrainingPlanDto>;
  onChange: (plan: Partial<TrainingPlanDto>) => void;
}

export function TrainingPlanForm({ plan, onChange }: TrainingPlanFormProps) {
  return (
    <>
      <div className="input-group">
        <label htmlFor="title">Tytuł planu</label>
        <div className="input-with-icon">
          <Type className="icon-left" size={18} />
          <input
            id="title"
            type="text"
            value={plan.title || ""}
            onChange={(e) => onChange({ ...plan, title: e.target.value })}
            required
            maxLength={100}
          />
        </div>
      </div>

      <div className="input-group">
        <label htmlFor="description">Opis planu</label>
        <div className="input-with-icon" style={{ alignItems: "flex-start" }}>
          <AlignLeft className="icon-left" size={18} style={{ top: "12px" }} />
          <textarea
            id="description"
            value={plan.description || ""}
            onChange={(e) => onChange({ ...plan, description: e.target.value })}
            maxLength={250}
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
