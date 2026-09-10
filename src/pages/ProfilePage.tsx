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

  const mono: React.CSSProperties = { fontFamily: "'JetBrains Mono', monospace" };

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!user || isDemo) return;
    if (!reason.trim() || !fieldsToChange.trim()) {
      toast("Please fill out both fields.", { icon: "–" });
      return;
    }
    setSaving(true);
    try {
      await apiSubmitEditRequest({
        usn: user.usn,
        password: passwordHash,
        reason: reason.trim(),
        fieldsToChange: fieldsToChange.trim(),
      });
      setReason("");
      setFieldsToChange("");
      toast.success("Edit request submitted! Wait for admin approval.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit request.");
    } finally {
      setSaving(false);
    }
  }

  const solved = user?.totalSolved ?? 0;
  const pct = user?.percentage ?? 0;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />
      <main className="page-enter" style={{ maxWidth: "640px", margin: "0 auto", padding: "3rem 1.5rem 5rem" }}>

        {/* Header */}
        <div style={{ marginBottom: "2.5rem", borderBottom: "1px solid var(--border)", paddingBottom: "1.5rem" }}>
          <p style={{ ...mono, fontSize: "0.6rem", color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "0.5rem" }}>
            Account
          </p>
          <h1 className="display-heading" style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", color: "var(--fg)" }}>
            PROFILE.
          </h1>
        </div>

        {/* Stats card */}
        <div style={{ background: "var(--bg-hover)", border: "1px solid var(--border)", padding: "1.5rem", marginBottom: "2rem" }}>
          <p style={{ ...mono, fontSize: "0.55rem", color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "1.25rem" }}>
            Progress Overview
          </p>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "0.5rem", marginBottom: "0.75rem" }}>
            <span style={{ fontFamily: "Barlow Condensed, sans-serif", fontWeight: 900, fontSize: "3.5rem", color: "var(--fg-highlight)", lineHeight: 1 }}>
              {solved}
            </span>
            <span style={{ ...mono, fontSize: "0.7rem", color: "var(--fg-muted)", marginBottom: "0.4rem" }}>/150 solved</span>
            <span style={{ ...mono, fontSize: "0.7rem", color: "var(--fg-muted)", marginBottom: "0.4rem", marginLeft: "auto" }}>{pct}%</span>
          </div>
          <div style={{ height: "2px", background: "var(--border)", overflow: "hidden" }}>
            <div className="progress-bar-fill" style={{ height: "100%", width: `${pct}%`, background: "var(--fg-highlight)" }} />
          </div>
        </div>

        {/* Info grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: "var(--border)", border: "1px solid var(--border)", marginBottom: "2rem" }}>
          {[
            { label: "First Name",  value: user?.firstName ?? "—" },
            { label: "Last Name",   value: user?.lastName ?? "—" },
            { label: "USN",         value: user?.usn ?? "—", mono: true },
            { label: "Email",       value: user?.email ?? "—" },
          ].map(({ label, value, mono: isMono }) => (
            <div key={label} style={{ background: "var(--bg-card)", padding: "1rem 1.25rem" }}>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.52rem", color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.35rem" }}>
                {label}
              </p>
              <p style={{ fontFamily: isMono ? "'JetBrains Mono', monospace" : "Space Grotesk, sans-serif", fontSize: "0.875rem", color: "var(--fg)", fontWeight: 500 }}>
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Edit Request */}
        <div style={{ marginTop: "1rem" }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--fg)", marginBottom: "1rem" }}>
            Request Profile Edit
          </h2>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", color: "var(--fg-muted)", marginBottom: "1.5rem", lineHeight: 1.5 }}>
            To protect the integrity of the checklist, direct profile edits are disabled.
            Submit a request to the Admin specifying what you want to change and why.
          </p>
          <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label htmlFor="req-fields" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--fg-muted)" }}>
                What do you want to change?
              </label>
              <input
                id="req-fields"
                type="text"
                value={fieldsToChange}
                onChange={(e) => setFieldsToChange(e.target.value)}
                placeholder="e.g. My LeetCode Username"
                disabled={isDemo}
                className="input-field"
                style={{
                  display: "block", width: "100%", marginTop: "0.375rem",
                  opacity: isDemo ? 0.4 : 1,
                }}
              />
            </div>
            <div>
              <label htmlFor="req-reason" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--fg-muted)" }}>
                Reason for change
              </label>
              <textarea
                id="req-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. I made a typo when registering..."
                disabled={isDemo}
                className="input-field"
                rows={3}
                style={{
                  display: "block", width: "100%", marginTop: "0.375rem",
                  opacity: isDemo ? 0.4 : 1, resize: "vertical"
                }}
              />
            </div>
            {isDemo && (
              <p style={{ ...mono, fontSize: "0.58rem", color: "var(--fg-muted)", marginTop: "0.35rem" }}>
                Edit requests are disabled in demo mode.
              </p>
            )}
            <button
              type="submit"
              id="profile-save-btn"
              disabled={saving || isDemo || !reason.trim() || !fieldsToChange.trim()}
              className="btn-primary"
              style={{ width: "100%", marginTop: "0.5rem" }}
            >
              {saving ? "Submitting Request…" : "Submit Edit Request"}
            </button>
          </form>
        </div>

        <div style={{ marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border)" }}>
          <Link to="/dashboard" style={{ ...mono, fontSize: "0.62rem", color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.08em", textDecoration: "underline" }}>
            ← Back to Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}
