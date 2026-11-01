import { expect, test } from "@playwright/test";
import {
  normalizeCmsMarkdown,
  parseMarkdownBlocks,
} from "@/lib/content/safe-markdown";
import { resolveEventDisplayStatus } from "@/lib/events/programme-status";
import { isLivePublicContent } from "@/lib/content/public-visibility";

test.describe("safe markdown", () => {
  test("repairs escaped markdown links", () => {
    const raw =
      "[The Girl Beyond the Map]\\(/events/the-girl-beyond-the-map).";
    const cleaned = normalizeCmsMarkdown(raw);
    expect(cleaned).toContain("](/events/the-girl-beyond-the-map)");
    expect(cleaned).not.toContain("]\\(");
  });

  test("parses headings lists and links without raw markers", () => {
    const blocks = parseMarkdownBlocks(
      "## Objectives\n\n• First goal\n• Second goal\n\n[Read more](/news/example)",
    );
    expect(blocks[0]).toMatchObject({ type: "heading", text: "Objectives" });
    expect(blocks[1]).toMatchObject({ type: "list", ordered: false });
    expect(blocks[2]).toMatchObject({
      type: "link",
      href: "/news/example",
    });
  });
});

test.describe("event and news status", () => {
  test("never infers cancelled or postponed from dates", () => {
    expect(
      resolveEventDisplayStatus({
        programmeStatus: "scheduled",
        startsOn: "1 January 2020",
      }),
    ).toBe("past");
    expect(
      resolveEventDisplayStatus({
        programmeStatus: "cancelled",
        startsOn: "1 January 2030",
      }),
    ).toBe("cancelled");
    expect(
      resolveEventDisplayStatus({
        programmeStatus: "postponed",
        startsOn: "1 January 2020",
        revisedStartsOn: "1 June 2030",
      }),
    ).toBe("postponed");
  });

  test("scheduled news stays hidden until go-live", () => {
    const future = new Date(Date.now() + 86_400_000).toISOString();
    expect(
      isLivePublicContent({ status: "scheduled", publishedAt: future }),
    ).toBe(false);
    const past = new Date(Date.now() - 86_400_000).toISOString();
    expect(
      isLivePublicContent({ status: "scheduled", publishedAt: past }),
    ).toBe(true);
  });
});
