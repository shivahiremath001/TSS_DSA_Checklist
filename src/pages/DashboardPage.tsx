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
        <div
          style={{
            borderBottom: "1px solid var(--border)",
            background: "var(--bg-hover)",
            padding: "0.5rem 1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.6rem",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              background: "var(--fg)",
              color: "var(--bg)",
              padding: "0.15rem 0.45rem",
              fontWeight: 700,
            }}
          >
            DEMO
          </span>
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.62rem",
              color: "var(--fg-muted)",
              letterSpacing: "0.04em",
            }}
          >
            Preview mode — checkboxes work locally. Connect your GAS backend to save progress.
          </p>
        </div>
      )}

      <main
        className="page-enter"
        style={{ maxWidth: "860px", margin: "0 auto", padding: "3rem 1.5rem 5rem" }}
      >
        {/* Page title */}
        <div style={{ marginBottom: "2.5rem" }}>
          <p
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "0.65rem",
              color: "var(--fg-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              marginBottom: "0.5rem",
            }}
          >
            Dashboard
          </p>
          <h1
            className="display-heading"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "var(--fg)" }}
          >
            {user?.firstName?.toUpperCase()}'S PROGRESS.
          </h1>
        </div>

        {/* Stats */}
        <div style={{ marginBottom: "2.5rem" }}>
          <StatsWidget />
        </div>

        {/* Week filter */}
        <WeekFilter activeWeek={activeWeek} onChange={setActiveWeek} />

        {/* Problem list */}
        <ProblemList activeWeek={activeWeek} />
      </main>
    </div>
  );
}
