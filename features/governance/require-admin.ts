import { auth } from "@/auth";
import {
  canAccessAdmin,
  type StaffRole,
} from "@/features/governance/rbac";

export type AdminSessionUser = {
  id: string;
  email: string;
  name: string;
  role: StaffRole;
};

export async function requireAdminSession(): Promise<
  | { ok: true; user: AdminSessionUser }
  | { ok: false; status: 401 | 403; message: string }
> {
  const session = await auth();
  const user = session?.user;

  if (!user?.id || !user.email || !user.role) {
    return { ok: false, status: 401, message: "Sign in required." };
  }

  if (!canAccessAdmin(user.role)) {
    return { ok: false, status: 403, message: "You do not have access." };
  }

  return {
    ok: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  };
}
