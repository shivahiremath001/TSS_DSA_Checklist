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
  apiSuspendUser,
  apiUnsuspendUser,
  apiAdminSetProgress,
  type EditRequest,
  type UserMeta,
  type LeaderboardEntry,
  type UserWithProgress,
} from "../lib/api";
import { Navigate } from "react-router-dom";

type Tab = "requests" | "users" | "leaderboard" | "sheet";

export default function AdminDashboardPage() {
  const { user, passwordHash } = useUser();
  const [activeTab, setActiveTab] = useState<Tab>("users");

  const [requests, setRequests] = useState<EditRequest[]>([]);
  const [users, setUsers] = useState<UserMeta[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [sheetUsers, setSheetUsers] = useState<UserWithProgress[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [loading, setLoading] = useState(false);

  // Users sub-view
  const [selectedUser, setSelectedUser] = useState<UserMeta | null>(null);
  const [selectedUserSolved, setSelectedUserSolved] = useState<number[]>([]);
  const [loadingProgress, setLoadingProgress] = useState(false);

  // Suspend modal state
  const [suspendModalUser, setSuspendModalUser] = useState<UserMeta | null>(null);
  const [suspendDuration, setSuspendDuration] = useState<"7d" | "14d" | "1m" | "custom">("7d");
  const [suspendCustomDate, setSuspendCustomDate] = useState("");
  // Editable progress state
  const [editedSolved, setEditedSolved] = useState<number[]>([]);
  const [savingProgress, setSavingProgress] = useState(false);

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
      setEditedSolved([...res.solvedArray]);
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

  async function handleSuspendUser(usn: string, suspendUntil: number) {
    try {
      await apiSuspendUser({ adminPassword: passwordHash, usn, suspendUntil });
      toast.success(`User ${usn} suspended until ${new Date(suspendUntil).toLocaleDateString("en-IN")}.`);
      setSuspendModalUser(null);
      fetchUsers();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to suspend user.");
    }
  }

  async function handleUnsuspendUser(usn: string) {
    if (!confirm(`Lift suspension for ${usn}?`)) return;
    try {
      await apiUnsuspendUser({ adminPassword: passwordHash, usn });
      toast.success(`${usn} unsuspended.`);
      fetchUsers();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to unsuspend user.");
    }
  }

  async function handleSaveProgress() {
    if (!selectedUser) return;
    setSavingProgress(true);
    try {
      await apiAdminSetProgress({ adminPassword: passwordHash, usn: selectedUser.usn, solvedArray: editedSolved });
      toast.success("Progress updated.");
      setSelectedUserSolved([...editedSolved]);
      // Update the user's totalSolved count in memory
      const newTotal = editedSolved.reduce((a, b) => a + b, 0);
      setSelectedUser(prev => prev ? { ...prev, totalSolved: newTotal, percentage: Math.round((newTotal / 150) * 1000) / 10 } : prev);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save progress.");
    } finally {
      setSavingProgress(false);
    }
  }

  function computeSuspendUntil(): number | null {
    const now = new Date();
    if (suspendDuration === "7d") {
      return now.getTime() + 7 * 24 * 60 * 60 * 1000;
    } else if (suspendDuration === "14d") {
      return now.getTime() + 14 * 24 * 60 * 60 * 1000;
    } else if (suspendDuration === "1m") {
      const d = new Date(now);
      d.setMonth(d.getMonth() + 1);
      return d.getTime();
    } else if (suspendDuration === "custom") {
      if (!suspendCustomDate) return null;
      return new Date(suspendCustomDate).getTime();
    }
    return null;
  }

  // ── Shared styles ────────────────────────────────────────────
  const mono: React.CSSProperties = { fontFamily: "'JetBrains Mono', monospace" };
  const muted: React.CSSProperties = { color: "var(--fg-muted)" };
  const cellPad: React.CSSProperties = { padding: "0.65rem 0.875rem" };

  const tabs: { id: Tab; label: string }[] = [
    { id: "users",       label: "USERS" },
    { id: "requests",    label: "EDIT REQUESTS" },
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
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <input 
                  type="text" 
                  placeholder="Search USN, Name, or LeetCode..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    color: "var(--fg)",
                    padding: "0.5rem 0.75rem",
                    fontSize: "0.75rem",
                    fontFamily: "'JetBrains Mono', monospace",
                    width: "250px",
                    outline: "none"
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--fg-muted)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                />
                <button onClick={fetchUsers} style={{ ...mono, fontSize: "0.75rem", background: "none", border: "none", color: "var(--fg-muted)", cursor: "pointer", textDecoration: "underline" }}>↺ Refresh</button>
              </div>
            </div>
            <div style={{ overflowX: "auto", border: "1px solid var(--border)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.825rem" }}>
                <thead>
                  <tr style={{ background: "var(--bg-card)" }}>
                    {["#", "USN", "Name", "Email", "LeetCode", "Solved", "Status", "Actions"].map(h => (
                      <th key={h} style={{ ...cellPad, ...mono, fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", ...muted, textAlign: "left", borderBottom: "1px solid var(--border)", whiteSpace: "nowrap" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.filter(u => {
                    const q = searchQuery.toLowerCase();
                    return u.usn.toLowerCase().includes(q) || 
                           `${u.firstName} ${u.lastName}`.toLowerCase().includes(q) ||
                           (u.leetcodeUsername && u.leetcodeUsername.toLowerCase().includes(q));
                  }).map((u, i) => (
                    <tr key={u.usn} style={{ borderBottom: "1px solid #0f0f0f", transition: "background 100ms" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-hover)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    >
                      <td style={{ ...cellPad, ...mono, fontSize: "0.75rem", ...muted }}>{i + 1}</td>
                      <td style={{ ...cellPad, ...mono, fontSize: "0.75rem", fontWeight: 700, color: "var(--fg)" }}>{u.usn}</td>
                      <td style={{ ...cellPad }}>{u.firstName} {u.lastName}</td>
                      <td style={{ ...cellPad, ...mono, fontSize: "0.7rem", ...muted }}>{u.email}</td>
                      <td style={{ ...cellPad, ...mono, fontSize: "0.7rem" }}>
                        {u.leetcodeUsername ? (
                          <a href={`https://leetcode.com/${u.leetcodeUsername}`} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)", textDecoration: "underline" }} onClick={e => e.stopPropagation()}>
                            {u.leetcodeUsername}
                          </a>
                        ) : "—"}
                      </td>
                      <td style={{ ...cellPad }}>
                        <span style={{ ...mono, fontSize: "0.75rem", fontWeight: 700 }}>{u.totalSolved}</span>
                        <span style={{ ...muted, ...mono, fontSize: "0.75rem" }}>/150</span>
                        <div style={{ marginTop: "4px", height: "2px", background: "var(--border)", width: "60px" }}>
                          <div style={{ height: "100%", background: "var(--fg)", width: `${u.percentage}%`, transition: "width 0.5s ease" }} />
                        </div>
                      </td>
                      <td style={{ ...cellPad }}>
                        {u.suspendedUntil && u.suspendedUntil > Date.now() ? (
                          <span style={{ ...mono, fontSize: "0.65rem", color: "#e05555", fontWeight: 700 }}>
                            SUSPENDED<br/>
                            <span style={{ fontWeight: 400, color: "var(--fg-muted)" }}>until {new Date(u.suspendedUntil).toLocaleDateString("en-IN")}</span>
                          </span>
                        ) : (
                          <span style={{ ...mono, fontSize: "0.65rem", color: "#4caf50" }}>ACTIVE</span>
                        )}
                      </td>
                      <td style={{ ...cellPad }}>
                        <div style={{ display: "flex", gap: "0.75rem" }}>
                          {u.usn !== "ADMIN" && (
                            <>
                              <button
                                onClick={() => handleViewProgress(u)}
                                style={{ ...mono, fontSize: "0.75rem", background: "none", border: "none", color: "var(--fg)", cursor: "pointer", textDecoration: "underline", textTransform: "uppercase", letterSpacing: "0.05em" }}
                              >
                                View
                              </button>
                              {u.suspendedUntil && u.suspendedUntil > Date.now() ? (
                                <button
                                  onClick={() => handleUnsuspendUser(u.usn)}
                                  style={{ ...mono, fontSize: "0.7rem", background: "none", border: "1px solid #4caf50", color: "#4caf50", cursor: "pointer", padding: "0.25rem 0.5rem", textTransform: "uppercase", letterSpacing: "0.04em", borderRadius: "3px" }}
                                >
                                  Unsuspend
                                </button>
                              ) : (
                                <button
                                  onClick={() => { setSuspendModalUser(u); setSuspendDuration("7d"); setSuspendCustomDate(""); }}
                                  style={{ ...mono, fontSize: "0.7rem", background: "none", border: "1px solid #e05555", color: "#e05555", cursor: "pointer", padding: "0.25rem 0.5rem", textTransform: "uppercase", letterSpacing: "0.04em", borderRadius: "3px" }}
                                >
                                  Suspend
                                </button>
                              )}
                            </>
                          )}
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <button
                onClick={() => setSelectedUser(null)}
                style={{ ...mono, fontSize: "0.75rem", ...muted, background: "none", border: "none", cursor: "pointer", textDecoration: "underline", textTransform: "uppercase", letterSpacing: "0.08em" }}
              >
                ← Back to Users
              </button>
              {selectedUser.usn !== "ADMIN" && (
                <>
                  {selectedUser.suspendedUntil && selectedUser.suspendedUntil > Date.now() ? (
                    <button
                      onClick={() => handleUnsuspendUser(selectedUser.usn)}
                      style={{ ...mono, fontSize: "0.75rem", background: "none", border: "none", color: "#4caf50", cursor: "pointer", textDecoration: "underline", textTransform: "uppercase", letterSpacing: "0.05em" }}
                    >
                      Unsuspend
                    </button>
                  ) : (
                    <button
                      onClick={() => { setSuspendModalUser(selectedUser); setSuspendDuration("7d"); setSuspendCustomDate(""); }}
                      style={{ ...mono, fontSize: "0.75rem", background: "none", border: "none", color: "#e09b30", cursor: "pointer", textDecoration: "underline", textTransform: "uppercase", letterSpacing: "0.05em" }}
                    >
                      Suspend
                    </button>
                  )}
                  <button
                    onClick={async () => {
                      await handleRemoveUser(selectedUser.usn);
                      setSelectedUser(null);
                    }}
                    style={{ ...mono, fontSize: "0.75rem", background: "none", border: "none", color: "#e05555", cursor: "pointer", textDecoration: "underline", textTransform: "uppercase", letterSpacing: "0.05em" }}
                  >
                    Remove User
                  </button>
                </>
              )}
            </div>

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
                  {editedSolved.map((solved, i) => (
                    <div
                      key={i}
                      title={`Q${i + 1} — ${solved ? "Solved ✓ (click to unmark)" : "Not solved (click to mark)"}`}
                      onClick={() => {
                        const updated = [...editedSolved];
                        updated[i] = updated[i] === 1 ? 0 : 1;
                        setEditedSolved(updated);
                      }}
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
                        cursor: "pointer",
                        transition: "opacity 200ms, background 100ms",
                        opacity: solved ? 1 : 0.5,
                      }}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
                <p style={{ marginTop: "1rem", ...mono, fontSize: "0.7rem", ...muted }}>
                  Each cell = one of the 150 problems. White = solved. Click any cell to toggle.
                </p>
                <div style={{ marginTop: "1.25rem", display: "flex", alignItems: "center", gap: "1rem" }}>
                  <button
                    onClick={handleSaveProgress}
                    disabled={savingProgress}
                    style={{
                      ...mono, fontSize: "0.75rem", fontWeight: 700,
                      background: "var(--fg)", color: "var(--bg)",
                      border: "none", cursor: savingProgress ? "not-allowed" : "pointer",
                      padding: "0.6rem 1.5rem", textTransform: "uppercase",
                      letterSpacing: "0.08em", borderRadius: "3px", opacity: savingProgress ? 0.6 : 1,
                    }}
                  >
                    {savingProgress ? "Saving…" : "Save Changes"}
                  </button>
                  <button
                    onClick={() => setEditedSolved([...selectedUserSolved])}
                    disabled={savingProgress}
                    style={{
                      ...mono, fontSize: "0.75rem", background: "none", border: "none",
                      color: "var(--fg-muted)", cursor: "pointer", textDecoration: "underline"
                    }}
                  >
                    Reset
                  </button>
                  <span style={{ ...mono, fontSize: "0.7rem", color: "var(--fg-muted)" }}>
                    {editedSolved.reduce((a, b) => a + b, 0)} / 150 marked
                  </span>
                </div>
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
                      <td style={{ ...cellPad, ...mono, fontSize: "0.7rem" }}>
                        {entry.leetcodeUsername ? (
                          <a href={`https://leetcode.com/${entry.leetcodeUsername}`} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)", textDecoration: "underline" }} onClick={e => e.stopPropagation()}>
                            {entry.leetcodeUsername}
                          </a>
                        ) : "—"}
                      </td>
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

      {/* ── Suspend Modal ──────────────────────────────────────── */}
      {suspendModalUser && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 1000,
          display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem"
        }}>
          <div style={{
            background: "var(--bg-card)", border: "1px solid var(--border)",
            padding: "2rem", maxWidth: "420px", width: "100%", borderRadius: "4px"
          }}>
            <p style={{ ...mono, fontSize: "0.65rem", color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "0.5rem" }}>Suspend Account</p>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1.5rem" }}>
              {suspendModalUser.firstName} {suspendModalUser.lastName}
              <span style={{ ...mono, fontSize: "0.75rem", color: "var(--fg-muted)", marginLeft: "0.5rem" }}>{suspendModalUser.usn}</span>
            </h3>

            <p style={{ ...mono, fontSize: "0.7rem", color: "var(--fg-muted)", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>Suspension Duration</p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBottom: "1rem" }}>
              {(["7d", "14d", "1m", "custom"] as const).map(opt => (
                <button
                  key={opt}
                  onClick={() => setSuspendDuration(opt)}
                  style={{
                    ...mono, fontSize: "0.75rem", padding: "0.6rem 1rem",
                    background: suspendDuration === opt ? "var(--fg)" : "transparent",
                    color: suspendDuration === opt ? "var(--bg)" : "var(--fg)",
                    border: `1px solid ${suspendDuration === opt ? "var(--fg)" : "var(--border)"}`,
                    cursor: "pointer", fontWeight: 700, borderRadius: "3px",
                    textTransform: "uppercase", letterSpacing: "0.06em",
                    transition: "all 120ms ease",
                  }}
                >
                  {opt === "7d" ? "7 Days" : opt === "14d" ? "14 Days" : opt === "1m" ? "1 Month" : "Custom"}
                </button>
              ))}
            </div>

            {suspendDuration === "custom" && (
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ ...mono, fontSize: "0.7rem", color: "var(--fg-muted)", display: "block", marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>End Date</label>
                <input
                  type="date"
                  value={suspendCustomDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={e => setSuspendCustomDate(e.target.value)}
                  style={{
                    width: "100%", background: "var(--bg)", border: "1px solid var(--border)",
                    color: "var(--fg)", padding: "0.5rem 0.75rem", ...mono, fontSize: "0.8rem",
                    outline: "none", borderRadius: "3px", boxSizing: "border-box"
                  }}
                />
              </div>
            )}

            {(() => {
              const until = computeSuspendUntil();
              return until ? (
                <p style={{ ...mono, fontSize: "0.72rem", color: "var(--fg-muted)", marginBottom: "1.25rem" }}>
                  Suspended until: <strong style={{ color: "#e05555" }}>{new Date(until).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</strong>
                </p>
              ) : null;
            })()}

            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
              <button
                onClick={() => setSuspendModalUser(null)}
                style={{ ...mono, fontSize: "0.75rem", background: "none", border: "none", color: "var(--fg-muted)", cursor: "pointer", textDecoration: "underline" }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const until = computeSuspendUntil();
                  if (!until) { toast.error("Please select a valid end date."); return; }
                  if (until <= Date.now()) { toast.error("Suspension end date must be in the future."); return; }
                  handleSuspendUser(suspendModalUser.usn, until);
                }}
                style={{
                  ...mono, fontSize: "0.75rem", fontWeight: 700, background: "#e05555", color: "#fff",
                  border: "none", cursor: "pointer", padding: "0.6rem 1.5rem",
                  textTransform: "uppercase", letterSpacing: "0.08em", borderRadius: "3px",
                }}
              >
                Confirm Suspend
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
