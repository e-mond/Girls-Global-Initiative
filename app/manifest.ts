import type { MetadataRoute } from "next";

/**
 * Web app identity for browser “Add to Home Screen” / installed shortcuts.
 * Icons are the approved GGI circular mark (cream-backed / maskable variants).
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Girls Global Initiative",
    short_name: "GGI",
    description:
      "Advancing the rights, dignity, health, wellbeing and potential of girls in rural, remote and underserved communities.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#fdf6ec",
    theme_color: "#041b4b",
    icons: [
      {
        src: "/icons/icon-192.png?v=20261101f",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png?v=20261101f",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-192-maskable.png?v=20261101f",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-512-maskable.png?v=20261101f",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/apple-touch-icon.png?v=20261101f",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
