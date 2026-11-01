import Link from "next/link";
import type { ReactNode } from "react";

export type MarkdownBlock =
  | { type: "heading"; level: 2 | 3; text: string; id: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "table"; rows: string[][] }
  | { type: "link"; label: string; href: string };

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64);
}

/** Fix common CMS escapes like `]\(/path)` → `](/path)`. */
export function normalizeCmsMarkdown(raw: string): string {
  return raw
    .replace(/\r\n/g, "\n")
    .replace(/\]\\\(/g, "](")
    .replace(/\\\[/g, "[")
    .replace(/\\\]/g, "]")
    .replace(/\*\*([^*]+):\*\*/g, "**$1**:")
    // Remove visitor-facing original-source PDF download lines.
    .replace(
      /\[(?:Download|View)?\s*(?:the\s+)?(?:original\s+)?source\s+PDF\]\([^)]+\)\.?/gi,
      "",
    )
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function isSafeHref(href: string): boolean {
  const value = href.trim();
  if (!value) return false;
  if (value.startsWith("/")) return !value.startsWith("//");
  if (value.startsWith("#")) return true;
  try {
    const url = new URL(value);
    return (
      url.protocol === "http:" ||
      url.protocol === "https:" ||
      url.protocol === "mailto:"
    );
  } catch {
    return false;
  }
}

function sanitizeHref(href: string): string | null {
  const cleaned = href.trim().replace(/\\/g, "");
  if (!isSafeHref(cleaned)) return null;
  return cleaned;
}

/** Inline bold + links without raw Markdown markers. */
export function renderInlineMarkdown(text: string): ReactNode[] {
  const normalized = normalizeCmsMarkdown(text);
  const parts = normalized.split(/(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*)/g).filter(Boolean);

  return parts.map((part, index) => {
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const href = sanitizeHref(link[2]);
      if (!href) {
        return <span key={`t-${index}`}>{link[1]}</span>;
      }
      const external = /^https?:/i.test(href);
      if (external) {
        return (
          <a
            key={`a-${index}`}
            href={href}
            className="font-semibold text-brand-sky hover:underline"
            rel="noopener noreferrer"
            target="_blank"
          >
            {link[1]}
          </a>
        );
      }
      return (
        <Link
          key={`a-${index}`}
          href={href}
          className="font-semibold text-brand-sky hover:underline"
        >
          {link[1]}
        </Link>
      );
    }
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={`b-${index}`} className="font-semibold text-brand-navy">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={`t-${index}`}>{part.replace(/\*\*/g, "")}</span>;
  });
}

export function parseMarkdownBlocks(body: string): MarkdownBlock[] {
  const cleaned = normalizeCmsMarkdown(body);
  if (!cleaned) return [];

  const chunks = cleaned
    .split(/\n\n+/)
    .map((block) => block.trim())
    .filter(Boolean);
  const blocks: MarkdownBlock[] = [];

  for (const chunk of chunks) {
    if (chunk.startsWith("## ")) {
      const text = chunk.replace(/^##\s+/, "");
      blocks.push({ type: "heading", level: 2, text, id: slugify(text) });
      continue;
    }
    if (chunk.startsWith("### ")) {
      const text = chunk.replace(/^###\s+/, "");
      blocks.push({ type: "heading", level: 3, text, id: slugify(text) });
      continue;
    }

    const soleLink = chunk.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (soleLink) {
      const href = sanitizeHref(soleLink[2]);
      if (href) {
        blocks.push({ type: "link", label: soleLink[1], href });
        continue;
      }
    }

    const lines = chunk.split("\n").map((line) => line.trim()).filter(Boolean);
    if (
      lines.length >= 2 &&
      lines.every((line) => line.startsWith("|") && line.endsWith("|"))
    ) {
      const rows = lines
        .filter((line) => !/^\|[\s|:-]+\|$/.test(line))
        .map((line) =>
          line
            .slice(1, -1)
            .split("|")
            .map((cell) => cell.trim()),
        );
      if (rows.length) {
        blocks.push({ type: "table", rows });
        continue;
      }
    }

    const bullet = lines.every(
      (line) =>
        /^([•\-*]|\d+[.)])\s+/.test(line) ||
        /^\*\*[^*]+\*\*\s*:/.test(line),
    );
    if (lines.length > 1 && bullet) {
      const ordered = lines.every((line) => /^\d+[.)]\s+/.test(line));
      blocks.push({
        type: "list",
        ordered,
        items: lines.map((line) =>
          line.replace(/^([•\-*]|\d+[.)])\s+/, ""),
        ),
      });
      continue;
    }

    blocks.push({ type: "paragraph", text: chunk });
  }

  return blocks;
}

export function MarkdownBlocks({
  blocks,
  className,
}: {
  blocks: MarkdownBlock[];
  className?: string;
}) {
  return (
    <div className={className ?? "space-y-5"}>
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          const Tag = block.level === 3 ? "h3" : "h2";
          return (
            <Tag
              key={`${block.id}-${index}`}
              id={block.id}
              className={
                block.level === 3
                  ? "scroll-mt-28 font-display text-xl font-bold text-brand-navy"
                  : "scroll-mt-28 border-l-4 border-brand-sky pl-4 font-display text-2xl font-bold text-brand-navy"
              }
            >
              {block.text}
            </Tag>
          );
        }
        if (block.type === "list") {
          const ListTag = block.ordered ? "ol" : "ul";
          return (
            <ListTag
              key={`list-${index}`}
              className={
                block.ordered
                  ? "list-decimal space-y-2 pl-5 text-base leading-relaxed text-text-muted"
                  : "space-y-2 pl-1 text-base leading-relaxed text-text-muted"
              }
            >
              {block.items.map((item) => (
                <li key={item.slice(0, 64)} className={block.ordered ? undefined : "flex gap-2"}>
                  {!block.ordered ? (
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-magenta" />
                  ) : null}
                  <span>{renderInlineMarkdown(item)}</span>
                </li>
              ))}
            </ListTag>
          );
        }
        if (block.type === "table") {
          return (
            <div
              key={`table-${index}`}
              className="overflow-x-auto rounded-xl border border-border-default"
            >
              <table className="min-w-full text-left text-sm">
                <tbody>
                  {block.rows.map((row, rowIndex) => (
                    <tr
                      key={`row-${rowIndex}`}
                      className={
                        rowIndex === 0
                          ? "bg-brand-navy text-text-on-inverse"
                          : "border-t border-border-default text-text-muted"
                      }
                    >
                      {row.map((cell, cellIndex) => (
                        <td
                          key={`cell-${rowIndex}-${cellIndex}`}
                          className="px-3 py-2 align-top"
                        >
                          {renderInlineMarkdown(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        if (block.type === "link") {
          const external = /^https?:/i.test(block.href);
          return (
            <p key={`link-${index}`}>
              {external ? (
                <a
                  href={block.href}
                  className="font-semibold text-brand-sky hover:underline"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {block.label}
                </a>
              ) : (
                <Link
                  href={block.href}
                  className="font-semibold text-brand-sky hover:underline"
                >
                  {block.label}
                </Link>
              )}
            </p>
          );
        }
        return (
          <p
            key={`p-${index}`}
            className="text-base leading-relaxed text-text-muted whitespace-pre-line"
          >
            {renderInlineMarkdown(block.text)}
          </p>
        );
      })}
    </div>
  );
}
