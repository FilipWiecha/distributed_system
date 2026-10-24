import { useEffect, useState } from "react";
import axios from "axios";
import { Search } from "lucide-react";
import { Button } from "../components/ui/Button";
import { PageHeading } from "../components/ui/Card";
import { Notice } from "../components/ui/Notice";
import { SessionDialog } from "../components/sessions/SessionDialog";
import { useAuth } from "../context/useAuth";
import { errorMessage, refreshCookies } from "../lib/api";
import {
  getSession,
  getSessions,
  revokeAllSessions,
  revokeSession,
  sessionDate,
} from "../features/sessions/service";
import type { Session, SessionsSlice } from "../features/sessions/types";

type Dialog =
  | { kind: "details"; id: string }
  | { kind: "revoke"; session: Session }
  | { kind: "all" };

type FilterTab = "all" | "active" | "revoked";

export function SessionsPage() {
  const { invalidateSession } = useAuth();
  const [page, setPage] = useState(0);
  const [revision, setRevision] = useState(0);
  const [apiData, setApiData] = useState<SessionsSlice | null>(null);
  const [apiLoading, setApiLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [dialog, setDialog] = useState<Dialog | null>(null);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [revokedIds, setRevokedIds] = useState<Set<string>>(new Set());
  const [filterTab, setFilterTab] = useState<FilterTab>("all");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    getSessions(page, controller.signal)
      .then((result) => {
        if (!controller.signal.aborted) setApiData(result);
      })
      .catch((failure: unknown) => {
        if (controller.signal.aborted) return;
        if (axios.isAxiosError(failure) && failure.response?.status === 401)
          invalidateSession();
        else setError(errorMessage(failure));
      })
      .finally(() => {
        if (!controller.signal.aborted) setApiLoading(false);
      });
    return () => controller.abort();
  }, [page, revision, invalidateSession]);

  const data = apiData;
  const loading = apiLoading;

  function reload(nextPage = page) {
    setApiLoading(true);
    setError(null);
    setApiData(null);
    setPage(nextPage);
    setRevision((value) => value + 1);
  }

  function openDialog(value: Dialog) {
    setActionError(null);
    setDialog(value);
  }

  async function confirmRevoke() {
    if (!dialog || dialog.kind === "details" || busy) return;
    setBusy(true);
    setActionError(null);

    try {
      if (dialog.kind === "all") {
        await revokeAllSessions();
        invalidateSession();
        return;
      }
      await revokeSession(dialog.session.sessionId);
      setRevokedIds((previous) =>
        new Set(previous).add(dialog.session.sessionId),
      );
      setDialog(null);
      setMessage(
        "Sesja została unieważniona. Urządzenie będzie wymagać ponownego logowania.",
      );
      // The API exposes no current-session flag. Refresh verifies whether we just revoked ourselves.
      try {
        await refreshCookies();
      } catch (failure) {
        if (
          axios.isAxiosError(failure) &&
          [400, 401, 403].includes(failure.response?.status ?? 0)
        ) {
          invalidateSession();
          return;
        }
        setError(
          "Sesja została unieważniona, ale nie udało się sprawdzić bieżącego logowania. Odśwież listę.",
        );
        return;
      }
      reload();
    } catch (failure) {
      if (axios.isAxiosError(failure) && failure.response?.status === 401)
        invalidateSession();
      else setActionError(errorMessage(failure));
    } finally {
      setBusy(false);
    }
  }

  const allSessions = (data?.sessions || []).map((s) => ({
    ...s,
    isRevoked: s.revoked || revokedIds.has(s.sessionId),
  }));
  const activeCount = allSessions.filter((s) => !s.isRevoked).length;
  const revokedCount = allSessions.filter((s) => s.isRevoked).length;

  const filteredSessions = allSessions.filter((s) => {
    if (filterTab === "active" && s.isRevoked) return false;
    if (filterTab === "revoked" && !s.isRevoked) return false;
    if (!query.trim()) return true;
    const q = query.trim().toLowerCase();
    return (
      (s.platform || "").toLowerCase().includes(q) ||
      (s.ipAddress || "").toLowerCase().includes(q) ||
      (s.userAgent || "").toLowerCase().includes(q) ||
      s.sessionId.toLowerCase().includes(q)
    );
  });

  return (
    <div className="screen-stack">
      <PageHeading
        breadcrumb="mojprojekt.test / account / sessions"
        title="Urządzenia i sesje"
        badge={
          data && !error ? (
            <span className="pill num">{activeCount} aktywne na stronie</span>
          ) : undefined
        }
        description="Każde logowanie wystawia osobny token odświeżania przypisany do urządzenia. Odwołanie sesji uniemożliwia jej dalsze odświeżanie."
        action={
          <div className="title-btn-group">
            <Button
              variant="secondary"
              onClick={() => reload()}
              disabled={loading || busy}
            >
              Odśwież listę
            </Button>
            <Button
              variant="danger"
              onClick={() => openDialog({ kind: "all" })}
              disabled={busy}
            >
              Wyloguj wszystkie
            </Button>
          </div>
        }
      />

      {message && <Notice tone="success">{message}</Notice>}
      {error && (
        <Notice tone="error">
          {error}{" "}
          <button className="session-inline-link" onClick={() => reload()}>
            Spróbuj ponownie
          </button>
        </Notice>
      )}

      {/* Underline tabs on a 1px full-width rule */}
      <div className="tabs" role="tablist" aria-label="Filtr stanu sesji">
        <button
          type="button"
          role="tab"
          aria-selected={filterTab === "all"}
          className="tab-btn"
          onClick={() => setFilterTab("all")}
        >
          Na tej stronie ({allSessions.length})
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={filterTab === "active"}
          className="tab-btn"
          onClick={() => setFilterTab("active")}
        >
          Aktywne ({activeCount})
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={filterTab === "revoked"}
          className="tab-btn"
          onClick={() => setFilterTab("revoked")}
        >
          Unieważnione ({revokedCount})
        </button>
      </div>

      {/* Filter toolbar */}
      <div className="filters">
        <div className="toolbar-search">
          <Search
            size={14}
            className="toolbar-search-icon"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filtruj po platformie, IP lub identyfikatorze…"
            aria-label="Filtruj sesje"
          />
        </div>
        <div className="spacer" />
        <span className="stamp num">
          Wyświetlono {filteredSessions.length} z {allSessions.length} na
          stronie {page + 1}
        </span>
      </div>

      {/* Table of sessions */}
      <section className="panel table-panel" aria-label="Tabela sesji konta">
        {loading ? (
          <div className="empty" role="status">
            Pobieranie listy sesji z serwera autoryzacji…
          </div>
        ) : error ? (
          <div className="empty">Nie udało się pobrać sesji.</div>
        ) : filteredSessions.length === 0 ? (
          <div className="empty">
            <div>
              <strong>Brak sesji spełniających kryteria</strong>
              <p className="sub">
                {query
                  ? "Zmień frazę wyszukiwania lub przełącz zakładkę stanu."
                  : page > 0
                    ? "Wróć do poprzedniej strony lub odśwież listę."
                    : "Nie znaleziono zapisanych sesji Twojego konta."}
              </p>
            </div>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="sessions-table">
              <thead>
                <tr>
                  <th>Urządzenie i klient</th>
                  <th>Identyfikator</th>
                  <th>Adres IP</th>
                  <th className="n">Ostatnia rotacja</th>
                  <th className="n">Ważność do</th>
                  <th>Stan</th>
                  <th className="n">Akcje</th>
                </tr>
              </thead>
              <tbody>
                {filteredSessions.map((session) => (
                  <tr key={session.sessionId}>
                    <td>
                      <div className="cell-title">
                        {session.platform || "Nieznana platforma"}
                      </div>
                      <span className="sub truncate-agent">
                        {session.userAgent || "Brak nagłówka User-Agent"}
                      </span>
                    </td>
                    <td className="mono">{session.sessionId.slice(0, 8)}…</td>
                    <td className="mono">{session.ipAddress || "-"}</td>
                    <td className="n num mono">
                      {sessionDate(session.rotatedAt)}
                    </td>
                    <td className="n num mono">
                      {sessionDate(session.expiresAt)}
                    </td>
                    <td>
                      <span
                        className={"pill " + (session.isRevoked ? "" : "pos")}
                      >
                        {session.isRevoked ? "Unieważniona" : "Aktywna"}
                      </span>
                    </td>
                    <td className="n">
                      <div className="row-action-group">
                        <Button
                          variant="secondary"
                          className="btn-compact"
                          onClick={() =>
                            openDialog({
                              kind: "details",
                              id: session.sessionId,
                            })
                          }
                          disabled={busy}
                        >
                          Szczegóły
                        </Button>
                        <Button
                          variant="ghost"
                          className="btn-compact"
                          disabled={session.isRevoked || busy}
                          onClick={() =>
                            openDialog({ kind: "revoke", session })
                          }
                        >
                          Wyloguj
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <nav className="sessions-pagination" aria-label="Stronicowanie sesji">
          <span className="stamp">
            Daty podane według czasu serwera autoryzacji. Wylogowanie wszystkich
            urządzeń obejmuje bieżącą przeglądarkę.
          </span>
          <div className="pagination-controls">
            <Button
              variant="secondary"
              className="btn-compact"
              disabled={page === 0 || loading || busy}
              onClick={() => reload(page - 1)}
            >
              Poprzednia
            </Button>
            <span className="stamp num" aria-live="polite">
              Strona {page + 1}
            </span>
            <Button
              variant="secondary"
              className="btn-compact"
              disabled={!data?.hasNext || loading || busy}
              onClick={() => reload(page + 1)}
            >
              Następna
            </Button>
          </div>
        </nav>
      </section>

      {dialog?.kind === "details" && (
        <SessionDetails
          id={dialog.id}
          locallyRevoked={revokedIds.has(dialog.id)}
          onClose={() => setDialog(null)}
          onUnauthorized={invalidateSession}
        />
      )}

      {dialog && dialog.kind !== "details" && (
        <SessionDialog
          title={
            dialog.kind === "all"
              ? "Wylogować wszystkie urządzenia?"
              : "Wylogować wybrane urządzenie?"
          }
          onClose={() => setDialog(null)}
          busy={busy}
        >
          <p className="session-confirm-copy">
            {dialog.kind === "all"
              ? "Wszystkie sesje odświeżania zostaną odwołane. Zostaniesz przekierowany do logowania. Wydane tokeny dostępu mogą działać do wygaśnięcia."
              : `Unieważnisz sesję urządzenia ${dialog.session.platform || "nieznanego"} (IP: ${dialog.session.ipAddress || "brak danych"}). Jeśli to bieżąca przeglądarka, zostaniesz wylogowany.`}
          </p>
          {actionError && <Notice tone="error">{actionError}</Notice>}
          <div className="session-dialog-actions">
            <Button
              variant="secondary"
              onClick={() => setDialog(null)}
              disabled={busy}
            >
              Anuluj
            </Button>
            <Button variant="danger" onClick={confirmRevoke} busy={busy}>
              {busy
                ? "Unieważnianie…"
                : dialog.kind === "all"
                  ? "Wyloguj wszystkie"
                  : "Wyloguj urządzenie"}
            </Button>
          </div>
        </SessionDialog>
      )}
    </div>
  );
}

function SessionDetails({
  id,
  locallyRevoked,
  onClose,
  onUnauthorized,
}: {
  id: string;
  locallyRevoked: boolean;
  onClose: () => void;
  onUnauthorized: () => void;
}) {
  const [session, setSession] = useState<Session | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    getSession(id, controller.signal)
      .then((result) => {
        if (!controller.signal.aborted) setSession(result);
      })
      .catch((failure: unknown) => {
        if (controller.signal.aborted) return;
        if (axios.isAxiosError(failure) && failure.response?.status === 401)
          onUnauthorized();
        else setError(errorMessage(failure));
      });
    return () => controller.abort();
  }, [id, attempt, onUnauthorized]);

  return (
    <SessionDialog title="Szczegóły techniczne sesji" onClose={onClose}>
      {error ? (
        <>
          <Notice tone="error">{error}</Notice>
          <Button
            variant="secondary"
            onClick={() => {
              setError(null);
              setAttempt((value) => value + 1);
            }}
          >
            Spróbuj ponownie
          </Button>
        </>
      ) : !session ? (
        <p role="status">Pobieranie szczegółów sesji…</p>
      ) : (
        <dl className="detail-list session-detail-list">
          {[
            ["Platforma", session.platform],
            [
              "Stan tokenu",
              session.revoked || locallyRevoked ? "Unieważniona" : "Aktywna",
            ],
            ["Adres IP", session.ipAddress],
            ["Utworzono", sessionDate(session.createdAt)],
            ["Ostatnia rotacja tokenu", sessionDate(session.rotatedAt)],
            ["Ważność do", sessionDate(session.expiresAt)],
            ["Nagłówek User-Agent", session.userAgent],
            ["Identyfikator sesji (UUID)", session.sessionId],
          ].map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd className="mono">{value || "Brak danych"}</dd>
            </div>
          ))}
        </dl>
      )}
      <div className="session-dialog-actions">
        <Button variant="secondary" onClick={onClose}>
          Zamknij
        </Button>
      </div>
    </SessionDialog>
  );
}
