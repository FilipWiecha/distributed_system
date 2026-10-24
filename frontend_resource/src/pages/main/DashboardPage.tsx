import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { Card, PageHeading } from "../../components/ui/Card";
import { getWorkouts } from "../../features/workout/services/WorkoutService";
import { getTrainingPlans } from "../../features/trainingplan/services/TrainingPlanService";
import type { WorkoutDto } from "../../features/workout/types/WorkoutDto";
import type { TrainingPlanDto } from "../../features/trainingplan/types/TrainingPlanDto";

export function DashboardPage() {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState<WorkoutDto[] | null>(null);
  const [plans, setPlans] = useState<TrainingPlanDto[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    Promise.allSettled([getWorkouts(0), getTrainingPlans(0)]).then(([w, p]) => {
      if (!active) return;
      setWorkouts(w.status === "fulfilled" ? w.value.content : null);
      setPlans(p.status === "fulfilled" ? p.value.content : null);
      setErrors([
        ...(w.status === "rejected" ? ["Nie udało się pobrać treningów."] : []),
        ...(p.status === "rejected" ? ["Nie udało się pobrać planów."] : []),
      ]);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [attempt]);
  return (
    <div className="screen-stack">
      <PageHeading
        breadcrumb="mojprojekt.test / gym"
        title="Przegląd treningów"
        description={`Ćwiczenia, plany i treningi konta @${user?.username}.`}
        action={
          <Link className="button button-primary" to="/workout/new">
            Zapisz trening
          </Link>
        }
      />
      <section
        className="panel lead-panel"
        aria-label="Skróty do dziennika treningów"
      >
        <div className="lead-identity">
          <div className="lead-identity-top">
            <span className="lead-title">Twój dziennik treningów</span>
          </div>
          <p className="lead-sub">Zapisuj ćwiczenia, serie i powtórzenia.</p>
        </div>
        <div className="title-btn-group">
          <Link className="button button-secondary" to="/exercise/new">
            Dodaj ćwiczenie
          </Link>
          <Link className="button button-secondary" to="/trainingplan/new">
            Utwórz plan
          </Link>
        </div>
      </section>
      {errors.length > 0 && (
        <div className="notice notice-error" role="alert">
          <span>{errors.join(" ")}</span>
          <button
            className="button button-secondary"
            onClick={() => {
              setLoading(true);
              setAttempt((n) => n + 1);
            }}
          >
            Spróbuj ponownie
          </button>
        </div>
      )}
      <div className="grid">
        <Card
          className="col-7"
          title="Treningi"
          description="Podgląd pierwszej strony dziennika."
          action={
            <Link className="text-link" to="/workout">
              Zobacz wszystkie
            </Link>
          }
        >
          {loading ? (
            <p role="status">Pobieranie treningów…</p>
          ) : workouts === null ? (
            <p>Dane treningów są niedostępne.</p>
          ) : workouts.length === 0 ? (
            <p>Brak zapisanych treningów.</p>
          ) : (
            <dl className="detail-list">
              {workouts.slice(0, 5).map((w) => (
                <div key={w.id}>
                  <dt>
                    {w.startDate
                      ? new Date(w.startDate).toLocaleString("pl-PL")
                      : "Nie podano daty"}
                  </dt>
                  <dd>
                    <Link className="text-link" to={`/workout/${w.id}`}>
                      {w.title}
                    </Link>
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </Card>
        <Card
          className="col-5"
          title="Plany treningowe"
          description="Podgląd pierwszej strony planów."
          action={
            <Link className="text-link" to="/trainingplan">
              Zobacz wszystkie
            </Link>
          }
        >
          {loading ? (
            <p role="status">Pobieranie planów…</p>
          ) : plans === null ? (
            <p>Dane planów są niedostępne.</p>
          ) : plans.length === 0 ? (
            <p>Brak zapisanych planów.</p>
          ) : (
            <dl className="detail-list">
              {plans.slice(0, 5).map((p) => (
                <div key={p.id}>
                  <dt>{p.description || "Bez opisu"}</dt>
                  <dd>
                    <Link className="text-link" to={`/trainingplan/${p.id}`}>
                      {p.title}
                    </Link>
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </Card>
      </div>
    </div>
  );
}
