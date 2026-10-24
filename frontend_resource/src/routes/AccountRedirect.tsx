import { useEffect } from "react";
import { accountUrl } from "../services/apiClient";
export function AccountRedirect({
  path,
  returnPath = "/",
}: {
  path: string;
  returnPath?: string;
}) {
  const target = accountUrl(
    path,
    new URL(returnPath, window.location.origin).href,
  );
  useEffect(() => {
    window.location.replace(target);
  }, [target]);
  return (
    <div className="state-sheet">
      <div className="state-box">
        <h1>Przejście do konta</h1>
        <a className="button button-primary" href={target}>
          Kontynuuj
        </a>
      </div>
    </div>
  );
}
