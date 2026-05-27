import type { ReactElement } from "react";
import { Navigate } from "react-router-dom";

import { LoadingScreen } from "../ui/LoadingScreen";
import { useAuth } from "../../features/auth/AuthContext";

export function ProtectedRoute({ children }: { children: ReactElement }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen label="Preparing workspace..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
