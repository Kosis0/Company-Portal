import { Component } from "react";
import { AlertOctagon, RefreshCw } from "lucide-react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "var(--bg-canvas, #F6F4EE)",
            padding: "24px",
            fontFamily: "Inter, sans-serif",
          }}
        >
          <div
            className="card"
            style={{
              maxWidth: "480px",
              width: "100%",
              padding: "32px",
              textAlign: "center",
              borderRadius: "14px",
              border: "1px solid var(--border-card, #EAE6DB)",
              backgroundColor: "var(--bg-surface, #FFFFFF)",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)",
            }}
          >
            <div
              style={{
                width: "54px",
                height: "54px",
                borderRadius: "50%",
                backgroundColor: "rgba(217, 107, 67, 0.12)",
                color: "#D96B43",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "16px",
              }}
            >
              <AlertOctagon size={28} />
            </div>
            <h2
              style={{
                fontSize: "18px",
                fontWeight: 700,
                color: "var(--text-primary, #0F172A)",
                marginBottom: "8px",
              }}
            >
              Application Error Encountered
            </h2>
            <p
              style={{
                fontSize: "13px",
                color: "var(--text-secondary, #64748B)",
                marginBottom: "20px",
                lineHeight: 1.5,
              }}
            >
              An unexpected runtime error occurred while rendering the workspace. Your data is safely persisted in the local storage cache.
            </p>
            {this.state.error?.message && (
              <pre
                style={{
                  fontSize: "11px",
                  padding: "10px",
                  borderRadius: "6px",
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                  color: "var(--text-tertiary, #94A3B8)",
                  textAlign: "left",
                  overflowX: "auto",
                  marginBottom: "20px",
                }}
              >
                {this.state.error.message}
              </pre>
            )}
            <button
              type="button"
              className="btn btn-primary"
              onClick={this.handleReload}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 18px",
                margin: "0 auto",
              }}
            >
              <RefreshCw size={14} />
              <span>Reload Workspace</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
