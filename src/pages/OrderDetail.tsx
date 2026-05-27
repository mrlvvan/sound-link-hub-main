import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Send, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import { useSettingsStore } from "@/stores/settingsStore";
import {
  getOrderById,
  getOrderMessages,
  sendOrderMessage,
  updateOrderStatus,
  STATUS_LABELS,
  STATUS_COLORS,
  ITEM_TYPE_LABELS,
  type OrderRecord,
  type OrderMessage,
} from "@/lib/orders";
import { supabase } from "@/lib/supabase";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import { toast } from "sonner";

const OrderDetail = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { user, profile } = useAuth();
  const { safeAreaTopInset, isFullscreen } = useSettingsStore();
  const navigate = useNavigate();

  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [messages, setMessages] = useState<OrderMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const loadMessages = useCallback(async () => {
    if (!orderId) return;
    const msgs = await getOrderMessages(orderId);
    setMessages(msgs);
  }, [orderId]);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    if (!orderId) return;

    const init = async () => {
      setLoading(true);
      try {
        const [o] = await Promise.all([getOrderById(orderId), loadMessages()]);
        setOrder(o);
      } finally {
        setLoading(false);
      }
    };
    void init();
  }, [orderId, user, navigate, loadMessages]);

  // Realtime
  useEffect(() => {
    if (!orderId) return;
    const channel = supabase
      .channel(`order-msgs-${orderId}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "order_messages",
        filter: `order_id=eq.${orderId}`,
      }, (payload) => {
        const msg = payload.new as OrderMessage;
        setMessages((prev) => prev.find((m) => m.id === msg.id) ? prev : [...prev, msg]);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [orderId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || sending || !user || !orderId) return;
    const text = input.trim();
    setInput("");
    setSending(true);
    try {
      const msg = await sendOrderMessage(orderId, user.id, text);
      msg.sender = { id: user.id, username: profile?.username ?? "", display_name: profile?.display_name ?? null, avatar_url: profile?.avatar_url ?? null };
      setMessages((prev) => prev.find((m) => m.id === msg.id) ? prev : [...prev, msg]);
    } catch {
      setInput(text);
      toast.error("Не удалось отправить");
    } finally {
      setSending(false);
    }
  };

  const handleStatus = async (status: "accepted" | "completed" | "cancelled") => {
    if (!orderId) return;
    try {
      await updateOrderStatus(orderId, status);
      setOrder((prev) => prev ? { ...prev, status } : prev);
      toast.success(STATUS_LABELS[status]);
    } catch {
      toast.error("Ошибка");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground text-sm">Загрузка заказа...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-3">
        <p className="font-semibold">Заказ не найден</p>
        <Button variant="outline" onClick={() => navigate("/orders")}>К заказам</Button>
      </div>
    );
  }

  const isBuyer = user?.id === order.buyer_id;
  const isSeller = user?.id === order.seller_id;
  const partner = isBuyer ? order.seller : order.buyer;
  const partnerName = partner?.display_name || partner?.username || "—";

  return (
    <div
      className="flex flex-col h-screen max-w-lg mx-auto"
      style={{ paddingTop: isFullscreen ? `${safeAreaTopInset}px` : "0" }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-background/95 backdrop-blur-lg flex-shrink-0">
        <Button variant="ghost" size="icon" onClick={() => navigate("/orders")}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <Link to={`/profile/${partner?.username}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity flex-1 min-w-0">
          <Avatar className="w-9 h-9 flex-shrink-0">
            <AvatarImage src={partner?.avatar_url ?? undefined} />
            <AvatarFallback className="bg-primary/20 text-sm font-semibold">
              {partnerName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="font-semibold text-sm truncate">{partnerName}</p>
            <p className="text-xs text-muted-foreground">@{partner?.username}</p>
          </div>
        </Link>
        <Badge className={`text-[11px] border flex-shrink-0 ${STATUS_COLORS[order.status]}`} variant="outline">
          {STATUS_LABELS[order.status]}
        </Badge>
      </div>

      {/* Order info */}
      <div className="px-4 py-3 bg-muted/30 border-b border-border flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                {ITEM_TYPE_LABELS[order.item_type]}
              </span>
              {order.license_name && (
                <Badge variant="outline" className="text-[10px] h-4 px-1.5 border-primary/40 text-primary">
                  {order.license_name}
                </Badge>
              )}
            </div>
            <p className="font-bold text-lg text-primary">
              ₽{order.amount.toLocaleString("ru-RU")}
            </p>
          </div>
          <div className="flex gap-2">
            {isSeller && order.status === "pending" && (
              <>
                <Button size="sm" variant="outline" className="text-red-500 border-red-500/30 hover:bg-red-500/10"
                  onClick={() => void handleStatus("cancelled")}>
                  <XCircle className="w-3.5 h-3.5 mr-1" />
                  Отклонить
                </Button>
                <Button size="sm" onClick={() => void handleStatus("accepted")}>
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                  Принять
                </Button>
              </>
            )}
            {isSeller && order.status === "accepted" && (
              <Button size="sm" onClick={() => void handleStatus("completed")}>
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                Завершить
              </Button>
            )}
            {isBuyer && order.status === "pending" && (
              <Button size="sm" variant="outline" className="text-red-500 border-red-500/30 hover:bg-red-500/10"
                onClick={() => void handleStatus("cancelled")}>
                <XCircle className="w-3.5 h-3.5 mr-1" />
                Отменить
              </Button>
            )}
          </div>
        </div>
        <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {formatDistanceToNow(new Date(order.created_at), { addSuffix: true, locale: ru })}
        </p>
      </div>

      <Separator />

      {/* Messages */}
      <ScrollArea className="flex-1 px-4 py-3">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground text-sm">
              {isBuyer
                ? "Заказ отправлен. Напишите продавцу что-нибудь, чтобы начать."
                : "Новый заказ! Ответьте покупателю."}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {messages.map((msg) => {
              const isOwn = msg.sender_id === user?.id;
              const sName = msg.sender?.display_name || msg.sender?.username || "?";
              return (
                <div key={msg.id} className={`flex items-end gap-2 ${isOwn ? "flex-row-reverse" : ""}`}>
                  {!isOwn && (
                    <Avatar className="w-7 h-7 flex-shrink-0">
                      <AvatarImage src={msg.sender?.avatar_url ?? undefined} />
                      <AvatarFallback className="text-[10px] bg-primary/20">{sName.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`max-w-[72%] group flex flex-col gap-0.5 ${isOwn ? "items-end" : "items-start"}`}>
                    <div className={`rounded-2xl px-3.5 py-2 text-sm break-words ${isOwn ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-muted rounded-bl-sm"}`}>
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
      {order.status !== "cancelled" && order.status !== "completed" && (
        <div className="px-4 py-3 border-t border-border bg-background flex-shrink-0">
          <div className="flex gap-2 items-center">
            <Input
              placeholder="Сообщение..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void handleSend(); } }}
              disabled={sending}
            />
            <Button size="icon" onClick={() => void handleSend()} disabled={sending || !input.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetail;
