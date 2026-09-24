import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

/**
 * Wraps /login and /signup — an already-authenticated user visiting either
 * is sent straight to /dashboard instead of seeing the auth forms again.
 */
export default function PublicOnlyRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <span className="mono-label text-[11px] text-ink-dim animate-pulse-soft">
          Verifying Session...
        </span>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
