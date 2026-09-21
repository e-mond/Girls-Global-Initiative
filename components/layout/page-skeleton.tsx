import { cn } from "@/lib/utils";

function Bone({ className }: { className?: string }) {
  return (
    <div
      className={cn("rounded-2xl bg-border-default/80", className)}
      aria-hidden
    />
  );
}

/** Full-page loading skeleton used by public/admin route segments. */
export function PageSkeleton({
  variant = "public",
}: {
  variant?: "public" | "admin";
}) {
  return (
    <div
      className={cn(
        "animate-pulse px-4 py-10 sm:px-6 lg:py-14",
        variant === "public" && "mx-auto max-w-6xl",
        variant === "admin" && "mx-auto max-w-7xl",
      )}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">Loading page content</span>

      <div className="space-y-4">
        <Bone className="h-5 w-36 sm:h-6 sm:w-44" />
        <Bone className="h-12 w-full max-w-3xl sm:h-14" />
        <Bone className="h-6 w-full max-w-2xl sm:h-7" />
        <Bone className="h-6 w-[80%] max-w-xl sm:h-7" />
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Bone className="h-12 w-full rounded-xl sm:h-12 sm:w-44" />
        <Bone className="h-12 w-full rounded-xl sm:h-12 sm:w-40" />
      </div>

      <div className="mt-12 grid gap-5 lg:grid-cols-2">
        <Bone className="min-h-[16rem] w-full sm:min-h-[20rem] lg:min-h-[24rem]" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Bone className="min-h-[8.5rem] w-full sm:min-h-[10rem]" />
          <Bone className="min-h-[8.5rem] w-full sm:min-h-[10rem]" />
          <Bone className="min-h-[8.5rem] w-full sm:min-h-[10rem]" />
          <Bone className="min-h-[8.5rem] w-full sm:min-h-[10rem]" />
        </div>
      </div>

      <div className="mt-10 space-y-4">
        <Bone className="h-8 w-56 sm:h-9 sm:w-72" />
        <Bone className="h-5 w-full max-w-3xl" />
        <div className="grid gap-4 sm:grid-cols-3">
          <Bone className="min-h-[7.5rem] w-full" />
          <Bone className="min-h-[7.5rem] w-full" />
          <Bone className="min-h-[7.5rem] w-full" />
        </div>
      </div>
    </div>
  );
}
