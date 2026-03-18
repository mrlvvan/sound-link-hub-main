import { useEffect, useRef, useState, useCallback } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";

type Message = {
  id: string;
  text: string;
  sender_id: string;
  created_at: string;
  sender?: { username?: string; display_name?: string; avatar_url?: string };
};

type EntityChatProps = {
  entityType: "order" | "booking";
  entityId: string;
  /** Демо-режим: чат работает через localStorage без авторизации */
  demo?: boolean;
};

const DEMO_STORAGE_KEY = (type: string, id: string) => `soundlink-chat-${type}-${id}`;

export const EntityChat = ({ entityType, entityId, demo: forceDemo }: EntityChatProps) => {
  const { user, profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isDemo = forceDemo || entityId === "demo";
  const storageKey = DEMO_STORAGE_KEY(entityType, entityId);

  const loadFromLocalStorage = useCallback(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as Message[];
        setMessages(parsed);
      } else {
        setMessages([]);
      }
    } catch {
      setMessages([]);
    }
    setLoading(false);
  }, [storageKey]);

  const loadFromSupabase = useCallback(async () => {
    const tableName = entityType === "order" ? "order_messages" : "booking_messages";
    const entityCol = entityType === "order" ? "order_id" : "booking_id";

    const { data, error } = await supabase
      .from(tableName)
      .select(`
        id, text, sender_id, created_at,
        sender:profiles(username, display_name, avatar_url)
      `)
      .eq(entityCol, entityId)
      .order("created_at", { ascending: true });

    if (!error && data) setMessages(data as Message[]);
    setLoading(false);
  }, [entityType, entityId]);

  useEffect(() => {
    if (isDemo) {
      loadFromLocalStorage();
      return;
    }
    loadFromSupabase();

    const tableName = entityType === "order" ? "order_messages" : "booking_messages";
    const entityCol = entityType === "order" ? "order_id" : "booking_id";

    const channel = supabase
      .channel(`${tableName}-${entityId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: tableName,
          filter: `${entityCol}=eq.${entityId}`,
        },
        () => loadFromSupabase()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [entityType, entityId, isDemo]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || sending) return;

    const text = input.trim();
    setInput("");
    setSending(true);

    if (isDemo) {
      const newMsg: Message = {
        id: crypto.randomUUID(),
        text,
        sender_id: "demo-user",
        created_at: new Date().toISOString(),
        sender: {
          display_name: user ? (profile?.display_name || profile?.username || "Вы") : "Гость",
          username: user ? profile?.username : "guest",
        },
      };
      const updated = [...messages, newMsg];
      setMessages(updated);
      localStorage.setItem(storageKey, JSON.stringify(updated));
      setSending(false);
      return;
    }

    if (!user) {
      setSending(false);
      return;
    }

    const tableName = entityType === "order" ? "order_messages" : "booking_messages";
    const payload =
      entityType === "order"
        ? { order_id: entityId, sender_id: user.id, text }
        : { booking_id: entityId, sender_id: user.id, text };
    await supabase.from(tableName).insert(payload);
    setSending(false);
  };

  const canSend = isDemo || user;
  const displayName = user ? (profile?.display_name || profile?.username || "Вы") : "Гость";

  if (!canSend && !isDemo) {
    return (
      <p className="text-sm text-muted-foreground py-4 text-center">
        Войдите, чтобы писать в чате
      </p>
    );
  }

  return (
    <div className="flex flex-col">
      <ScrollArea className="h-[240px] pr-2">
        <div className="space-y-2 py-2">
          {loading ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Загрузка сообщений...
            </p>
          ) : messages.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Нет сообщений. Напишите первым
            </p>
          ) : (
            messages.map((msg) => {
              const isOwn = isDemo ? msg.sender_id === "demo-user" : msg.sender_id === user?.id;
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2 ${isOwn ? "flex-row-reverse" : ""}`}
                >
                  <Avatar className="w-7 h-7 shrink-0">
                    <AvatarImage src={(msg as any).sender?.avatar_url} />
                    <AvatarFallback className="text-[10px] bg-primary/20">
                      {((msg as any).sender?.display_name || (msg as any).sender?.username || "?")
                        .slice(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`max-w-[75%] rounded-lg px-3 py-2 ${
                      isOwn ? "bg-primary/20 text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    <p className="text-xs font-medium opacity-80">
                      {(msg as any).sender?.display_name || (msg as any).sender?.username || "Пользователь"}
                    </p>
                    <p className="text-sm break-words">{msg.text}</p>
                    <p className="text-[10px] opacity-70 mt-0.5">
                      {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true, locale: ru })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>
      <div className="flex gap-2 pt-3">
        <Input
          placeholder="Сообщение..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
        />
        <Button size="icon" onClick={sendMessage} disabled={sending || !input.trim()}>
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
