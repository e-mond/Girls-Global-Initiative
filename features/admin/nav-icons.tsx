"use client";

import type { LucideIcon } from "lucide-react";
import {
  FileText,
  HandCoins,
  History,
  Images,
  Inbox,
  LayoutDashboard,
  Mail,
  Settings,
  Users,
} from "lucide-react";
import type { AdminNavIconName } from "@/features/admin/nav";

/** Client-only Lucide map for serialisable admin nav icon keys. */
export const ADMIN_NAV_ICONS: Record<AdminNavIconName, LucideIcon> = {
  "layout-dashboard": LayoutDashboard,
  "file-text": FileText,
  images: Images,
  inbox: Inbox,
  "hand-coins": HandCoins,
  mail: Mail,
  users: Users,
  settings: Settings,
  history: History,
};
