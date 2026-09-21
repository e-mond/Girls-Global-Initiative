"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

export type GalleryShuffleImage = {
  id: string;
  src: string;
  alt: string;
};

/**
 * Mosaic of gallery moments that gently reshuffles emphasis.
 * Whole band links to /gallery.
 */
export function GalleryShuffleBand({
  images,
}: {
  images: GalleryShuffleImage[];
}) {
  const pool =
    images.length > 0
      ? images
      : [
          {
            id: "fallback",
            src: "/our-story/community.jpg",
            alt: "Girls Global Initiative community moment",
          },
        ];

  const [order, setOrder] = useState(() => pool.map((_, i) => i));

  useEffect(() => {
    if (pool.length < 2) return;
    const id = window.setInterval(() => {
      setOrder((prev) => {
        const next = [...prev];
        const i = Math.floor(Math.random() * next.length);
        let j = Math.floor(Math.random() * next.length);
        if (i === j) j = (j + 1) % next.length;
        [next[i], next[j]] = [next[j], next[i]];
        return next;
      });
    }, 4200);
    return () => window.clearInterval(id);
  }, [pool.length]);

  const slots = order.slice(0, Math.min(5, pool.length)).map((idx) => pool[idx]);

  return (
    <section className="bg-bg-surface px-4 py-10 lg:px-6 lg:py-14">
      <Reveal className="mx-auto max-w-6xl">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-brand-magenta">
              From the gallery
            </p>
            <h2 className="mt-2 font-display text-xl font-bold text-brand-navy sm:text-2xl">
              Moments that keep moving with the work.
            </h2>
          </div>
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-sky hover:underline"
          >
            Open gallery
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        <Link
          href="/gallery"
          className="group grid gap-3 sm:grid-cols-4 sm:grid-rows-2"
          aria-label="Browse the GGI gallery"
        >
          {slots.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className={cn(
                "relative overflow-hidden rounded-[1.25rem] bg-blob-sky",
                index === 0
                  ? "aspect-[4/5] sm:col-span-2 sm:row-span-2 sm:aspect-auto sm:min-h-[22rem]"
                  : "aspect-[4/3] sm:min-h-[10.5rem]",
              )}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-cover transition duration-700 group-hover:scale-[1.03]"
                sizes={
                  index === 0
                    ? "(max-width: 640px) 100vw, 50vw"
                    : "(max-width: 640px) 100vw, 25vw"
                }
              />
            </div>
          ))}
        </Link>
      </Reveal>
    </section>
  );
}
