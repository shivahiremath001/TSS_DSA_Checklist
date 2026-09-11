import { useState } from "react";
import toast from "react-hot-toast";
import type { Problem } from "../data/problems";
import { useUser } from "../context/UserContext";
import { apiUpdateProgress } from "../lib/api";

interface ProblemCardProps {
  problem: Problem;
  index: number;
}

const difficultyColor: Record<Problem["difficulty"], string> = {
  Easy:   "#4ade80",
  Medium: "#facc15",
  Hard:   "#f87171",
};

const difficultyBg: Record<Problem["difficulty"], string> = {
  Easy:   "#052e16",
  Medium: "#1c1a00",
  Hard:   "#2d0b0b",
};

const topicBg: Record<string, string> = {
  "Arrays & Hashing":     "#1e1b4b",
  "Two Pointers":         "#1a1a2e",
  "Sliding Window":       "#0d2137",
  "Stack":                "#1c1a10",
  "Binary Search":        "#12231c",
  "Linked List":          "#1f1423",
  "Trees":                "#0f2318",
  "Heap / Priority Queue":"#1e1620",
  "Backtracking":         "#1e1520",
  "Tries":                "#101c2e",
  "Graphs":               "#1a1010",
  "Advanced Graphs":      "#1c1010",
  "1-D DP":               "#0e1f1f",
  "2-D DP":               "#0e1c1c",
  "Greedy":               "#1f1a0e",
  "Intervals":            "#1a1020",
  "Math & Geometry":      "#1a1a10",
  "Bit Manipulation":     "#101a1a",
};

const topicAccent: Record<string, string> = {
  "Arrays & Hashing":     "#818cf8",
  "Two Pointers":         "#60a5fa",
  "Sliding Window":       "#38bdf8",
  "Stack":                "#fbbf24",
  "Binary Search":        "#34d399",
  "Linked List":          "#c084fc",
  "Trees":                "#4ade80",
  "Heap / Priority Queue":"#e879f9",
  "Backtracking":         "#fb7185",
  "Tries":                "#7dd3fc",
  "Graphs":               "#f87171",
  "Advanced Graphs":      "#fca5a5",
  "1-D DP":               "#2dd4bf",
  "2-D DP":               "#5eead4",
  "Greedy":               "#fde68a",
  "Intervals":            "#a78bfa",
  "Math & Geometry":      "#d9f99d",
  "Bit Manipulation":     "#67e8f9",
};

// Debounce delay: 60 seconds
const DEBOUNCE_MS = 60_000;

// Module-level maps to store timers per problem ID (avoids stale closure issues)
const syncTimers: Map<number, ReturnType<typeof setTimeout>>  = new Map();
const cdTimers:   Map<number, ReturnType<typeof setInterval>> = new Map();

export default function ProblemCard({ problem, index }: ProblemCardProps) {
  const { solvedArray, user, passwordHash, setSolved } = useUser();
  const isSolved  = solvedArray[index];
  const [loading, setLoading]   = useState(false);
  const [expanded, setExpanded] = useState(false);

  // pendingStatus: null = nothing pending, 0/1 = waiting to sync that value
  const [pendingStatus, setPendingStatus] = useState<0 | 1 | null>(null);
  const [countdown, setCountdown]         = useState(0);

  function cancelTimers() {
    const st = syncTimers.get(problem.id);
    const ct = cdTimers.get(problem.id);
    if (st) { clearTimeout(st);  syncTimers.delete(problem.id); }
    if (ct) { clearInterval(ct); cdTimers.delete(problem.id);   }
  }

  async function syncToServer(targetStatus: 0 | 1) {
    if (!user || passwordHash === "__demo__") return;
    setLoading(true);
    try {
      await apiUpdateProgress({
        usn: user.usn,
        password: passwordHash,
        qNumber: problem.id,
        status: targetStatus,
      });
      toast.success(
        targetStatus === 1 ? `✓ Q${problem.id} synced!` : `✗ Q${problem.id} unsynced!`,
        { id: `sync-${problem.id}`, duration: 2500 }
      );
    } catch (err) {
      setSolved(index, targetStatus === 0); // rollback on failure
      toast.error(
        err instanceof Error ? err.message : "Sync failed. Please retry.",
        { id: `prob-${problem.id}` }
      );
    } finally {
      setLoading(false);
      setPendingStatus(null);
      setCountdown(0);
    }
  }

  function handleToggle() {
    if (!user || loading) return;

    const newSolved = !isSolved;
    const newStatus = newSolved ? 1 : 0;

    // Instant optimistic UI update
    setSolved(index, newSolved);

    if (passwordHash === "__demo__") return;

    // If there's already a pending sync and the user just toggled back → cancel
    if (pendingStatus !== null && newStatus !== pendingStatus) {
      cancelTimers();
      setPendingStatus(null);
      setCountdown(0);
      toast(`↩ Q${problem.id} sync cancelled`, { id: `cancel-${problem.id}`, duration: 2000 });
      return;
    }

    // Cancel any existing timers before starting new ones
    cancelTimers();

    // Start fresh 60s debounce window
    setPendingStatus(newStatus as 0 | 1);
    setCountdown(DEBOUNCE_MS / 1000);

    // Countdown ticker
    const ct = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) { clearInterval(ct); return 0; }
        return prev - 1;
      });
    }, 1000);
    cdTimers.set(problem.id, ct);

    // Deferred sync
    const st = setTimeout(() => {
      cdTimers.delete(problem.id);
      syncTimers.delete(problem.id);
      syncToServer(newStatus as 0 | 1);
    }, DEBOUNCE_MS);
    syncTimers.set(problem.id, st);

    toast(
      newStatus === 1 ? `⏳ Q${problem.id} — syncing in 60s` : `⏳ Q${problem.id} unsolved — syncing in 60s`,
      { id: `pending-${problem.id}`, duration: DEBOUNCE_MS }
    );
  }

  const accentColor = topicAccent[problem.topic] ?? "#888";
  const bgColor     = topicBg[problem.topic]     ?? "#111";

  return (
    <div style={{ borderBottom: "1px solid #0d0d0d" }}>

      {/* ── Main row ──────────────────────────────────────────────── */}
      <div
        className="flex items-center gap-3"
        style={{ padding: "0.6rem 0.5rem" }}
      >
        {/* 1. NeetCode # */}
        <span
          style={{
            flexShrink: 0,
            width: "1.75rem",
            textAlign: "right",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.75rem",
            color: isSolved ? "#2a2a2a" : "#555",
            userSelect: "none",
          }}
        >
          {problem.id}
        </span>

        {/* 2. Name + difficulty */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <span
            style={{
              display: "block",
              fontSize: "0.875rem",
              fontWeight: 500,
              color: isSolved ? "#3a3a3a" : "#d0d0d0",
              textDecoration: isSolved ? "line-through" : "none",
              textDecorationColor: "#2a2a2a",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {problem.name}
          </span>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.7rem",
              color: isSolved ? "#333" : difficultyColor[problem.difficulty],
              opacity: isSolved ? 0.4 : 0.7,
              marginTop: "2px",
              display: "block",
            }}
          >
            {problem.difficulty}
          </span>
        </div>

        {/* 3. LC link */}
        <a
          href={problem.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            flexShrink: 0,
            display: "inline-flex",
            alignItems: "center",
            gap: "0.3rem",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.7rem",
            fontWeight: 600,
            color: isSolved ? "#1d4ed8" : "#3b82f6",
            textDecoration: "underline",
            textDecorationColor: isSolved ? "#1e3a8a" : "#1d4ed8",
            textUnderlineOffset: "2px",
            letterSpacing: "0.01em",
            opacity: isSolved ? 0.45 : 1,
            transition: "color 100ms ease, opacity 100ms ease",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.color = "#60a5fa";
            el.style.textDecorationColor = "#3b82f6";
            el.style.opacity = "1";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.color = isSolved ? "#1d4ed8" : "#3b82f6";
            el.style.textDecorationColor = isSolved ? "#1e3a8a" : "#1d4ed8";
            el.style.opacity = isSolved ? "0.45" : "1";
          }}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
          LC {problem.lcNumber}
        </a>

        {/* 4. Checkbox + pending countdown */}
        <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
          <button
            id={`checkbox-q${problem.id}`}
            onClick={handleToggle}
            disabled={loading}
            aria-label={`Mark problem ${problem.id} as ${isSolved ? "unsolved" : "solved"}`}
            title={pendingStatus !== null ? `Syncing in ${countdown}s — click again to cancel` : undefined}
            style={{
              flexShrink: 0,
              width: "20px",
              height: "20px",
              border: pendingStatus !== null
                ? "1.5px solid #f59e0b"
                : isSolved ? "1.5px solid #166534" : "1.5px solid #333",
              background: isSolved ? "#052e16" : "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.5 : 1,
              transition: "all 120ms ease",
              animation: pendingStatus !== null ? "pendingPulse 1.2s ease-in-out infinite" : "none",
            }}
          >
            {isSolved && !loading && (
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                stroke={pendingStatus !== null ? "#f59e0b" : "#4ade80"}
                strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
            {loading && (
              <div style={{
                width: "9px", height: "9px",
                border: "1.5px solid #333", borderTopColor: "#4ade80",
                borderRadius: "50%", animation: "spin 0.6s linear infinite",
              }} />
            )}
          </button>
          {/* Countdown badge */}
          {pendingStatus !== null && countdown > 0 && (
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.55rem",
              color: "#f59e0b",
              lineHeight: 1,
              userSelect: "none",
            }}>
              {countdown}s
            </span>
          )}
        </div>


        {/* 5. Expand arrow */}
        <button
          onClick={() => setExpanded((p) => !p)}
          aria-label={expanded ? "Collapse details" : "Expand details"}
          style={{
            flexShrink: 0,
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "2px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: expanded ? accentColor : "#333",
            transition: "color 150ms ease",
          }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 200ms ease",
            }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>

      {/* ── Expanded detail panel ─────────────────────────────────── */}
      <div
        style={{
          maxHeight: expanded ? "200px" : "0px",
          overflow: "hidden",
          transition: "max-height 220ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div
          style={{
            margin: "0 0.5rem 0.625rem",
            background: bgColor,
            borderLeft: `2px solid ${accentColor}`,
            padding: "0.75rem 1rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.625rem",
          }}
        >
          {/* Row 1: Topic chip + Difficulty chip */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
            {/* Topic */}
            <span
              style={{
                display: "inline-flex", alignItems: "center", gap: "0.3rem",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.75rem",
                color: accentColor,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                background: `${accentColor}18`,
                border: `1px solid ${accentColor}33`,
                padding: "0.2rem 0.5rem",
              }}
            >
              {/* Tag icon */}
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                <line x1="7" y1="7" x2="7.01" y2="7" />
              </svg>
              {problem.topic}
            </span>

            {/* Difficulty chip */}
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.75rem",
                color: difficultyColor[problem.difficulty],
                background: difficultyBg[problem.difficulty],
                border: `1px solid ${difficultyColor[problem.difficulty]}44`,
                padding: "0.2rem 0.5rem",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              {problem.difficulty}
            </span>
          </div>

          {/* Row 2: Meta info grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "0.5rem",
            }}
          >
            {[
              { label: "NeetCode #", value: `#${problem.id}` },
              { label: "LeetCode #", value: `#${problem.lcNumber}` },
              { label: "Week",       value: `Week ${problem.week}` },
            ].map(({ label, value }) => (
              <div key={label}>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", color: "#444", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "2px" }}>
                  {label}
                </p>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", color: "#888", fontWeight: 600 }}>
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* Row 3: Open on LeetCode button */}
          <a
            href={problem.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.75rem",
              color: "#3b82f6",
              letterSpacing: "0.04em",
              textDecoration: "none",
              border: "1px solid #1d4ed844",
              background: "#0d1a30",
              padding: "0.3rem 0.65rem",
              alignSelf: "flex-start",
              transition: "background 120ms ease, border-color 120ms ease",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background = "#1e3a70";
              el.style.borderColor = "#3b82f6";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background = "#0d1a30";
              el.style.borderColor = "#1d4ed844";
            }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            Open on LeetCode
          </a>
        </div>
      </div>
    </div>
  );
}
