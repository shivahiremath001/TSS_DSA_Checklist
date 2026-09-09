import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { apiSendOtp, apiVerifyOtp } from "../lib/api";
import { sha256 } from "../lib/crypto";

// ─── Shared styles ────────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  display: "block", width: "100%", marginTop: "0.375rem",
  background: "#000", border: "1px solid #2a2a2a", color: "#fff",
  padding: "0.625rem 0.875rem", fontSize: "0.875rem",
  fontFamily: "Space Grotesk, sans-serif", outline: "none",
  transition: "border-color 120ms ease",
};

const labelStyle: React.CSSProperties = {
  fontFamily: "JetBrains Mono, monospace", fontSize: "0.75rem", fontWeight: 700,
  textTransform: "uppercase" as const, letterSpacing: "0.12em", color: "var(--fg-muted)",
};

// ─── Step indicator ────────────────────────────────────────────────────────────

function StepIndicator({ step }: { step: 1 | 2 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "2rem" }}>
      {[1, 2].map((s) => {
        const done    = step > s;
        const active  = step === s;
        return (
          <div key={s} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div
              style={{
                width: "24px", height: "24px", borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: done ? "#fff" : active ? "transparent" : "transparent",
                border: done ? "none" : active ? "1.5px solid #fff" : "1.5px solid #2a2a2a",
                transition: "all 200ms ease",
              }}
            >
              {done ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.6rem", color: active ? "#fff" : "#333" }}>
                  {s}
                </span>
              )}
            </div>
            <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.6rem", color: active ? "#fff" : done ? "#4ade80" : "#333", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              {s === 1 ? "Your Details" : "Verify Email"}
            </span>
            {s === 1 && (
              <div style={{ width: "2rem", height: "1px", background: step > 1 ? "#fff" : "#1a1a1a", margin: "0 0.25rem", transition: "background 300ms ease" }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Countdown hook ───────────────────────────────────────────────────────────

function useCountdown(seconds: number, active: boolean) {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    if (!active) return;
    setRemaining(seconds);
    const id = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) { clearInterval(id); return 0; }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [active, seconds]);

  return remaining;
}

// ─── OTP Input ───────────────────────────────────────────────────────────────

function OtpInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  function handleKey(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !value[i] && i > 0) {
      refs.current[i - 1]?.focus();
    }
  }

  function handleChange(i: number, e: React.ChangeEvent<HTMLInputElement>) {
    const digit = e.target.value.replace(/\D/, "").slice(-1);
    const arr   = value.split("");
    arr[i]      = digit;
    const next  = arr.join("").slice(0, 6);
    onChange(next.padEnd(6, "").slice(0, 6).replace(/ /g, ""));
    if (digit && i < 5) refs.current[i + 1]?.focus();
  }

  function handlePaste(e: React.ClipboardEvent) {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      onChange(pasted);
      refs.current[5]?.focus();
    }
    e.preventDefault();
  }

  return (
    <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] ?? ""}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKey(i, e)}
          onPaste={handlePaste}
          autoFocus={i === 0}
          style={{
            width: "44px", height: "52px",
            textAlign: "center", fontSize: "1.25rem", fontWeight: 700,
            fontFamily: "JetBrains Mono, monospace",
            background: "#000", color: "#fff",
            border: `1.5px solid ${value[i] ? "#fff" : "#2a2a2a"}`,
            outline: "none",
            transition: "border-color 120ms ease",
            caretColor: "transparent",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#fff")}
          onBlur={(e) => (e.target.style.borderColor = value[i] ? "#fff" : "#2a2a2a")}
        />
      ))}
    </div>
  );
}

// ─── Step 1 form state ────────────────────────────────────────────────────────

interface FormState {
  firstName: string; lastName: string; usn: string;
  email: string; leetcodeUsername: string;
  password: string; confirmPassword: string;
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function RegisterPage() {
  const navigate = useNavigate();

  // Step 1 state
  const [form, setForm] = useState<FormState>({
    firstName: "", lastName: "", usn: "", email: "",
    leetcodeUsername: "", password: "", confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  // Step 2 state
  const [step, setStep]         = useState<1 | 2>(1);
  const [otp, setOtp]           = useState("");
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const [resendLockedUntil, setResendLockedUntil] = useState<number>(0);
  const [resendSecsLeft, setResendSecsLeft] = useState(0);
  const remaining = useCountdown(180, timerActive); // 3 min OTP expiry

  // Format mm:ss for OTP expiry
  const mins = String(Math.floor(remaining / 60)).padStart(2, "0");
  const secs = String(remaining % 60).padStart(2, "0");
  const expired = remaining === 0;

  // Resend cooldown: 15 min countdown shown on button
  useEffect(() => {
    if (resendLockedUntil === 0) return;
    const id = setInterval(() => {
      const left = Math.max(0, Math.ceil((resendLockedUntil - Date.now()) / 1000));
      setResendSecsLeft(left);
      if (left === 0) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, [resendLockedUntil]);

  const set = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = field === "usn" ? e.target.value.toUpperCase() : e.target.value;
    setForm((p) => ({ ...p, [field]: val }));
  };

  const usnValid = /^2VD\d{2}[A-Z]{2}\d{3}$/.test(form.usn);
  const emailExpected = `${form.usn.toLowerCase()}@klsvdit.edu.in`;
  const emailValid = form.email.trim().toLowerCase() === emailExpected;
  const pwdMatch = form.password === form.confirmPassword;

  // ── Step 1 submit — send OTP ──────────────────────────────────
  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!usnValid) { toast.error("Invalid USN format. Must start with 2VD (e.g. 2VD23CS065)"); return; }
    if (!emailValid) { toast.error(`Email must exactly match your USN: ${emailExpected}`); return; }
    if (form.password.length < 6) { toast.error("Password must be at least 6 characters."); return; }
    if (!pwdMatch) { toast.error("Passwords do not match."); return; }

    setLoading(true);
    try {
      const hash = await sha256(form.password);
      await apiSendOtp({
        firstName:        form.firstName.trim(),
        lastName:         form.lastName.trim(),
        usn:              form.usn,
        email:            form.email.trim().toLowerCase(),
        leetcodeUsername: form.leetcodeUsername.trim(),
        password:         hash,
      });
      toast.success(`Verification code sent to ${form.email.trim().toLowerCase()}`);
      setOtp("");
      setStep(2);
      setTimerActive(false);
      // start both timers
      setTimeout(() => setTimerActive(true), 50);
      setResendLockedUntil(Date.now() + 15 * 60 * 1000); // 15-min resend lock
      setResendSecsLeft(15 * 60);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  }

  // ── Step 2 — verify OTP & complete registration ───────────────
  async function handleVerify() {
    if (otp.replace(/\s/g, "").length < 6) {
      toast.error("Enter the 6-digit code.");
      return;
    }
    if (expired) {
      toast.error("OTP expired. Please resend a new code.");
      return;
    }
    setVerifying(true);
    try {
      await apiVerifyOtp({ usn: form.usn, otp: otp.trim() });
      toast.success("Account created! You can now sign in.");
      navigate("/login", { replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Verification failed.");
    } finally {
      setVerifying(false);
    }
  }

  // ── Resend OTP ────────────────────────────────────────────────
  async function handleResend() {
    setResending(true);
    try {
      const hash = await sha256(form.password);
      await apiSendOtp({
        firstName:        form.firstName.trim(),
        lastName:         form.lastName.trim(),
        usn:              form.usn,
        email:            form.email.trim().toLowerCase(),
        leetcodeUsername: form.leetcodeUsername.trim(),
        password:         hash,
      });
      toast.success("New code sent!");
      setOtp("");
      setTimerActive(false);
      setTimeout(() => setTimerActive(true), 50);
      setResendLockedUntil(Date.now() + 15 * 60 * 1000);
      setResendSecsLeft(15 * 60);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to resend OTP.");
    } finally {
      setResending(false);
    }
  }

  function inputField(
    id: string, label: string, key: keyof FormState,
    type = "text", mono = false, placeholder = ""
  ) {
    return (
      <div>
        <label htmlFor={id} style={labelStyle}>{label}</label>
        <input
          id={id} type={type} value={form[key]} onChange={set(key)}
          required placeholder={placeholder}
          style={{ ...inputStyle, fontFamily: mono ? "JetBrains Mono, monospace" : inputStyle.fontFamily }}
          onFocus={(e) => (e.target.style.borderColor = "#fff")}
          onBlur={(e) => (e.target.style.borderColor = "#2a2a2a")}
        />
      </div>
    );
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div
      className="page-enter"
      style={{ minHeight: "100vh", background: "#000", display: "flex", alignItems: "center", justifyContent: "center", padding: "3rem 1.5rem" }}
    >
      <div style={{ width: "100%", maxWidth: "480px" }}>

        {/* Header */}
        <div style={{ marginBottom: "2.5rem" }}>
          <div className="brand-tag" style={{ marginBottom: "1.25rem" }}>
            &lt;TSS DSA TRACKER/&gt;]
          </div>
          <h1
            className="display-heading"
            style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", color: "#fff", lineHeight: "1" }}
          >
            JOIN THE<br />SOCIETY.
          </h1>
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem",
              color: "#777", marginTop: "0.75rem", textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            Create your account to get started
          </p>
        </div>

        {/* Divider */}
        <div style={{ height: "1px", background: "#1a1a1a", marginBottom: "2rem" }} />

        {/* Step indicator */}
        <StepIndicator step={step} />

        {/* ════════════════════════════════════════════════
            STEP 1 — Registration Form
            ════════════════════════════════════════════════ */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {/* Name row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <div>
                <label htmlFor="reg-firstname" style={labelStyle}>First Name</label>
                <input id="reg-firstname" type="text" value={form.firstName} onChange={set("firstName")}
                  required placeholder="John" style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "#fff")}
                  onBlur={(e) => (e.target.style.borderColor = "#2a2a2a")} />
              </div>
              <div>
                <label htmlFor="reg-lastname" style={labelStyle}>Last Name</label>
                <input id="reg-lastname" type="text" value={form.lastName} onChange={set("lastName")}
                  required placeholder="Doe" style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "#fff")}
                  onBlur={(e) => (e.target.style.borderColor = "#2a2a2a")} />
              </div>
            </div>

            {/* USN */}
            <div>
              <label htmlFor="reg-usn" style={labelStyle}>USN</label>
              <input
                id="reg-usn" type="text" value={form.usn} onChange={set("usn")}
                required placeholder="2VDXXCSXXX"
                style={{ ...inputStyle, fontFamily: "JetBrains Mono, monospace", textTransform: "uppercase",
                  borderColor: form.usn && !usnValid ? "#5a5a5a" : "var(--border)" }}
                onFocus={(e) => (e.target.style.borderColor = "var(--border-focus)")}
                onBlur={(e) => (e.target.style.borderColor = form.usn && !usnValid ? "#5a5a5a" : "var(--border)")}
              />
              {form.usn && !usnValid && (
                <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.6rem", color: "#5a5a5a", marginTop: "0.25rem" }}>
                  Format: 2VDXXCSXXX
                </p>
              )}
            </div>

            {inputField("reg-email", "College Email", "email", "email", false, "2vdxxcsxxx@klsvdit.edu.in")}
            {inputField("reg-leetcode", "LeetCode Username", "leetcodeUsername", "text", true, "john_doe")}

            {/* Password */}
            <div>
              <label htmlFor="reg-password" style={labelStyle}>Password</label>
              <input id="reg-password" type="password" value={form.password} onChange={set("password")}
                required placeholder="Min 6 characters" style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#fff")}
                onBlur={(e) => (e.target.style.borderColor = "#2a2a2a")} />
            </div>

            {/* Confirm */}
            <div>
              <label htmlFor="reg-confirm" style={labelStyle}>Confirm Password</label>
              <input
                id="reg-confirm" type="password" value={form.confirmPassword} onChange={set("confirmPassword")}
                required placeholder="Repeat password"
                style={{ ...inputStyle, borderColor: form.confirmPassword && !pwdMatch ? "#5a5a5a" : "#2a2a2a" }}
                onFocus={(e) => (e.target.style.borderColor = "#fff")}
                onBlur={(e) => (e.target.style.borderColor = form.confirmPassword && !pwdMatch ? "#5a5a5a" : "#2a2a2a")}
              />
              {form.confirmPassword && !pwdMatch && (
                <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.6rem", color: "#5a5a5a", marginTop: "0.25rem" }}>
                  Passwords do not match
                </p>
              )}
            </div>

            {/* Account deletion warning */}
            <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.58rem", color: "#3d3d3d", lineHeight: 1.6, marginTop: "-0.25rem" }}>
              ⚠ Accounts cannot be deleted once created.
            </p>

            <button type="submit" id="register-send-otp" disabled={loading} className="btn-primary" style={{ width: "100%", marginTop: "0.5rem" }}>
              {loading ? "Sending Code…" : "Send Verification Code →"}
            </button>
          </form>
        )}

        {/* ════════════════════════════════════════════════
            STEP 2 — OTP Verification
            ════════════════════════════════════════════════ */}
        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

            {/* Email indicator */}
            <div
              style={{
                background: "#080808", border: "1px solid #1a1a1a",
                padding: "0.875rem 1rem",
                display: "flex", alignItems: "center", gap: "0.75rem",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <div>
                <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.58rem", color: "#555", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  Code sent to
                </p>
                <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.75rem", color: "#d0d0d0", marginTop: "2px" }}>
                  {form.email.trim().toLowerCase()}
                </p>
              </div>
            </div>

            {/* OTP input label */}
            <div>
              <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.6rem", color: "#3d3d3d", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.875rem", textAlign: "center" }}>
                Enter 6-digit verification code
              </p>
              <OtpInput value={otp} onChange={setOtp} />
            </div>

            {/* Timer */}
            <div style={{ textAlign: "center" }}>
              {!expired ? (
                <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.65rem", color: remaining < 60 ? "#f87171" : "#555" }}>
                  Code expires in{" "}
                  <span style={{ color: remaining < 60 ? "#f87171" : "#d0d0d0", fontWeight: 600 }}>
                    {mins}:{secs}
                  </span>
                </p>
              ) : (
                <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.65rem", color: "#f87171" }}>
                  Code expired.
                </p>
              )}
            </div>

            {/* Verify button */}
            <button
              id="register-verify-otp"
              onClick={handleVerify}
              disabled={verifying || otp.length < 6}
              className="btn-primary"
              style={{ width: "100%" }}
            >
              {verifying ? "Verifying…" : "Verify & Create Account →"}
            </button>

            {/* Resend + back */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <button
                onClick={() => setStep(1)}
                style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "JetBrains Mono, monospace", fontSize: "0.62rem", color: "#444", letterSpacing: "0.04em", padding: 0 }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#888")}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#444")}
              >
                ← Edit Details
              </button>

              <button
                onClick={handleResend}
                disabled={resending || resendSecsLeft > 0}
                style={{
                  background: "none", border: "none",
                  cursor: (resending || resendSecsLeft > 0) ? "not-allowed" : "pointer",
                  fontFamily: "JetBrains Mono, monospace", fontSize: "0.62rem",
                  color: (resending || resendSecsLeft > 0) ? "#333" : "#666",
                  letterSpacing: "0.04em", padding: 0,
                  textDecoration: "underline",
                  transition: "color 100ms ease",
                }}
              >
                {resending
                  ? "Sending…"
                  : resendSecsLeft > 0
                  ? `Resend in ${Math.floor(resendSecsLeft / 60)}:${String(resendSecsLeft % 60).padStart(2, "0")}`
                  : "Resend Code"}
              </button>
            </div>
          </div>
        )}

        {/* Sign-in link */}
        {step === 1 && (
          <p style={{ marginTop: "1.5rem", fontFamily: "JetBrains Mono, monospace", fontSize: "0.65rem", color: "#3d3d3d", textAlign: "center" }}>
            Already a member?{" "}
            <Link to="/login" style={{ color: "#8a8a8a", textDecoration: "underline" }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#fff")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#8a8a8a")}>
              Sign in
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
