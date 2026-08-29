"use client";
import { createContext, useContext, useState } from "react";

const SidebarContext = createContext<{ showSidebar: boolean; setShowSidebar: (value: boolean) => void } | null>(null);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <SidebarContext.Provider value={{ showSidebar, setShowSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar deve ser usado dentro de um SidebarProvider");
  }
  return context;
}
