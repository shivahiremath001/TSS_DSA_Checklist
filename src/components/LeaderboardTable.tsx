import { useState } from "react";
import type { LeaderboardEntry } from "../lib/api";

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  loading: boolean;
}

const PAGE_SIZE = 15;

function SkeletonRows() {
  return (
    <>
      {Array.from({ length: PAGE_SIZE }).map((_, i) => (
        <tr key={i}>
          <td style={{ padding: "0.75rem", borderBottom: "1px solid var(--border)" }}>
            <div className="skeleton" style={{ width: "28px", height: "20px" }} />
          </td>
          <td style={{ padding: "0.75rem", borderBottom: "1px solid var(--border)" }}>
            <div className="skeleton" style={{ width: `${90 + (i % 4) * 20}px`, height: "14px" }} />
          </td>
          <td style={{ padding: "0.75rem", borderBottom: "1px solid var(--border)" }}>
            <div className="skeleton" style={{ width: "90px", height: "12px" }} />
          </td>
          <td style={{ padding: "0.75rem", borderBottom: "1px solid var(--border)" }}>
            <div className="skeleton" style={{ width: "80px", height: "12px" }} />
          </td>
          <td style={{ padding: "0.75rem", borderBottom: "1px solid var(--border)" }}>
            <div className="skeleton" style={{ width: "40px", height: "18px" }} />
          </td>
          <td style={{ padding: "0.75rem", borderBottom: "1px solid var(--border)", minWidth: "8rem" }}>
            <div className="skeleton" style={{ width: "100%", height: "4px" }} />
          </td>
        </tr>
      ))}
    </>
  );
}

const RANK_STYLE: Record<number, { color: string; glow: string; label: string }> = {
  1: { color: "#ffd700", glow: "rgba(255,215,0,0.3)",   label: "▲▲▲" },
  2: { color: "#c0c0c0", glow: "rgba(192,192,192,0.25)", label: "▲▲" },
  3: { color: "#cd7f32", glow: "rgba(205,127,50,0.25)",  label: "▲" },
};

export default function LeaderboardTable({ entries, loading }: LeaderboardTableProps) {
  const [page, setPage] = useState(0);
  const totalPages = Math.max(1, Math.ceil(entries.length / PAGE_SIZE));
  const pageEntries = entries.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const colStyle: React.CSSProperties = {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: "0.7rem",
    color: "var(--fg-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.14em",
    padding: "0.6rem 0.875rem",
    textAlign: "left",
    borderBottom: "1px solid var(--border)",
    fontWeight: 600,
    background: "var(--bg-card)",
  };

  return (
    <div>
      <div style={{ overflowX: "auto", border: "1px solid var(--border)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Rank", "Player", "USN", "LeetCode", "Solved", "Score"].map((h) => (
                <th key={h} style={colStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <SkeletonRows />
            ) : pageEntries.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: "4rem", textAlign: "center", fontFamily: "'Share Tech Mono', monospace", fontSize: "0.7rem", color: "var(--fg-muted)", letterSpacing: "0.1em" }}>
                  NO PLAYERS REGISTERED YET
                </td>
              </tr>
            ) : (
              pageEntries.map((entry) => {
                const isTop3 = entry.rank <= 3;
                const rs = RANK_STYLE[entry.rank];
                const cellBase: React.CSSProperties = {
                  padding: "0.75rem 0.875rem",
                  borderBottom: "1px solid #0a1628",
                  verticalAlign: "middle",
                };
                return (
                  <tr
                    key={entry.usn}
                    style={{
                      background: isTop3 ? `${rs?.glow}10` : "transparent",
                      transition: "background 100ms ease",
                      borderLeft: isTop3 ? `2px solid ${rs?.color}55` : "2px solid transparent",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-hover)")}
                    onMouseLeave={e => (e.currentTarget.style.background = isTop3 ? `${rs?.glow}10` : "transparent")}
                  >
                    <td style={cellBase}>
                      {isTop3 ? (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                          <span style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 900, fontSize: "1.4rem", color: rs.color, lineHeight: 1, textShadow: `0 0 12px ${rs.color}` }}>
                            #{entry.rank}
                          </span>
                          <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.45rem", color: rs.color, letterSpacing: "0.1em" }}>
                            {rs.label}
                          </span>
                        </div>
                      ) : (
                        <span style={{ fontFamily: "'Share Tech Mono', monospace", fontWeight: 700, fontSize: "0.75rem", color: "var(--fg-muted)" }}>
                          #{String(entry.rank).padStart(2, "0")}
                        </span>
                      )}
                    </td>
                    <td style={cellBase}>
                      <p style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.925rem", fontWeight: 700, color: isTop3 ? rs.color : "var(--fg)", letterSpacing: "0.04em" }}>
                        {entry.firstName} {entry.lastName}
                      </p>
                    </td>
                    <td style={cellBase}>
                      <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.75rem", color: "var(--fg-muted)" }}>
                        {entry.usn}
                      </span>
                    </td>
                    <td style={cellBase}>
                      <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.75rem", color: "var(--fg-muted)" }}>
                        {entry.leetcodeUsername || "—"}
                      </span>
                    </td>
                    <td style={cellBase}>
                      <span style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 700, fontSize: "1rem", color: isTop3 ? rs.color : "var(--fg)", textShadow: isTop3 ? `0 0 8px ${rs.color}` : "none" }}>
                        {entry.totalSolved}
                      </span>
                      <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.7rem", color: "var(--fg-muted)", marginLeft: "4px" }}>/150</span>
                    </td>
                    <td style={{ ...cellBase, minWidth: "9rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <div style={{ flex: 1, height: "3px", background: "var(--border)", overflow: "hidden" }}>
                          <div style={{
                            height: "100%",
                            width: `${entry.percentage}%`,
                            background: isTop3
                              ? `linear-gradient(90deg, ${rs.color}88, ${rs.color})`
                              : "linear-gradient(90deg, var(--accent-dim), var(--accent))",
                            boxShadow: isTop3 ? `0 0 6px ${rs.color}` : "0 0 4px var(--accent)",
                          }} />
                        </div>
                        <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.7rem", color: isTop3 ? rs.color : "var(--fg-muted)", flexShrink: 0 }}>
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
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid var(--border)" }}>
          <button
            id="leaderboard-prev"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="btn-secondary"
            style={{ opacity: page === 0 ? 0.3 : 1 }}
          >
            ← PREV
          </button>
          <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.75rem", color: "var(--fg-muted)", letterSpacing: "0.1em" }}>
            PAGE {page + 1} / {totalPages} · {entries.length} PLAYERS
          </span>
          <button
            id="leaderboard-next"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className="btn-secondary"
            style={{ opacity: page === totalPages - 1 ? 0.3 : 1 }}
          >
            NEXT →
          </button>
        </div>
      )}
    </div>
  );
}
