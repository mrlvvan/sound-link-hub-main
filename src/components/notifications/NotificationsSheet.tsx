import { Bell, Heart, UserPlus, Building2, ShoppingBag, CheckCheck } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotifications } from "@/hooks/useNotifications";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import type { NotificationRecord, NotificationType } from "@/lib/notifications";

const TYPE_ICON: Record<NotificationType, React.ElementType> = {
  like:            Heart,
  follow:          UserPlus,
  booking_new:     Building2,
  booking_update:  Building2,
  order_new:       ShoppingBag,
  order_update:    ShoppingBag,
};

const TYPE_COLOR: Record<NotificationType, string> = {
  like:            "bg-red-500/10 text-red-500",
  follow:          "bg-blue-500/10 text-blue-500",
  booking_new:     "bg-violet-500/10 text-violet-500",
  booking_update:  "bg-violet-500/10 text-violet-500",
  order_new:       "bg-green-500/10 text-green-500",
  order_update:    "bg-green-500/10 text-green-500",
};

const NotificationItem = ({
  n,
  onMarkRead,
}: {
  n: NotificationRecord;
  onMarkRead: (id: string) => void;
}) => {
  const navigate = useNavigate();
  const Icon = TYPE_ICON[n.type] ?? Bell;
  const color = TYPE_COLOR[n.type] ?? "bg-primary/10 text-primary";

  const handleClick = () => {
    if (!n.read) onMarkRead(n.id);
    const data = n.data ?? {};
    if (n.type === "booking_new" || n.type === "booking_update") {
      if (data.bookingId) navigate(`/bookings/${data.bookingId as string}`);
    } else if (n.type === "order_new" || n.type === "order_update") {
      if (data.orderId) navigate(`/orders/${data.orderId as string}`);
    } else if (n.type === "follow" && data.fromUsername) {
      navigate(`/profile/${data.fromUsername as string}`);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`w-full flex items-start gap-3 px-4 py-3 transition-colors hover:bg-muted/50 text-left ${!n.read ? "bg-primary/5" : ""}`}
    >
      <div className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm leading-snug ${!n.read ? "font-semibold" : ""}`}>{n.title}</p>
        {n.body && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.body}</p>}
        <p className="text-[10px] text-muted-foreground mt-1">
          {formatDistanceToNow(new Date(n.created_at), { addSuffix: true, locale: ru })}
        </p>
      </div>
      {!n.read && (
        <span className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-1.5" />
      )}
    </button>
  );
};

interface NotificationsSheetProps {
  children?: React.ReactNode;
  side?: "left" | "right";
}

export const NotificationsSheet = ({ children, side = "right" }: NotificationsSheetProps) => {
  const { notifications, unreadCount, markAll, markOne } = useNotifications();

  return (
    <Sheet>
      <SheetTrigger asChild>
        {children ?? (
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[9px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </Button>
        )}
      </SheetTrigger>
      <SheetContent side={side} className="p-0 w-full sm:max-w-sm flex flex-col">
        <SheetHeader className="px-4 pt-5 pb-3 border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Уведомления
              {unreadCount > 0 && (
                <span className="bg-primary text-primary-foreground text-[10px] font-bold rounded-full px-1.5 py-0.5 leading-none">
                  {unreadCount}
                </span>
              )}
            </SheetTitle>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" className="text-xs h-7 gap-1.5" onClick={() => void markAll()}>
                <CheckCheck className="w-3.5 h-3.5" />
                Прочитать все
              </Button>
            )}
          </div>
        </SheetHeader>
        <ScrollArea className="flex-1">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
              <Bell className="w-10 h-10 text-muted-foreground/40 mb-3" />
              <p className="font-medium text-sm">Уведомлений пока нет</p>
              <p className="text-xs text-muted-foreground mt-1">
                Здесь будут появляться лайки, подписки и обновления по заказам
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {notifications.map((n) => (
                <NotificationItem key={n.id} n={n} onMarkRead={(id) => void markOne(id)} />
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
