import { useState } from "react";
import toast from "react-hot-toast";
import { useUser } from "../../context/UserContext";
import { apiChangePassword } from "../../lib/api";
import { sha256 } from "../../lib/crypto";

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
      toast.success("Password updated.");
      handleClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to change password.");
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
      role="dialog" aria-modal="true" aria-labelledby="change-pwd-title"
    >
      {/* Backdrop */}
      <div
        style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.85)" }}
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className="page-enter"
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "420px",
          background: "#000",
          border: "1px solid #1a1a1a",
          padding: "2rem",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.75rem" }}>
          <div>
            <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.6rem", color: "#3d3d3d", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Account
            </p>
            <h2 id="change-pwd-title" style={{ fontSize: "1.25rem", fontWeight: 700, color: "#fff", marginTop: "0.25rem" }}>
              Change Password
            </h2>
          </div>
          <button onClick={handleClose} style={{ color: "#3d3d3d", cursor: "pointer", background: "none", border: "none", fontSize: "1.25rem", lineHeight: 1 }} aria-label="Close">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={labelStyle}>Current Password</label>
            <input id="change-pwd-old" type="password" value={oldPwd} onChange={(e) => setOldPwd(e.target.value)} required placeholder="Current password" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>New Password</label>
            <input id="change-pwd-new" type="password" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} required placeholder="Min 6 characters" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Confirm Password</label>
            <input
              id="change-pwd-confirm"
              type="password"
              value={confirmPwd}
              onChange={(e) => setConfirmPwd(e.target.value)}
              required
              placeholder="Repeat new password"
              style={{ ...inputStyle, borderColor: confirmPwd && confirmPwd !== newPwd ? "#5a5a5a" : "#2a2a2a" }}
            />
            {confirmPwd && confirmPwd !== newPwd && (
              <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.6rem", color: "#5a5a5a", marginTop: "0.35rem" }}>
                Passwords do not match
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
            {loading ? "Updating…" : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
