import type { ReactNode } from "react";
import { ComingSoon } from "../ui/Card";

export function SettingRow({
  title,
  description,
  children,
  comingSoon = true,
}: {
  comingSoon?: boolean;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className="setting-row">
      <div className="setting-copy">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>

      <div className="setting-controls">
        {comingSoon && <ComingSoon />}
        {children}
      </div>
    </div>
  );
}
