"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
export default function Navbar() {
  const supabase = createClient();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", user.id)
          .single();
        setUsername(profile?.username ?? null);
      }
    };
    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        if (!session?.user) setUsername(null);
      },
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 sm:px-10 py-5">
      {/* Glassmorphism background */}
      <div className="absolute inset-0 bg-[#0a0a0a]/60 backdrop-blur-md border-b border-white/[0.05]" />

      {/* Logo */}
      <a
        href="/"
        className="relative z-10 text-[#F4A800] font-black text-2xl tracking-tight hover:opacity-80 transition-opacity"
      >
        wakhma sa deugg.
      </a>

      {/* Right side */}
      <div className="relative z-10 flex items-center gap-4">
        {user ? (
          <>
            {username && (
              <a
                href="/dashboard"
                className="text-white/60 text-sm hover:text-white transition-colors duration-200"
              >
                @{username}
              </a>
            )}
            <button
              onClick={handleLogout}
              className="text-sm px-4 py-2 rounded-xl border border-white/10 text-white/50 hover:text-white hover:border-white/20 transition-all duration-200"
            >
              Déconnetewoul
            </button>
          </>
        ) : (
          <button
            onClick={handleLogin}
            className="text-sm px-5 py-2.5 rounded-xl bg-[#F4A800] text-black font-semibold hover:bg-[#ffc233] transition-all duration-200 shadow-[0_0_20px_rgba(244,168,0,0.2)] hover:shadow-[0_0_30px_rgba(244,168,0,0.4)]"
          >
            Connectewoul →
          </button>
        )}
      </div>
    </nav>
  );
}
