import { useState } from "react";
import toast from "react-hot-toast";
import { useUser } from "../../context/UserContext";
import { apiChangePassword } from "../../lib/api";
import { sha256 } from "../../lib/crypto";
import { Eye, EyeOff } from "lucide-react";

interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({ open, onClose }: ChangePasswordModalProps) {
  const { user, passwordHash } = useUser();
  const [oldPwd, setOldPwd]       = useState("");
  const [newPwd, setNewPwd]       = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [loading, setLoading]     = useState(false);
  
  const [showOldPwd, setShowOldPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  function handleClose() {
    setOldPwd(""); setNewPwd(""); setConfirmPwd("");
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    if (newPwd.length < 6) { toast.error("Password must be at least 6 characters."); return; }
    if (newPwd !== confirmPwd) { toast.error("Passwords do not match."); return; }

    setLoading(true);
    try {
      const oldHash = await sha256(oldPwd);
      const newHash = await sha256(newPwd);
      if (oldHash !== passwordHash) { toast.error("Current password is incorrect."); return; }
      await apiChangePassword({ usn: user.usn, oldPassword: oldHash, newPassword: newHash });
      toast.success("ACCESS KEY UPDATED.");
      handleClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to change password.");
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}
      role="dialog" aria-modal="true" aria-labelledby="change-pwd-title"
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
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.75rem" }}>
          <div>
            <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.75rem", color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              &gt;_ ACCOUNT SECURITY
            </p>
            <h2 id="change-pwd-title" style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "1.25rem", fontWeight: 700, color: "var(--fg)", marginTop: "0.25rem", textShadow: "0 0 8px var(--accent-glow)" }}>
              RECONFIGURE KEY
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

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div>
            <label style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--fg-muted)", display: "block", marginBottom: "0.5rem" }}>◈ Current Key</label>
            <div style={{ position: "relative" }}>
              <input id="change-pwd-old" type={showOldPwd ? "text" : "password"} value={oldPwd} onChange={(e) => setOldPwd(e.target.value)} required placeholder="Current access key" className="input-field" style={{ paddingRight: "2.5rem" }} />
              <button
                type="button"
                onClick={() => setShowOldPwd(!showOldPwd)}
                style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--fg-muted)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: "0.25rem" }}
              >
                {showOldPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div>
            <label style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--fg-muted)", display: "block", marginBottom: "0.5rem" }}>◈ New Key</label>
            <div style={{ position: "relative" }}>
              <input id="change-pwd-new" type={showNewPwd ? "text" : "password"} value={newPwd} onChange={(e) => setNewPwd(e.target.value)} required placeholder="Min 6 characters" className="input-field" style={{ paddingRight: "2.5rem" }} />
              <button
                type="button"
                onClick={() => setShowNewPwd(!showNewPwd)}
                style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--fg-muted)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: "0.25rem" }}
              >
                {showNewPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div>
            <label style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--fg-muted)", display: "block", marginBottom: "0.5rem" }}>◈ Verify Key</label>
            <div style={{ position: "relative" }}>
              <input
                id="change-pwd-confirm"
                type={showConfirmPwd ? "text" : "password"}
                value={confirmPwd}
                onChange={(e) => setConfirmPwd(e.target.value)}
                required
                placeholder="Repeat new access key"
                className="input-field"
                style={{ paddingRight: "2.5rem", borderColor: confirmPwd && confirmPwd !== newPwd ? "var(--danger)" : undefined }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--fg-muted)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: "0.25rem" }}
              >
                {showConfirmPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {confirmPwd && confirmPwd !== newPwd && (
              <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.75rem", color: "var(--danger)", marginTop: "0.35rem" }}>
                KEYS DO NOT MATCH
              </p>
            )}
          </div>

          <button
            type="submit"
            id="change-pwd-submit"
            disabled={loading || !oldPwd || !newPwd || newPwd !== confirmPwd}
            className="btn-primary"
            style={{ marginTop: "0.5rem", width: "100%" }}
          >
            {loading ? "TRANSMITTING..." : "OVERRIDE KEY →"}
          </button>
        </form>
      </div>
    </div>
  );
}
