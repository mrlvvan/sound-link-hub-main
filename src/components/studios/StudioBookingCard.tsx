import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/formatPrice";
import { Star, Clock, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CreateBookingDialog } from "./CreateBookingDialog";
import { openTelegramChat } from "@/lib/telegramUtils";

interface StudioBookingCardProps {
  studioName: string;
  ownerUsername: string;
  pricePerHour?: number;
  pricePerDay?: number;
  pricePerMonth?: number;
  pricePerSession?: number;
  rating: number;
  reviewsCount: number;
}

export const StudioBookingCard = ({
  studioName,
  ownerUsername,
  pricePerHour,
  pricePerDay,
  pricePerMonth,
  pricePerSession,
  rating,
  reviewsCount
}: StudioBookingCardProps) => {
  return (
    <Card className="p-6 shadow-lg border-border sticky top-20">
      {/* Price Section */}
      <div className="mb-4">
        <div className="flex items-baseline gap-2 mb-3">
          {pricePerHour && (
            <div>
              <span className="text-3xl font-bold">{formatPrice(pricePerHour)}</span>
              <span className="text-muted-foreground ml-1">/ час</span>
            </div>
          )}
        </div>
        
        {/* Additional Prices */}
        <div className="space-y-2">
          {pricePerDay && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Посуточно</span>
              </div>
              <span className="font-semibold">{formatPrice(pricePerDay)}</span>
            </div>
          )}
          {pricePerMonth && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>В месяц</span>
              </div>
              <span className="font-semibold">{formatPrice(pricePerMonth)}</span>
            </div>
          )}
          {pricePerSession && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Сессия под ключ</span>
              </div>
              <span className="font-semibold">{formatPrice(pricePerSession)}</span>
            </div>
          )}
        </div>
      </div>

      <Separator className="my-4" />

      {/* Rating */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Star className="w-5 h-5 text-primary fill-primary" />
          <span className="text-lg font-bold">{rating}</span>
          <span className="text-sm text-muted-foreground">({reviewsCount} отзывов)</span>
        </div>
      </div>

      {/* CTA Button */}
      <CreateBookingDialog
        studioName={studioName}
        ownerUsername={ownerUsername}
        pricePerHour={pricePerHour}
        pricePerDay={pricePerDay}
        pricePerSession={pricePerSession}
      >
        <Button className="w-full h-12 text-base bg-gradient-primary hover:shadow-neon mb-3">
          Забронировать
        </Button>
      </CreateBookingDialog>
      
      <Button 
        variant="outline" 
        className="w-full h-12"
        onClick={() => openTelegramChat(ownerUsername)}
      >
        Связаться с владельцем
      </Button>

      <p className="text-xs text-center text-muted-foreground mt-4">
        Вы еще ничего не оплачиваете
      </p>

      <Separator className="my-4" />

      {/* Quick Facts */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            Быстрое подтверждение
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            Бесплатная отмена за 24 часа
          </Badge>
        </div>
      </div>
    </Card>
  );
};
