import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useUser } from "../context/UserContext";
import ChangePasswordModal from "./modals/ChangePasswordModal";
import SnakeGameModal from "./modals/SnakeGameModal";
import AboutModal from "./modals/AboutModal";

export default function Navbar() {
  const { user, logout } = useUser();
  const location = useLocation();
  const [showChangePwd, setShowChangePwd] = useState(false);
  const [showSnakeGame, setShowSnakeGame] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  const isAdmin = user?.usn === "ADMIN";

  const navLinks = isAdmin
    ? [{ label: "Admin Command", href: "/admin-dashboard" }]
    : [
        { label: "Mission", href: "/dashboard" },
        { label: "Rankings", href: "/leaderboard" },
        { label: "Player", href: "/profile" },
      ];

  return (
    <>
      <nav style={{
        borderBottom: "1px solid var(--border)",
        background: "rgba(2, 11, 24, 0.95)",
        backdropFilter: "blur(12px)",
        position: "sticky",
        top: 0,
        zIndex: 40,
        width: "100%",
      }}>
        {/* Top accent line */}
        <div style={{ height: "2px", background: "linear-gradient(90deg, transparent, var(--accent), var(--purple), transparent)" }} />

        <div className="max-w-[1280px] mx-auto flex flex-wrap md:flex-nowrap items-center justify-between px-4 sm:px-6 py-3 md:py-0 md:h-14">

          {/* ── Brand ─────────────────────────────────── */}
          <div 
            className="brand-tag order-1" 
            style={{ fontSize: "0.7rem", lineHeight: 1.5, letterSpacing: "0.06em", cursor: "pointer" }}
            onClick={() => setShowSnakeGame(true)}
            title="Access System Override"
          >
            &lt;The<br className="hidden md:block" />Software<br className="hidden md:block" />Society/&gt;
          </div>

          {/* ── Nav Links ─────────────────────────────── */}
          <div className="order-3 md:order-2 flex items-center gap-4 sm:gap-8 overflow-x-auto w-full md:w-auto mt-3 md:mt-0 pb-1 md:pb-0 scrollbar-hide" style={{ WebkitOverflowScrolling: "touch", msOverflowStyle: "none", scrollbarWidth: "none" }}>
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className="whitespace-nowrap"
                  style={{
                    fontFamily: "'Orbitron', sans-serif",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: isActive ? "var(--accent)" : "var(--fg-muted)",
                    textShadow: isActive ? "0 0 10px var(--accent)" : "none",
                    textDecoration: "none",
                    position: "relative",
                    paddingBottom: "2px",
                    transition: "color 150ms, text-shadow 150ms",
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      (e.currentTarget as HTMLAnchorElement).style.color = "#e0f2ff";
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      (e.currentTarget as HTMLAnchorElement).style.color = "var(--fg-muted)";
                    }
                  }}
                >
                  {link.label}
                  {isActive && (
                    <span style={{
                      position: "absolute",
                      bottom: "-4px",
                      left: 0,
                      right: 0,
                      height: "1px",
                      background: "var(--accent)",
                      boxShadow: "0 0 6px var(--accent)",
                    }} />
                  )}
                </Link>
              );
            })}
            {/* About Button */}
            <button
              onClick={() => setShowAbout(true)}
              className="whitespace-nowrap"
              style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: "0.75rem",
                fontWeight: 600,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: showAbout ? "var(--accent)" : "var(--fg-muted)",
                textShadow: showAbout ? "0 0 10px var(--accent)" : "none",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "0",
                paddingBottom: "2px",
                position: "relative",
                transition: "color 150ms, text-shadow 150ms",
              }}
              onMouseEnter={e => {
                if (!showAbout) {
                  e.currentTarget.style.color = "#e0f2ff";
                }
              }}
              onMouseLeave={e => {
                if (!showAbout) {
                  e.currentTarget.style.color = "var(--fg-muted)";
                }
              }}
            >
              System Info
              {showAbout && (
                <span style={{
                  position: "absolute",
                  bottom: "-4px",
                  left: 0,
                  right: 0,
                  height: "1px",
                  background: "var(--accent)",
                  boxShadow: "0 0 6px var(--accent)",
                }} />
              )}
            </button>
          </div>

          {/* ── Right side Actions ─────────────────────────────── */}
          <div className="order-2 md:order-3 flex items-center gap-2 md:gap-3">
            {user && (
              <span className="hidden md:inline-block" style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: "0.75rem",
                color: isAdmin ? "var(--gold)" : "var(--fg-muted)",
                textShadow: isAdmin ? "0 0 8px var(--gold)" : "none",
                letterSpacing: "0.06em",
              }}>
                {isAdmin ? "⬡ ADMIN" : `◈ ${user.usn}`}
              </span>
            )}

            {!isAdmin && (
              <button
                id="account-settings-btn"
                onClick={() => setShowChangePwd(true)}
                className="btn-secondary"
                style={{ fontSize: "0.7rem", padding: "0.4rem 0.8rem" }}
              >
                Settings
              </button>
            )}

            <button
              id="logout-btn"
              onClick={logout}
              className="btn-primary"
              style={{ fontSize: "0.7rem", padding: "0.4rem 0.8rem" }}
            >
              {isAdmin ? "Disconnect" : "Logout"}
            </button>
          </div>
        </div>
      </nav>

      <ChangePasswordModal open={showChangePwd} onClose={() => setShowChangePwd(false)} />
      <SnakeGameModal open={showSnakeGame} onClose={() => setShowSnakeGame(false)} />
      <AboutModal open={showAbout} onClose={() => setShowAbout(false)} />
    </>
  );
}
