"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";

const COLLAPSE_KEY = "ggi-admin-sidebar-collapsed";

type AdminShellContextValue = {
  mobileNavOpen: boolean;
  openMobileNav: () => void;
  closeMobileNav: () => void;
  toggleMobileNav: () => void;
  sidebarCollapsed: boolean;
  toggleSidebarCollapsed: () => void;
};

const AdminShellContext = createContext<AdminShellContextValue | null>(null);

export function AdminShellProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(COLLAPSE_KEY);
      if (stored === "1") setSidebarCollapsed(true);
    } catch {
      // Ignore storage access errors.
    }
  }, []);

  const closeMobileNav = useCallback(() => setMobileNavOpen(false), []);
  const openMobileNav = useCallback(() => setMobileNavOpen(true), []);
  const toggleMobileNav = useCallback(
    () => setMobileNavOpen((value) => !value),
    [],
  );
  const toggleSidebarCollapsed = useCallback(() => {
    setSidebarCollapsed((value) => {
      const next = !value;
      try {
        window.localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
      } catch {
        // Ignore storage access errors.
      }
      return next;
    });
  }, []);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileNavOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileNavOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [mobileNavOpen]);

  const value = useMemo(
    () => ({
      mobileNavOpen,
      openMobileNav,
      closeMobileNav,
      toggleMobileNav,
      sidebarCollapsed,
      toggleSidebarCollapsed,
    }),
    [
      mobileNavOpen,
      openMobileNav,
      closeMobileNav,
      toggleMobileNav,
      sidebarCollapsed,
      toggleSidebarCollapsed,
    ],
  );

  return (
    <AdminShellContext.Provider value={value}>
      {children}
    </AdminShellContext.Provider>
  );
}

export function useAdminShell() {
  const ctx = useContext(AdminShellContext);
  if (!ctx) {
    throw new Error("useAdminShell must be used within AdminShellProvider");
  }
  return ctx;
}
