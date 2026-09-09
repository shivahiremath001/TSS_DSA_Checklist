import { useUser } from "../context/UserContext";

const TOTAL = 150;

export default function StatsWidget() {
  const { user } = useUser();
  const solved = user?.totalSolved ?? 0;
  const pct = Math.min(100, Math.round((solved / TOTAL) * 100));

  return (
    <div
      className="w-full"
      style={{ borderBottom: "1px solid #1a1a1a", paddingBottom: "2rem" }}
    >
      {/* Big display number */}
      <div className="flex items-end gap-4 mb-4">
        <span
          className="display-heading"
          style={{ fontSize: "clamp(4rem, 10vw, 7rem)", color: "#fff" }}
        >
          {solved}
        </span>
        <div className="pb-3">
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.65rem",
              color: "#888",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            / {TOTAL} SOLVED
          </p>
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.65rem",
              color: "#666",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginTop: "2px",
            }}
          >
            {pct}% COMPLETE
          </p>
        </div>
      </div>

      {/* Progress track */}
      <div
        className="w-full overflow-hidden"
        style={{ height: "2px", background: "#1a1a1a" }}
        role="progressbar"
        aria-valuenow={solved}
        aria-valuemin={0}
        aria-valuemax={TOTAL}
      >
        <div
          className="h-full progress-bar-fill"
          style={{ width: `${pct}%`, background: "#fff" }}
        />
      </div>

      {/* Mini stats */}
      <div className="flex gap-8 mt-4">
        {[
          { label: "Remaining",  value: TOTAL - solved },
          { label: "LeetCode",   value: user?.leetcodeUsername ?? "—" },
          { label: "USN",        value: user?.usn ?? "—" },
        ].map(({ label, value }) => (
          <div key={label}>
            <p
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.62rem",
                color: "#666",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              {label}
            </p>
            <p
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.75rem",
                color: "#999",
                marginTop: "2px",
              }}
            >
              {value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
