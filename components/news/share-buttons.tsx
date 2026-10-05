"use client";

import { useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

type ShareButtonsProps = {
  title: string;
  summary?: string;
  /** Absolute or site-relative URL to share. Defaults to /news. */
  url?: string;
  className?: string;
};

function absoluteUrl(pathOrUrl: string) {
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl;
  }
  if (typeof window !== "undefined") {
    return new URL(pathOrUrl, window.location.origin).toString();
  }
  return pathOrUrl;
}

/** Accessible share actions for news cards — native share + social deep links. */
export function ShareButtons({
  title,
  summary = "",
  url = "/news",
  className,
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = absoluteUrl(url);
  const text = summary ? `${title} — ${summary}` : title;

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(text);

  async function onNativeShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, text: summary || title, url: shareUrl });
      } catch {
        // User cancelled — ignore.
      }
      return;
    }
    await onCopy();
  }

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  const linkClass =
    "inline-flex h-10 min-h-10 w-10 items-center justify-center rounded-xl border border-border-default bg-bg-surface text-brand-navy hover:border-brand-sky/50 hover:text-brand-sky focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky";

  return (
    <div
      className={cn("flex flex-wrap items-center gap-2", className)}
      role="group"
      aria-label={`Share ${title}`}
    >
      <button
        type="button"
        className={linkClass}
        onClick={() => void onNativeShare()}
        aria-label="Share"
      >
        <Share2 className="h-4 w-4" aria-hidden />
      </button>
      <a
        className={linkClass}
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X"
      >
        <span className="text-xs font-bold" aria-hidden>
          X
        </span>
      </a>
      <a
        className={linkClass}
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Facebook"
      >
        <span className="text-[10px] font-bold" aria-hidden>
          f
        </span>
      </a>
      <a
        className={linkClass}
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
      >
        <span className="text-[9px] font-bold" aria-hidden>
          in
        </span>
      </a>
      <a
        className={linkClass}
        href={`https://wa.me/?text=${encodeURIComponent(`${text} ${shareUrl}`)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on WhatsApp"
      >
        <span className="text-[10px] font-bold" aria-hidden>
          WA
        </span>
      </a>
      <button
        type="button"
        className={linkClass}
        onClick={() => void onCopy()}
        aria-label={copied ? "Link copied" : "Copy link"}
      >
        {copied ? (
          <Check className="h-4 w-4 text-state-success" aria-hidden />
        ) : (
          <Copy className="h-4 w-4" aria-hidden />
        )}
      </button>
    </div>
  );
}
