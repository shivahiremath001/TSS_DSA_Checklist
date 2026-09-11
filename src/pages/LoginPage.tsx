import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useUser } from "../context/UserContext";
import { apiLogin } from "../lib/api";
import { sha256 } from "../lib/crypto";
import { Eye, EyeOff } from "lucide-react";
import ForgotPasswordModal from "../components/modals/ForgotPasswordModal";
import SnakeGameModal from "../components/modals/SnakeGameModal";
import { DEMO_USN, DEMO_PASSWORD, DEMO_USER, DEMO_SOLVED_ARRAY } from "../lib/demo";

export default function LoginPage() {
  const { login } = useUser();
  const navigate = useNavigate();
  const [usn, setUsn] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSnakeGame, setShowSnakeGame] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!usn.trim() || !password) return;
    setLoading(true);
    try {
      const usnUpper = usn.toUpperCase();

      if (usnUpper === "ADMIN" && password === "The*Software*Society@581329") {
        login({ slNo: 0, firstName: "Admin", lastName: "User", usn: "ADMIN", email: "admin@klsvdit.edu.in", leetcodeUsername: "admin", totalSolved: 0, percentage: 0 }, Array(150).fill(0), "The*Software*Society@581329");
        toast.success("ACCESS GRANTED. Welcome, Commander.");
        navigate("/admin-dashboard", { replace: true });
        return;
      }
      if (usnUpper === DEMO_USN && password === DEMO_PASSWORD) {
        login(DEMO_USER, DEMO_SOLVED_ARRAY, "__demo__");
        toast.success("DEMO MODE ACTIVATED.");
        navigate("/dashboard", { replace: true });
        return;
      }
      const hash = await sha256(password);
      const data = await apiLogin({ usn: usnUpper, password: hash });
      login(data.user, data.solvedArray, hash);
      toast.success(`IDENTITY VERIFIED. Welcome, ${data.user.firstName}.`);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "ACCESS DENIED.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="page-enter min-h-screen bg-[var(--bg)] grid grid-cols-1 lg:grid-cols-2">

        {/* ══ LEFT – Hero Panel ══════════════════════════════════ */}
        <div className="flex flex-col justify-center lg:justify-between gap-6 lg:gap-0 p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-[var(--border)] relative overflow-hidden">
          {/* Corner decoration */}
          <div style={{ position: "absolute", top: 0, left: 0, width: "120px", height: "120px", borderRight: "1px solid var(--border-glow)", borderBottom: "1px solid var(--border-glow)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: 0, right: 0, width: "80px", height: "80px", borderLeft: "1px solid var(--border-glow)", borderTop: "1px solid var(--border-glow)", pointerEvents: "none" }} />

          {/* Brand */}
          <div 
            className="brand-tag lg:pt-3 lg:pl-3 lg:pr-2 lg:pb-2" 
            style={{ fontSize: "0.8rem", cursor: "pointer" }}
            onClick={() => setShowSnakeGame(true)}
            title="Access System Override"
          >
            &lt;The<br />Software<br />Society/&gt;
          </div>

          {/* Hero */}
          <div>
            <p className="hidden lg:block" style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.75rem", color: "var(--fg-muted)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1rem" }}>
              // MISSION ACTIVE
            </p>
            <h1 style={{
              fontFamily: "'Orbitron', sans-serif",
              fontWeight: 900,
              fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
              lineHeight: 1.1,
              wordBreak: "break-word",
              color: "var(--fg)",
              textShadow: "0 0 30px rgba(0,212,255,0.35), 0 0 80px rgba(0,212,255,0.1)",
            }}>
              CHALLENGE<br />
              <span style={{ color: "var(--accent)", textShadow: "0 0 30px var(--accent), 0 0 80px var(--accent-glow)" }}>150</span>
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "1.5rem" }}>
              <div style={{ height: "1px", width: "2rem", background: "var(--accent)", boxShadow: "0 0 6px var(--accent)" }} />
              <p style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "1rem", fontWeight: 600, color: "var(--fg-muted)", letterSpacing: "0.1em" }}>
                TRACK · SOLVE · DOMINATE
              </p>
            </div>
            <p className="hidden lg:block" style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.95rem", color: "#1d3a52", lineHeight: 1.7, maxWidth: "280px", marginTop: "1rem" }}>
              150 algorithmic missions. One leaderboard. Prove your skill.
            </p>

            {/* XP progress teaser */}
            <div className="hidden lg:flex" style={{ marginTop: "2rem", flexDirection: "column", gap: "0.4rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.7rem", color: "var(--fg-muted)", letterSpacing: "0.1em" }}>CHALLENGE PROGRESS</span>
                <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.7rem", color: "var(--accent)" }}>101 / 150</span>
              </div>
              <div className="xp-bar-track">
                <div style={{ height: "100%", width: "70%", background: "linear-gradient(90deg, var(--accent-dim), var(--accent))", boxShadow: "0 0 8px var(--accent)" }} />
              </div>
            </div>
          </div>

          {/* Bottom tag */}
          <p className="hidden lg:block" style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.7rem", color: "#0d2035", letterSpacing: "0.12em" }}>
            © THE SOFTWARE SOCIETY · KLS VDIT
          </p>
        </div>

        {/* ══ RIGHT – Login Form ══════════════════════════════════ */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
        }}>
          <div style={{ width: "100%", maxWidth: "380px" }}>
            <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.75rem", color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: "0.75rem" }}>
              &gt;_ AUTHENTICATE
            </p>
            <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 700, fontSize: "1.75rem", color: "var(--fg)", marginBottom: "0.35rem", letterSpacing: "0.05em" }}>
              SIGN IN
            </h2>
            <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.75rem", color: "var(--fg-muted)", marginBottom: "2.5rem", letterSpacing: "0.08em" }}>
              Enter your credentials to access the system
            </p>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div>
                <label htmlFor="login-usn" style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--fg-muted)", display: "block", marginBottom: "0.5rem" }}>
                  ◈ Player ID (USN)
                </label>
                <input
                  id="login-usn"
                  type="text"
                  value={usn}
                  onChange={e => setUsn(e.target.value.toUpperCase())}
                  required autoComplete="username"
                  placeholder="e.g. 2VDXXCSXXX"
                  className="input-field mono"
                />
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <label htmlFor="login-password" style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--fg-muted)" }}>
                    ◈ Access Key
                  </label>
                  <button type="button" onClick={() => setShowForgot(true)} style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.7rem", background: "none", border: "none", color: "var(--fg-muted)", cursor: "pointer", letterSpacing: "0.08em", textDecoration: "underline", textTransform: "uppercase" }}>
                    Forgot?
                  </button>
                </div>
                <div style={{ position: "relative" }}>
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required autoComplete="current-password"
                    placeholder="••••••••••"
                    className="input-field"
                    style={{ paddingRight: "2.5rem" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "0.75rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      color: "var(--fg-muted)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "0.25rem",
                    }}
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button type="submit" id="login-submit" disabled={loading} className="btn-primary" style={{ width: "100%", marginTop: "0.5rem" }}>
                {loading ? "AUTHENTICATING..." : "ENTER SYSTEM →"}
              </button>
            </form>

            <p style={{ marginTop: "2rem", fontFamily: "'Share Tech Mono', monospace", fontSize: "0.75rem", color: "var(--fg-muted)", textAlign: "center", letterSpacing: "0.06em" }}>
              No account?{" "}
              <Link to="/register" style={{ color: "var(--accent)", textDecoration: "underline", textShadow: "0 0 6px var(--accent)" }}>
                Enlist here
              </Link>
            </p>
          </div>
        </div>
      </div>
      <ForgotPasswordModal open={showForgot} onClose={() => setShowForgot(false)} />
      <SnakeGameModal open={showSnakeGame} onClose={() => setShowSnakeGame(false)} />
    </>
  );
}
