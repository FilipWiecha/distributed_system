import type { ReactNode } from "react";
import { Brand } from "../ui/Brand";
import { ThemeToggle } from "../ui/ThemeToggle";
import { ECOSYSTEM_SERVICES } from "../../lib/ecosystem";

export function AuthLayout({
  children,
  register = false,
}: {
  children: ReactNode;
  register?: boolean;
}) {
  return (
    <div className="auth-frame">
      <header className="chrome-topbar auth-topbar">
        <div className="chrome-topbar-left">
          <Brand scope="account.mojprojekt.test" />
        </div>
        <div className="chrome-topbar-right">
          <span className="stamp hide-mobile">
            Brama uwierzytelniania SSO · .mojprojekt.test
          </span>
          <ThemeToggle />
        </div>
      </header>

      <main className="auth-sheet">
        <div className={"auth-grid" + (register ? " auth-grid-register" : "")}>
          <section
            className="auth-form-panel"
            aria-label="Formularz autoryzacji"
          >
            {children}
          </section>

          <aside
            className="auth-architecture-panel"
            aria-label="Architektura ekosystemu mojprojekt.test"
          >
            <div className="auth-arch-head">
              <h2>Konto i aplikacja Gym</h2>
              <p>
                Zaloguj się, aby zarządzać kontem i korzystać z aplikacji Gym:
                katalogu ćwiczeń, planów oraz treningów.
              </p>
            </div>

            <div
              className="auth-subdomains-table"
              role="region"
              aria-label="Subdomeny ekosystemu"
            >
              <div className="auth-subdomains-header">
                <span>Usługa i subdomena</span>
                <span>Funkcje</span>
                <span className="num">Dostęp</span>
              </div>
              {ECOSYSTEM_SERVICES.map((svc) => (
                <div key={svc.id} className="auth-subdomain-row">
                  <div>
                    <div className="auth-subdomain-name">{svc.name}</div>
                    <div className="auth-subdomain-host mono">
                      {svc.subdomain}
                    </div>
                  </div>
                  <div className="auth-subdomain-role">{svc.role}</div>
                  <div className="auth-subdomain-status num">
                    <span
                      className={"pill " + (svc.id === "account" ? "pos" : "")}
                    >
                      Konto
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <dl className="auth-specs-strip">
              <div>
                <dt>Transport sesji</dt>
                <dd className="mono num">HttpOnly Cookie</dd>
              </div>
              <div>
                <dt>Standard hasła</dt>
                <dd className="mono num">Min. 12 znaków, max 72 B</dd>
              </div>
              <div>
                <dt>Kontrola dostępu</dt>
                <dd className="mono num">Zarządzanie sesjami</dd>
              </div>
            </dl>
          </aside>
        </div>

        <footer className="auth-sheet-footer">
          <span>Filip W · Konto i aplikacja Gym</span>
          <span className="mono">
            X-Client-Type: WEB · Spring Cloud Gateway
          </span>
        </footer>
      </main>
    </div>
  );
}
