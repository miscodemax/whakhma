"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const supabase = createClient();
  const router = useRouter();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setIsConnected(!!user);
    };
    checkSession();
  }, []);

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const handleCTA = () => {
    if (isConnected) {
      router.push("/dashboard");
    } else {
      handleGoogleLogin();
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] overflow-hidden relative flex flex-col items-center justify-center px-4 py-14">
      {/* Background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#F4A800] opacity-20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-[#F4A800] opacity-10 blur-[100px] pointer-events-none" />
      <div className="absolute top-[40%] right-[20%] w-[200px] h-[200px] rounded-full bg-[#ffcc44] opacity-10 blur-[80px] pointer-events-none" />

      {/* Grain overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px",
        }}
      />

      {/* Hero */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto gap-6">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#F4A800]/30 bg-[#F4A800]/10 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F4A800] animate-pulse" />
          <span className="text-[#F4A800] text-xs font-medium tracking-wider uppercase">
            Messages anonymes
          </span>
        </div>
        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl font-black text-white leading-[1.05] tracking-tight">
          Wakhma sa xalaat{" "}
          <span
            className="relative inline-block"
            style={{
              WebkitTextStroke: "2px #F4A800",
              color: "transparent",
            }}
          >
            sans gêne.
          </span>
        </h1>

        {/* Subline */}
        <p className="text-white/50 text-lg max-w-md leading-relaxed">
          Partage ton lien. Reçois des messages anonymes. Réponds et poste —{" "}
          <span className="text-white/80">seulement ce que tu veux.</span>
        </p>

        {/* CTA Button */}
        <button
          onClick={handleCTA}
          className="group mt-2 flex items-center gap-3 px-6 py-3.5 rounded-2xl font-semibold text-black bg-[#F4A800] hover:bg-[#ffc233] transition-all duration-200 shadow-[0_0_40px_rgba(244,168,0,0.3)] hover:shadow-[0_0_60px_rgba(244,168,0,0.5)] hover:scale-[1.03] active:scale-[0.98]"
        >
          {isConnected ? (
            <>
              Accéder à mon dashboard
              <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                →
              </span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#000"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#111"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#222"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                />
                <path
                  fill="#333"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continuer avec Google
              <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                →
              </span>
            </>
          )}
        </button>

        <p className="text-white/20 text-xs">
          Gratuit · Sans pub · 100% anonyme
        </p>
      </div>

      {/* How it works */}
      <div className="relative z-10 mt-24 w-full max-w-3xl mx-auto">
        <p className="text-center text-white/30 text-xs uppercase tracking-widest mb-10 font-medium">
          Noumouy deme ci 3 étapes simples
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              step: "01",
              title: "Crée ton lien",
              desc: "Connecte-toi et choisis ton pseudo. Ton lien wakh est prêt.",
              wolof: "Seetlu sa lien bi",
            },
            {
              step: "02",
              title: "Partage-le",
              desc: "Envoie ton lien à tes amis ou poste-le en story.",
              wolof: "Fare ko ci reew mi",
            },
            {
              step: "03",
              title: "Réponds & poste",
              desc: "Reçois les messages, réponds à ceux que tu veux et partage la carte.",
              wolof: "Tekki ngir indi ko",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="relative p-6 rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm hover:border-[#F4A800]/20 hover:bg-white/[0.05] transition-all duration-300 group"
            >
              <span className="text-[#F4A800]/30 text-xs font-black tracking-widest group-hover:text-[#F4A800]/60 transition-colors duration-300">
                {item.step}
              </span>
              <h3 className="text-white font-bold mt-3 mb-1 text-base">
                {item.title}
              </h3>
              <p className="text-white/40 text-sm leading-relaxed">
                {item.desc}
              </p>
              <p className="text-[#F4A800]/40 text-xs mt-3 italic font-medium">
                {item.wolof}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
