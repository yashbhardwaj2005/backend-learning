import { useEffect, useState } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import {
  ArrowUpRight,
  Bookmark,
  ChevronRight,
  Play,
  Compass,
  Flame,
  Gamepad2,
  GraduationCap,
  History,
  Home,
  Menu,
  Music2,
  Plus,
  Search,
  ThumbsUp,
  Upload,
  UserRound,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Avatar } from "./VideoCard";
import CreatorCredit from "./CreatorCredit";
import ThemeToggle from "./ThemeToggle";

export function Brand() {
  return (
    <Link to="/" className="brand" aria-label="StreamTube home">
      <span className="brand-icon">
        <Play size={17} fill="currentColor" strokeWidth={0} />
      </span>
      <span>
        Stream<span className="brand-light">Tube</span>
        <span className="brand-dot">.</span>
      </span>
    </Link>
  );
}

const mainLinks = [
  { to: "/", label: "Home", icon: Home },
  { to: "/?view=trending", label: "Trending", icon: Flame },
  { to: "/?view=explore", label: "Explore", icon: Compass },
];
const libraryLinks = [
  { to: "/library/history", label: "History", icon: History },
  { to: "/library/saved", label: "Watch later", icon: Bookmark },
  { to: "/library/liked", label: "Liked videos", icon: ThumbsUp },
];
const discoverLinks = [
  { to: "/?category=Music", label: "Music", icon: Music2 },
  { to: "/?category=Gaming", label: "Gaming", icon: Gamepad2 },
  { to: "/?category=Learning", label: "Learning", icon: GraduationCap },
];

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setSearch(searchParams.get("q") || "");
    setMobileOpen(false);
    window.scrollTo({ top: 0 });
  }, [location.pathname, location.search, searchParams]);

  useEffect(() => {
    function onEscape(event) {
      if (event.key === "Escape") setMobileOpen(false);
    }
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, []);

  function searchVideos(event) {
    event.preventDefault();
    navigate(search.trim() ? `/?q=${encodeURIComponent(search.trim())}` : "/");
  }

  function navigationLink({ to, label, icon: Icon }) {
    const active = `${location.pathname}${location.search}` === to;
    return (
      <Link
        key={label}
        to={to}
        className={`sidebar-link ${active ? "active" : ""}`}
        title={collapsed ? label : undefined}
        aria-current={active ? "page" : undefined}
      >
        <Icon size={19} strokeWidth={active ? 2.2 : 1.7} />
        <span>{label}</span>
        {active && <span className="active-dot" />}
      </Link>
    );
  }

  return (
    <div className={`app-shell ${collapsed ? "sidebar-collapsed" : ""}`}>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header className="topbar">
        <div className="topbar-brand">
          <button
            className="icon-button desktop-menu"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!collapsed}
            onClick={() => setCollapsed((previous) => !previous)}
          >
            <Menu size={21} />
          </button>
          <button
            className="icon-button mobile-menu"
            aria-label="Open navigation"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((previous) => !previous)}
          >
            <Menu size={21} />
          </button>
          <Brand />
        </div>
        <form className="search-form" onSubmit={searchVideos} role="search">
          <Search size={19} className="search-leading" />
          <input
            aria-label="Search videos"
            placeholder="Search something worth watching"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          {search && (
            <button
              type="button"
              aria-label="Clear search"
              className="search-clear"
              onClick={() => setSearch("")}
            >
              <X size={15} />
            </button>
          )}
          <button className="search-submit" aria-label="Search">
            <Search size={19} />
          </button>
        </form>
        <div className="topbar-actions">
          <ThemeToggle />
          <Link to="/upload" className="create-button" aria-label="Create">
            <Plus size={18} />
            <span>Create</span>
          </Link>
          {user ? (
            <Link
              to="/profile"
              className="profile-link"
              aria-label="Your profile"
            >
              <Avatar user={user} />
            </Link>
          ) : (
            <Link to="/login" className="sign-in-button">
              <UserRound size={17} />
              <span>Sign in</span>
            </Link>
          )}
        </div>
      </header>

      {mobileOpen && (
        <button
          className="sidebar-scrim"
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={`sidebar ${mobileOpen ? "mobile-open" : ""}`}
        aria-label="Main navigation"
      >
        <div className="sidebar-mobile-heading">
          <Brand />
          <button
            className="icon-button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
        </div>
        <nav>
          <div className="nav-group">{mainLinks.map(navigationLink)}</div>
          <div className="nav-group">
            <p className="nav-label">YOUR SPACE</p>
            {libraryLinks.map(navigationLink)}
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <UserRound size={19} strokeWidth={1.7} />
              <span>Your profile</span>
            </NavLink>
          </div>
          <div className="nav-group">
            <p className="nav-label">DISCOVER</p>
            {discoverLinks.map(navigationLink)}
          </div>
        </nav>
        <div className="sidebar-bottom">
          <div className="creator-promo">
            <span className="promo-icon">
              <Upload size={19} />
            </span>
            <h3>Your story starts here.</h3>
            <p>
              Make something.
              <br />
              Share it with the world.
            </p>
            <Link to="/upload">
              Start creating <ArrowUpRight size={15} />
            </Link>
          </div>
          <p className="sidebar-footer">
            A little curiosity goes a long way.
            <br />
            <span>© {new Date().getFullYear()} StreamTube</span>
          </p>
        </div>
      </aside>

      <main id="main-content" className="main-content">
        <Outlet />
        <CreatorCredit />
      </main>
      <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
        <Link to="/">
          <Home size={21} />
          Home
        </Link>
        <Link to="/?view=trending">
          <Flame size={21} />
          Trending
        </Link>
        <Link to="/library/saved">
          <Bookmark size={21} />
          Saved
        </Link>
        <Link to="/profile">
          <UserRound size={21} />
          You
        </Link>
      </nav>
    </div>
  );
}

export function PageHeading({ eyebrow, title, children }) {
  return (
    <div className="page-heading">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
      </div>
      {children}
    </div>
  );
}

export function EmptyState({
  icon: Icon = Compass,
  title,
  children,
  action,
  to = "/",
}) {
  return (
    <div className="empty-state">
      <span className="empty-icon">
        <Icon size={30} />
      </span>
      <h2>{title}</h2>
      <p>{children}</p>
      {action && (
        <Link to={to} className="button button-primary">
          {action}
          <ChevronRight size={16} />
        </Link>
      )}
    </div>
  );
}
