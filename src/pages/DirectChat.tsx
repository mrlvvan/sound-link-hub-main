import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import {
  getMessagesWith,
  sendDirectMessage,
  markMessagesRead,
  type DirectMessage,
} from "@/lib/messages";
import { getProfileByUserId } from "@/lib/music";
import { supabase } from "@/lib/supabase";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import { toast } from "sonner";
import type { ProfileRecord } from "@/lib/music";

const DirectChat = () => {
  const { userId: partnerId } = useParams<{ userId: string }>();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [partner, setPartner] = useState<ProfileRecord | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const loadMessages = useCallback(async () => {
    if (!user || !partnerId) return;
    const data = await getMessagesWith(user.id, partnerId);
    setMessages(data);
    await markMessagesRead(user.id, partnerId);
  }, [user, partnerId]);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    if (!partnerId) return;

    const init = async () => {
      setLoading(true);
      try {
        const [partnerProfile] = await Promise.all([
          getProfileByUserId(partnerId),
          loadMessages(),
        ]);
        setPartner(partnerProfile);
      } finally {
        setLoading(false);
      }
    };
    void init();
  }, [user, partnerId, navigate, loadMessages]);

  // Realtime подписка
  useEffect(() => {
    if (!user || !partnerId) return;

    const channel = supabase
      .channel(`dm-${[user.id, partnerId].sort().join("-")}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "direct_messages",
        },
        (payload) => {
          const msg = payload.new as DirectMessage;
          const isRelevant =
            (msg.sender_id === user.id && msg.receiver_id === partnerId) ||
            (msg.sender_id === partnerId && msg.receiver_id === user.id);
          if (isRelevant) {
            setMessages((prev) => {
              if (prev.find((m) => m.id === msg.id)) return prev;
              return [...prev, msg];
            });
            if (msg.receiver_id === user.id) {
              void markMessagesRead(user.id, partnerId);
            }
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user, partnerId]);

  // Автоскролл
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || sending || !user || !partnerId) return;
    const text = input.trim();
    setInput("");
    setSending(true);
    try {
      const msg = await sendDirectMessage(user.id, partnerId, text);
      setMessages((prev) => {
        if (prev.find((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
    } catch {
      setInput(text);
      toast.error("Не удалось отправить сообщение");
    } finally {
      setSending(false);
    }
  };

  const partnerName = partner?.display_name || partner?.username || "Пользователь";

  return (
    <div className="flex flex-col h-screen max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-background/95 backdrop-blur-lg sticky top-0 z-10">
        <Button variant="ghost" size="icon" onClick={() => navigate("/messages")}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        {partner ? (
          <Link to={`/profile/${partner.username}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Avatar className="w-9 h-9">
              <AvatarImage src={partner.avatar_url ?? undefined} />
              <AvatarFallback className="bg-primary/20 text-sm font-semibold">
                {partnerName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-sm leading-tight">{partnerName}</p>
              {partner.username && (
                <p className="text-xs text-muted-foreground">@{partner.username}</p>
              )}
            </div>
          </Link>
        ) : (
          <div className="w-32 h-8 bg-muted rounded animate-pulse" />
        )}
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-4 py-4">
        {loading ? (
          <div className="flex items-center justify-center h-full py-20">
            <p className="text-muted-foreground text-sm">Загрузка...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Avatar className="w-16 h-16 mb-4">
              <AvatarImage src={partner?.avatar_url ?? undefined} />
              <AvatarFallback className="bg-primary/20 text-xl font-bold">
                {partnerName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <p className="font-semibold">{partnerName}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Начните разговор
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {messages.map((msg) => {
              const isOwn = msg.sender_id === user?.id;
              const senderProfile = isOwn ? profile : partner;
              const senderName = senderProfile?.display_name || senderProfile?.username || "";

              return (
                <div key={msg.id} className={`flex items-end gap-2 ${isOwn ? "flex-row-reverse" : ""}`}>
                  {!isOwn && (
                    <Avatar className="w-7 h-7 flex-shrink-0 mb-0.5">
                      <AvatarImage src={partner?.avatar_url ?? undefined} />
                      <AvatarFallback className="text-[10px] bg-primary/20">
                        {senderName.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`max-w-[72%] group ${isOwn ? "items-end" : "items-start"} flex flex-col gap-0.5`}>
                    <div
                      className={`rounded-2xl px-3.5 py-2 text-sm break-words ${
                        isOwn
                          ? "bg-primary text-primary-foreground rounded-br-sm"
                          : "bg-muted rounded-bl-sm"
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-muted-foreground px-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true, locale: ru })}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={scrollRef} />
          </div>
        )}
      </ScrollArea>

      {/* Input */}
      <div className="px-4 py-3 border-t border-border bg-background">
        <div className="flex gap-2 items-center">
          <Input
            placeholder="Сообщение..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void handleSend();
              }
            }}
            disabled={sending}
            className="flex-1"
          />
          <Button
            size="icon"
            onClick={() => void handleSend()}
            disabled={sending || !input.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DirectChat;
