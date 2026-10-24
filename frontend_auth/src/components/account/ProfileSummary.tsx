import { useAuth } from "../../context/useAuth";
import { initials, roleLabel } from "../../lib/format";

export function ProfileSummary() {
  const { userInfo: user } = useAuth();

  return (
    <div className="profile-summary">
      <div className="profile-identity-row">
        <div className="avatar avatar-large" aria-hidden="true">
          {initials(user?.firstName, user?.lastName, user?.username)}
        </div>

        <div className="profile-identity-copy">
          <h2>
            {user?.firstName} {user?.lastName}
          </h2>

          <p className="mono">@{user?.username}</p>

          <div className="profile-badges">
            <span className="pill">{roleLabel(user?.role)}</span>
          </div>
        </div>
      </div>

      <div className="profile-claims-box">
        <div className="profile-claims-head">
          <span>Atrybuty odpowiedzi /auth/user/me</span>
          <span className="mono">UserDto</span>
        </div>

        <dl className="claims-list">
          <div>
            <dt>username</dt>
            <dd className="mono">@{user?.username}</dd>
          </div>

          <div>
            <dt>email</dt>
            <dd className="mono">{user?.email || "-"}</dd>
          </div>

          <div>
            <dt>role</dt>
            <dd className="mono">{user?.role || "Brak danych"}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
