import type { Metadata, Viewport } from "next";
import {
  JetBrains_Mono,
  Red_Hat_Display,
  Red_Hat_Text,
} from "next/font/google";
import { MswProvider } from "@/components/providers/msw-provider";
import { AuthSessionProvider } from "@/components/providers/auth-session-provider";
import {
  DEFAULT_SITE_DESCRIPTION,
  DEFAULT_SITE_TITLE,
} from "@/content/page-seo";
import { getSiteSettings } from "@/features/settings/service";
import { getSiteOrigin } from "@/lib/seo/site-origin";
import "./globals.css";

const redHatDisplay = Red_Hat_Display({
  variable: "--font-redhat-display",
  subsets: ["latin"],
  display: "swap",
});

const redHatText = Red_Hat_Text({
  variable: "--font-redhat-text",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const titleDefault =
    settings.seoDefaultTitle.trim() || DEFAULT_SITE_TITLE;
  const description =
    settings.seoDefaultDescription.trim() || DEFAULT_SITE_DESCRIPTION;
  const origin = getSiteOrigin();
  const ogImage = `${origin}/brand/ggi-logo.png`;
  const googleVerification = process.env.GOOGLE_SITE_VERIFICATION?.trim();
  // Bing Webmaster Tools HTML meta tag (msvalidate.01).
  const bingVerification =
    process.env.BING_SITE_VERIFICATION?.trim() ||
    "861FC8B82DE81460937BBDDA6D0EAFCF";

  return {
    metadataBase: new URL(origin),
    title: {
      default: titleDefault,
      template: "%s | Girls Global Initiative",
    },
    description,
    applicationName: "Girls Global Initiative",
    // Cache-busted public icons. app/favicon.ico + app/icon.png + app/apple-icon.png
    // remain the App Router file convention sources (kept in sync by generate:favicons).
    icons: {
      icon: [
        {
          url: "/icons/favicon-16x16.png?v=20261101g",
          sizes: "16x16",
          type: "image/png",
        },
        {
          url: "/icons/favicon-32x32.png?v=20261101g",
          sizes: "32x32",
          type: "image/png",
        },
        {
          url: "/icons/favicon-48x48.png?v=20261101g",
          sizes: "48x48",
          type: "image/png",
        },
        {
          url: "/icons/icon-192.png?v=20261101g",
          sizes: "192x192",
          type: "image/png",
        },
        {
          url: "/icons/icon-512.png?v=20261101g",
          sizes: "512x512",
          type: "image/png",
        },
      ],
      apple: [
        {
          url: "/icons/apple-touch-icon.png?v=20261101g",
          sizes: "180x180",
          type: "image/png",
        },
      ],
      other: [
        {
          rel: "mask-icon",
          url: "/icons/safari-pinned-tab.svg?v=20261101g",
          color: "#041b4b",
        },
      ],
    },
    openGraph: {
      title: titleDefault,
      description,
      type: "website",
      locale: "en_GB",
      siteName: "Girls Global Initiative",
      url: origin,
      images: [{ url: ogImage, alt: "Girls Global Initiative" }],
    },
    twitter: {
      card: "summary_large_image",
      title: titleDefault,
      description,
      images: [ogImage],
    },
    verification: {
      ...(googleVerification ? { google: googleVerification } : {}),
      other: {
        "msvalidate.01": bingVerification,
      },
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fdf6ec" },
    { media: "(prefers-color-scheme: dark)", color: "#041b4b" },
  ],
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${redHatDisplay.variable} ${redHatText.variable} ${jetbrainsMono.variable} min-h-screen overflow-x-hidden antialiased`}
      >
        <AuthSessionProvider>
          <MswProvider>{children}</MswProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
