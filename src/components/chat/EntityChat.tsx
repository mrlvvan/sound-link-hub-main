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
import { toast } from "sonner";

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
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isDemo = forceDemo || entityId === "demo";
  const storageKey = DEMO_STORAGE_KEY(entityType, entityId);
  const tableName = entityType === "order" ? "order_messages" : "booking_messages";
  const entityCol = entityType === "order" ? "order_id" : "booking_id";

  const loadFromLocalStorage = useCallback(() => {
    setError(null);
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
      setError("Не удалось прочитать локальные сообщения");
    }
    setLoading(false);
  }, [storageKey]);

  const loadFromSupabase = useCallback(async () => {
    setError(null);
    const { data, error } = await supabase
      .from(tableName)
      .select(`
        id, text, sender_id, created_at,
        sender:profiles(username, display_name, avatar_url)
      `)
      .eq(entityCol, entityId)
      .order("created_at", { ascending: true });

    if (error) {
      setError("Не удалось загрузить сообщения");
      setLoading(false);
      return;
    }

    if (data) setMessages(data as Message[]);
    setLoading(false);
  }, [entityCol, entityId, tableName]);

  useEffect(() => {
    setLoading(true);
    if (isDemo) {
      loadFromLocalStorage();
      return;
    }
    void loadFromSupabase();

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
        () => {
          void loadFromSupabase();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [entityCol, entityId, isDemo, loadFromLocalStorage, loadFromSupabase, tableName]);

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
    const { error } = await supabase.from(tableName).insert(payload);
    if (error) {
      setInput(text);
      setSending(false);
      setError("Не удалось отправить сообщение");
      toast.error(error.message || "Не удалось отправить сообщение");
      return;
    }

    await loadFromSupabase();
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
          ) : error ? (
            <div className="text-center py-4 space-y-3">
              <p className="text-sm text-destructive">{error}</p>
              {!isDemo && (
                <Button size="sm" variant="outline" onClick={() => void loadFromSupabase()}>
                  Повторить
                </Button>
              )}
            </div>
          ) : messages.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Нет сообщений. Напишите первым
            </p>
          ) : (
            messages.map((msg) => {
              const isOwn = isDemo ? msg.sender_id === "demo-user" : msg.sender_id === user?.id;
              const senderName = msg.sender?.display_name || msg.sender?.username || "Пользователь";
              const senderInitials = senderName.slice(0, 2).toUpperCase();
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2 ${isOwn ? "flex-row-reverse" : ""}`}
                >
                  <Avatar className="w-7 h-7 shrink-0">
                    <AvatarImage src={msg.sender?.avatar_url} />
                    <AvatarFallback className="text-[10px] bg-primary/20">
                      {senderInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`max-w-[75%] rounded-lg px-3 py-2 ${
                      isOwn ? "bg-primary/20 text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    <p className="text-xs font-medium opacity-80">
                      {senderName}
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
