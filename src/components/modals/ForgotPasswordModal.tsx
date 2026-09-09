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
      toast.success("Reset email sent!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "#000",
    border: "1px solid #2a2a2a",
    color: "#fff",
    padding: "0.625rem 0.875rem",
    fontSize: "0.875rem",
    fontFamily: "Space Grotesk, sans-serif",
    outline: "none",
    marginTop: "0.375rem",
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "JetBrains Mono, monospace",
    fontSize: "0.6rem",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: "#3d3d3d",
  };

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}
      role="dialog" aria-modal="true" aria-labelledby="forgot-pwd-title"
    >
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.85)" }} onClick={handleClose} />

      <div
        className="page-enter"
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "380px",
          background: "#000",
          border: "1px solid #1a1a1a",
          padding: "2rem",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.75rem" }}>
          <div>
            <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.6rem", color: "#3d3d3d", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Account Recovery
            </p>
            <h2 id="forgot-pwd-title" style={{ fontSize: "1.25rem", fontWeight: 700, color: "#fff", marginTop: "0.25rem" }}>
              Reset Password
            </h2>
          </div>
          <button onClick={handleClose} style={{ color: "#3d3d3d", cursor: "pointer", background: "none", border: "none", fontSize: "1.25rem", lineHeight: 1 }}>×</button>
        </div>

        {done ? (
          <div style={{ textAlign: "center", padding: "1rem 0" }}>
            <p style={{ fontFamily: "Barlow Condensed, sans-serif", fontWeight: 900, fontSize: "3rem", color: "#fff", lineHeight: 1 }}>
              SENT.
            </p>
            <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.7rem", color: "#5a5a5a", marginTop: "0.75rem", lineHeight: 1.6 }}>
              Check your inbox for a temporary password. Log in and update it immediately.
            </p>
            <button onClick={handleClose} className="btn-primary" style={{ marginTop: "1.5rem", width: "100%" }}>
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={labelStyle}>USN</label>
              <input
                id="forgot-pwd-usn"
                type="text"
                value={usn}
                onChange={(e) => setUsn(e.target.value.toUpperCase())}
                required
                placeholder="1BM22CS001"
                style={{ ...inputStyle, fontFamily: "JetBrains Mono, monospace", textTransform: "uppercase" }}
              />
            </div>
            <div>
              <label style={labelStyle}>Registered Email</label>
              <input
                id="forgot-pwd-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@gmail.com"
                style={inputStyle}
              />
            </div>
            <button
              type="submit"
              id="forgot-pwd-submit"
              disabled={loading || !usn || !email}
              className="btn-primary"
              style={{ marginTop: "0.5rem", width: "100%" }}
            >
              {loading ? "Sending…" : "Send Reset Email"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
