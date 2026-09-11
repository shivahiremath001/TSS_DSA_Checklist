import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import { useUser } from "../context/UserContext";
import {
  apiGetEditRequests,
  apiDeleteEditRequest,
  apiGetAllUsers,
  apiGetUserProgress,
  apiRemoveUser,
  apiGetLeaderboard,
  apiGetAllUsersProgress,
  type EditRequest,
  type UserMeta,
  type LeaderboardEntry,
  type UserWithProgress,
} from "../lib/api";
import { Navigate } from "react-router-dom";

type Tab = "requests" | "users" | "leaderboard" | "sheet";

export default function AdminDashboardPage() {
  const { user, passwordHash } = useUser();
  const [activeTab, setActiveTab] = useState<Tab>("requests");

  const [requests, setRequests] = useState<EditRequest[]>([]);
  const [users, setUsers] = useState<UserMeta[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [sheetUsers, setSheetUsers] = useState<UserWithProgress[]>([]);

  const [loading, setLoading] = useState(false);

  // Users sub-view
  const [selectedUser, setSelectedUser] = useState<UserMeta | null>(null);
  const [selectedUserSolved, setSelectedUserSolved] = useState<number[]>([]);
  const [loadingProgress, setLoadingProgress] = useState(false);

  if (user?.usn !== "ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }

  // ── Data fetchers ────────────────────────────────────────────
  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiGetEditRequests({ adminPassword: passwordHash });
      setRequests(res.requests);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load requests.");
    } finally { setLoading(false); }
  }, [passwordHash]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiGetAllUsers({ adminPassword: passwordHash });
      setUsers(res.users);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load users.");
    } finally { setLoading(false); }
  }, [passwordHash]);

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiGetLeaderboard();
      setLeaderboard(res.leaderboard);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load leaderboard.");
    } finally { setLoading(false); }
  }, []);

  const fetchSheetView = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiGetAllUsersProgress({ adminPassword: passwordHash });
      setSheetUsers(res.users);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load sheet view.");
    } finally { setLoading(false); }
  }, [passwordHash]);

  useEffect(() => {
    setSelectedUser(null);
    if (activeTab === "requests") fetchRequests();
    else if (activeTab === "users") fetchUsers();
    else if (activeTab === "leaderboard") fetchLeaderboard();
    else if (activeTab === "sheet") fetchSheetView();
  }, [activeTab, fetchRequests, fetchUsers, fetchLeaderboard, fetchSheetView]);

  async function handleViewProgress(u: UserMeta) {
    setSelectedUser(u);
    setLoadingProgress(true);
    try {
      const res = await apiGetUserProgress({ adminPassword: passwordHash, usn: u.usn });
      setSelectedUserSolved(res.solvedArray);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load progress.");
    } finally { setLoadingProgress(false); }
  }

  async function handleRemoveUser(usn: string) {
    if (!confirm(`Remove user ${usn} permanently? This cannot be undone.`)) return;
    try {
      await apiRemoveUser({ adminPassword: passwordHash, usn });
      toast.success(`User ${usn} removed.`);
      fetchUsers();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to remove user.");
    }
  }

  async function handleDeleteRequest(timestamp: number, usn: string) {
    if (!confirm(`Delete this edit request from ${usn}?`)) return;
    try {
      await apiDeleteEditRequest({ adminPassword: passwordHash, timestamp, usn });
      toast.success("Edit request deleted.");
      fetchRequests();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete request.");
    }
  }

  // ── Shared styles ────────────────────────────────────────────
  const mono: React.CSSProperties = { fontFamily: "'JetBrains Mono', monospace" };
  const muted: React.CSSProperties = { color: "var(--fg-muted)" };
  const cellPad: React.CSSProperties = { padding: "0.65rem 0.875rem" };

  const tabs: { id: Tab; label: string }[] = [
    { id: "requests",    label: "EDIT REQUESTS" },
    { id: "users",       label: "USERS" },
    { id: "leaderboard", label: "LEADERBOARD" },
    { id: "sheet",       label: "SHEET VIEW" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />

      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "2.5rem 1.5rem 5rem" }}>

        {/* ── Page Header ───────────────────────────────────── */}
        <div style={{ marginBottom: "2rem", borderBottom: "1px solid var(--border)", paddingBottom: "1.5rem" }}>
          <p style={{ ...mono, fontSize: "0.7rem", ...muted, textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: "0.5rem" }}>
            &lt;The Software Society/&gt; · Administration
          </p>
          <h1 className="display-heading" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "var(--fg)", lineHeight: 1 }}>
            ADMIN DASHBOARD.
          </h1>
        </div>

        {/* ── Tab Bar ───────────────────────────────────────── */}
        <div style={{ display: "flex", gap: "0", borderBottom: "1px solid var(--border)", marginBottom: "2rem", overflowX: "auto" }}>
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                background: "transparent",
                border: "none",
                borderBottom: `2px solid ${activeTab === t.id ? "var(--fg)" : "transparent"}`,
                color: activeTab === t.id ? "var(--fg)" : "var(--fg-muted)",
                padding: "0.75rem 1.5rem",
                cursor: "pointer",
                fontWeight: 700,
                fontSize: "0.7rem",
                letterSpacing: "0.1em",
                fontFamily: "'JetBrains Mono', monospace",
                whiteSpace: "nowrap",
                transition: "color 120ms ease, border-color 120ms ease",
                marginBottom: "-1px",
              }}
            >
              {t.label}
              {t.id === "requests" && requests.length > 0 && (
                <span style={{
                  marginLeft: "0.5rem",
                  background: "var(--fg)",
                  color: "var(--bg)",
                  fontSize: "0.7rem",
                  padding: "1px 5px",
                  borderRadius: "99px",
                  fontWeight: 900,
                }}>
                  {requests.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Loading State ─────────────────────────────────── */}
        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", ...muted }}>
            <div className="animate-spin" style={{ width: 14, height: 14, border: "2px solid #333", borderTopColor: "#fff", borderRadius: "50%" }} />
            <span style={{ ...mono, fontSize: "0.7rem" }}>Loading…</span>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            TAB 1 — EDIT REQUESTS
        ══════════════════════════════════════════════════════ */}
        {!loading && activeTab === "requests" && (
          <div className="page-enter">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <h2 style={{ fontWeight: 700, fontSize: "1.1rem" }}>Pending Edit Requests</h2>
              <button onClick={fetchRequests} style={{ ...mono, fontSize: "0.75rem", background: "none", border: "none", color: "var(--fg-muted)", cursor: "pointer", textDecoration: "underline" }}>↺ Refresh</button>
            </div>
            {requests.length === 0 ? (
              <div style={{ border: "1px solid var(--border)", padding: "3rem", textAlign: "center", ...muted, ...mono, fontSize: "0.7rem" }}>
                NO PENDING REQUESTS
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {requests.map((req, i) => (
                  <div key={i} style={{ border: "1px solid var(--border)", padding: "1.25rem 1.5rem", background: "var(--bg-card)", display: "grid", gridTemplateColumns: "1fr auto", gap: "1rem", alignItems: "start" }}>
                    <div>
                      <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "0.75rem" }}>
                        <span style={{ ...mono, fontSize: "0.75rem", color: "var(--fg)", fontWeight: 700 }}>{req.usn}</span>
                        <span style={{ ...mono, fontSize: "0.7rem", ...muted }}>
                          {new Date(req.timestamp).toLocaleString("en-IN")}
                        </span>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                        <div>
                          <p style={{ ...mono, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", ...muted, marginBottom: "0.25rem" }}>Wants to change</p>
                          <p style={{ fontSize: "0.875rem", color: "var(--fg)" }}>{req.fieldsToChange}</p>
                        </div>
                        <div>
                          <p style={{ ...mono, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", ...muted, marginBottom: "0.25rem" }}>Reason</p>
                          <p style={{ fontSize: "0.875rem", color: "#ccc", fontStyle: "italic" }}>"{req.reason}"</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <button
                        onClick={() => handleDeleteRequest(req.timestamp, req.usn)}
                        style={{ ...mono, fontSize: "0.75rem", background: "none", border: "1px solid var(--border)", color: "#e05555", cursor: "pointer", padding: "0.5rem 1rem", textTransform: "uppercase", letterSpacing: "0.05em", transition: "background 100ms", borderRadius: "4px" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "rgba(224, 85, 85, 0.1)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            TAB 2 — USERS DIRECTORY
        ══════════════════════════════════════════════════════ */}
        {!loading && activeTab === "users" && !selectedUser && (
          <div className="page-enter">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <h2 style={{ fontWeight: 700, fontSize: "1.1rem" }}>
                All Users <span style={{ ...mono, fontSize: "0.7rem", ...muted, fontWeight: 400 }}>({users.length} total)</span>
              </h2>
              <button onClick={fetchUsers} style={{ ...mono, fontSize: "0.75rem", background: "none", border: "none", color: "var(--fg-muted)", cursor: "pointer", textDecoration: "underline" }}>↺ Refresh</button>
            </div>
            <div style={{ overflowX: "auto", border: "1px solid var(--border)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.825rem" }}>
                <thead>
                  <tr style={{ background: "var(--bg-card)" }}>
                    {["#", "USN", "Name", "Email", "LeetCode", "Solved", "Actions"].map(h => (
                      <th key={h} style={{ ...cellPad, ...mono, fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", ...muted, textAlign: "left", borderBottom: "1px solid var(--border)", whiteSpace: "nowrap" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr key={u.usn} style={{ borderBottom: "1px solid #0f0f0f", transition: "background 100ms" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-hover)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    >
                      <td style={{ ...cellPad, ...mono, fontSize: "0.75rem", ...muted }}>{i + 1}</td>
                      <td style={{ ...cellPad, ...mono, fontSize: "0.75rem", fontWeight: 700, color: "var(--fg)" }}>{u.usn}</td>
                      <td style={{ ...cellPad }}>{u.firstName} {u.lastName}</td>
                      <td style={{ ...cellPad, ...mono, fontSize: "0.7rem", ...muted }}>{u.email}</td>
                      <td style={{ ...cellPad, ...mono, fontSize: "0.7rem" }}>{u.leetcodeUsername || "—"}</td>
                      <td style={{ ...cellPad }}>
                        <span style={{ ...mono, fontSize: "0.75rem", fontWeight: 700 }}>{u.totalSolved}</span>
                        <span style={{ ...muted, ...mono, fontSize: "0.75rem" }}>/150</span>
                        <div style={{ marginTop: "4px", height: "2px", background: "var(--border)", width: "60px" }}>
                          <div style={{ height: "100%", background: "var(--fg)", width: `${u.percentage}%`, transition: "width 0.5s ease" }} />
                        </div>
                      </td>
                      <td style={{ ...cellPad }}>
                        <div style={{ display: "flex", gap: "0.75rem" }}>
                          <button
                            onClick={() => handleViewProgress(u)}
                            style={{ ...mono, fontSize: "0.75rem", background: "none", border: "none", color: "var(--fg)", cursor: "pointer", textDecoration: "underline", textTransform: "uppercase", letterSpacing: "0.05em" }}
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleRemoveUser(u.usn)}
                            style={{ ...mono, fontSize: "0.75rem", background: "none", border: "none", color: "#e05555", cursor: "pointer", textDecoration: "underline", textTransform: "uppercase", letterSpacing: "0.05em" }}
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── User Progress Sub-view ─────────────────────────── */}
        {!loading && activeTab === "users" && selectedUser && (
          <div className="page-enter">
            <button
              onClick={() => setSelectedUser(null)}
              style={{ ...mono, fontSize: "0.75rem", ...muted, background: "none", border: "none", cursor: "pointer", textDecoration: "underline", marginBottom: "1.5rem", textTransform: "uppercase", letterSpacing: "0.08em" }}
            >
              ← Back to Users
            </button>

            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "1.5rem", alignItems: "start", marginBottom: "2rem" }}>
              <div>
                <p style={{ ...mono, fontSize: "0.7rem", ...muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.35rem" }}>Viewing Progress</p>
                <h2 style={{ fontSize: "1.75rem", fontWeight: 700, lineHeight: 1.1 }}>
                  {selectedUser.firstName} {selectedUser.lastName}
                </h2>
                <p style={{ ...mono, fontSize: "0.75rem", ...muted, marginTop: "0.35rem" }}>{selectedUser.usn}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: "3rem", lineHeight: 1 }}>
                  {selectedUser.totalSolved}
                </span>
                <span style={{ ...mono, fontSize: "0.75rem", ...muted }}>/150</span>
                <p style={{ ...mono, fontSize: "0.75rem", color: "var(--fg)", marginTop: "0.25rem" }}>{selectedUser.percentage}% complete</p>
              </div>
            </div>

            {loadingProgress ? (
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", ...muted }}>
                <div className="animate-spin" style={{ width: 14, height: 14, border: "2px solid #333", borderTopColor: "#fff", borderRadius: "50%" }} />
                <span style={{ ...mono, fontSize: "0.7rem" }}>Loading checklist…</span>
              </div>
            ) : (
              <>
                {/* Progress bar */}
                <div style={{ height: "3px", background: "var(--border)", marginBottom: "1.5rem" }}>
                  <div className="progress-bar-fill" style={{ height: "100%", background: "var(--fg)", width: `${selectedUser.percentage}%` }} />
                </div>
                {/* Grid of 150 cells */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(15, 1fr)", gap: "3px" }}>
                  {selectedUserSolved.map((solved, i) => (
                    <div
                      key={i}
                      title={`Q${i + 1} — ${solved ? "Solved ✓" : "Not solved"}`}
                      style={{
                        aspectRatio: "1/1",
                        background: solved ? "#fff" : "var(--bg-card)",
                        border: `1px solid ${solved ? "#555" : "#1a1a1a"}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.4rem",
                        color: solved ? "#000" : "#333",
                        fontFamily: "'JetBrains Mono', monospace",
                        fontWeight: 700,
                        cursor: "default",
                        transition: "opacity 200ms",
                        opacity: solved ? 1 : 0.5,
                      }}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
                <p style={{ marginTop: "1rem", ...mono, fontSize: "0.7rem", ...muted }}>
                  Each cell = one of the 150 problems. White = solved.
                </p>
              </>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            TAB 3 — LEADERBOARD
        ══════════════════════════════════════════════════════ */}
        {!loading && activeTab === "leaderboard" && (
          <div className="page-enter">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <h2 style={{ fontWeight: 700, fontSize: "1.1rem" }}>
                Challenge 150 Leaderboard
              </h2>
              <button onClick={fetchLeaderboard} style={{ ...mono, fontSize: "0.75rem", background: "none", border: "none", ...muted, cursor: "pointer", textDecoration: "underline" }}>↺ Refresh</button>
            </div>
            <div style={{ overflowX: "auto", border: "1px solid var(--border)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.825rem" }}>
                <thead>
                  <tr style={{ background: "var(--bg-card)" }}>
                    {["Rank", "Name", "USN", "LeetCode", "Solved", "%"].map(h => (
                      <th key={h} style={{ ...cellPad, ...mono, fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", ...muted, textAlign: "left", borderBottom: "1px solid var(--border)", whiteSpace: "nowrap" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry) => (
                    <tr
                      key={entry.usn}
                      style={{ borderBottom: "1px solid #0f0f0f", transition: "background 100ms" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-hover)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    >
                      <td style={{ ...cellPad }}>
                        <span style={{
                          ...mono, fontWeight: 900, fontSize: "0.9rem",
                          color: entry.rank === 1 ? "#fff" : entry.rank === 2 ? "#aaa" : entry.rank === 3 ? "#888" : "var(--fg-muted)",
                        }}>
                          #{entry.rank}
                        </span>
                      </td>
                      <td style={{ ...cellPad, fontWeight: 600 }}>{entry.firstName} {entry.lastName}</td>
                      <td style={{ ...cellPad, ...mono, fontSize: "0.7rem", ...muted }}>{entry.usn}</td>
                      <td style={{ ...cellPad, ...mono, fontSize: "0.7rem" }}>{entry.leetcodeUsername || "—"}</td>
                      <td style={{ ...cellPad }}>
                        <span style={{ ...mono, fontWeight: 700 }}>{entry.totalSolved}</span>
                        <span style={{ ...muted, ...mono, fontSize: "0.75rem" }}>/150</span>
                      </td>
                      <td style={{ ...cellPad, ...mono, fontSize: "0.75rem", fontWeight: 700 }}>{entry.percentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            TAB 4 — SHEET VIEW (Spreadsheet-style)
        ══════════════════════════════════════════════════════ */}
        {!loading && activeTab === "sheet" && (
          <div className="page-enter">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <div>
                <h2 style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: "0.25rem" }}>Full Data Sheet</h2>
                <p style={{ ...mono, fontSize: "0.75rem", ...muted }}>
                  Each column = Q1–Q150 · White cell = solved · {sheetUsers.length} users loaded
                </p>
              </div>
              <button onClick={fetchSheetView} style={{ ...mono, fontSize: "0.75rem", background: "none", border: "none", ...muted, cursor: "pointer", textDecoration: "underline" }}>↺ Refresh</button>
            </div>

            {/* Sticky horizontal scroll container */}
            <div style={{ overflowX: "auto", border: "1px solid var(--border)", maxHeight: "70vh", overflowY: "auto" }}>
              <table style={{ borderCollapse: "collapse", fontSize: "0.75rem" }}>
                <thead style={{ position: "sticky", top: 0, zIndex: 10, background: "#0a0a0a" }}>
                  <tr>
                    {/* Fixed info columns */}
                    <th style={{ ...cellPad, ...mono, ...muted, textAlign: "left", borderRight: "2px solid var(--border)", borderBottom: "1px solid var(--border)", whiteSpace: "nowrap", minWidth: "90px", position: "sticky", left: 0, background: "#0a0a0a", zIndex: 20 }}>USN</th>
                    <th style={{ ...cellPad, ...mono, ...muted, textAlign: "left", borderRight: "1px solid var(--border)", borderBottom: "1px solid var(--border)", whiteSpace: "nowrap", minWidth: "100px" }}>Name</th>
                    <th style={{ ...cellPad, ...mono, ...muted, textAlign: "center", borderRight: "2px solid var(--border)", borderBottom: "1px solid var(--border)", whiteSpace: "nowrap" }}>Total</th>
                    {/* Q1-Q150 columns */}
                    {Array.from({ length: 150 }, (_, i) => (
                      <th key={i} style={{
                        padding: "4px 2px",
                        ...mono,
                        fontSize: "0.42rem",
                        ...muted,
                        textAlign: "center",
                        borderBottom: "1px solid var(--border)",
                        borderRight: "1px solid #111",
                        minWidth: "18px",
                        color: "#444",
                      }}>
                        {i + 1}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sheetUsers.map((u) => (
                    <tr key={u.usn} style={{ borderBottom: "1px solid #0a0a0a" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "#0d0d0d")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    >
                      {/* Sticky USN column */}
                      <td style={{
                        ...cellPad, ...mono, fontSize: "0.75rem", fontWeight: 700,
                        color: "var(--fg)", borderRight: "2px solid var(--border)",
                        position: "sticky", left: 0, background: "var(--bg)", whiteSpace: "nowrap",
                        zIndex: 5,
                      }}>
                        {u.usn}
                      </td>
                      <td style={{ ...cellPad, whiteSpace: "nowrap", borderRight: "1px solid var(--border)", ...muted, fontSize: "0.7rem" }}>
                        {u.firstName} {u.lastName}
                      </td>
                      <td style={{ ...cellPad, ...mono, fontSize: "0.7rem", fontWeight: 700, textAlign: "center", borderRight: "2px solid var(--border)", color: u.totalSolved > 100 ? "#fff" : u.totalSolved > 50 ? "#aaa" : "var(--fg-muted)" }}>
                        {u.totalSolved}
                      </td>
                      {/* Q1–Q150 cells */}
                      {u.solvedArray.map((solved, i) => (
                        <td
                          key={i}
                          title={`Q${i + 1}`}
                          style={{
                            width: "18px",
                            height: "18px",
                            padding: 0,
                            background: solved ? "#fff" : "transparent",
                            borderRight: "1px solid #0f0f0f",
                            borderBottom: "1px solid #0f0f0f",
                            cursor: "default",
                          }}
                        />
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Legend */}
            <div style={{ display: "flex", gap: "1.5rem", marginTop: "1rem", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <div style={{ width: 14, height: 14, background: "#fff", border: "1px solid #555" }} />
                <span style={{ ...mono, fontSize: "0.75rem", ...muted }}>Solved</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <div style={{ width: 14, height: 14, background: "transparent", border: "1px solid #222" }} />
                <span style={{ ...mono, fontSize: "0.75rem", ...muted }}>Not solved</span>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
