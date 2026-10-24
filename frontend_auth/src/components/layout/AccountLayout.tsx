import { useEffect, useRef, useState } from "react";
import { NavLink, Link, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  User,
  Laptop,
  ShieldCheck,
  Grip,
  Search,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Brand } from "../ui/Brand";
import { Button } from "../ui/Button";
import { Notice } from "../ui/Notice";
import { ThemeToggle } from "../ui/ThemeToggle";
import { useAuth } from "../../context/useAuth";
import { initials } from "../../lib/format";
import { ECOSYSTEM_SERVICES } from "../../lib/ecosystem";

const navigation = [
  { to: "/", label: "Przegląd konta", icon: LayoutGrid },
  { to: "/profile", label: "Dane i tożsamość", icon: User },
  { to: "/sessions", label: "Urządzenia i sesje", icon: Laptop },
  { to: "/settings", label: "Bezpieczeństwo i opcje", icon: ShieldCheck },
];

const quickCommands = [
  { label: "Przegląd konta i ekosystemu", meta: "Strona główna", to: "/" },
  { label: "Dane osobowe i tożsamość SSO", meta: "Profil", to: "/profile" },
  { label: "Urządzenia i aktywne sesje", meta: "Sesje JWT", to: "/sessions" },
  {
    label: "Zmień hasło i zabezpieczenia",
    meta: "Ustawienia",
    to: "/settings",
  },
];

export function AccountLayout() {
  const { userInfo: user, logOutUser } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [launcherOpen, setLauncherOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const launcherRef = useRef<HTMLDivElement>(null);
  const searchWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.classList.toggle("menu-open", mobileMenuOpen);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
        setLauncherOpen(false);
        setSearchOpen(false);
      }
      if (
        event.key === "/" &&
        !["INPUT", "TEXTAREA", "SELECT"].includes(
          (event.target as HTMLElement)?.tagName || "",
        )
      ) {
        event.preventDefault();
        searchInputRef.current?.focus();
        setSearchOpen(true);
      }
    };
    const onClickOutside = (event: MouseEvent) => {
      if (
        launcherRef.current &&
        !launcherRef.current.contains(event.target as Node)
      ) {
        setLauncherOpen(false);
      }
      if (
        searchWrapRef.current &&
        !searchWrapRef.current.contains(event.target as Node)
      ) {
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClickOutside);
    return () => {
      document.body.classList.remove("menu-open");
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClickOutside);
    };
  }, [mobileMenuOpen]);

  async function logout() {
    setBusy(true);
    setError(null);
    const result = await logOutUser();
    if (!result.success) setError(result.error || "Nie udało się wylogować.");
    setBusy(false);
  }

  const filteredCommands = quickCommands.filter(
    (cmd) =>
      cmd.label.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
      cmd.meta.toLowerCase().includes(searchQuery.trim().toLowerCase()),
  );

  const filteredServices = ECOSYSTEM_SERVICES.filter(
    (svc) =>
      svc.name.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
      svc.subdomain.toLowerCase().includes(searchQuery.trim().toLowerCase()),
  );

  return (
    <div className="app-frame">
      <a className="skip-link" href="#main">
        Przejdź do treści
      </a>

      <header className="chrome-topbar">
        <div className="chrome-topbar-left">
          <button
            type="button"
            className="btn menu-toggle"
            aria-expanded={mobileMenuOpen}
            aria-controls="account-sidebar"
            aria-label={
              mobileMenuOpen ? "Zamknij nawigację" : "Otwórz nawigację"
            }
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
            <span>Menu</span>
          </button>
          <Brand scope="account.mojprojekt.test" />
        </div>

        <div className="chrome-search-wrap" ref={searchWrapRef}>
          <div className="chrome-search">
            <Search
              size={14}
              className="chrome-search-icon"
              aria-hidden="true"
            />
            <input
              ref={searchInputRef}
              type="search"
              value={searchQuery}
              onFocus={() => setSearchOpen(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchOpen(true);
              }}
              placeholder="Szukaj w koncie, sesjach lub subdomenach…"
              aria-label="Szukaj w koncie i usługach"
            />
            <kbd className="chrome-kbd" aria-hidden="true">
              /
            </kbd>
          </div>
          {searchOpen && (
            <div
              className="chrome-dropdown search-dropdown"
              role="region"
              aria-label="Wyniki wyszukiwania"
            >
              <div className="dropdown-group-title">Widoki konta</div>
              {filteredCommands.map((cmd) => (
                <button
                  key={cmd.to}
                  type="button"
                  className="dropdown-item"
                  onClick={() => {
                    navigate(cmd.to);
                    setSearchOpen(false);
                    setSearchQuery("");
                  }}
                >
                  <span>{cmd.label}</span>
                  <span className="dropdown-meta">{cmd.meta}</span>
                </button>
              ))}
              <div className="dropdown-group-title">Subdomeny ekosystemu</div>
              {filteredServices.map((svc) => (
                <a
                  key={svc.id}
                  href={svc.url}
                  className="dropdown-item"
                  target="_self"
                  onClick={(e) => {
                    setSearchOpen(false);
                    if (svc.id === "account") {
                      e.preventDefault();
                      navigate("/");
                    }
                  }}
                >
                  <span>{svc.name}</span>
                  <span className="dropdown-meta mono">{svc.subdomain}</span>
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="chrome-topbar-right">
          <div className="launcher-wrap" ref={launcherRef}>
            <button
              type="button"
              className="btn btn-icon-label"
              aria-expanded={launcherOpen}
              aria-haspopup="dialog"
              onClick={() => setLauncherOpen(!launcherOpen)}
              title="Przełącznik usług w subdomenach mojprojekt.test"
            >
              <Grip size={16} aria-hidden="true" />
              <span className="hide-mobile">
                Aplikacje ({ECOSYSTEM_SERVICES.length})
              </span>
            </button>

            {launcherOpen && (
              <div
                className="chrome-dropdown launcher-popover"
                role="dialog"
                aria-label="Aplikacje ekosystemu mojprojekt.test"
              >
                <div className="launcher-header">
                  <div>
                    <div className="launcher-title">
                      Ekosystem mojprojekt.test
                    </div>
                    <div className="launcher-sub">
                      Wybierz aplikację — przeniesienie w tym samym oknie
                    </div>
                  </div>
                  <span className="pill pos">
                    {ECOSYSTEM_SERVICES.length} aplikacje
                  </span>
                </div>
                <div className="launcher-list">
                  {ECOSYSTEM_SERVICES.map((svc) => {
                    const isCurrent = svc.id === "account";
                    return (
                      <a
                        key={svc.id}
                        href={svc.url}
                        target="_self"
                        className={
                          "launcher-tile" + (isCurrent ? " is-current" : "")
                        }
                        onClick={(e) => {
                          if (isCurrent) {
                            e.preventDefault();
                            setLauncherOpen(false);
                            navigate("/");
                          }
                        }}
                      >
                        <div className="launcher-tile-top">
                          <span className="launcher-tile-name">{svc.name}</span>
                          <span className="pill">
                            {isCurrent ? "Tu jesteś" : "Przejdź"}
                          </span>
                        </div>
                        <span className="launcher-tile-host mono">
                          {svc.subdomain}
                        </span>
                        <span className="launcher-tile-desc">{svc.role}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <ThemeToggle />

          <Link
            to="/profile"
            className="chrome-user-chip"
            title="Przejdź do profilu"
          >
            <span className="avatar" aria-hidden="true">
              {initials(user?.firstName, user?.lastName, user?.username)}
            </span>
            <span className="chrome-user-name hide-mobile">
              {user?.firstName || user?.username}
            </span>
          </Link>
        </div>
      </header>

      <div className="chrome-body">
        <aside
          id="account-sidebar"
          className={"chrome-sidebar" + (mobileMenuOpen ? " open" : "")}
          aria-label="Nawigacja konta i usług"
        >
          <div className="sidebar-mobile-head">
            <Brand scope="account" />
            <button
              type="button"
              className="btn"
              onClick={() => setMobileMenuOpen(false)}
            >
              Zamknij
            </button>
          </div>

          <div className="sidebar-group-label">Tożsamość i dostęp</div>
          <nav className="sidebar-nav" aria-label="Główna nawigacja">
            {navigation.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className="nav-item"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon size={16} aria-hidden="true" />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="sidebar-bottom">
            <div className="sidebar-account-box">
              <div className="sidebar-account-row">
                <span className="avatar" aria-hidden="true">
                  {initials(user?.firstName, user?.lastName, user?.username)}
                </span>
                <div className="sidebar-account-meta">
                  <div className="sidebar-account-name">
                    {user?.firstName} {user?.lastName}
                  </div>
                  <div className="sidebar-account-handle mono">
                    @{user?.username}
                  </div>
                </div>
              </div>
              <div className="sidebar-account-actions">
                <Button
                  variant="secondary"
                  onClick={logout}
                  busy={busy}
                  className="button-full btn-compact"
                >
                  <LogOut size={14} aria-hidden="true" />
                  <span>{busy ? "Wylogowywanie…" : "Wyloguj się z konta"}</span>
                </Button>
              </div>
            </div>
          </div>
        </aside>

        <main id="main" className="work-sheet">
          {error && (
            <div className="logout-error">
              <Notice tone="error">{error}</Notice>
              <Button variant="ghost" onClick={() => setError(null)}>
                Zamknij
              </Button>
            </div>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
