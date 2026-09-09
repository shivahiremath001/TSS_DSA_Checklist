import { useState } from "react";
import type { LeaderboardEntry } from "../lib/api";

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  loading: boolean;
}

const PAGE_SIZE = 15;
const MEDAL: Record<number, string> = { 1: "01", 2: "02", 3: "03" };

function SkeletonRows() {
  return (
    <>
      {Array.from({ length: PAGE_SIZE }).map((_, i) => (
        <tr key={i}>
          <td style={{ padding: "0.75rem", borderBottom: "1px solid #0a0a0a" }}>
            <div className="skeleton" style={{ width: "28px", height: "20px" }} />
          </td>
          <td style={{ padding: "0.75rem", borderBottom: "1px solid #0a0a0a" }}>
            <div className="skeleton" style={{ width: `${90 + (i % 4) * 20}px`, height: "14px" }} />
          </td>
          <td style={{ padding: "0.75rem", borderBottom: "1px solid #0a0a0a" }}>
            <div className="skeleton" style={{ width: "90px", height: "12px" }} />
          </td>
          <td style={{ padding: "0.75rem", borderBottom: "1px solid #0a0a0a" }}>
            <div className="skeleton" style={{ width: "80px", height: "12px" }} />
          </td>
          <td style={{ padding: "0.75rem", borderBottom: "1px solid #0a0a0a" }}>
            <div className="skeleton" style={{ width: "40px", height: "18px" }} />
          </td>
          <td style={{ padding: "0.75rem", borderBottom: "1px solid #0a0a0a", minWidth: "8rem" }}>
            <div className="skeleton" style={{ width: "100%", height: "4px" }} />
          </td>
        </tr>
      ))}
    </>
  );
}

export default function LeaderboardTable({ entries, loading }: LeaderboardTableProps) {
  const [page, setPage] = useState(0);
  const totalPages = Math.max(1, Math.ceil(entries.length / PAGE_SIZE));
  const pageEntries = entries.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

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
    <div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Rank", "Student", "USN", "LeetCode", "Solved", "Score"].map((h) => (
                <th key={h} style={colStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <SkeletonRows />
            ) : pageEntries.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: "4rem", textAlign: "center", fontFamily: "JetBrains Mono, monospace", fontSize: "0.75rem", color: "#2a2a2a" }}>
                  No data available yet.
                </td>
              </tr>
            ) : (
              pageEntries.map((entry) => {
                const isTop3 = entry.rank <= 3;
                const cellBase: React.CSSProperties = { padding: "0.75rem", borderBottom: "1px solid #0f0f0f", verticalAlign: "middle" };
                return (
                  <tr
                    key={entry.usn}
                    style={{ transition: "background 80ms ease" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = "#080808")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = "transparent")}
                  >
                    <td style={cellBase}>
                      <span style={{ fontFamily: "Barlow Condensed, sans-serif", fontWeight: 900, fontSize: isTop3 ? "2rem" : "1.1rem", color: isTop3 ? "#fff" : "#2a2a2a", lineHeight: 1 }}>
                        {MEDAL[entry.rank] ?? `${String(entry.rank).padStart(2, "0")}`}
                      </span>
                    </td>
                    <td style={cellBase}>
                      <p style={{ fontSize: "0.875rem", fontWeight: 600, color: isTop3 ? "#fff" : "#8a8a8a" }}>
                        {entry.firstName} {entry.lastName}
                      </p>
                    </td>
                    <td style={cellBase}>
                      <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.7rem", color: "#3d3d3d" }}>
                        {entry.usn}
                      </span>
                    </td>
                    <td style={cellBase}>
                      <a
                        href={`https://leetcode.com/${entry.leetcodeUsername}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.7rem", color: "#5a5a5a", transition: "color 100ms ease" }}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#fff")}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#5a5a5a")}
                      >
                        {entry.leetcodeUsername}
                      </a>
                    </td>
                    <td style={cellBase}>
                      <span style={{ fontFamily: "Barlow Condensed, sans-serif", fontWeight: 700, fontSize: "1.25rem", color: isTop3 ? "#fff" : "#5a5a5a" }}>
                        {entry.totalSolved}
                      </span>
                      <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.6rem", color: "#2a2a2a", marginLeft: "4px" }}>/150</span>
                    </td>
                    <td style={{ ...cellBase, minWidth: "8rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <div style={{ flex: 1, height: "1px", background: "#1a1a1a", overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${entry.percentage}%`, background: isTop3 ? "#fff" : "#3d3d3d" }} />
                        </div>
                        <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.6rem", color: "#3d3d3d", flexShrink: 0 }}>
                          {entry.percentage}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      {!loading && totalPages > 1 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid #1a1a1a" }}>
          <button
            id="leaderboard-prev"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            style={{
              background: "none", border: "1px solid #2a2a2a",
              color: page === 0 ? "#2a2a2a" : "#8a8a8a",
              cursor: page === 0 ? "not-allowed" : "pointer",
              padding: "0.5rem 1rem",
              fontFamily: "JetBrains Mono, monospace", fontSize: "0.65rem",
              letterSpacing: "0.08em", textTransform: "uppercase",
              display: "flex", alignItems: "center", gap: "0.5rem",
              transition: "border-color 100ms ease, color 100ms ease",
            }}
          >
            ← Prev
          </button>
          <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.6rem", color: "#3d3d3d", letterSpacing: "0.08em" }}>
            {page + 1} / {totalPages}
            <span style={{ color: "#1a1a1a", marginLeft: "0.5rem" }}>({entries.length} members)</span>
          </span>
          <button
            id="leaderboard-next"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            style={{
              background: "none", border: "1px solid #2a2a2a",
              color: page === totalPages - 1 ? "#2a2a2a" : "#8a8a8a",
              cursor: page === totalPages - 1 ? "not-allowed" : "pointer",
              padding: "0.5rem 1rem",
              fontFamily: "JetBrains Mono, monospace", fontSize: "0.65rem",
              letterSpacing: "0.08em", textTransform: "uppercase",
              display: "flex", alignItems: "center", gap: "0.5rem",
              transition: "border-color 100ms ease, color 100ms ease",
            }}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}


