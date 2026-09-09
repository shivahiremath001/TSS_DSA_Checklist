import type { LeaderboardEntry } from "../lib/api";

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  loading: boolean;
}

const MEDAL: Record<number, string> = { 1: "01", 2: "02", 3: "03" };

export default function LeaderboardTable({ entries, loading }: LeaderboardTableProps) {
  if (loading) {
    return (
      <div style={{ padding: "4rem 0", textAlign: "center" }}>
        <div
          style={{
            display: "inline-block",
            width: "20px",
            height: "20px",
            border: "1px solid #1a1a1a",
            borderTopColor: "#fff",
            borderRadius: "50%",
            animation: "spin 0.7s linear infinite",
          }}
        />
        <p
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "0.7rem",
            color: "#3d3d3d",
            marginTop: "1rem",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          Loading…
        </p>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <p
        style={{
          fontFamily: "JetBrains Mono, monospace",
          fontSize: "0.75rem",
          color: "#2a2a2a",
          textAlign: "center",
          padding: "4rem 0",
        }}
      >
        No data available yet.
      </p>
    );
  }

  const colStyle: React.CSSProperties = {
    fontFamily: "JetBrains Mono, monospace",
    fontSize: "0.6rem",
    color: "#2a2a2a",
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    padding: "0.5rem 0.75rem",
    textAlign: "left",
    borderBottom: "1px solid #1a1a1a",
    fontWeight: 600,
  };

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {["Rank", "Student", "USN", "LeetCode", "Solved", "Score"].map((h) => (
              <th key={h} style={colStyle}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => {
            const isTop3 = entry.rank <= 3;
            const cellBase: React.CSSProperties = {
              padding: "0.75rem",
              borderBottom: "1px solid #0f0f0f",
              verticalAlign: "middle",
            };

            return (
              <tr
                key={entry.usn}
                style={{ transition: "background 80ms ease" }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLTableRowElement).style.background =
                    "#080808")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLTableRowElement).style.background =
                    "transparent")
                }
              >
                {/* Rank */}
                <td style={cellBase}>
                  <span
                    style={{
                      fontFamily: "Barlow Condensed, sans-serif",
                      fontWeight: 900,
                      fontSize: isTop3 ? "2rem" : "1.1rem",
                      color: isTop3 ? "#fff" : "#2a2a2a",
                      lineHeight: 1,
                    }}
                  >
                    {MEDAL[entry.rank] ?? `${String(entry.rank).padStart(2, "0")}`}
                  </span>
                </td>

                {/* Name */}
                <td style={cellBase}>
                  <p
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: isTop3 ? "#fff" : "#8a8a8a",
                    }}
                  >
                    {entry.firstName} {entry.lastName}
                  </p>
                </td>

                {/* USN */}
                <td style={cellBase}>
                  <span
                    style={{
                      fontFamily: "JetBrains Mono, monospace",
                      fontSize: "0.7rem",
                      color: "#3d3d3d",
                    }}
                  >
                    {entry.usn}
                  </span>
                </td>

                {/* LeetCode */}
                <td style={cellBase}>
                  <a
                    href={`https://leetcode.com/${entry.leetcodeUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontFamily: "JetBrains Mono, monospace",
                      fontSize: "0.7rem",
                      color: "#5a5a5a",
                      transition: "color 100ms ease",
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLAnchorElement).style.color =
                        "#fff")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLAnchorElement).style.color =
                        "#5a5a5a")
                    }
                  >
                    {entry.leetcodeUsername}
                  </a>
                </td>

                {/* Solved */}
                <td style={cellBase}>
                  <span
                    style={{
                      fontFamily: "Barlow Condensed, sans-serif",
                      fontWeight: 700,
                      fontSize: "1.25rem",
                      color: isTop3 ? "#fff" : "#5a5a5a",
                    }}
                  >
                    {entry.totalSolved}
                  </span>
                  <span
                    style={{
                      fontFamily: "JetBrains Mono, monospace",
                      fontSize: "0.6rem",
                      color: "#2a2a2a",
                      marginLeft: "4px",
                    }}
                  >
                    /150
                  </span>
                </td>

                {/* Percentage bar */}
                <td style={{ ...cellBase, minWidth: "8rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <div
                      style={{
                        flex: 1,
                        height: "1px",
                        background: "#1a1a1a",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${entry.percentage}%`,
                          background: isTop3 ? "#fff" : "#3d3d3d",
                        }}
                      />
                    </div>
                    <span
                      style={{
                        fontFamily: "JetBrains Mono, monospace",
                        fontSize: "0.6rem",
                        color: "#3d3d3d",
                        flexShrink: 0,
                      }}
                    >
                      {entry.percentage}%
                    </span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
