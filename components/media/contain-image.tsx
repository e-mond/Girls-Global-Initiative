import Image from "next/image";
import { cn } from "@/lib/utils";

type ContainImageProps = {
  src: string;
  alt: string;
  /** Card thumbnails vs detail heroes. */
  variant?: "card" | "detail";
  priority?: boolean;
  className?: string;
  sizes?: string;
};

/**
 * Poster-safe image frame: never crops or stretches artwork.
 * Uses object-contain on a GGI cream/navy-tinted stage so portrait and
 * landscape assets stay fully readable inside consistent card shells.
 */
export function ContainImage({
  src,
  alt,
  variant = "card",
  priority = false,
  className,
  sizes,
}: ContainImageProps) {
  const shell =
    variant === "detail"
      ? "relative mx-auto w-full max-w-4xl overflow-hidden rounded-[1.75rem] border border-border-default bg-bg-base"
      : "relative w-full overflow-hidden bg-bg-base";

  const frame =
    variant === "detail"
      ? "aspect-[4/5] max-h-[70vh] sm:aspect-[16/10] sm:max-h-[560px]"
      : "aspect-[4/5] min-h-[220px] max-h-[320px]";

  return (
    <div className={cn(shell, frame, className)}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        className="object-contain object-center p-2 sm:p-3"
        sizes={
          sizes ??
          (variant === "detail"
            ? "(max-width: 900px) 100vw, 800px"
            : "(max-width: 1024px) 100vw, 50vw")
        }
      />
    </div>
  );
}
