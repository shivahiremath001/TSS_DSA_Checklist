import { Info } from "lucide-react";

interface AboutModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AboutModal({ open, onClose }: AboutModalProps) {
  if (!open) return null;

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}
      role="dialog" aria-modal="true" aria-labelledby="about-modal-title"
    >
      {/* Backdrop */}
      <div
        style={{ position: "absolute", inset: 0, background: "rgba(2, 11, 24, 0.85)", backdropFilter: "blur(4px)" }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="page-enter"
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "520px",
          background: "var(--bg-card)",
          border: "1px solid var(--accent)",
          padding: "2rem",
          boxShadow: "0 0 20px var(--accent-glow)",
          clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "2.5rem", height: "2.5rem", borderRadius: "50%", background: "rgba(0, 212, 255, 0.1)", border: "1px solid var(--accent)", color: "var(--accent)" }}>
              <Info size={20} />
            </div>
            <div>
              <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.75rem", color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                &gt;_ SYSTEM INFO
              </p>
              <h2 id="about-modal-title" style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "1.25rem", fontWeight: 700, color: "var(--fg)", marginTop: "0.1rem", textShadow: "0 0 8px var(--accent-glow)" }}>
                ABOUT CHALLENGE 150
              </h2>
            </div>
          </div>
          <button 
            onClick={onClose} 
            style={{ 
              color: "var(--fg-muted)", cursor: "pointer", background: "none", border: "none", 
              fontSize: "2.5rem", lineHeight: 0.8, fontFamily: "'Share Tech Mono', monospace",
              transition: "color 150ms, text-shadow 150ms",
              marginTop: "-0.5rem"
            }} 
            aria-label="Close"
            onMouseEnter={(e) => { e.currentTarget.style.color = "var(--danger)"; e.currentTarget.style.textShadow = "0 0 8px var(--danger)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "var(--fg-muted)"; e.currentTarget.style.textShadow = "none"; }}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div style={{ 
          fontFamily: "'Rajdhani', sans-serif", 
          fontSize: "1rem", 
          color: "var(--fg-muted)", 
          lineHeight: 1.6,
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem"
        }}>
          <p>
            <strong style={{ color: "var(--fg)", fontFamily: "'Orbitron', sans-serif", letterSpacing: "0.05em" }}>Challenge 150</strong> is a DSA progress-tracking platform built for The Software Society to help students systematically complete the <strong>NeetCode 150</strong> problem set over a 30-week period.
          </p>
          
          <p>
            The 150 problems are divided into <strong>30 weeks, with 5 problems assigned per week</strong>. We intentionally kept it to 5 problems per week so students are also encouraged to solve additional problems on LeetCode. For every problem in the checklist, a direct link to the corresponding LeetCode problem is provided.
          </p>

          <div>
            <h3 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "1.1rem", color: "var(--fg)", marginBottom: "0.5rem", borderBottom: "1px solid var(--border)", paddingBottom: "0.25rem" }}>
              How it works
            </h3>
            <ul style={{ listStyleType: "none", paddingLeft: "0", margin: "0", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              {[
                "View the 150-problem checklist.",
                "Tick a checkbox when you have solved a problem.",
                "Track overall progress and weekly distribution.",
                "Check the club's leaderboard to compare progress.",
                "Manage your profile information and access keys."
              ].map((item, i) => (
                <li key={i} style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
                  <span style={{ color: "var(--accent)" }}>◈</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "1.1rem", color: "var(--fg)", marginBottom: "0.5rem", borderBottom: "1px solid var(--border)", paddingBottom: "0.25rem" }}>
              Honor-System Approach
            </h3>
            <p>
              The platform is designed for our coding club, where we trust students to use the tracker honestly. The purpose of the system is <strong>progress tracking and motivation</strong>, rather than automated verification.
            </p>
          </div>
        </div>

        {/* Footer */}
        <button
          onClick={onClose}
          className="btn-primary"
          style={{ marginTop: "2rem", width: "100%", padding: "0.75rem", fontSize: "0.9rem" }}
        >
          ACKNOWLEDGE & CLOSE
        </button>
      </div>
    </div>
  );
}
