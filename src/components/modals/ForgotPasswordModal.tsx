import { useState } from "react";
import toast from "react-hot-toast";
import { apiResetPassword } from "../../lib/api";

interface ForgotPasswordModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ForgotPasswordModal({ open, onClose }: ForgotPasswordModalProps) {
  const [usn, setUsn]     = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone]   = useState(false);

  function handleClose() { setUsn(""); setEmail(""); setDone(false); onClose(); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await apiResetPassword({ usn: usn.toUpperCase(), email });
      setDone(true);
      toast.success("RESET PROTOCOL INITIATED.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to initiate reset.");
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}
      role="dialog" aria-modal="true" aria-labelledby="forgot-pwd-title"
    >
      {/* Backdrop */}
      <div 
        style={{ position: "absolute", inset: 0, background: "rgba(2, 11, 24, 0.85)", backdropFilter: "blur(4px)" }} 
        onClick={handleClose} 
      />

      {/* Modal */}
      <div
        className="page-enter"
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "420px",
          background: "var(--bg-card)",
          border: "1px solid var(--accent)",
          padding: "2rem",
          boxShadow: "0 0 20px var(--accent-glow)",
          clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.75rem" }}>
          <div>
            <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.75rem", color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              &gt;_ RECOVERY SYSTEM
            </p>
            <h2 id="forgot-pwd-title" style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "1.25rem", fontWeight: 700, color: "var(--fg)", marginTop: "0.25rem", textShadow: "0 0 8px var(--accent-glow)" }}>
              INITIATE RESET
            </h2>
          </div>
          <button 
            onClick={handleClose} 
            style={{ 
              color: "var(--fg-muted)", cursor: "pointer", background: "none", border: "none", 
              fontSize: "2.5rem", lineHeight: 0.8, fontFamily: "'Share Tech Mono', monospace",
              transition: "color 150ms, text-shadow 150ms"
            }} 
            aria-label="Close"
            onMouseEnter={(e) => { e.currentTarget.style.color = "var(--danger)"; e.currentTarget.style.textShadow = "0 0 8px var(--danger)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "var(--fg-muted)"; e.currentTarget.style.textShadow = "none"; }}
          >
            ×
          </button>
        </div>

        {done ? (
          <div style={{ textAlign: "center", padding: "1rem 0" }}>
            <p style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 900, fontSize: "3rem", color: "var(--green)", lineHeight: 1, textShadow: "0 0 12px var(--green-glow)" }}>
              SENT.
            </p>
            <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.75rem", color: "var(--fg-muted)", marginTop: "0.75rem", lineHeight: 1.6 }}>
              Check your inbox for a temporary access key. Log in and reconfigure it immediately.
            </p>
            <button onClick={handleClose} className="btn-primary" style={{ marginTop: "1.5rem", width: "100%" }}>
              DISMISS
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <label style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--fg-muted)", display: "block", marginBottom: "0.5rem" }}>
                ◈ Player ID (USN)
              </label>
              <input
                id="forgot-pwd-usn"
                type="text"
                value={usn}
                onChange={(e) => setUsn(e.target.value.toUpperCase())}
                required
                placeholder="2VDXXCSXXX"
                className="input-field mono"
              />
            </div>
            <div>
              <label style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--fg-muted)", display: "block", marginBottom: "0.5rem" }}>
                ◈ Registered Email
              </label>
              <input
                id="forgot-pwd-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@gmail.com"
                className="input-field"
              />
            </div>
            <button
              type="submit"
              id="forgot-pwd-submit"
              disabled={loading || !usn || !email}
              className="btn-primary"
              style={{ marginTop: "0.5rem", width: "100%" }}
            >
              {loading ? "TRANSMITTING..." : "SEND RESET KEY →"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
