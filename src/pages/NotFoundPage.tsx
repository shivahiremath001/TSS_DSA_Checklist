import { Link } from "react-router-dom";

export default function NotFoundPage() {
  const mono: React.CSSProperties = { fontFamily: "'JetBrains Mono', monospace" };
  return (
    <div style={{ minHeight: "100vh", background: "#000", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div className="page-enter" style={{ maxWidth: "480px", width: "100%", textAlign: "center" }}>
        <p style={{ ...mono, fontSize: "0.75rem", color: "#3d3d3d", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "1rem" }}>
          404
        </p>
        <h1 className="display-heading" style={{ fontSize: "clamp(4rem, 14vw, 8rem)", color: "#fff", lineHeight: 1, marginBottom: "1.5rem" }}>
          PAGE<br />NOT<br />FOUND.
        </h1>
        <p style={{ ...mono, fontSize: "0.75rem", color: "#3d3d3d", lineHeight: 1.8, marginBottom: "2.5rem" }}>
          The page you are looking for doesn&apos;t exist<br />or has been moved.
        </p>
        <Link to="/dashboard" className="btn-primary" style={{ display: "inline-block" }}>
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
