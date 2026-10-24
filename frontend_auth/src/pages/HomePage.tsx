import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { Card, PageHeading } from "../components/ui/Card";
import { roleLabel } from "../lib/format";
import { ECOSYSTEM_SERVICES } from "../lib/ecosystem";

export function HomePage() {
  const { userInfo: user } = useAuth();
  const gym =
    ECOSYSTEM_SERVICES.find((s) => s.id === "gym") ?? ECOSYSTEM_SERVICES[0];
  return (
    <div className="screen-stack">
      <PageHeading
        breadcrumb="mojprojekt.test / account"
        title="Przegląd konta"
        description="Dane konta, hasło, sesje i dostęp do aplikacji Gym."
        action={
          <Link className="button button-primary" to="/sessions">
            Zarządzaj sesjami
          </Link>
        }
      />
      <section className="panel lead-panel" aria-label="Dane zalogowanej osoby">
        <div className="lead-identity">
          <div className="lead-identity-top">
            <span className="lead-title">
              {user?.firstName} {user?.lastName}
            </span>
            <span className="mono lead-handle">@{user?.username}</span>
            <span className="pill">{roleLabel(user?.role)}</span>
          </div>
          <p className="lead-sub">
            {user?.email || "Nie podano adresu e-mail"}
          </p>
        </div>
        <Link className="button button-secondary" to="/profile">
          Dane konta
        </Link>
      </section>
      <div className="grid">
        <Card
          className="col-8"
          title="Aplikacja Gym"
          description={gym.description}
        >
          <dl className="detail-list">
            <div>
              <dt>Adres aplikacji</dt>
              <dd className="mono">{gym.subdomain}</dd>
            </div>
            <div>
              <dt>Funkcje</dt>
              <dd>Katalog ćwiczeń, plany treningowe i dziennik treningów</dd>
            </div>
          </dl>
          <div className="panel-foot">
            <span className="stamp">Korzysta z logowania kontem.</span>
            <a className="button button-primary" href={gym.url}>
              Otwórz Gym
            </a>
          </div>
        </Card>
        <Card
          className="col-4"
          title="Zarządzanie dostępem"
          description="Operacje dostępne dla Twojego konta."
        >
          <dl className="detail-list">
            <div>
              <dt>Hasło</dt>
              <dd>
                <Link className="text-link" to="/settings">
                  Zmień hasło
                </Link>
              </dd>
            </div>
            <div>
              <dt>Sesje</dt>
              <dd>
                <Link className="text-link" to="/sessions">
                  Przeglądaj i odwołuj sesje
                </Link>
              </dd>
            </div>
            <div>
              <dt>Konto</dt>
              <dd>
                <Link className="text-link" to="/settings">
                  Dezaktywuj konto
                </Link>
              </dd>
            </div>
          </dl>
        </Card>
      </div>
    </div>
  );
}
