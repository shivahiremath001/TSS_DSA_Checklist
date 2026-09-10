import { PROBLEMS, WEEKS, WEEK_NAMES } from "../data/problems";
import { useUser } from "../context/UserContext";

interface WeekFilterProps {
  activeWeek: number;
  onChange: (week: number) => void;
}

export default function WeekFilter({ activeWeek, onChange }: WeekFilterProps) {
  const { solvedArray } = useUser();

  const completedWeeks = new Set<number>();
  for (const w of WEEKS) {
    const weekProblems = PROBLEMS.filter((p) => p.week === w);
    const allDone = weekProblems.length > 0 && weekProblems.every((p) => solvedArray[p.id - 1]);
    if (allDone) completedWeeks.add(w);
  }

  const isCompleted = completedWeeks.has(activeWeek);

  return (
    <div style={{ borderBottom: "1px solid var(--border)", paddingBottom: "1.25rem", marginBottom: "1.5rem" }}>
      <p style={{
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: "0.7rem",
        color: "var(--fg-muted)",
        textTransform: "uppercase",
        letterSpacing: "0.16em",
        marginBottom: "0.875rem",
      }}>
        ◈ Mission Phase
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
        {WEEKS.map((w) => {
          const isActive    = activeWeek === w;
          const isWeekDone  = completedWeeks.has(w);

          return (
            <button
              key={w}
              id={`filter-week-${w}`}
              onClick={() => onChange(w)}
              title={WEEK_NAMES[w]}
              style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: "0.7rem",
                fontWeight: 700,
                letterSpacing: "0.06em",
                width: "38px",
                height: "38px",
                border: isActive
                  ? `1px solid ${isWeekDone ? "var(--green)" : "var(--accent)"}`
                  : isWeekDone
                  ? "1px solid var(--green-dim)30"
                  : "1px solid var(--border)",
                background: isActive
                  ? isWeekDone ? "var(--green-glow)" : "var(--accent-glow)"
                  : isWeekDone ? "rgba(0,255,136,0.05)" : "var(--bg-card)",
                color: isActive
                  ? isWeekDone ? "var(--green)" : "var(--accent)"
                  : isWeekDone ? "var(--green-dim)" : "var(--fg-muted)",
                boxShadow: isActive
                  ? `0 0 10px ${isWeekDone ? "var(--green-glow)" : "var(--accent-glow)"},
                     inset 0 0 8px ${isWeekDone ? "var(--green-glow)" : "var(--accent-glow)"}`
                  : "none",
                textShadow: isActive ? `0 0 8px ${isWeekDone ? "var(--green)" : "var(--accent)"}` : "none",
                cursor: "pointer",
                transition: "all 150ms ease",
                position: "relative",
                clipPath: "polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 5px 100%, 0 calc(100% - 5px))",
              }}
            >
              {w}
              {isWeekDone && !isActive && (
                <span style={{
                  position: "absolute",
                  top: "2px",
                  right: "2px",
                  width: "5px",
                  height: "5px",
                  borderRadius: "50%",
                  background: "var(--green)",
                  boxShadow: "0 0 4px var(--green)",
                }} />
              )}
            </button>
          );
        })}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "0.75rem" }}>
        <div style={{ width: "8px", height: "8px", background: isCompleted ? "var(--green)" : "var(--border)", borderRadius: "50%", boxShadow: isCompleted ? "0 0 8px var(--green)" : "none", transition: "all 300ms" }} />
        <p style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: "0.75rem",
          color: isCompleted ? "var(--green)" : "var(--fg-muted)",
          letterSpacing: "0.08em",
          textShadow: isCompleted ? "0 0 6px var(--green)" : "none",
        }}>
          {WEEK_NAMES[activeWeek]}
          {isCompleted && " · PHASE CLEARED ✓"}
        </p>
      </div>
    </div>
  );
}
