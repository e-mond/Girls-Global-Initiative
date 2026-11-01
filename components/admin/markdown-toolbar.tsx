"use client";

import { Button } from "@/components/ui/button";

type MarkdownToolbarProps = {
  value: string;
  onChange: (next: string) => void;
  /** Live textarea element used for selection wrapping. */
  textareaRef?: { current: HTMLTextAreaElement | null };
};

function wrapSelection(
  value: string,
  start: number,
  end: number,
  before: string,
  after: string,
  placeholder: string,
): { next: string; selectionStart: number; selectionEnd: number } {
  const selected = value.slice(start, end);
  const body = selected || placeholder;
  const next = `${value.slice(0, start)}${before}${body}${after}${value.slice(end)}`;
  const selectionStart = start + before.length;
  const selectionEnd = selectionStart + body.length;
  return { next, selectionStart, selectionEnd };
}

function prefixLines(
  value: string,
  start: number,
  end: number,
  prefix: string,
): { next: string; selectionStart: number; selectionEnd: number } {
  const lineStart = value.lastIndexOf("\n", Math.max(0, start - 1)) + 1;
  const lineEndIndex = value.indexOf("\n", end);
  const lineEnd = lineEndIndex === -1 ? value.length : lineEndIndex;
  const block = value.slice(lineStart, lineEnd);
  const nextBlock = block
    .split("\n")
    .map((line) => (line.startsWith(prefix) ? line : `${prefix}${line}`))
    .join("\n");
  const next = `${value.slice(0, lineStart)}${nextBlock}${value.slice(lineEnd)}`;
  return {
    next,
    selectionStart: lineStart,
    selectionEnd: lineStart + nextBlock.length,
  };
}

/** Lightweight Markdown formatting controls for CMS body fields (safe subset). */
export function MarkdownToolbar({
  value,
  onChange,
  textareaRef,
}: MarkdownToolbarProps) {
  function apply(
    mutator: (
      value: string,
      start: number,
      end: number,
    ) => { next: string; selectionStart: number; selectionEnd: number },
  ) {
    const el = textareaRef?.current;
    const start = el?.selectionStart ?? value.length;
    const end = el?.selectionEnd ?? value.length;
    const result = mutator(value, start, end);
    onChange(result.next);
    requestAnimationFrame(() => {
      if (!el) return;
      el.focus();
      el.setSelectionRange(result.selectionStart, result.selectionEnd);
    });
  }

  const actions: Array<{
    label: string;
    title: string;
    run: () => void;
  }> = [
    {
      label: "B",
      title: "Bold",
      run: () =>
        apply((v, s, e) => wrapSelection(v, s, e, "**", "**", "bold text")),
    },
    {
      label: "I",
      title: "Italic",
      run: () =>
        apply((v, s, e) => wrapSelection(v, s, e, "*", "*", "italic text")),
    },
    {
      label: "H2",
      title: "Heading",
      run: () => apply((v, s, e) => prefixLines(v, s, e, "## ")),
    },
    {
      label: "H3",
      title: "Subheading",
      run: () => apply((v, s, e) => prefixLines(v, s, e, "### ")),
    },
    {
      label: "• List",
      title: "Bullet list",
      run: () => apply((v, s, e) => prefixLines(v, s, e, "- ")),
    },
    {
      label: "1. List",
      title: "Numbered list",
      run: () => apply((v, s, e) => prefixLines(v, s, e, "1. ")),
    },
    {
      label: "Link",
      title: "Link",
      run: () =>
        apply((v, s, e) =>
          wrapSelection(v, s, e, "[", "](/path-or-url)", "link text"),
        ),
    },
    {
      label: "Quote",
      title: "Block quote",
      run: () => apply((v, s, e) => prefixLines(v, s, e, "> ")),
    },
  ];

  return (
    <div
      className="flex flex-wrap gap-1 rounded-t-xl border border-b-0 border-border-default bg-bg-base p-2"
      role="toolbar"
      aria-label="Text formatting"
    >
      {actions.map((action) => (
        <Button
          key={action.title}
          type="button"
          size="sm"
          variant="outline"
          title={action.title}
          aria-label={action.title}
          className="h-8 min-w-8 px-2 font-semibold"
          onClick={action.run}
        >
          {action.label === "B" ? (
            <span className="font-bold">B</span>
          ) : action.label === "I" ? (
            <span className="italic">I</span>
          ) : (
            action.label
          )}
        </Button>
      ))}
      <p className="ml-auto self-center text-[11px] text-text-muted">
        Markdown · public pages use GGI brand fonts
      </p>
    </div>
  );
}
