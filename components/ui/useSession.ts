"use client";
import { useEffect, useState } from "react";

export type SessionUser = { id: string; name: string; email: string; role: "USER" | "ADMIN" };

// undefined = still loading, null = logged out
export function useSession() {
  const [user, setUser] = useState<SessionUser | null | undefined>(undefined);

  useEffect(() => {
    fetch("/api/v1/auth/me")
      .then((r) => r.json())
      .then((j) => setUser(j.success ? j.data : null))
      .catch(() => setUser(null));
  }, []);

  const logout = async () => {
    await fetch("/api/v1/auth/logout", { method: "POST" }).catch(() => {});
    window.location.href = "/";
  };

  return { user, logout };
}
