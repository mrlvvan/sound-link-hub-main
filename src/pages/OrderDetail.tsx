import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, User, MessageCircle, Clock, Package, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSettingsStore } from "@/stores/settingsStore";
import { formatPrice } from "@/lib/formatPrice";
import { EntityChat } from "@/components/chat/EntityChat";

const OrderDetail = () => {
  const { orderId } = useParams();
  const { safeAreaTopInset, isFullscreen } = useSettingsStore();
  const isDemo = orderId === "demo";

  // Mock order data
  type OrderStatus = "pending" | "in_progress" | "review" | "completed" | "cancelled";
  
  type OrderType = "custom" | "ready_beat";

  const demoOrder = {
    id: "demo",
    orderType: "custom" as OrderType,
    service: "Демо-заказ (проверка чата)",
    description: "Это демонстрационный заказ для проверки работы чата. Вы можете писать сообщения без авторизации.",
    category: "Демо",
    status: "in_progress" as OrderStatus,
    createdAt: "Сейчас",
    deadline: "—",
    price: 0,
    platformFee: 0,
    total: 0,
    client: { username: "you", name: "Вы", avatar: "", rating: 5 },
    provider: { username: "soundlinker", name: "SoundLinker", avatar: "", rating: 5 },
    fundsStatus: "none",
    timeline: [
      { status: "created", label: "Заказ создан", date: "Сейчас", completed: true },
      { status: "payment", label: "Оплата получена", date: null, completed: false },
      { status: "in_progress", label: "В работе", date: null, completed: false },
      { status: "review", label: "На проверке", date: null, completed: false },
      { status: "completed", label: "Завершено", date: null, completed: false },
    ],
  };

  const defaultOrder: {
    id: number;
    orderType: OrderType;
    service: string;
    description: string;
    category: string;
    status: OrderStatus;
    createdAt: string;
    deadline: string;
    price: number;
    platformFee: number;
    total: number;
    client: { username: string; name: string; avatar: string; rating: number };
    provider: { username: string; name: string; avatar: string; rating: number };
    fundsStatus: string;
    timeline: Array<{ status: string; label: string; date: string | null; completed: boolean }>;
    readyBeatTimeline?: Array<{ status: string; label: string; date: string | null; completed: boolean }>;
  } = {
    id: isDemo ? 0 : Number(orderId),
    orderType: "custom",
    service: "Trap бит production",
    description: "Нужен trap бит в стиле Southside, с тяжелыми 808, crispy hi-hats и мрачной атмосферой. Желательно использовать синтезаторы типа Omnisphere. BPM около 140-145. Длительность 2:30-3:00 минуты. Нужен stems для дальнейшего сведения.",
    category: "Битмейкинг",
    status: "in_progress",
    createdAt: "15 окт 2025, 14:30",
    deadline: "18 окт 2025, 23:59",
    price: 15000,
    platformFee: 1500,
    total: 16500,
    client: {
      username: "rapper_jay",
      name: "Jay",
      avatar: "",
      rating: 4.8
    },
    provider: {
      username: "trapmaster",
      name: "TrapMaster",
      avatar: "",
      rating: 4.9
    },
    fundsStatus: "frozen",
    timeline: [
      { status: "created", label: "Заказ создан", date: "15 окт, 14:30", completed: true },
      { status: "payment", label: "Оплата получена", date: "15 окт, 14:32", completed: true },
      { status: "in_progress", label: "Работа начата", date: "15 окт, 18:00", completed: true },
      { status: "review", label: "На проверке", date: null, completed: false },
      { status: "completed", label: "Завершено", date: null, completed: false },
    ],
    readyBeatTimeline: [
      { status: "transfer", label: "Оформлен перевод", date: null, completed: false },
      { status: "buyer_confirm", label: "Покупатель подтвердил оплату", date: null, completed: false },
      { status: "seller_confirm", label: "Продавец подтвердил получение", date: null, completed: false },
      { status: "delivered", label: "Бит передан покупателю", date: null, completed: false },
    ],
  };

  const isReadyBeat = orderId === "ready-beat";

  const readyBeatOrder = {
    ...defaultOrder,
    id: 0,
    orderType: "ready_beat" as OrderType,
    service: "Готовый бит — Dark Drill",
    description: "Покупка готового бита. Сначала оформляется перевод, затем обе стороны подтверждают оплату/получение, после чего бит передаётся покупателю.",
    category: "Готовый бит",
    client: { username: "you", name: "Вы", avatar: "", rating: 5 },
    provider: { username: "drillking", name: "DrillKing", avatar: "", rating: 4.9 },
    price: 5000,
    platformFee: 500,
    total: 5500,
    readyBeatTimeline: [
      { status: "transfer", label: "Оформлен перевод", date: "16 окт, 10:00", completed: true },
      { status: "buyer_confirm", label: "Покупатель подтвердил оплату", date: null, completed: false },
      { status: "seller_confirm", label: "Продавец подтвердил получение", date: null, completed: false },
      { status: "delivered", label: "Бит передан покупателю", date: null, completed: false },
    ],
  };

  const order = isDemo ? demoOrder : (isReadyBeat ? readyBeatOrder : defaultOrder);
  const isClient = true; // Mock: current user is client

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return { label: "В ожидании", icon: Clock, color: "text-info", bgColor: "bg-info/10" };
      case "in_progress":
        return { label: "В работе", icon: Clock, color: "text-accent", bgColor: "bg-accent/10" };
      case "review":
        return { label: "На проверке", icon: AlertCircle, color: "text-primary", bgColor: "bg-primary/10" };
      case "completed":
        return { label: "Завершено", icon: CheckCircle2, color: "text-green-500", bgColor: "bg-green-500/10" };
      case "cancelled":
        return { label: "Отменено", icon: XCircle, color: "text-red-500", bgColor: "bg-red-500/10" };
      default:
        return { label: "Неизвестно", icon: Clock, color: "text-muted-foreground", bgColor: "bg-muted/10" };
    }
  };

  const statusConfig = getStatusConfig(order.status);
  const StatusIcon = statusConfig.icon;
  const otherUser = isClient ? order.provider : order.client;

  return (
    <div className="min-h-screen pb-24 bg-background" style={{ paddingTop: isFullscreen ? `calc(1rem + ${safeAreaTopInset}px)` : '1rem' }}>
      {/* Header */}
      <div 
        className="sticky z-50 bg-background/95 backdrop-blur border-b border-border" 
        style={{ top: isFullscreen ? `${safeAreaTopInset}px` : '0' }}
      >
        <div className="max-w-3xl mx-auto px-3 h-14 flex items-center">
          <Link to="/orders">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="ml-2 font-semibold text-base">Детали заказа {isDemo ? "Демо" : `#${order.id}`}</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-3 py-4 space-y-4">
        {/* Status Card */}
        <Card className="p-4">
          <div className="flex items-start justify-between mb-3 gap-2">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold mb-2 break-words">{order.service}</h2>
              <Badge variant="outline" className="text-xs">{order.category}</Badge>
            </div>
            <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full ${statusConfig.bgColor} shrink-0`}>
              <StatusIcon className={`w-3.5 h-3.5 ${statusConfig.color}`} />
              <span className={`text-xs font-medium ${statusConfig.color}`}>
                {statusConfig.label}
              </span>
            </div>
          </div>

          <Separator className="my-3" />

          {/* P2P Info */}
          {order.fundsStatus !== "none" && (
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 mb-3">
              <p className="text-xs font-medium flex items-center gap-2">
                🤝 П2П: платформа — гарант сделки
              </p>
              <p className="text-[11px] text-muted-foreground mt-1">
                Переводы напрямую между сторонами. Реквизиты в чате.
              </p>
            </div>
          )}

          {/* Description */}
          <div className="mb-3">
            <h3 className="font-semibold mb-2 flex items-center gap-2 text-sm">
              <Package className="w-4 h-4" />
              Описание задачи
            </h3>
            <p className="text-muted-foreground text-xs leading-relaxed break-words">
              {order.description}
            </p>
          </div>

          <Separator className="my-3" />

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Создан</p>
              <p className="font-medium text-xs flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span className="break-words">{order.createdAt}</span>
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Срок выполнения</p>
              <p className="font-medium text-xs flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span className="break-words">{order.deadline}</span>
              </p>
            </div>
          </div>

          <Separator className="my-3" />

          {/* Price Breakdown */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Стоимость услуги</span>
              <span className="font-medium">{formatPrice(order.price)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Комиссия платформы (10%)</span>
              <span className="font-medium">{formatPrice(order.platformFee)}</span>
            </div>
            <Separator />
            <div className="flex justify-between pt-0.5">
              <span className="font-semibold text-sm">Итого</span>
              <span className="font-bold text-base text-primary">{formatPrice(order.total)}</span>
            </div>
          </div>
        </Card>

        {/* User Card */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2 text-sm">
            <User className="w-4 h-4" />
            {isClient ? "Исполнитель" : "Заказчик"}
          </h3>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <Avatar className="w-11 h-11 shrink-0">
                <AvatarImage src={otherUser.avatar} />
                <AvatarFallback className="bg-gradient-primary text-white text-sm">
                  {otherUser.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm truncate">{otherUser.name}</p>
                <p className="text-xs text-muted-foreground truncate">@{otherUser.username}</p>
                <p className="text-xs text-muted-foreground">⭐ {otherUser.rating}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Чат по заказу */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2 text-sm">
            <MessageCircle className="w-4 h-4" />
            Чат по заказу
          </h3>
          <EntityChat entityType="order" entityId={orderId ?? ""} demo={orderId === "demo"} />
        </Card>

        {/* Timeline */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3 text-sm">
            {order.orderType === "ready_beat" ? "Этапы сделки (готовый бит)" : "История заказа"}
          </h3>
          <div className="space-y-3">
            {(() => {
              const timelineItems = order.orderType === "ready_beat" && order.readyBeatTimeline ? order.readyBeatTimeline : order.timeline;
              return timelineItems.map((item, index) => (
              <div key={item.status} className={`flex gap-2.5 relative ${item.date ? 'items-start' : 'items-center'}`}>
                {/* Vertical line connecting timeline items */}
                {index < timelineItems.length - 1 && (
                  <div 
                    className="absolute left-[13px] top-7 bottom-0 w-[2px] -mb-3"
                    style={{ 
                      background: timelineItems[index + 1].completed 
                        ? 'hsl(var(--primary))' 
                        : 'hsl(var(--border))'
                    }}
                  />
                )}
                
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 ${
                  item.completed ? 'bg-primary/20' : 'bg-muted'
                }`}>
                  {item.completed ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-medium text-xs ${!item.completed && 'text-muted-foreground'} break-words`}>
                    {item.label}
                  </p>
                  {item.date && (
                    <p className="text-[11px] text-muted-foreground">{item.date}</p>
                  )}
                </div>
              </div>
            ));
            })()}
          </div>
        </Card>

        {/* Actions */}
        <div className="space-y-2.5">
          {isClient && order.status === "review" && (
            <>
              <Button className="w-full h-11 bg-gradient-primary hover:shadow-neon text-sm">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Принять работу
              </Button>
              <Button variant="outline" className="w-full h-11 text-sm">
                Запросить доработку
              </Button>
            </>
          )}
          
          {!isClient && order.status === "pending" && (
            <Button className="w-full h-11 bg-gradient-accent hover:shadow-accent text-sm">
              Начать работу
            </Button>
          )}

          {!isClient && order.status === "in_progress" && (
            <Button className="w-full h-11 bg-gradient-primary hover:shadow-neon text-sm">
              Отправить на проверку
            </Button>
          )}

          {order.status === "pending" && (
            <Button variant="outline" className="w-full h-11 border-destructive/30 hover:bg-destructive/10 text-destructive text-sm">
              <XCircle className="w-4 h-4 mr-2" />
              Отменить заказ
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
