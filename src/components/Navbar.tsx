import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useUser } from "../context/UserContext";
import { useTheme } from "../context/ThemeContext";
import ChangePasswordModal from "./modals/ChangePasswordModal";

export default function Navbar() {
  const { user, logout } = useUser();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [showChangePwd, setShowChangePwd] = useState(false);

  const navLinks = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Leaderboard", href: "/leaderboard" },
    { label: "Profile", href: "/profile" },
  ];

  return (
    <>
      <nav
        style={{ borderBottom: "1px solid var(--border)", background: "var(--bg)" }}
        className="sticky top-0 z-40 w-full"
      >
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-5">
          {/* ── Brand Tag ────────────────────────────────────── */}
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.7rem",
              fontWeight: 700,
              color: "var(--fg)",
              lineHeight: 1.35,
              letterSpacing: "0.02em",
            }}
          >
            &lt;THE<br />
            SOFTWARE<br />
            SOCIETY/&gt;
          </div>

          {/* ── Nav Links ────────────────────────────────────── */}
          <div className="flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className="relative text-xs font-semibold uppercase tracking-widest transition-colors"
                  style={{
                    color: isActive ? "var(--fg)" : "var(--fg-muted)",
                    letterSpacing: "0.12em",
                  }}
                >
                  {link.label}
                  {isActive && (
                    <span
                      className="absolute -bottom-[1px] left-0 w-full"
                      style={{ height: "1px", background: "var(--fg)" }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* ── Right actions ────────────────────────────────── */}
          <div className="flex items-center gap-3">
            {user && (
              <span
                className="hidden text-xs sm:block"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  color: "#777",
                }}
              >
                {user.usn}
              </span>
            )}
            <button
              onClick={toggleTheme}
              style={{
                background: "none", border: "none", cursor: "pointer",
                color: "var(--fg)", padding: "4px", display: "flex", alignItems: "center", justifyContent: "center"
              }}
              title="Toggle theme"
            >
              {theme === "dark" ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              )}
            </button>
            <button
              id="account-settings-btn"
              onClick={() => setShowChangePwd(true)}
              className="btn-secondary text-xs"
            >
              Settings
            </button>
            <button
              id="logout-btn"
              onClick={logout}
              className="btn-primary text-xs"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <ChangePasswordModal
        open={showChangePwd}
        onClose={() => setShowChangePwd(false)}
      />
    </>
  );
}
