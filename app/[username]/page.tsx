"use client";

import { createClient } from "@/lib/supabase/client";
import { use, useEffect, useState } from "react";

export default function UserPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const supabase = createClient();
  const { username } = use(params);

  const [exists, setExists] = useState<boolean | null>(null);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("username")
        .eq("username", username.toLowerCase())
        .single();
      setExists(!!data);
    };
    checkUser();
  }, [username]);

  const handleSend = async () => {
    if (!message.trim() || message.trim().length < 2) return;
    setLoading(true);

    const { error } = await supabase.from("messages").insert({
      recipient_username: username.toLowerCase(),
      content: message.trim(),
    });

    if (!error) {
      setSent(true);
    }
    setLoading(false);
  };

  // Loading
  if (exists === null) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-[#F4A800] border-t-transparent animate-spin" />
      </div>
    );
  }

  // Profil introuvable
  if (!exists) {
    return (
      <main className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center gap-4">
        <span className="text-5xl">🤷🏾</span>
        <h1 className="text-2xl font-black text-white">@{username} xam-xam</h1>
        <p className="text-white/40 text-sm">
          Ce profil n'existe pas — vérifie le lien.
        </p>
      </main>
    );
  }

  // Message envoyé
  if (sent) {
    return (
      <main className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center gap-5">
        <div className="fixed top-0 left-[50%] -translate-x-1/2 w-[500px] h-[300px] rounded-full bg-[#F4A800] opacity-[0.08] blur-[100px] pointer-events-none" />
        <span className="text-6xl relative z-10">🤫</span>
        <div className="relative z-10 flex flex-col gap-2">
          <h2 className="text-2xl font-black text-white">Message envoyé !</h2>
          <p className="text-white/40 text-sm max-w-xs">
            Yow degg la — @{username} va recevoir ton message de façon anonyme.
          </p>
        </div>
        <button
          onClick={() => {
            setMessage("");
            setSent(false);
          }}
          className="relative z-10 mt-2 px-6 py-3 rounded-xl border border-white/10 text-white/50 text-sm hover:text-white hover:border-white/20 transition-all duration-200"
        >
          Envoyer un autre message
        </button>
      </main>
    );
  }

  // Formulaire principal
  return (
    <main className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      {/* Background blob */}
      <div className="fixed top-0 left-[50%] -translate-x-1/2 w-[600px] h-[350px] rounded-full bg-[#F4A800] opacity-[0.08] blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md flex flex-col gap-6">
        {/* Header */}
        <div className="text-center flex flex-col gap-2">
          <div className="w-16 h-16 rounded-2xl bg-[#F4A800]/10 border border-[#F4A800]/20 flex items-center justify-center mx-auto text-2xl">
            🤫
          </div>
          <h1 className="text-2xl font-black text-white mt-2">
            Wakh ci <span className="text-[#F4A800]">@{username}</span>
          </h1>
          <p className="text-white/40 text-sm">
            Ton identité restera anonyme — doo feigne.
          </p>
        </div>

        {/* Form card */}
        <div className="p-5 rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm flex flex-col gap-4">
          <textarea
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Wakh sa xalaat bi ci kanam... 💬"
            maxLength={500}
            className="w-full px-4 py-3.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder-white/20 text-sm leading-relaxed outline-none focus:border-[#F4A800]/40 focus:bg-white/[0.07] transition-all duration-200 resize-none"
          />

          <div className="flex items-center justify-between px-1">
            <p className="text-white/20 text-xs">
              100% anonyme · personne ne saura que c'est toi
            </p>
            <p
              className={`text-xs font-medium transition-colors ${message.length > 400 ? "text-[#F4A800]/80" : "text-white/20"}`}
            >
              {message.length}/500
            </p>
          </div>

          <button
            onClick={handleSend}
            disabled={message.trim().length < 2 || loading}
            className="w-full py-3.5 rounded-xl bg-[#F4A800] text-black font-bold text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#ffc233] transition-all duration-200 shadow-[0_0_30px_rgba(244,168,0,0.2)] hover:shadow-[0_0_40px_rgba(244,168,0,0.35)] hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? "Envoi en cours..." : "Envoyer anonymement 🤫"}
          </button>
        </div>

        {/* CTA pour créer son propre compte */}
        <div className="text-center">
          <p className="text-white/20 text-xs">
            Tu veux recevoir des messages anonymes toi aussi ?{" "}
            <a
              href="/"
              className="text-[#F4A800]/60 hover:text-[#F4A800] transition-colors underline underline-offset-2"
            >
              Crée ton wakhma
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
