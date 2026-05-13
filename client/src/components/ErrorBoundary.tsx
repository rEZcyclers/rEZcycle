import { Component, ErrorInfo, ReactNode } from "react";
import { useRouteError } from "react-router-dom";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export function OutageFallback() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "2rem",
        background:
          "radial-gradient(circle at top, #f7f7f0 0%, #f1efe3 40%, #ebe7d6 100%)",
        color: "#1f2430",
        textAlign: "center",
      }}
    >
      <section
        style={{
          maxWidth: "760px",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          border: "1px solid #d8d1bd",
          borderRadius: "16px",
          padding: "2rem",
          boxShadow: "0 20px 60px rgba(71, 63, 39, 0.16)",
        }}
      >
        <h1 style={{ marginTop: 0, fontSize: "clamp(1.8rem, 3vw, 2.6rem)" }}>
          rEZcycle is currently down
        </h1>
        <p style={{ fontSize: "1.05rem", lineHeight: 1.6, marginBottom: 0 }}>
          This is likely because the free tier database has been temporarily
          paused due to inactivity; please raise an issue on{" "}
          <a
            href="https://github.com/rEZcyclers/rEZcycle"
            target="_blank"
            rel="noreferrer"
            style={{ color: "#0d5a8b", fontWeight: 600 }}
          >
            github.com/rEZcyclers/rEZcycle
          </a>{" "}
          if you would like to reach out for further development works!
        </p>
      </section>
    </main>
  );
}

export function RouterErrorBoundary() {
  const routeError = useRouteError();
  console.error("Unhandled route error:", routeError);
  return <OutageFallback />;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Unhandled application error:", error, errorInfo);
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      return <OutageFallback />;
    }

    return this.props.children;
  }
}
