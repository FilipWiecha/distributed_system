import { Link } from "react-router-dom";
import { Card, PageHeading } from "../components/ui/Card";
import { ProfileSummary } from "../components/account/ProfileSummary";
import { useAuth } from "../context/useAuth";
import { formatDate, roleLabel } from "../lib/format";
import { ECOSYSTEM_SERVICES } from "../lib/ecosystem";

export function UserPage() {
  const { userInfo: user } = useAuth();
  return (
    <div className="screen-stack">
      <PageHeading
        breadcrumb="mojprojekt.test / account / profile"
        title="Dane i tożsamość"
        badge={<span className="pill">{roleLabel(user?.role)}</span>}
        description="Informacje zapisane na Twoim koncie."
        action={
          <div className="title-btn-group">
            <Link className="button button-secondary" to="/sessions">
              Urządzenia i sesje
            </Link>
            <Link className="button button-primary" to="/settings">
              Ustawienia bezpieczeństwa
            </Link>
          </div>
        }
      />

      <div className="grid">
        <div className="col-5 stack-col">
          <Card
            title="Podsumowanie tożsamości"
            description="Główny profil użytkownika w węźle account.mojprojekt.test."
          >
            <ProfileSummary />
          </Card>

          <Card
            title="Parametry sesji i tokenu SSO"
            description="Sposób przekazywania poświadczeń między subdomenami."
          >
            <dl className="detail-list">
              <div>
                <dt>Podpis kryptograficzny</dt>
                <dd className="mono">RS256 (Klucz RSA serwera auth)</dd>
              </div>
              <div>
                <dt>Nośnik sesji</dt>
                <dd className="mono">HttpOnly Cookie · withCredentials</dd>
              </div>
              <div>
                <dt>Nagłówek klienta</dt>
                <dd className="mono">X-Client-Type: WEB</dd>
              </div>
            </dl>
          </Card>
        </div>

        <div className="col-7 stack-col">
          <Card
            title="Dane osobowe"
            description="Podstawowe informacje podane podczas rejestracji konta."
          >
            <dl className="detail-list">
              <div>
                <dt>Imię</dt>
                <dd>{user?.firstName || "Nie podano"}</dd>
              </div>
              <div>
                <dt>Nazwisko</dt>
                <dd>{user?.lastName || "Nie podano"}</dd>
              </div>
              <div>
                <dt>Data urodzenia</dt>
                <dd className="num">
                  {formatDate(user?.birthDate)}{" "}
                  {user?.birthDate && (
                    <span className="sub-inline mono">({user.birthDate})</span>
                  )}
                </dd>
              </div>
            </dl>
          </Card>

          <Card
            title="Identyfikatory konta i aplikacja"
            description="Identyfikatory wykorzystywane przy autoryzacji między usługami."
          >
            <dl className="detail-list">
              <div>
                <dt>Nazwa użytkownika</dt>
                <dd className="mono">@{user?.username}</dd>
              </div>
              <div>
                <dt>Adres e-mail</dt>
                <dd className="mono">{user?.email || "Nie podano"}</dd>
              </div>
              <div>
                <dt>Uprawnienia w systemie</dt>
                <dd>{roleLabel(user?.role)}</dd>
              </div>
              <div>
                <dt>Aplikacja</dt>
                <dd className="mono">
                  {ECOSYSTEM_SERVICES.map((s) => s.subdomain).join(" · ")}
                </dd>
              </div>
            </dl>
          </Card>
        </div>
      </div>
    </div>
  );
}
