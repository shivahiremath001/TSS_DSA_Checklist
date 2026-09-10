import { useUser } from "../context/UserContext";

const TOTAL = 150;

export default function StatsWidget() {
  const { user } = useUser();
  const solved = user?.totalSolved ?? 0;
  const pct = Math.min(100, Math.round((solved / TOTAL) * 100));
  const remaining = TOTAL - solved;

  // XP tier
  const tier = pct >= 80 ? { label: "LEGENDARY", color: "#ffd700", glow: "rgba(255,215,0,0.3)" }
             : pct >= 60 ? { label: "ELITE",      color: "#00d4ff", glow: "rgba(0,212,255,0.3)" }
             : pct >= 40 ? { label: "ADVANCED",   color: "#7c3aed", glow: "rgba(124,58,237,0.3)" }
             : pct >= 20 ? { label: "SKILLED",    color: "#00ff88", glow: "rgba(0,255,136,0.3)" }
             :             { label: "INITIATE",   color: "#3d6a8a", glow: "rgba(61,106,138,0.3)" };

  return (
    <div style={{ marginBottom: "2rem" }}>
      {/* Main stat panel */}
      <div style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        padding: "1.5rem 2rem",
        position: "relative",
        overflow: "hidden",
        marginBottom: "1rem",
      }}>
        {/* Corner accent */}
        <div style={{ position: "absolute", top: 0, right: 0, width: 0, height: 0, borderLeft: "30px solid transparent", borderTop: `30px solid ${tier.color}22`, pointerEvents: "none" }} />

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "1rem" }}>
            {/* Big number */}
            <span className="stat-number" style={{ fontSize: "clamp(3.5rem, 8vw, 6rem)", lineHeight: 1 }}>
              {solved}
            </span>
            <div style={{ paddingBottom: "0.6rem" }}>
              <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.75rem", color: "var(--fg-muted)", letterSpacing: "0.1em" }}>/ {TOTAL} MISSIONS</p>
              <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.75rem", color: "var(--fg-muted)", letterSpacing: "0.1em", marginTop: "2px" }}>COMPLETED</p>
            </div>
          </div>

          {/* Tier badge */}
          <div style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.2em",
            color: tier.color,
            border: `1px solid ${tier.color}55`,
            padding: "0.4rem 0.8rem",
            textShadow: `0 0 8px ${tier.color}`,
            boxShadow: `0 0 12px ${tier.glow}`,
            background: `${tier.glow}`,
            clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
          }}>
            ▲ {tier.label}
          </div>
        </div>

        {/* XP Bar */}
        <div style={{ marginBottom: "0.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
            <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.7rem", color: "var(--fg-muted)", letterSpacing: "0.1em" }}>XP PROGRESS</span>
            <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.7rem", color: "var(--accent)" }}>{pct}%</span>
          </div>
          <div className="xp-bar-track">
            <div className="xp-bar-fill progress-bar-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      {/* Mini stat cards */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Remaining", value: remaining, color: "var(--danger)" },
          { label: "LeetCode",  value: user?.leetcodeUsername ?? "—", color: "var(--accent)" },
          { label: "Player ID", value: user?.usn ?? "—", color: "var(--purple)" },
        ].map(({ label, value, color }) => (
          <div key={label} style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            padding: "0.875rem 1rem",
            position: "relative",
          }}>
            <div style={{ position: "absolute", top: 0, left: 0, width: "2px", height: "100%", background: color, opacity: 0.5 }} />
            <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.7rem", color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "0.35rem" }}>
              {label}
            </p>
            <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.75rem", color, fontWeight: 700, letterSpacing: "0.04em" }}>
              {value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
