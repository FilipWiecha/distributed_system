import { useId, useState } from "react";
import type { InputHTMLAttributes } from "react";
interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
}
export function Field({
  label,
  hint,
  error,
  type = "text",
  id,
  className = "",
  ...props
}: Props) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const [visible, setVisible] = useState(false);
  const password = type === "password";
  return (
    <div className={"field " + className}>
      <label htmlFor={inputId}>
        {label}
        {props.required && <span aria-hidden="true"> *</span>}
      </label>
      <div className="input-wrap">
        <input
          {...props}
          id={inputId}
          type={password && visible ? "text" : type}
          aria-invalid={!!error}
          aria-describedby={error || hint ? inputId + "-hint" : undefined}
          className={password ? "password-input" : ""}
        />
        {password && (
          <button
            type="button"
            className="password-toggle"
            disabled={props.disabled}
            onClick={() => setVisible(!visible)}
            aria-label={visible ? "Ukryj hasło" : "Pokaż hasło"}
            aria-pressed={visible}
          >
            {visible ? "Ukryj" : "Pokaż"}
          </button>
        )}
      </div>
      {(error || hint) && (
        <span
          className={"field-hint" + (error ? " field-error" : "")}
          id={inputId + "-hint"}
        >
          {error || hint}
        </span>
      )}
    </div>
  );
}
