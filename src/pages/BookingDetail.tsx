import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, MessageCircle, Clock, Image as ImageIcon, Star, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSettingsStore } from "@/stores/settingsStore";
import { formatPrice } from "@/lib/formatPrice";
import { openTelegramChat } from "@/lib/telegramUtils";

const BookingDetail = () => {
  const { bookingId } = useParams();
  const { safeAreaTopInset, isFullscreen } = useSettingsStore();

  // Mock booking data
  const booking = {
    id: Number(bookingId),
    studio: {
      name: "Studio Flow",
      photos: [
        "/images/studios/studio-flow-1.jpg",
        "/images/studios/studio-flow-2.jpg",
        "/images/studios/studio-flow-3.jpg"
      ],
      address: "Москва, ЦАО, ул. Тверская, 15",
      rating: 4.9,
      owner: {
        username: "studioflow_owner",
        name: "Андрей",
        avatar: ""
      }
    },
    rentalType: "hourly",
    startDate: "20 окт 2025, 15:00",
    endDate: "20 окт 2025, 19:00",
    duration: "4 часа",
    status: "confirmed" as const,
    createdAt: "16 окт 2025, 10:30",
    price: 8000,
    additionalServices: [
      { name: "Звукорежиссер", price: 2000 }
    ],
    platformFee: 1000,
    total: 11000,
    fundsStatus: "frozen",
    equipment: ["Neumann U87 Ai", "Yamaha HS8", "Universal Audio Apollo Twin"],
    specialRequests: "Нужна помощь с настройкой микрофона для записи вокала"
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return { label: "В ожидании", color: "text-info", bgColor: "bg-info/10" };
      case "confirmed":
        return { label: "Подтверждено", color: "text-green-500", bgColor: "bg-green-500/10" };
      case "active":
        return { label: "Активно", color: "text-accent", bgColor: "bg-accent/10" };
      case "completed":
        return { label: "Завершено", color: "text-primary", bgColor: "bg-primary/10" };
      case "cancelled":
        return { label: "Отменено", color: "text-red-500", bgColor: "bg-red-500/10" };
      default:
        return { label: "Неизвестно", color: "text-muted-foreground", bgColor: "bg-muted/10" };
    }
  };

  const statusConfig = getStatusConfig(booking.status);
  
  const openMap = () => {
    const query = encodeURIComponent(booking.studio.address);
    window.open(`https://yandex.ru/maps/?text=${query}`, '_blank');
  };

  return (
    <div className="min-h-screen pb-24 bg-background" style={{ paddingTop: isFullscreen ? `calc(1.5rem + ${safeAreaTopInset}px)` : '1.5rem' }}>
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center">
          <Link to="/bookings">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="ml-3 font-semibold text-lg">Бронирование #{booking.id}</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Gallery */}
        <div className="grid grid-cols-3 gap-2 rounded-xl overflow-hidden">
          {booking.studio.photos.slice(0, 3).map((photo, index) => (
            <div key={index} className="aspect-square relative overflow-hidden bg-muted">
              <img
                src={photo}
                alt={`${booking.studio.name} ${index + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
              />
            </div>
          ))}
        </div>

        {/* Main Info Card */}
        <Card className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">{booking.studio.name}</h2>
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-4 h-4 text-primary fill-primary" />
                <span className="font-semibold">{booking.studio.rating}</span>
              </div>
              <Badge variant="outline" className="mb-2">
                {booking.rentalType === "hourly" ? "Почасовая аренда" : 
                 booking.rentalType === "daily" ? "Посуточная аренда" : "Сессия"}
              </Badge>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${statusConfig.bgColor}`}>
              <span className={`text-sm font-medium ${statusConfig.color}`}>
                {statusConfig.label}
              </span>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Funds Status */}
          {booking.fundsStatus === "frozen" && (
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-4">
              <p className="text-sm font-medium flex items-center gap-2">
                💰 Средства заморожены на платформе
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Деньги будут переведены владельцу после завершения аренды
              </p>
            </div>
          )}

          {/* Address */}
          <div className="mb-4">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Адрес
            </h3>
            <p className="text-muted-foreground text-sm mb-2">{booking.studio.address}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={openMap}
              className="w-full border-primary/30 hover:border-primary hover:bg-primary/10"
            >
              Открыть в Яндекс.Картах
            </Button>
          </div>

          <Separator className="my-4" />

          {/* Date & Time */}
          <div className="space-y-3 mb-4">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-primary mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Начало аренды</p>
                <p className="font-semibold">{booking.startDate}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-primary mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Окончание аренды</p>
                <p className="font-semibold">{booking.endDate}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-primary mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Продолжительность</p>
                <p className="font-semibold">{booking.duration}</p>
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Equipment */}
          {booking.equipment.length > 0 && (
            <>
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Оборудование</h3>
                <div className="space-y-1">
                  {booking.equipment.map((item, index) => (
                    <p key={index} className="text-sm text-muted-foreground">• {item}</p>
                  ))}
                </div>
              </div>
              <Separator className="my-4" />
            </>
          )}

          {/* Special Requests */}
          {booking.specialRequests && (
            <>
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Особые пожелания</h3>
                <p className="text-sm text-muted-foreground">{booking.specialRequests}</p>
              </div>
              <Separator className="my-4" />
            </>
          )}

          {/* Price Breakdown */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Аренда ({booking.duration})</span>
              <span className="font-medium">{formatPrice(booking.price)}</span>
            </div>
            {booking.additionalServices.map((service, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{service.name}</span>
                <span className="font-medium">{formatPrice(service.price)}</span>
              </div>
            ))}
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Комиссия платформы (10%)</span>
              <span className="font-medium">{formatPrice(booking.platformFee)}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="font-semibold">Итого</span>
              <span className="font-bold text-lg text-primary">{formatPrice(booking.total)}</span>
            </div>
          </div>
        </Card>

        {/* Owner Card */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Владелец студии</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src={booking.studio.owner.avatar} />
                <AvatarFallback className="bg-gradient-primary text-white">
                  {booking.studio.owner.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{booking.studio.owner.name}</p>
                <p className="text-sm text-muted-foreground">@{booking.studio.owner.username}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => openTelegramChat(booking.studio.owner.username)}
              className="border-primary/30 hover:border-primary hover:bg-primary/10"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Написать
            </Button>
          </div>
        </Card>

        {/* Actions */}
        <div className="space-y-3">
          {booking.status === "confirmed" && (
            <>
              <Button variant="outline" className="w-full h-12 border-destructive/30 hover:bg-destructive/10 text-destructive">
                <XCircle className="w-4 h-4 mr-2" />
                Отменить бронирование
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Бесплатная отмена за 24 часа до начала
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingDetail;
