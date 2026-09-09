import { PROBLEMS, WEEKS, WEEK_NAMES } from "../data/problems";
import { useUser } from "../context/UserContext";

interface WeekFilterProps {
  activeWeek: number;
  onChange: (week: number) => void;
}

export default function WeekFilter({ activeWeek, onChange }: WeekFilterProps) {
  const { solvedArray } = useUser();

  // Compute which weeks are 100% complete
  const completedWeeks = new Set<number>();
  for (const w of WEEKS) {
    const weekProblems = PROBLEMS.filter((p) => p.week === w);
    const allDone = weekProblems.length > 0 && weekProblems.every((p) => solvedArray[p.id - 1]);
    if (allDone) completedWeeks.add(w);
  }

  return (
    <div style={{ borderBottom: "1px solid #1a1a1a", paddingBottom: "1.25rem", marginBottom: "1.5rem" }}>
      <p
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.62rem",
          color: "#777",
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          marginBottom: "0.75rem",
        }}
      >
        Filter by Week
      </p>

      <div className="flex flex-wrap gap-2">
        {WEEKS.map((w) => {
          const isActive    = activeWeek === w;
          const isCompleted = completedWeeks.has(w);

          // Style: green if completed, white if active, otherwise dim
          const bg     = isActive ? (isCompleted ? "#16a34a" : "#fff")
                       : isCompleted ? "#052e16"
                       : "transparent";
          const border = isActive ? (isCompleted ? "#16a34a" : "#fff")
                       : isCompleted ? "#166534"
                       : "#2a2a2a";
          const color  = isActive ? (isCompleted ? "#fff" : "#000")
                       : isCompleted ? "#4ade80"
                       : "#777";

          return (
            <button
              key={w}
              id={`filter-week-${w}`}
              onClick={() => onChange(w)}
              title={WEEK_NAMES[w]}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.65rem",
                letterSpacing: "0.04em",
                fontWeight: isActive ? 700 : 400,
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                border: `1.5px solid ${border}`,
                background: bg,
                color,
                cursor: "pointer",
                transition: "all 120ms ease",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {w}
              {/* Green dot for completed week */}
              {isCompleted && !isActive && (
                <span
                  style={{
                    position: "absolute",
                    top: "2px",
                    right: "2px",
                    width: "5px",
                    height: "5px",
                    borderRadius: "50%",
                    background: "#4ade80",
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      <p
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.62rem",
          color: completedWeeks.has(activeWeek) ? "#4ade80" : "#555",
          marginTop: "0.625rem",
          letterSpacing: "0.04em",
        }}
      >
        {WEEK_NAMES[activeWeek]}
        {completedWeeks.has(activeWeek) && "  ✓ COMPLETED"}
      </p>
    </div>
  );
}
