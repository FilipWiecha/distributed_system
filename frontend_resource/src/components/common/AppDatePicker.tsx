interface AppDatePickerProps {
  name?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  isRequired?: boolean;
  className?: string;
  withTime?: boolean;
  minuteStep?: number;
  disableFuture?: boolean;
}
import { localDateTime } from "../../lib/localDateTime";
export function AppDatePicker({
  name = "startDate",
  value,
  onChange,
  onBlur,
  isRequired = false,
  className = "",
  withTime = false,
  disableFuture = false,
}: AppDatePickerProps) {
  return (
    <input
      id={name}
      name={name}
      type={withTime ? "datetime-local" : "date"}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      required={isRequired}
      className={className}
      max={
        disableFuture
          ? withTime
            ? localDateTime()
            : localDateTime().slice(0, 10)
          : undefined
      }
    />
  );
}
