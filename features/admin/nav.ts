export type AdminNavIconName =
  | "layout-dashboard"
  | "file-text"
  | "images"
  | "inbox"
  | "hand-coins"
  | "mail"
  | "users"
  | "settings"
  | "history";

export type AdminNavItem = {
  href: string;
  label: string;
  icon: AdminNavIconName;
};

export type AdminNavGroup = {
  id: string;
  label: string;
  items: AdminNavItem[];
};

/** Shared admin IA — Administration group filtered by role at render time.
 * Icons are string keys so groups stay serialisable Server → Client. */
export const ADMIN_NAV_MANAGE: AdminNavItem[] = [
  { href: "/admin/content", label: "Content", icon: "file-text" },
  { href: "/admin/content/media", label: "Media", icon: "images" },
  { href: "/admin/submissions", label: "Submissions", icon: "inbox" },
  { href: "/admin/donations", label: "Donations", icon: "hand-coins" },
  { href: "/admin/subscribers", label: "Subscribers", icon: "mail" },
];

export function buildAdminNavGroups(options: {
  canManageUsers: boolean;
  canManageSettings: boolean;
}): AdminNavGroup[] {
  const groups: AdminNavGroup[] = [
    {
      id: "overview",
      label: "Overview",
      items: [
        { href: "/admin", label: "Dashboard", icon: "layout-dashboard" },
      ],
    },
    {
      id: "manage",
      label: "Manage",
      items: ADMIN_NAV_MANAGE,
    },
  ];

  const adminItems: AdminNavItem[] = [];
  if (options.canManageUsers) {
    adminItems.push({
      href: "/admin/users",
      label: "Users",
      icon: "users",
    });
  }
  if (options.canManageSettings) {
    adminItems.push(
      { href: "/admin/settings", label: "Settings", icon: "settings" },
      { href: "/admin/audit", label: "Audits", icon: "history" },
    );
  }
  if (adminItems.length) {
    groups.push({
      id: "administration",
      label: "Administration",
      items: adminItems,
    });
  }

  return groups;
}

export function adminLinkIsActive(pathname: string, href: string) {
  if (href === "/admin") {
    return pathname === "/admin";
  }
  if (href === "/admin/content") {
    if (pathname === "/admin/content") return true;
    if (!pathname.startsWith("/admin/content/")) return false;
    return !pathname.startsWith("/admin/content/media");
  }
  if (href === "/admin/content/media") {
    return (
      pathname === "/admin/content/media" ||
      pathname.startsWith("/admin/content/media/")
    );
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Resolve a short page title from the pathname for the topbar. */
export function adminPageTitle(pathname: string): string {
  const map: Record<string, string> = {
    "/admin": "Dashboard",
    "/admin/content": "Content",
    "/admin/content/media": "Media",
    "/admin/content/pillars": "Pillars",
    "/admin/content/team": "Team",
    "/admin/content/challenge-tags": "Challenge tags",
    "/admin/content/gallery": "Gallery",
    "/admin/content/news": "News",
    "/admin/content/events": "Events",
    "/admin/content/testimonials": "Testimonials",
    "/admin/content/advocacy": "Advocacy",
    "/admin/submissions": "Submissions",
    "/admin/donations": "Donations",
    "/admin/subscribers": "Subscribers",
    "/admin/users": "Users",
    "/admin/settings": "Settings",
    "/admin/audit": "Audits",
  };
  if (map[pathname]) return map[pathname];
  for (const [href, label] of Object.entries(map)) {
    if (href !== "/admin" && pathname.startsWith(`${href}/`)) return label;
  }
  return "Administration";
}
