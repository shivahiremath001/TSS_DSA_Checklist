import { useMemo } from "react";
import { PROBLEMS } from "../data/problems";
import ProblemCard from "./ProblemCard";
import { useUser } from "../context/UserContext";

interface ProblemListProps {
  activeWeek: number;
}

const colLabel: React.CSSProperties = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: "0.6rem",
  color: "#555",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
};

export default function ProblemList({ activeWeek }: ProblemListProps) {
  const { solvedArray } = useUser();

  const filtered = useMemo(
    () => PROBLEMS.filter((p) => p.week === activeWeek),
    [activeWeek]
  );

  const solvedInView = filtered.filter((p) => solvedArray[p.id - 1]).length;

  return (
    <div>
      {/* Column headers */}
      <div
        className="flex items-center gap-3"
        style={{
          borderBottom: "1px solid #1a1a1a",
          paddingBottom: "0.5rem",
          marginBottom: "0.25rem",
        }}
      >
        {/* Sl No */}
        <div style={{ ...colLabel, width: "2rem", textAlign: "right", flexShrink: 0 }}>
          #
        </div>
        {/* Name */}
        <p style={{ ...colLabel, flex: 1 }}>
          Problem{" "}
          <span style={{ color: "#333" }}>
            ({solvedInView}/{filtered.length} solved)
          </span>
        </p>
        {/* Difficulty */}
        <span style={{ ...colLabel, flexShrink: 0 }}>Diff</span>
        {/* Link */}
        <span style={{ ...colLabel, flexShrink: 0 }}>Link</span>
        {/* Checkbox */}
        <span style={{ ...colLabel, width: "18px", textAlign: "center", flexShrink: 0 }}>✓</span>
      </div>

      {filtered.length === 0 ? (
        <p
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.75rem",
            color: "#333",
            textAlign: "center",
            padding: "3rem 0",
          }}
        >
          No problems for this week.
        </p>
      ) : (
        filtered.map((problem) => (
          <ProblemCard
            key={problem.id}
            problem={problem}
            index={problem.id - 1}
          />
        ))
      )}
    </div>
  );
}
