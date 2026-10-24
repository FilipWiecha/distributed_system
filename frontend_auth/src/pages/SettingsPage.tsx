import { useState } from "react";
import { Link } from "react-router-dom";
import { DeleteAccountDialog } from "../components/account/DeleteAccountDialog";
import { ChangePasswordForm } from "../components/account/ChangePasswordForm";
import { PageHeading } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { SettingRow } from "../components/account/SettingRow";
import { useAuth } from "../context/useAuth";
import { useTheme } from "../lib/theme";

const sections = [
  { id: "security", title: "Bezpieczeństwo" },
  { id: "preferences", title: "Wygląd i język" },
] as const;

const themeOptions = [
  { id: "light", label: "Jasny" },
  { id: "dark", label: "Ciemny" },
  { id: "system", label: "Systemowy" },
] as const;

export function SettingsPage() {
  const { mode, resolved, setMode } = useTheme();
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [section, setSection] =
    useState<(typeof sections)[number]["id"]>("security");
  const { userInfo: user } = useAuth();

  return (
    <div className="screen-stack">
      {deletingAccount && (
        <DeleteAccountDialog onClose={() => setDeletingAccount(false)} />
      )}

      <PageHeading
        breadcrumb="mojprojekt.test / account / settings"
        title="Bezpieczeństwo i opcje"
        description="Zmiana hasła, motywu interfejsu i dezaktywacja konta."
      />

      {/* Underline tabs on a 1px rule */}
      <div className="tabs" role="tablist" aria-label="Kategorie ustawień">
        {sections.map(({ id, title }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={section === id}
            className="tab-btn"
            onClick={() => {
              setSection(id);
              setChangingPassword(false);
            }}
          >
            {title}
          </button>
        ))}
      </div>

      {section === "security" && (
        <div className="settings-sections">
          {/* Section 1: Password & Authentication */}
          <section
            className="settings-row-section"
            aria-label="Hasło i uwierzytelnianie"
          >
            <div className="settings-label-col">
              <h2>Hasło i uwierzytelnianie</h2>
              <p>
                Hasło chroni logowanie w węźle{" "}
                <code className="mono">account.mojprojekt.test</code>. Zmiana
                hasła wykorzystuje endpoint{" "}
                <code className="mono">POST /auth/user/password</code>.
              </p>
              <dl className="settings-summary-well">
                <div>
                  <dt>Algorytm skrótu</dt>
                  <dd className="mono">bcrypt (max 72 B)</dd>
                </div>
                <div>
                  <dt>Minimalna długość</dt>
                  <dd className="mono num">12 znaków</dd>
                </div>
              </dl>
            </div>

            <div className="settings-panel-col">
              <SettingRow
                title="Hasło logowania"
                comingSoon={false}
                description="Wymagane obecne hasło oraz nowa fraza o długości od 12 znaków do 72 bajtów UTF-8."
              >
                <Button
                  id="change-password-trigger"
                  variant="secondary"
                  aria-expanded={changingPassword}
                  aria-controls="password-change-panel"
                  onClick={() => setChangingPassword(true)}
                  disabled={changingPassword}
                >
                  Zmień hasło
                </Button>
              </SettingRow>

              {changingPassword && (
                <ChangePasswordForm
                  onClose={() => {
                    setChangingPassword(false);
                    requestAnimationFrame(() =>
                      document
                        .getElementById("change-password-trigger")
                        ?.focus(),
                    );
                  }}
                />
              )}

              <SettingRow
                title="Urządzenia i sesje odświeżania"
                comingSoon={false}
                description="Przeglądaj wszystkie urządzenia z aktywnym tokenem i odwołuj nieużywane połączenia."
              >
                <Link className="button button-secondary" to="/sessions">
                  Zarządzaj sesjami
                </Link>
              </SettingRow>
            </div>
          </section>

          {/* Section 2: Destructive action, last in its own section */}
          <section
            className="settings-row-section"
            aria-label="Dezaktywacja konta"
          >
            <div className="settings-label-col">
              <h2>Zamknięcie i dezaktywacja konta</h2>
              <p>
                Operacja{" "}
                <code className="mono">DELETE /auth/user/delete-account</code>{" "}
                ustawia flagę <code className="mono">enabled=false</code> i
                natychmiast unieważnia wszystkie aktywne sesje w bazie.
              </p>
            </div>

            <div className="settings-panel-col">
              <SettingRow
                title={`Dezaktywuj konto @${user?.username || "użytkownika"}`}
                comingSoon={false}
                description="Konto zostanie dezaktywowane, a sesje odświeżania odwołane. Operacja wymaga obecnego hasła."
              >
                <Button
                  variant="danger"
                  onClick={() => setDeletingAccount(true)}
                >
                  Usuń konto
                </Button>
              </SettingRow>
            </div>
          </section>
        </div>
      )}

      {section === "preferences" && (
        <div className="settings-sections">
          <section className="settings-row-section" aria-label="Wygląd i język">
            <div className="settings-label-col">
              <h2>Wygląd i parametry lokalne</h2>
              <p>
                Motyw interfejsu zapisywany jest lokalnie w przeglądarce i
                działa natychmiast bez przeładowania strony.
              </p>
              <dl className="settings-summary-well">
                <div>
                  <dt>Wybrany tryb</dt>
                  <dd className="mono">{mode}</dd>
                </div>
                <div>
                  <dt>Aktywny schemat</dt>
                  <dd className="mono">
                    {resolved === "dark"
                      ? "Ciemny (#000000)"
                      : "Jasny (#f6f8fa)"}
                  </dd>
                </div>
                <div>
                  <dt>Format dat</dt>
                  <dd className="mono">pl-PL (czas serwera)</dd>
                </div>
              </dl>
            </div>

            <div className="settings-panel-col">
              <SettingRow
                title="Motyw kolorystyczny"
                comingSoon={false}
                description="Wybierz jasny arkusz roboczy, ciemny terminal lub synchronizację z systemem."
              >
                <div
                  className="segmented"
                  role="radiogroup"
                  aria-label="Motyw kolorystyczny"
                >
                  {themeOptions.map(({ id, label }) => (
                    <button
                      key={id}
                      type="button"
                      role="radio"
                      aria-checked={mode === id}
                      className={mode === id ? "selected" : ""}
                      onClick={() => setMode(id)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </SettingRow>

              <SettingRow
                title="Język interfejsu"
                comingSoon={false}
                description="Interfejs jest dostępny w języku polskim."
              >
                <select
                  aria-label="Język interfejsu"
                  disabled
                  defaultValue="pl"
                >
                  <option value="pl">Polski (pl-PL)</option>
                </select>
              </SettingRow>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
