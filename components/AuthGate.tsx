import React from "react";
import { useAuth } from "../hooks/useAuth";

// Minimal gate to protect views without breaking existing UI.
// Replace the placeholder UI with your design system components later.
export function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Carregando...</div>;
  if (!user) return <div>Faça login para continuar.</div>;

  return <>{children}</>;
}
