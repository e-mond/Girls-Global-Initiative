import type { Metadata, Viewport } from "next";
import {
  JetBrains_Mono,
  Red_Hat_Display,
  Red_Hat_Text,
} from "next/font/google";
import { MswProvider } from "@/components/providers/msw-provider";
import { AuthSessionProvider } from "@/components/providers/auth-session-provider";
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

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.AUTH_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "Girls Global Initiative",
    template: "%s | Girls Global Initiative",
  },
  description:
    "Advancing the rights, dignity, health, wellbeing and potential of girls in rural, remote and underserved communities.",
  applicationName: "Girls Global Initiative",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: ["/favicon.ico"],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Girls Global Initiative",
    description:
      "Advancing the rights, dignity, health, wellbeing and potential of girls in rural, remote and underserved communities.",
    type: "website",
    locale: "en_GB",
    siteName: "Girls Global Initiative",
  },
};

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
