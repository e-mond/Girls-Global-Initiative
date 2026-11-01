import {
  MarkdownBlocks,
  parseMarkdownBlocks,
} from "@/lib/content/safe-markdown";

/** Shared safe Markdown renderer for news, events, newsletters and reports. */
export function CmsMarkdown({
  body,
  className,
}: {
  body: string;
  className?: string;
}) {
  const blocks = parseMarkdownBlocks(body);
  if (blocks.length === 0) return null;
  return <MarkdownBlocks blocks={blocks} className={className} />;
}
