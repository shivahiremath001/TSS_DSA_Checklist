import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useUser } from "../context/UserContext";
import ChangePasswordModal from "./modals/ChangePasswordModal";

export default function Navbar() {
  const { user, logout } = useUser();
  const location = useLocation();
  const [showChangePwd, setShowChangePwd] = useState(false);

  const navLinks = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Leaderboard", href: "/leaderboard" },
  ];

  return (
    <>
      <nav
        style={{ borderBottom: "1px solid #1a1a1a" }}
        className="sticky top-0 z-40 w-full bg-black"
      >
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-5">
          {/* ── Brand Tag ────────────────────────────────────── */}
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.7rem",
              fontWeight: 700,
              color: "#fff",
              lineHeight: 1.35,
              letterSpacing: "0.02em",
            }}
          >
            &lt;THE<br />
            SOFTWARE<br />
            SOCIETY/&gt;]
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
                    color: isActive ? "#fff" : "#888",
                    letterSpacing: "0.12em",
                  }}
                >
                  {link.label}
                  {isActive && (
                    <span
                      className="absolute -bottom-[1px] left-0 w-full"
                      style={{ height: "1px", background: "#fff" }}
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
