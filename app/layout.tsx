import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Wakhma — Messages anonymes",
    template: "%s · Wakhma",
  },
  description:
    "Wakh sa xalaat sans gêne. Reçois des messages anonymes, réponds et partage ce que tu veux.",
  keywords: [
    "messages anonymes",
    "wakhma",
    "sénégal",
    "wolof",
    "NGL",
    "anonymous",
  ],
  authors: [{ name: "Wakhma" }],
  creator: "Wakhma",
  metadataBase: new URL("https://wakhma.vercel.app"),
  openGraph: {
    title: "Wakhma — Messages anonymes",
    description:
      "Wakh sa xalaat sans gêne. Reçois des messages anonymes et réponds à ceux que tu veux.",
    url: "https://wakhma.vercel.app",
    siteName: "Wakhma",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wakhma — Messages anonymes",
    description:
      "Wakh sa xalaat sans gêne. Reçois des messages anonymes et réponds à ceux que tu veux.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body
        className={`${geist.className} bg-[#0a0a0a] min-h-screen flex flex-col`}
      >
        <Navbar />
        <div className="flex-1 pt-20">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
