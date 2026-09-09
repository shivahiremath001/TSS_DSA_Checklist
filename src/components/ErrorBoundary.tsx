import { Component, type ReactNode } from "react";

interface Props { children: ReactNode; }
interface State { hasError: boolean; error: Error | null; }

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    const mono: React.CSSProperties = { fontFamily: "'JetBrains Mono', monospace" };

    return (
      <div style={{ minHeight: "100vh", background: "#000", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ maxWidth: "480px", width: "100%" }}>
          <p style={{ ...mono, fontSize: "0.6rem", color: "#3d3d3d", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "1rem" }}>
            Error
          </p>
          <h1 className="display-heading" style={{ fontSize: "clamp(3rem, 10vw, 6rem)", color: "#fff", lineHeight: 1, marginBottom: "1.5rem" }}>
            SOMETHING<br />BROKE.
          </h1>
          <div style={{ background: "#0a0a0a", border: "1px solid #1a1a1a", padding: "1rem 1.25rem", marginBottom: "2rem" }}>
            <p style={{ ...mono, fontSize: "0.65rem", color: "#5a5a5a", lineHeight: 1.7 }}>
              {this.state.error?.message ?? "An unexpected error occurred."}
            </p>
          </div>
          <button className="btn-primary" onClick={() => window.location.reload()} style={{ width: "100%" }}>
            Reload Page
          </button>
          <button
            style={{ ...mono, marginTop: "1rem", width: "100%", background: "none", border: "none", color: "#3d3d3d", fontSize: "0.65rem", cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.08em" }}
            onClick={() => (window.location.href = "/dashboard")}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }
}
