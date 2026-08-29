"use client";

import React, { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";

interface RoleGateProps {
  allowedRoles: Array<'buyer' | 'seller' | 'admin'>;
  children: ReactNode;
  fallback?: ReactNode;
}

export function RoleGate({ allowedRoles, children, fallback = null }: RoleGateProps) {
  const { session } = useAuth();

  if (!session || !session.user || !session.user.role) {
    return <>{fallback}</>;
  }

  if (!allowedRoles.includes(session.user.role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
