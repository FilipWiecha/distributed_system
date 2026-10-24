import { useEffect, useRef, useState } from "react";
import { NavLink, Link, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  Dumbbell,
  ClipboardList,
  Activity,
  User,
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
import { accountUrl } from "../../services/apiClient";
import { ECOSYSTEM_SERVICES } from "../../lib/ecosystem";

const navigation = [
  { to: "/", label: "Przegląd treningów", icon: LayoutGrid },
  { to: "/exercise", label: "Katalog ćwiczeń", icon: Dumbbell },
  { to: "/trainingplan", label: "Plany treningowe", icon: ClipboardList },
  { to: "/workout", label: "Dziennik treningów", icon: Activity },
];

const quickCommands = [
  ...navigation.map((item) => ({
    label: item.label,
    meta: "Nawigacja",
    to: item.to,
  })),
  { label: "Dane konta", meta: "Konto SSO", to: "/profile" },
  { label: "Ustawienia konta", meta: "Konto SSO", to: "/settings" },
];

export function Layout() {
  const { user, logout: logOutUser, isAuthenticated } = useAuth();
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
    try {
      await logOutUser();
    } catch {
      setError("Nie udało się wylogować. Spróbuj ponownie.");
    } finally {
      setBusy(false);
    }
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

  if (!isAuthenticated) return <Outlet />;
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
          <Brand scope="gym.mojprojekt.test" />
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
              placeholder="Szukaj widoku treningów lub konta…"
              aria-label="Szukaj widoku treningów lub konta"
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
                    if (svc.id === "gym") {
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
                    const isCurrent = svc.id === "gym";
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
            <Brand scope="gym" />
            <button
              type="button"
              className="btn"
              onClick={() => setMobileMenuOpen(false)}
            >
              Zamknij
            </button>
          </div>

          <div className="sidebar-group-label">Treningi</div>
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

              <div className="sidebar-account-nav">
                <a
                  href={accountUrl("/profile")}
                  className="sidebar-account-link"
                  title="Przejdź do: Dane konta"
                >
                  <User size={14} aria-hidden="true" />
                  <span>Dane konta</span>
                </a>
                <a
                  href={accountUrl("/settings")}
                  className="sidebar-account-link"
                  title="Przejdź do: Ustawienia konta"
                >
                  <ShieldCheck size={14} aria-hidden="true" />
                  <span>Ustawienia konta</span>
                </a>
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
