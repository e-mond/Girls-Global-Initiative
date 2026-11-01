/**
 * Provider-agnostic video embed. Accepts a full iframe embed URL
 * (YouTube, Vimeo, or self-hosted player) from site settings.
 */
export function VideoEmbed({
  url,
  title,
}: {
  url: string;
  title: string;
}) {
  const src = url.trim();
  if (!src) return null;

  return (
    <div className="relative aspect-video overflow-hidden rounded-[1.5rem] border border-border-default bg-brand-navy/5">
      <iframe
        src={src}
        title={title}
        className="absolute inset-0 h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}
