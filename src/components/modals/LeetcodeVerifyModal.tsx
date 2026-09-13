import { useState } from "react";
import toast from "react-hot-toast";
import { useUser } from "../../context/UserContext";
import { apiUpdateProfile } from "../../lib/api";

interface LeetcodeVerifyModalProps {
  open: boolean;
  onSuccess: (newUsername: string) => void;
}

export default function LeetcodeVerifyModal({ open, onSuccess }: LeetcodeVerifyModalProps) {
  const { user, passwordHash } = useUser();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    const trimmed = username.trim();
    if (!trimmed) return;

    setLoading(true);
    const toastId = toast.loading("Verifying LeetCode username...");
    try {
      // 1. Verify with API
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
      const lcRes = await fetch(`https://alfa-leetcode-api.onrender.com/${trimmed}`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      if (lcRes.ok) {
        const lcData = await lcRes.json();
        if (lcData.errors && lcData.errors.length > 0) {
          toast.error("LeetCode user does not exist. Please check your username.", { id: toastId });
          setLoading(false);
          return;
        }
      }

      // 2. Update profile in GAS backend
      toast.loading("Updating profile...", { id: toastId });
      await apiUpdateProfile({
        usn: user.usn,
        password: passwordHash,
        leetcodeUsername: trimmed
      });

      toast.success("LeetCode username updated successfully!", { id: toastId });
      onSuccess(trimmed);
      
    } catch (err: any) {
      if (err.name === 'AbortError') {
         toast.error("Verification timed out. Please try again later.", { id: toastId });
      } else {
         toast.error("Verification failed (API unavailable). Please try again later.", { id: toastId });
      }
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}
      role="dialog" aria-modal="true" aria-labelledby="verify-lc-title"
    >
      {/* Backdrop */}
      <div style={{ position: "absolute", inset: 0, background: "rgba(2, 11, 24, 0.95)", backdropFilter: "blur(8px)" }} />

      {/* Modal */}
      <div
        className="page-enter"
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "450px",
          background: "var(--bg-card)",
          border: "1px solid var(--accent)",
          padding: "2rem",
          boxShadow: "0 0 30px var(--accent-glow)",
          clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
        }}
      >
        <div style={{ marginBottom: "1.75rem" }}>
          <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.75rem", color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            &gt;_ MISSION CRITICAL
          </p>
          <h2 id="verify-lc-title" style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "1.25rem", fontWeight: 700, color: "var(--fg)", marginTop: "0.25rem", textShadow: "0 0 8px var(--accent-glow)", lineHeight: 1.2 }}>
            INVALID LEETCODE ID DETECTED
          </h2>
          <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.8rem", color: "var(--fg-muted)", marginTop: "1rem", lineHeight: 1.6 }}>
            The LeetCode username associated with your account could not be verified. To proceed, please enter your exact, correct LeetCode username.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div>
            <label style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--fg-muted)", display: "block", marginBottom: "0.5rem" }}>
              ◈ Correct LeetCode Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="e.g. john_doe"
              className="input-field"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !username.trim()}
            className="btn-primary"
            style={{ marginTop: "0.5rem", width: "100%" }}
          >
            {loading ? "VERIFYING..." : "VERIFY & OVERRIDE →"}
          </button>
        </form>
      </div>
    </div>
  );
}
