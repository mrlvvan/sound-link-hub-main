import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, Send, CheckCircle2, XCircle, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSettingsStore } from "@/stores/settingsStore";
import { useAuth } from "@/contexts/AuthContext";
import {
  getBookingById,
  getBookingMessages,
  sendBookingMessage,
  updateBookingStatus,
  STATUS_LABELS,
  STATUS_COLORS,
  type BookingRecord,
  type BookingMessage,
} from "@/lib/bookings";
import { supabase } from "@/lib/supabase";
import { hasReviewed } from "@/lib/reviews";
import { ReviewDialog } from "@/components/studios/ReviewDialog";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import { toast } from "sonner";

const BookingDetail = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const { user, profile } = useAuth();
  const { safeAreaTopInset, isFullscreen } = useSettingsStore();
  const navigate = useNavigate();

  const [booking, setBooking] = useState<BookingRecord | null>(null);
  const [messages, setMessages] = useState<BookingMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const loadMessages = useCallback(async () => {
    if (!bookingId) return;
    const msgs = await getBookingMessages(bookingId);
    setMessages(msgs);
  }, [bookingId]);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    if (!bookingId) return;

    const init = async () => {
      setLoading(true);
      try {
        const [b] = await Promise.all([getBookingById(bookingId), loadMessages()]);
        setBooking(b);
        if (b && b.status === "completed" && user?.id === b.renter_id) {
          const reviewed = await hasReviewed(bookingId);
          setAlreadyReviewed(reviewed);
        }
      } finally {
        setLoading(false);
      }
    };
    void init();
  }, [bookingId, user, navigate, loadMessages]);

  // Realtime
  useEffect(() => {
    if (!bookingId) return;
    const channel = supabase
      .channel(`booking-msgs-${bookingId}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "booking_messages",
        filter: `booking_id=eq.${bookingId}`,
      }, (payload) => {
        const msg = payload.new as BookingMessage;
        setMessages((prev) => prev.find((m) => m.id === msg.id) ? prev : [...prev, msg]);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [bookingId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || sending || !user || !bookingId) return;
    const text = input.trim();
    setInput("");
    setSending(true);
    try {
      const msg = await sendBookingMessage(bookingId, user.id, text);
      msg.sender = { id: user.id, username: profile?.username ?? "", display_name: profile?.display_name ?? null, avatar_url: profile?.avatar_url ?? null };
      setMessages((prev) => prev.find((m) => m.id === msg.id) ? prev : [...prev, msg]);
    } catch {
      setInput(text);
      toast.error("Не удалось отправить");
    } finally {
      setSending(false);
    }
  };

  const handleStatus = async (status: "confirmed" | "completed" | "cancelled") => {
    if (!bookingId) return;
    try {
      await updateBookingStatus(bookingId, status);
      setBooking((prev) => prev ? { ...prev, status } : prev);
      toast.success(STATUS_LABELS[status]);
      // Prompt renter to review when booking is completed
      if (status === "completed" && booking && user?.id === booking.renter_id) {
        const reviewed = await hasReviewed(bookingId);
        setAlreadyReviewed(reviewed);
        if (!reviewed) setShowReview(true);
      }
    } catch {
      toast.error("Ошибка");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground text-sm">Загрузка бронирования...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-3">
        <p className="font-semibold">Бронирование не найдено</p>
        <Button variant="outline" onClick={() => navigate("/bookings")}>К бронированиям</Button>
      </div>
    );
  }

  const isRenter = user?.id === booking.renter_id;
  const isOwner = user?.id === booking.owner_id;
  const partner = isRenter ? booking.owner : booking.renter;
  const partnerName = partner?.display_name || partner?.username || "—";
  const start = new Date(booking.start_time);
  const end = new Date(booking.end_time);
  const studioName = booking.studio?.name ?? "Студия";

  const openMap = () => {
    const query = encodeURIComponent(booking.studio?.address ?? studioName);
    window.open(`https://yandex.ru/maps/?text=${query}`, "_blank");
  };

  return (
    <div
      className="flex flex-col h-screen max-w-lg mx-auto"
      style={{ paddingTop: isFullscreen ? `${safeAreaTopInset}px` : "0" }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-background/95 backdrop-blur-lg flex-shrink-0">
        <Button variant="ghost" size="icon" onClick={() => navigate("/bookings")}>
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
            <p className="text-xs text-muted-foreground truncate">{studioName}</p>
          </div>
        </Link>
        <Badge className={`text-[11px] border flex-shrink-0 ${STATUS_COLORS[booking.status]}`} variant="outline">
          {STATUS_LABELS[booking.status]}
        </Badge>
      </div>

      {/* Booking info */}
      <div className="px-4 py-3 bg-muted/30 border-b border-border flex-shrink-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
              <Calendar className="w-3 h-3" />
              <span>
                {start.toLocaleDateString("ru-RU", { day: "numeric", month: "short" })},&nbsp;
                {start.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}
                &nbsp;–&nbsp;
                {end.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
            {booking.studio?.address && (
              <button onClick={openMap} className="flex items-center gap-1 text-xs text-primary hover:underline">
                <MapPin className="w-3 h-3" />
                {booking.studio.address}
              </button>
            )}
            <p className="font-bold text-lg text-primary mt-1">
              ₽{booking.total_price.toLocaleString("ru-RU")}
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            {isOwner && booking.status === "pending" && (
              <>
                <Button size="sm" variant="outline" className="text-red-500 border-red-500/30 hover:bg-red-500/10"
                  onClick={() => void handleStatus("cancelled")}>
                  <XCircle className="w-3.5 h-3.5 mr-1" />
                  Отклонить
                </Button>
                <Button size="sm" onClick={() => void handleStatus("confirmed")}>
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                  Принять
                </Button>
              </>
            )}
            {isOwner && booking.status === "confirmed" && (
              <Button size="sm" onClick={() => void handleStatus("completed")}>
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                Завершить
              </Button>
            )}
            {isRenter && booking.status === "pending" && (
              <Button size="sm" variant="outline" className="text-red-500 border-red-500/30 hover:bg-red-500/10"
                onClick={() => void handleStatus("cancelled")}>
                <XCircle className="w-3.5 h-3.5 mr-1" />
                Отменить
              </Button>
            )}
          </div>
        </div>
        <p className="text-[11px] text-muted-foreground mt-1.5 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {formatDistanceToNow(new Date(booking.created_at), { addSuffix: true, locale: ru })}
        </p>
      </div>

      <Separator />

      {/* Review prompt for renter on completed booking */}
      {isRenter && booking.status === "completed" && !alreadyReviewed && (
        <button
          onClick={() => setShowReview(true)}
          className="flex items-center gap-3 px-4 py-3 bg-yellow-500/10 border-b border-yellow-500/20 hover:bg-yellow-500/15 transition-colors w-full text-left flex-shrink-0"
        >
          <Star className="w-4 h-4 text-yellow-500 flex-shrink-0" />
          <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
            Оцените студию — оставьте отзыв
          </span>
          <span className="ml-auto text-xs text-yellow-500">→</span>
        </button>
      )}

      {/* Messages */}
      <ScrollArea className="flex-1 px-4 py-3">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground text-sm">
              {isRenter
                ? "Запрос отправлен. Напишите владельцу студии что-нибудь."
                : "Новый запрос на бронирование! Ответьте арендатору."}
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
      {booking.status !== "cancelled" && booking.status !== "completed" && (
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

      {booking.studio_id && user && showReview && (
        <ReviewDialog
          open={showReview}
          onOpenChange={setShowReview}
          studioId={booking.studio_id}
          studioName={studioName}
          bookingId={booking.id}
          reviewerId={user.id}
          onSubmitted={() => setAlreadyReviewed(true)}
        />
      )}
    </div>
  );
};

export default BookingDetail;
