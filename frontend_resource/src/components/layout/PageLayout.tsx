import type { ReactNode } from "react";
export function PageLayout({ children }: { children: ReactNode }) {
  return <div className="screen-stack gym-content">{children}</div>;
}
