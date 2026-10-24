import { Link } from "react-router-dom";

export function Brand({
  inverse = false,
  scope = "account",
}: {
  inverse?: boolean;
  scope?: string;
}) {
  return (
    <Link
      to="/"
      className={"brand" + (inverse ? " brand-inverse" : "")}
      aria-label="Filip W – Konto i tożsamość SSO (strona główna)"
    >
      <svg
        className="brand-mark-svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden="true"
      >
        <rect
          x="2"
          y="2"
          width="6.5"
          height="6.5"
          rx="1.5"
          fill="currentColor"
        />
        <rect
          x="11.5"
          y="2"
          width="6.5"
          height="6.5"
          rx="1.5"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <rect
          x="2"
          y="11.5"
          width="6.5"
          height="6.5"
          rx="1.5"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <rect
          x="11.5"
          y="11.5"
          width="6.5"
          height="6.5"
          rx="1.5"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M8.5 5.25H11.5M5.25 8.5V11.5M14.75 8.5V11.5M8.5 14.75H11.5"
          stroke="currentColor"
          strokeWidth="1.25"
        />
      </svg>
      <span className="brand-name">Filip W</span>
      {scope && <span className="brand-scope">{scope}</span>}
    </Link>
  );
}
