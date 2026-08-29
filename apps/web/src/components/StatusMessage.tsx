import type { ReactNode } from "react";

export function StatusMessage({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "error" }) {
  return <div className={`status-message status-message--${tone}`} role="status">{children}</div>;
}
