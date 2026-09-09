import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useUser } from "../context/UserContext";
import { apiLogin } from "../lib/api";
import { sha256 } from "../lib/crypto";
import ForgotPasswordModal from "../components/modals/ForgotPasswordModal";

import { DEMO_USN, DEMO_PASSWORD, DEMO_USER, DEMO_SOLVED_ARRAY } from "../lib/demo";

export default function LoginPage() {
  const { login } = useUser();
  const navigate  = useNavigate();

  const [usn, setUsn]               = useState("");
  const [password, setPassword]     = useState("");
  const [loading, setLoading]       = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!usn.trim() || !password) return;
    setLoading(true);

    try {
      const usnUpper = usn.toUpperCase();

      /* ── Demo bypass (USN: 2VD / Password: 2vd) ──────────── */
      if (usnUpper === DEMO_USN && password === DEMO_PASSWORD) {
        login(DEMO_USER, DEMO_SOLVED_ARRAY, "__demo__");
        toast.success("Welcome, Demo User!");
        navigate("/dashboard", { replace: true });
        return;
      }

      /* ── Real GAS auth ────────────────────────────────────── */
      const hash = await sha256(password);
      const data = await apiLogin({ usn: usnUpper, password: hash });
      login(data.user, data.solvedArray, hash);
      toast.success(`Welcome back, ${data.user.firstName}.`);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  }


  /* ─── shared input style ─── */
  const inp: React.CSSProperties = {
    display: "block", width: "100%", marginTop: "0.4rem",
    background: "#000", border: "1px solid #333", color: "#fff",
    padding: "0.65rem 0.9rem", fontSize: "0.9rem",
    fontFamily: "'Space Grotesk', sans-serif", outline: "none",
    transition: "border-color 120ms ease",
  };
  const lbl: React.CSSProperties = {
    fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem",
    textTransform: "uppercase" as const, letterSpacing: "0.12em", color: "#777",
  };

  return (
    <>
      {/* ── Full-screen split layout ── */}
      <div
        className="page-enter"
        style={{
          minHeight: "100vh",
          background: "#000",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
        }}
      >
        {/* ══════════ LEFT — Hero ══════════════════════════════ */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "2rem 2.5rem",
            borderRight: "1px solid #111",
          }}
        >
          {/* Brand tag — identical to reference image */}
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.7rem",
              fontWeight: 700,
              color: "#fff",
              lineHeight: 1.35,
              letterSpacing: "0.02em",
            }}
          >
            &lt;THE<br />
            SOFTWARE<br />
            SOCIETY/&gt;]
          </div>

          {/* Main hero text */}
          <div>
            <h1
              style={{
                fontFamily: "'Barlow Condensed', 'Space Grotesk', sans-serif",
                fontWeight: 900,
                textTransform: "uppercase",
                fontSize: "clamp(3.75rem, 8.5vw, 7rem)",
                lineHeight: 0.93,
                color: "#fff",
                letterSpacing: "-0.01em",
              }}
            >
              THE<br />
              SOFTWARE<br />
              SOCIETY.
            </h1>

            {/* Tagline */}
            <p
              style={{
                marginTop: "1.5rem",
                fontSize: "1rem",
                fontWeight: 700,
                color: "#fff",
                letterSpacing: "0.01em",
              }}
            >
              Track. Solve. Lead.
            </p>

            {/* Description — short, clearly readable */}
            <p
              style={{
                marginTop: "0.6rem",
                fontSize: "0.82rem",
                color: "#888",
                lineHeight: 1.65,
                maxWidth: "300px",
              }}
            >
              A selective collective of engineers pushing the boundaries of algorithmic excellence.
            </p>

            {/* CTA-style register link styled like the reference "Join Community" button */}
            <Link
              to="/register"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                marginTop: "1.75rem",
                background: "#fff",
                color: "#000",
                fontWeight: 700,
                fontSize: "0.8rem",
                letterSpacing: "0.06em",
                padding: "0.7rem 1.5rem",
                border: "1px solid #fff",
                cursor: "pointer",
                textDecoration: "none",
                transition: "background 120ms ease, color 120ms ease",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.background = "transparent";
                el.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.background = "#fff";
                el.style.color = "#000";
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
              </svg>
              Join Community
            </Link>
          </div>

          {/* Spacer for bottom alignment */}
          <div />
        </div>

        {/* ══════════ RIGHT — Sign-in form ═════════════════════ */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2.5rem",
          }}
        >
          <div style={{ width: "100%", maxWidth: "360px" }}>

            {/* Logo box */}
            <div
              style={{
                width: "48px",
                height: "48px",
                border: "1px solid #222",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1.75rem",
                overflow: "hidden",
              }}
            >
              <img
                src="/logo.png"
                alt="Club Logo"
                className="h-10 w-auto object-contain"
                onError={(e) => {
                  const el = e.target as HTMLImageElement;
                  el.style.display = "none";
                  el.parentElement!.innerHTML =
                    '<span style="font-family:\'JetBrains Mono\',monospace;font-size:0.6rem;color:#fff;font-weight:700;line-height:1.2;text-align:center;">TSS</span>';
                }}
              />
            </div>

            <h2
              style={{ fontSize: "1.5rem", fontWeight: 700, color: "#fff", marginBottom: "0.35rem" }}
            >
              Sign In
            </h2>
            <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.65rem", color: "#555", marginBottom: "2rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Enter your credentials
            </p>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
              {/* USN */}
              <div>
                <label htmlFor="login-usn" style={lbl}>USN</label>
                <input
                  id="login-usn" type="text" value={usn}
                  onChange={(e) => setUsn(e.target.value.toUpperCase())}
                  required autoComplete="username" placeholder="e.g. 1BM22CS001"
                  style={{ ...inp, fontFamily: "'JetBrains Mono',monospace", textTransform: "uppercase" }}
                  onFocus={(e) => (e.target.style.borderColor = "#fff")}
                  onBlur={(e) => (e.target.style.borderColor = "#333")}
                />
              </div>

              {/* Password */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <label htmlFor="login-password" style={lbl}>Password</label>
                  <button
                    type="button"
                    onClick={() => setShowForgot(true)}
                    style={{ ...lbl, background: "none", border: "none", cursor: "pointer", color: "#555", transition: "color 100ms" }}
                    onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#fff")}
                    onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#555")}
                  >
                    Forgot?
                  </button>
                </div>
                <input
                  id="login-password" type="password" value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required autoComplete="current-password" placeholder="••••••••"
                  style={inp}
                  onFocus={(e) => (e.target.style.borderColor = "#fff")}
                  onBlur={(e) => (e.target.style.borderColor = "#333")}
                />
              </div>

              {/* Submit */}
              <button
                type="submit" id="login-submit" disabled={loading}
                className="btn-primary"
                style={{ width: "100%", marginTop: "0.25rem" }}
              >
                {loading ? "Signing in…" : "Sign In →"}
              </button>
            </form>

            <p style={{ marginTop: "1.5rem", fontFamily: "'JetBrains Mono',monospace", fontSize: "0.65rem", color: "#555", textAlign: "center" }}>
              No account?{" "}
              <Link
                to="/register"
                style={{ color: "#aaa", textDecoration: "underline", transition: "color 100ms" }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#fff")}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#aaa")}
              >
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>

      <ForgotPasswordModal open={showForgot} onClose={() => setShowForgot(false)} />
    </>
  );
}
