"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SetupPage() {
  const supabase = createClient();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValid = /^[a-zA-Z0-9_]{3,20}$/.test(username);

  const handleSubmit = async () => {
    if (!isValid) return;
    setLoading(true);
    setError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/");
      return;
    }

    // Vérifie si le username est déjà pris
    const { data: existing } = await supabase
      .from("profiles")
      .select("username")
      .eq("username", username.toLowerCase())
      .single();

    if (existing) {
      setError("Ce pseudo est déjà pris, choisis-en un autre.");
      setLoading(false);
      return;
    }

    // Crée le profil
    const { error: insertError } = await supabase
      .from("profiles")
      .insert({ id: user.id, username: username.toLowerCase() });

    if (insertError) {
      setError("Une erreur est survenue, réessaie.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <main className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      {/* Background blob */}
      <div className="fixed top-[-20%] left-[50%] -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-[#F4A800] opacity-10 blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md flex flex-col items-center gap-8">
        {/* Header */}
        <div className="text-center flex flex-col gap-2">
          <span className="text-4xl">👋</span>
          <h1 className="text-3xl font-black text-white">Choisis ton pseudo</h1>
          <p className="text-white/40 text-sm">
            C'est l'URL que tu vas partager à tes amis —{" "}
            <span className="text-white/60">choisis bien.</span>
          </p>
        </div>

        {/* Input card */}
        <div className="w-full p-6 rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm flex flex-col gap-5">
          {/* Preview URL */}
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
            <span className="text-white/30 text-sm font-medium shrink-0">
              wakhma.vercel.app/
            </span>
            <span
              className={`text-sm font-bold transition-colors duration-200 ${username ? "text-[#F4A800]" : "text-white/20"}`}
            >
              {username || "tonpseudo"}
            </span>
          </div>

          {/* Input */}
          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(
                  e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""),
                );
                setError(null);
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="tonpseudo"
              maxLength={20}
              className="w-full px-4 py-3.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder-white/20 text-sm font-medium outline-none focus:border-[#F4A800]/50 focus:bg-white/[0.07] transition-all duration-200"
            />
            <div className="flex items-center justify-between px-1">
              <p className="text-white/25 text-xs">
                Lettres, chiffres et _ uniquement · 3 à 20 caractères
              </p>
              <p
                className={`text-xs font-medium transition-colors ${username.length >= 3 ? "text-[#F4A800]/60" : "text-white/20"}`}
              >
                {username.length}/20
              </p>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!isValid || loading}
            className="w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed bg-[#F4A800] text-black hover:bg-[#ffc233] shadow-[0_0_30px_rgba(244,168,0,0.2)] hover:shadow-[0_0_40px_rgba(244,168,0,0.35)] hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? "Création..." : "Valider mon pseudo →"}
          </button>
        </div>

        <p className="text-white/20 text-xs text-center">
          na leerr — tu ne pourras pas changer ton pseudo après. 😅
        </p>
      </div>
    </main>
  );
}
