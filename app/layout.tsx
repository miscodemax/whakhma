import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Wakhma — Messages anonymes", template: "%s · Wakhma" },
  description:
    "Wakh sa xalaat sans gêne. Reçois des messages anonymes, réponds et partage ce que tu veux.",
  metadataBase: new URL("https://wakhma.vercel.app"),
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
        <Suspense fallback={null}>
          <Navbar />
        </Suspense>
        <div className="flex-1 pt-20">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
