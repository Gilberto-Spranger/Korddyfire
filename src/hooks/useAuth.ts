import { useState, useEffect } from "react";
import api from "@/utils/api";
import type { User } from "@/types/types";

const getCookie = (name: string) =>
  document.cookie
    .split("; ")
    .find((c) => c.startsWith(name + "="))
    ?.split("=")[1];

export function useAuth() {
  const [session, setSession] = useState<{ user: User } | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      const token = getCookie("auth_token");
      const storedUser = localStorage.getItem("auth_user");

      if (token && storedUser) {
        setSession({ user: JSON.parse(storedUser) });
      } else if (token) {
        try {
          const res = await api.get<{ user: User }>("/auth/user"); // endpoint que retorna usuário do token
          setSession({ user: res.data.user });
          localStorage.setItem("auth_user", JSON.stringify(res.data.user));
        } catch {
          setSession(null);
          localStorage.removeItem("auth_user");
        }
      } else {
        setSession(null);
        localStorage.removeItem("auth_user");
      }
    };

    initAuth();
  }, []);

  const logout = () => {
    document.cookie =
      "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; Secure; SameSite=None";
    localStorage.removeItem("auth_user");
    setSession(null);
  };

  return { session, logout };
}