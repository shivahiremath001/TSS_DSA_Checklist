import { Terminal } from "lucide-react";

interface WelcomeModalProps {
  open: boolean;
  onNext: () => void;
  firstName: string;
}

export default function WelcomeModal({ open, onNext, firstName }: WelcomeModalProps) {
  if (!open) return null;

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}
      role="dialog" aria-modal="true" aria-labelledby="welcome-title"
    >
      <div
        style={{ position: "absolute", inset: 0, background: "rgba(2, 11, 24, 0.85)", backdropFilter: "blur(6px)" }}
      />

      <div
        className="page-enter"
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "460px",
          background: "var(--bg-card)",
          border: "1px solid var(--accent)",
          padding: "2.5rem 2rem",
          boxShadow: "0 0 40px rgba(0, 212, 255, 0.15)",
          clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))",
          textAlign: "center",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "4rem", height: "4rem", borderRadius: "50%", background: "rgba(0, 212, 255, 0.1)", border: "1px solid var(--accent)", color: "var(--accent)" }}>
            <Terminal size={32} />
          </div>
        </div>

        <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.85rem", color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: "0.5rem" }}>
          &gt;_ INITIALIZATION COMPLETE
        </p>
        
        <h2 id="welcome-title" style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "1.75rem", fontWeight: 700, color: "var(--fg)", marginBottom: "1rem", textShadow: "0 0 10px var(--accent-glow)" }}>
          WELCOME, {firstName.toUpperCase()}
        </h2>

        <p style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "1.1rem", color: "var(--fg-muted)", lineHeight: 1.6, marginBottom: "2rem" }}>
          Your mission control is ready. You have successfully authenticated into the Challenge 150 system. Prepare to track your algorithms and data structures journey.
        </p>

        <button
          onClick={onNext}
          className="btn-primary"
          style={{ width: "100%", padding: "0.8rem", fontSize: "1rem", letterSpacing: "0.1em" }}
        >
          CONTINUE →
        </button>
      </div>
    </div>
  );
}
