import { useState } from "react";
import Navbar from "../components/Navbar";
import StatsWidget from "../components/StatsWidget";
import WeekFilter from "../components/WeekFilter";
import ProblemList from "../components/ProblemList";
import { useUser } from "../context/UserContext";

export default function DashboardPage() {
  const { user, passwordHash } = useUser();
  const isDemo = passwordHash === "__demo__";
  const [activeWeek, setActiveWeek] = useState<number>(1);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />

      {/* Demo mode banner */}
      {isDemo && (
        <div style={{
          borderBottom: "1px solid var(--border)",
          background: "rgba(0,212,255,0.05)",
          padding: "0.5rem 1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
        }}>
          <span style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: "0.7rem",
            textTransform: "uppercase",
            letterSpacing: "0.16em",
            background: "var(--accent)",
            color: "#000d1a",
            padding: "0.2rem 0.6rem",
            fontWeight: 700,
            clipPath: "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))",
          }}>
            DEMO
          </span>
          <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.75rem", color: "var(--fg-muted)", letterSpacing: "0.04em" }}>
            Simulation mode — progress saves locally only. Deploy backend to activate sync.
          </p>
        </div>
      )}

      <main className="page-enter" style={{ maxWidth: "880px", margin: "0 auto", padding: "2.5rem 1.5rem 5rem" }}>
        {/* Page header */}
        <div style={{ marginBottom: "2rem" }}>
          <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.7rem", color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: "0.5rem" }}>
            &gt;_ MISSION CONTROL
          </p>
          <h1 className="display-heading" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "var(--fg)" }}>
            {user?.firstName?.toUpperCase()}'S CAMPAIGN
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "0.5rem" }}>
            <div style={{ height: "1px", width: "1.5rem", background: "var(--accent)", boxShadow: "0 0 4px var(--accent)" }} />
            <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.7rem", color: "var(--fg-muted)", letterSpacing: "0.1em" }}>
              CHALLENGE 150 · ACTIVE
            </p>
          </div>
        </div>

        <StatsWidget />
        <WeekFilter activeWeek={activeWeek} onChange={setActiveWeek} />
        <ProblemList activeWeek={activeWeek} />
      </main>
    </div>
  );
}
