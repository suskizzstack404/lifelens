import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // Deliberately renders nothing but a neutral loading state — never the
    // protected content — so a logged-out user never sees a flash of the
    // dashboard before the redirect below can happen.
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <span className="mono-label text-[11px] text-ink-dim animate-pulse-soft">
          Verifying Session...
        </span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
