"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const supabase = createClient();
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [savingReply, setSavingReply] = useState<string | null>(null);
  const [shareMsg, setShareMsg] = useState<Message | null>(null);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/");
        return;
      }

      const { data: prof } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!prof) {
        router.push("/setup");
        return;
      }
      setProfile(prof);

      const { data: msgs } = await supabase
        .from("messages")
        .select("*")
        .eq("recipient_username", prof.username)
        .order("created_at", { ascending: false });

      setMessages(msgs ?? []);
      setLoading(false);

      // Mark unread as read
      await supabase
        .from("messages")
        .update({ is_read: true })
        .eq("recipient_username", prof.username)
        .eq("is_read", false);
    };
    init();
  }, []);

  const myLink = profile
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/${profile.username}`
    : "";

  const copyLink = () => {
    navigator.clipboard.writeText(myLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const saveReply = async (msgId: string) => {
    const reply = replyText[msgId]?.trim();
    if (!reply) return;
    setSavingReply(msgId);

    await supabase.from("messages").update({ reply }).eq("id", msgId);

    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, reply } : m)),
    );
    setSavingReply(null);
  };

  const shareToWhatsApp = (msg: Message) => {
    setShareMsg(msg);
  };

  const downloadCard = async () => {
    if (!cardRef.current || !shareMsg) return;
    const { default: html2canvas } = await import("html2canvas");
    const canvas = await html2canvas(cardRef.current, {
      backgroundColor: null,
      scale: 3,
    });
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `wakhma-${shareMsg.id}.png`;
    a.click();
  };

  const unread = messages.filter((m) => !m.is_read).length;

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-[#F4A800] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] px-4 py-24">
      {/* Background blob */}
      <div className="fixed top-0 left-[50%] -translate-x-1/2 w-[700px] h-[300px] rounded-full bg-[#F4A800] opacity-[0.07] blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-black text-white">
            Salamalekoum,{" "}
            <span className="text-[#F4A800]">@{profile?.username}</span> 👋
          </h1>
          <p className="text-white/40 text-sm">
            {messages.length === 0
              ? "Dégg rekk — partagel sa lien ngirr diott ay messages."
              : `${messages.length} message${messages.length > 1 ? "s" : ""} reçu${messages.length > 1 ? "s" : ""}${unread > 0 ? ` · ${unread} nouveau${unread > 1 ? "x" : ""}` : ""}`}
          </p>
        </div>

        {/* Link card */}
        <div className="p-5 rounded-2xl border border-[#F4A800]/20 bg-[#F4A800]/5 backdrop-blur-sm flex flex-col gap-3">
          <p className="text-white/50 text-xs uppercase tracking-widest font-medium">
            Ton lien wakhma
          </p>
          <div className="flex items-center gap-3">
            <div className="flex-1 px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-[#F4A800] text-sm font-medium truncate">
              {myLink}
            </div>
            <button
              onClick={copyLink}
              className="shrink-0 px-4 py-3 rounded-xl bg-[#F4A800] text-black text-sm font-bold hover:bg-[#ffc233] transition-all duration-200 active:scale-95"
            >
              {copied ? "Copié ✓" : "Copier"}
            </button>
          </div>
          <p className="text-white/25 text-xs">
            partage ko say kharite — ils peuvent t'écrire de façon anonyme 🤫
          </p>
        </div>

        {/* Messages */}
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <span className="text-5xl">📭</span>
            <p className="text-white/40 text-sm">
              Aucun message pour l'instant.
            </p>
            <p className="text-white/20 text-xs">
              Partage ton lien et attends! 😄
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <p className="text-white/30 text-xs uppercase tracking-widest font-medium">
              Tes messages
            </p>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className="p-5 rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm flex flex-col gap-4 hover:border-white/[0.1] transition-all duration-200"
              >
                {/* Message content */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-white text-sm leading-relaxed flex-1">
                      {msg.content}
                    </p>
                    {!msg.is_read && (
                      <span className="shrink-0 w-2 h-2 rounded-full bg-[#F4A800] mt-1.5" />
                    )}
                  </div>
                  <p className="text-white/20 text-xs">
                    {new Date(msg.created_at).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                {/* Reply */}
                {msg.reply ? (
                  <div className="flex flex-col gap-3">
                    <div className="px-4 py-3 rounded-xl bg-[#F4A800]/10 border border-[#F4A800]/20">
                      <p className="text-[#F4A800]/80 text-xs font-medium mb-1">
                        Ta réponse
                      </p>
                      <p className="text-white/80 text-sm leading-relaxed">
                        {msg.reply}
                      </p>
                    </div>
                    <button
                      onClick={() => shareToWhatsApp(msg)}
                      className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] text-sm font-semibold hover:bg-[#25D366]/20 transition-all duration-200 active:scale-95"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.118.554 4.107 1.523 5.83L.057 23.486a.5.5 0 00.614.612l5.757-1.51A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.894a9.878 9.878 0 01-5.031-1.378l-.36-.214-3.733.979.997-3.645-.235-.374A9.861 9.861 0 012.106 12C2.106 6.53 6.53 2.106 12 2.106S21.894 6.53 21.894 12 17.47 21.894 12 21.894z" />
                      </svg>
                      Partager sur WhatsApp
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <textarea
                      rows={2}
                      value={replyText[msg.id] ?? ""}
                      onChange={(e) =>
                        setReplyText((prev) => ({
                          ...prev,
                          [msg.id]: e.target.value,
                        }))
                      }
                      placeholder="Tekki ci message bi... (ta réponse)"
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder-white/20 text-sm outline-none focus:border-[#F4A800]/40 transition-all duration-200 resize-none"
                    />
                    <button
                      onClick={() => saveReply(msg.id)}
                      disabled={
                        !replyText[msg.id]?.trim() || savingReply === msg.id
                      }
                      className="self-end px-5 py-2.5 rounded-xl bg-[#F4A800] text-black text-sm font-bold disabled:opacity-30 hover:bg-[#ffc233] transition-all duration-200 active:scale-95"
                    >
                      {savingReply === msg.id ? "Envoi..." : "Répondre →"}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Share Modal */}
      {shareMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-sm flex flex-col gap-4">
            {/* Card à partager */}
            <div
              ref={cardRef}
              className="w-full rounded-2xl overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, #111 0%, #1a1400 50%, #111 100%)",
                border: "1px solid rgba(244,168,0,0.2)",
                padding: "28px",
              }}
            >
              {/* Logo */}
              <p
                style={{
                  color: "#F4A800",
                  fontWeight: 900,
                  fontSize: "18px",
                  marginBottom: "20px",
                  letterSpacing: "-0.5px",
                }}
              >
                wakhma.
              </p>

              {/* Message */}
              <div
                style={{
                  background: "rgba(255,255,255,0.04)",
                  borderRadius: "12px",
                  padding: "16px",
                  marginBottom: "12px",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <p
                  style={{
                    color: "rgba(255,255,255,0.4)",
                    fontSize: "10px",
                    marginBottom: "8px",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                  }}
                >
                  Message anonyme
                </p>
                <p
                  style={{
                    color: "white",
                    fontSize: "15px",
                    lineHeight: "1.6",
                  }}
                >
                  {shareMsg.content}
                </p>
              </div>

              {/* Reply */}
              <div
                style={{
                  background: "rgba(244,168,0,0.08)",
                  borderRadius: "12px",
                  padding: "16px",
                  border: "1px solid rgba(244,168,0,0.15)",
                  marginBottom: "20px",
                }}
              >
                <p
                  style={{
                    color: "rgba(244,168,0,0.6)",
                    fontSize: "10px",
                    marginBottom: "8px",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                  }}
                >
                  @{profile?.username} a répondu
                </p>
                <p
                  style={{
                    color: "rgba(255,255,255,0.85)",
                    fontSize: "15px",
                    lineHeight: "1.6",
                  }}
                >
                  {shareMsg.reply}
                </p>
              </div>

              {/* Footer */}
              <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "11px" }}>
                Wakh sa xalaat → wakhma.vercel.app/{profile?.username}
              </p>
            </div>

            {/* Actions */}
            <button
              onClick={downloadCard}
              className="w-full py-3.5 rounded-xl bg-[#F4A800] text-black font-bold text-sm hover:bg-[#ffc233] transition-all active:scale-95"
            >
              Télécharger la carte 📸
            </button>
            <p className="text-white/30 text-xs text-center">
              Télécharge l'image et poste-la dans ton statut WhatsApp
            </p>
            <button
              onClick={() => setShareMsg(null)}
              className="text-white/30 text-sm hover:text-white/60 transition-colors text-center"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
