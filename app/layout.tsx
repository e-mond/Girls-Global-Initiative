import type { Metadata } from "next";
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
  title: {
    default: "Girls Global Initiative",
    template: "%s | Girls Global Initiative",
  },
  description:
    "Advancing the rights, dignity, health, wellbeing and education of girls in rural, remote and underserved communities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${redHatDisplay.variable} ${redHatText.variable} ${jetbrainsMono.variable} min-h-screen antialiased`}
      >
        <AuthSessionProvider>
          <MswProvider>{children}</MswProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
