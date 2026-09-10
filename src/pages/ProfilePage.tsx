import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import { useUser } from "../context/UserContext";
import { apiSubmitEditRequest } from "../lib/api";

export default function ProfilePage() {
  const { user, passwordHash } = useUser();
  const [reason, setReason] = useState("");
  const [fieldsToChange, setFieldsToChange] = useState("");
  const [saving, setSaving] = useState(false);
  const isDemo = passwordHash === "__demo__";

  const mono: React.CSSProperties = { fontFamily: "'Share Tech Mono', monospace" };

  const solved = user?.totalSolved ?? 0;
  const pct = user?.percentage ?? 0;
  const tier = pct >= 80 ? { label: "LEGENDARY", color: "#ffd700" }
             : pct >= 60 ? { label: "ELITE",      color: "#00d4ff" }
             : pct >= 40 ? { label: "ADVANCED",   color: "#7c3aed" }
             : pct >= 20 ? { label: "SKILLED",    color: "#00ff88" }
             :             { label: "INITIATE",   color: "#3d6a8a" };

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    if (!reason.trim() || !fieldsToChange.trim()) {
      toast("Fill out both fields.", { icon: "⚠" });
      return;
    }
    if (isDemo) {
      toast.success("SIMULATION: Edit request transmitted.");
      setReason("");
      setFieldsToChange("");
      return;
    }
    setSaving(true);
    try {
      await apiSubmitEditRequest({ usn: user.usn, password: passwordHash, reason: reason.trim(), fieldsToChange: fieldsToChange.trim() });
      setReason("");
      setFieldsToChange("");
      toast.success("EDIT REQUEST TRANSMITTED. Awaiting admin clearance.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Transmission failed.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />
      <main className="page-enter" style={{ maxWidth: "680px", margin: "0 auto", padding: "2.5rem 1.5rem 5rem" }}>

        {/* Header */}
        <div style={{ marginBottom: "2rem", borderBottom: "1px solid var(--border)", paddingBottom: "1.5rem" }}>
          <p style={{ ...mono, fontSize: "0.7rem", color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: "0.5rem" }}>
            &gt;_ PLAYER FILE
          </p>
          <h1 className="display-heading" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "var(--fg)" }}>
            PROFILE.
          </h1>
        </div>

        {/* Player card */}
        <div style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          padding: "1.5rem",
          marginBottom: "1.5rem",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Tier color strip */}
          <div style={{ position: "absolute", top: 0, left: 0, width: "3px", height: "100%", background: tier.color, boxShadow: `0 0 12px ${tier.color}88` }} />

          <div style={{ paddingLeft: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
              <div>
                <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 700, fontSize: "1.25rem", color: "var(--fg)", letterSpacing: "0.05em" }}>
                  {user?.firstName} {user?.lastName}
                </h2>
                <p style={{ ...mono, fontSize: "0.75rem", color: "var(--fg-muted)", marginTop: "0.25rem" }}>{user?.usn}</p>
              </div>
              <div style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: "0.7rem",
                fontWeight: 700,
                color: tier.color,
                border: `1px solid ${tier.color}55`,
                padding: "0.35rem 0.75rem",
                textShadow: `0 0 8px ${tier.color}`,
                letterSpacing: "0.15em",
                clipPath: "polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 5px 100%, 0 calc(100% - 5px))",
                background: `${tier.color}15`,
              }}>
                {tier.label}
              </div>
            </div>

            {/* XP bar */}
            <div style={{ marginBottom: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                <span style={{ ...mono, fontSize: "0.7rem", color: "var(--fg-muted)", letterSpacing: "0.1em" }}>MISSION XP</span>
                <span style={{ ...mono, fontSize: "0.7rem", color: "var(--accent)" }}>{solved}/150 · {pct}%</span>
              </div>
              <div className="xp-bar-track">
                <div className="xp-bar-fill progress-bar-fill" style={{ width: `${pct}%` }} />
              </div>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { label: "First Name", value: user?.firstName ?? "—" },
                { label: "Last Name", value: user?.lastName ?? "—" },
                { label: "Email", value: user?.email ?? "—" },
                { label: "LeetCode", value: user?.leetcodeUsername ?? "—" },
              ].map(({ label, value }) => (
                <div key={label} style={{ background: "var(--bg)", border: "1px solid var(--border)", padding: "0.75rem 1rem" }}>
                  <p style={{ ...mono, fontSize: "0.7rem", color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "0.3rem" }}>{label}</p>
                  <p style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.875rem", color: "var(--fg)", fontWeight: 600, letterSpacing: "0.02em" }}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Edit Request */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", padding: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
            <div style={{ width: "6px", height: "6px", background: "var(--gold)", borderRadius: "50%", boxShadow: "0 0 8px var(--gold)" }} />
            <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 700, fontSize: "0.85rem", color: "var(--fg)", letterSpacing: "0.08em" }}>
              REQUEST EDIT CLEARANCE
            </h2>
          </div>
          <p style={{ ...mono, fontSize: "0.7rem", color: "var(--fg-muted)", marginBottom: "1.25rem", lineHeight: 1.7, letterSpacing: "0.04em" }}>
            ◈ Direct profile edits are locked to protect mission integrity.<br />
            Submit a clearance request to the Admin — include what you want changed and why.
          </p>

          <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label htmlFor="req-fields" style={{ ...mono, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--fg-muted)", display: "block", marginBottom: "0.5rem" }}>
                ◈ What do you want to change?
              </label>
              <input
                id="req-fields"
                type="text"
                value={fieldsToChange}
                onChange={e => setFieldsToChange(e.target.value)}
                placeholder="e.g. My LeetCode username"
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor="req-reason" style={{ ...mono, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--fg-muted)", display: "block", marginBottom: "0.5rem" }}>
                ◈ Reason / justification
              </label>
              <textarea
                id="req-reason"
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="e.g. I made a typo when registering..."
                className="input-field"
                rows={3}
                style={{ resize: "vertical" }}
              />
            </div>
            {isDemo && (
              <p style={{ ...mono, fontSize: "0.7rem", color: "var(--fg-muted)" }}>
                Edit requests are disabled in simulation mode.
              </p>
            )}
            <button
              type="submit"
              id="profile-save-btn"
              disabled={saving || !reason.trim() || !fieldsToChange.trim()}
              className="btn-primary"
              style={{ width: "100%", marginTop: "0.25rem" }}
            >
              {saving ? "TRANSMITTING..." : "TRANSMIT REQUEST →"}
            </button>
          </form>
        </div>

        <div style={{ marginTop: "1.5rem" }}>
          <Link to="/dashboard" style={{ ...mono, fontSize: "0.75rem", color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.1em", textDecoration: "underline" }}>
            ← Return to Mission Control
          </Link>
        </div>
      </main>
    </div>
  );
}
