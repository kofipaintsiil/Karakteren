import type { Metadata, Viewport } from "next";
import "./globals.css";
import DarkModeProvider from "@/components/DarkModeProvider";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://karakteren.no";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "Karakteren — Øv til muntlig eksamen",
    template: "%s — Karakteren",
  },
  description: "AI-sensor trekker tema, stiller eksamens­spørsmål og gir deg karakter 1–6 med tilbakemelding. Gratis for norske VGS-elever.",
  keywords: ["muntlig eksamen", "VGS", "eksamenstrener", "karakter", "øving", "norsk skole"],
  authors: [{ name: "Karakteren" }],
  openGraph: {
    type: "website",
    locale: "nb_NO",
    url: APP_URL,
    siteName: "Karakteren",
    title: "Karakteren — Øv til muntlig eksamen",
    description: "AI-sensor trekker tema, stiller eksamens­spørsmål og gir deg karakter 1–6. Gratis å starte.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Karakteren — Øv til muntlig eksamen",
    description: "AI-sensor trekker tema og gir deg karakter 1–6. Gratis for norske VGS-elever.",
  },
  robots: { index: true, follow: true },
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Karakteren" },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#FAF8F4",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nb" className="h-full">
      <body className="min-h-full flex flex-col">
        <DarkModeProvider>{children}</DarkModeProvider>
      </body>
    </html>
  );
}
