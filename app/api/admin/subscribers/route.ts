import { NextResponse } from "next/server";
import { toCsv } from "@/features/exports/csv";
import { writeAuditLog } from "@/features/audit/write-audit";
import { requireAdminSession } from "@/features/governance/require-admin";
import {
  adminSubscriberSchema,
  subscriberStatusSchema,
} from "@/features/newsletter/schemas";
import {
  adminCreateSubscriber,
  adminSetStatus,
  listSubscribers,
} from "@/features/newsletter/service";

export async function GET(request: Request) {
  try {
    const access = await requireAdminSession();
    if (!access.ok) {
      return NextResponse.json(
        { error: { message: access.message } },
        { status: access.status },
      );
    }

    const { searchParams } = new URL(request.url);
    const items = await listSubscribers();
    const q = searchParams.get("q")?.trim().toLowerCase();
    const status = searchParams.get("status");
    const filtered = items.filter((item) => {
      if (status && item.status !== status) return false;
      if (!q) return true;
      return item.email.toLowerCase().includes(q);
    });

    if (searchParams.get("format") === "csv") {
      const limited = filtered.slice(0, 500);
      const csv = toCsv(
        [
          "id",
          "email",
          "status",
          "source",
          "createdAt",
          "confirmedAt",
          "unsubscribedAt",
        ],
        limited.map((item) => [
          item.id,
          item.email,
          item.status,
          item.source ?? "",
          item.createdAt ?? "",
          item.confirmedAt ?? "",
          item.unsubscribedAt ?? "",
        ]),
      );

      try {
        await writeAuditLog({
          actorUserId: access.user.id,
          action: "newsletter.export",
          entityType: "newsletter_subscriber",
          summary: `Exported ${limited.length} newsletter subscribers`,
        });
      } catch (error) {
        // Export must still succeed if audit write fails (e.g. stale session user).
        console.error("[admin/subscribers] export audit failed", error);
      }

      // BOM helps Excel open UTF-8 CSV correctly.
      const body = `\uFEFF${csv}\r\n`;
      return new NextResponse(body, {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition":
            'attachment; filename="newsletter-subscribers.csv"',
          "Cache-Control": "no-store",
        },
      });
    }

    return NextResponse.json({
      data: {
        items: filtered.map((item) => ({
          id: item.id,
          email: item.email,
          status: item.status,
          source: item.source,
          createdAt: item.createdAt,
          confirmedAt: item.confirmedAt,
          unsubscribedAt: item.unsubscribedAt,
        })),
      },
    });
  } catch (error) {
    console.error("[admin/subscribers] GET failed", error);
    return NextResponse.json(
      { error: { message: "Could not load subscribers. Please try again." } },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const access = await requireAdminSession();
  if (!access.ok) {
    return NextResponse.json(
      { error: { message: access.message } },
      { status: access.status },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: { message: "Invalid request." } },
      { status: 400 },
    );
  }

  const parsed = adminSubscriberSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { message: "A valid email is required." } },
      { status: 400 },
    );
  }

  const item = await adminCreateSubscriber({
    email: parsed.data.email,
    status: parsed.data.status,
  });

  await writeAuditLog({
    actorUserId: access.user.id,
    action: "newsletter.admin_create",
    entityType: "newsletter_subscriber",
    entityId: item.id,
    summary: `Admin added subscriber ${item.email}`,
  });

  return NextResponse.json({ data: { item } }, { status: 201 });
}

export async function PATCH(request: Request) {
  const access = await requireAdminSession();
  if (!access.ok) {
    return NextResponse.json(
      { error: { message: access.message } },
      { status: access.status },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: { message: "Invalid request." } },
      { status: 400 },
    );
  }

  const id = (body as { id?: string }).id;
  const status = subscriberStatusSchema.safeParse(
    (body as { status?: string }).status,
  );
  if (!id || !status.success) {
    return NextResponse.json(
      { error: { message: "A valid id and status are required." } },
      { status: 400 },
    );
  }

  const item = await adminSetStatus(id, status.data);
  if (!item) {
    return NextResponse.json(
      { error: { message: "Subscriber not found." } },
      { status: 404 },
    );
  }

  await writeAuditLog({
    actorUserId: access.user.id,
    action: "newsletter.status",
    entityType: "newsletter_subscriber",
    entityId: id,
    summary: `Set subscriber status to ${status.data}`,
  });

  return NextResponse.json({ data: { item } });
}
