import type { ReactNode } from "react";
export function Notice({
  children,
  tone = "info",
}: {
  children: ReactNode;
  tone?: "info" | "error" | "success";
}) {
  return (
    <div
      className={"notice notice-" + tone}
      role={tone === "error" ? "alert" : "status"}
    >
      {children}
    </div>
  );
}
