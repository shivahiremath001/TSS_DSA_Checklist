import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import LeaderboardTable from "../components/LeaderboardTable";
import { apiGetLeaderboard, type LeaderboardEntry } from "../lib/api";

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  async function fetchLeaderboard() {
    setLoading(true);
    try {
      const data = await apiGetLeaderboard();
      setEntries(data.leaderboard);
      setLastRefreshed(new Date());
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load leaderboard.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchLeaderboard(); }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />

      <main className="page-enter" style={{ maxWidth: "1000px", margin: "0 auto", padding: "2.5rem 1.5rem 5rem" }}>

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 border-b border-[var(--border)] pb-6 gap-4 sm:gap-0">
          <div>
            <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.7rem", color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: "0.5rem" }}>
              &gt;_ GLOBAL RANKINGS
            </p>
            <h1 className="display-heading" style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", color: "var(--fg)" }}>
              LEADERBOARD.
            </h1>
            {lastRefreshed && (
              <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.7rem", color: "var(--fg-muted)", marginTop: "0.5rem", letterSpacing: "0.08em" }}>
                SYNCED {lastRefreshed.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              </p>
            )}
          </div>

          <button
            id="leaderboard-refresh"
            onClick={fetchLeaderboard}
            disabled={loading}
            className="btn-secondary"
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <svg
              style={{ width: "12px", height: "12px", animation: loading ? "spin 0.7s linear infinite" : "none" }}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            SYNC
          </button>
        </div>

        <LeaderboardTable entries={entries} loading={loading} />
      </main>
    </div>
  );
}
