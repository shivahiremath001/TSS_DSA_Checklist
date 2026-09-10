import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import { useUser } from "../context/UserContext";
import { apiGetEditRequests, apiGetAllUsers, apiGetUserProgress, apiRemoveUser, type EditRequest, type UserMeta } from "../lib/api";
import { Navigate } from "react-router-dom";

export default function AdminDashboardPage() {
  const { user, passwordHash } = useUser();
  const [activeTab, setActiveTab] = useState<"requests" | "users">("requests");
  
  const [requests, setRequests] = useState<EditRequest[]>([]);
  const [users, setUsers] = useState<UserMeta[]>([]);
  const [loading, setLoading] = useState(false);

  // For User Progress View
  const [selectedUser, setSelectedUser] = useState<UserMeta | null>(null);
  const [selectedUserSolved, setSelectedUserSolved] = useState<number[]>([]);
  const [loadingProgress, setLoadingProgress] = useState(false);

  // If not admin, boot them
  if (user?.usn !== "ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiGetEditRequests({ adminPassword: passwordHash });
      setRequests(res.requests);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load requests.");
    } finally {
      setLoading(false);
    }
  }, [passwordHash]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiGetAllUsers({ adminPassword: passwordHash });
      setUsers(res.users);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load users.");
    } finally {
      setLoading(false);
    }
  }, [passwordHash]);

  useEffect(() => {
    if (activeTab === "requests") fetchRequests();
    else fetchUsers();
  }, [activeTab, fetchRequests, fetchUsers]);

  async function handleViewProgress(u: UserMeta) {
    setSelectedUser(u);
    setLoadingProgress(true);
    try {
      const res = await apiGetUserProgress({ adminPassword: passwordHash, usn: u.usn });
      setSelectedUserSolved(res.solvedArray);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load progress.");
    } finally {
      setLoadingProgress(false);
    }
  }

  async function handleRemoveUser(usn: string) {
    if (!confirm(`Are you sure you want to completely remove user ${usn}?`)) return;
    try {
      await apiRemoveUser({ adminPassword: passwordHash, usn });
      toast.success("User removed.");
      fetchUsers();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to remove user.");
    }
  }

  const mono: React.CSSProperties = { fontFamily: "'JetBrains Mono', monospace" };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />

      <main className="page-enter" style={{ maxWidth: "1000px", margin: "0 auto", padding: "3rem 1.5rem 5rem" }}>
        {/* Header */}
        <div style={{ marginBottom: "2rem", borderBottom: "1px solid var(--border)", paddingBottom: "1.5rem" }}>
          <p style={{ ...mono, fontSize: "0.6rem", color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "0.5rem" }}>
            Administration
          </p>
          <h1 className="display-heading" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "var(--fg)" }}>
            ADMIN DASHBOARD.
          </h1>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
          <button
            onClick={() => { setActiveTab("requests"); setSelectedUser(null); }}
            style={{
              background: "transparent",
              color: activeTab === "requests" ? "var(--fg)" : "var(--fg-muted)",
              border: "none",
              borderBottom: `2px solid ${activeTab === "requests" ? "var(--fg)" : "transparent"}`,
              padding: "0.5rem 1rem",
              cursor: "pointer",
              fontWeight: 700,
              fontFamily: "'Space Grotesk', sans-serif",
              letterSpacing: "0.05em"
            }}
          >
            EDIT REQUESTS
          </button>
          <button
            onClick={() => { setActiveTab("users"); setSelectedUser(null); }}
            style={{
              background: "transparent",
              color: activeTab === "users" ? "var(--fg)" : "var(--fg-muted)",
              border: "none",
              borderBottom: `2px solid ${activeTab === "users" ? "var(--fg)" : "transparent"}`,
              padding: "0.5rem 1rem",
              cursor: "pointer",
              fontWeight: 700,
              fontFamily: "'Space Grotesk', sans-serif",
              letterSpacing: "0.05em"
            }}
          >
            USERS DIRECTORY
          </button>
        </div>

        {/* Content */}
        {loading && <p style={{ color: "var(--fg-muted)", ...mono, fontSize: "0.75rem" }}>Loading...</p>}

        {!loading && activeTab === "requests" && (
          <div>
            {requests.length === 0 ? (
              <p style={{ color: "var(--fg-muted)" }}>No edit requests pending.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {requests.map((req, i) => (
                  <div key={i} style={{ border: "1px solid var(--border)", padding: "1.5rem", background: "var(--bg-card)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                      <span style={{ ...mono, color: "var(--fg-highlight)", fontWeight: 700 }}>{req.usn}</span>
                      <span style={{ ...mono, fontSize: "0.6rem", color: "var(--fg-muted)" }}>
                        {new Date(req.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div style={{ marginBottom: "0.5rem" }}>
                      <span style={{ ...mono, fontSize: "0.6rem", color: "var(--fg-muted)", textTransform: "uppercase" }}>Wants to change:</span>
                      <p style={{ fontSize: "0.9rem", marginTop: "0.25rem", wordBreak: "break-all" }}>{req.fieldsToChange}</p>
                    </div>
                    <div>
                      <span style={{ ...mono, fontSize: "0.6rem", color: "var(--fg-muted)", textTransform: "uppercase" }}>Reason:</span>
                      <p style={{ fontSize: "0.9rem", marginTop: "0.25rem", color: "#ddd" }}>"{req.reason}"</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {!loading && activeTab === "users" && !selectedUser && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 700 }}>All Registered Users</h2>
              <span style={{ ...mono, fontSize: "0.7rem", color: "var(--fg-muted)" }}>Total: {users.length}</span>
            </div>
            
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.85rem" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--fg-muted)" }}>
                    <th style={{ padding: "0.75rem", ...mono, fontWeight: "normal" }}>USN</th>
                    <th style={{ padding: "0.75rem", ...mono, fontWeight: "normal" }}>Name</th>
                    <th style={{ padding: "0.75rem", ...mono, fontWeight: "normal" }}>Solved</th>
                    <th style={{ padding: "0.75rem", ...mono, fontWeight: "normal" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.usn} style={{ borderBottom: "1px solid #111" }}>
                      <td style={{ padding: "0.75rem", ...mono }}>{u.usn}</td>
                      <td style={{ padding: "0.75rem" }}>{u.firstName} {u.lastName}</td>
                      <td style={{ padding: "0.75rem", ...mono }}>{u.totalSolved}/150</td>
                      <td style={{ padding: "0.75rem" }}>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <button onClick={() => handleViewProgress(u)} style={{ background: "none", border: "none", color: "var(--fg)", cursor: "pointer", textDecoration: "underline", fontSize: "0.75rem" }}>
                            View Progress
                          </button>
                          <button onClick={() => handleRemoveUser(u.usn)} style={{ background: "none", border: "none", color: "#ff4444", cursor: "pointer", textDecoration: "underline", fontSize: "0.75rem" }}>
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

        {/* User Progress Sub-view */}
        {selectedUser && (
          <div>
            <button onClick={() => setSelectedUser(null)} style={{ background: "none", border: "none", color: "var(--fg-muted)", cursor: "pointer", marginBottom: "1rem", ...mono, fontSize: "0.7rem", textDecoration: "underline" }}>
              ← Back to Users
            </button>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>{selectedUser.firstName}'s Progress</h2>
            <p style={{ ...mono, color: "var(--fg-muted)", marginBottom: "2rem" }}>USN: {selectedUser.usn} | Solved: {selectedUser.totalSolved}/150</p>
            
            {loadingProgress ? (
              <p style={{ ...mono, color: "var(--fg-muted)", fontSize: "0.75rem" }}>Loading checklist...</p>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(20px, 1fr))", gap: "2px" }}>
                {selectedUserSolved.map((solved, i) => (
                  <div key={i} title={`Problem ${i + 1}`} style={{
                    aspectRatio: "1/1",
                    background: solved ? "var(--fg-highlight)" : "var(--bg-card)",
                    border: "1px solid var(--border)",
                    opacity: solved ? 1 : 0.5
                  }} />
                ))}
              </div>
            )}
            <p style={{ marginTop: "1rem", ...mono, fontSize: "0.6rem", color: "var(--fg-muted)" }}>Each box represents one of the 150 problems.</p>
          </div>
        )}
      </main>
    </div>
  );
}
