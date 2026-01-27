import { Building2, Mic2, AudioLines, Star, Users, MapPin, Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/formatPrice";
import { Link } from "react-router-dom";

interface StudioCardProps {
  id: number;
  name: string;
  type: string[];
  pricePerHour?: number;
  pricePerDay?: number;
  pricePerMonth?: number;
  pricePerSession?: number;
  location: string;
  rating: number;
  bookings: number;
  equipment: string;
  description: string;
  gradient: string;
  photo?: string;
  promotionType?: 'standard' | 'recommended' | 'vip';
}

export const StudioCard = ({
  id,
  name,
  type,
  pricePerHour,
  pricePerDay,
  pricePerMonth,
  pricePerSession,
  location,
  rating,
  bookings,
  equipment,
  description,
  gradient,
  photo,
  promotionType = 'standard',
}: StudioCardProps) => {
  const getIcon = () => {
    if (type.includes("full_service")) return AudioLines;
    if (type.includes("with_equipment")) return Mic2;
    return Building2;
  };

  const Icon = getIcon();

  const getPrimaryPrice = () => {
    if (pricePerHour) return { price: pricePerHour, label: "час" };
    if (pricePerDay) return { price: pricePerDay, label: "день" };
    if (pricePerMonth) return { price: pricePerMonth, label: "мес" };
    if (pricePerSession) return { price: pricePerSession, label: "сессия" };
    return { price: 0, label: "" };
  };

  const { price, label } = getPrimaryPrice();

  const getCardStyles = () => {
    if (promotionType === 'vip') {
      return "relative overflow-hidden rounded-xl border-2 border-transparent bg-card shadow-xl shadow-primary/30 hover:scale-[1.01] transition-all cursor-pointer group";
    }
    if (promotionType === 'recommended') {
      return "relative overflow-hidden rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-all hover:scale-[1.01] cursor-pointer group";
    }
    return "relative overflow-hidden rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-all hover:scale-[1.01] cursor-pointer group";
  };

  return (
    <Link to={`/studios/${id}`}>
      <div className={getCardStyles()}>
        {/* Photo */}
        {photo ? (
          <div className="relative h-48 overflow-hidden">
            <img 
              src={photo} 
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-card" />
            
            {/* Promotion Badge */}
            {promotionType === 'vip' && (
              <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-gradient-to-r from-violet-500 via-pink-500 to-purple-500 text-white text-xs font-bold backdrop-blur-sm shadow-lg animate-gradient-shift bg-[length:200%_200%]">
                VIP
              </div>
            )}
            {promotionType === 'recommended' && (
              <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-xs font-bold backdrop-blur-sm shadow-lg">
                Рекомендуем
              </div>
            )}
          </div>
        ) : (
          <>
            <div className={`relative h-24 ${gradient} opacity-20`} />
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-card" />
          </>
        )}
      
      <div className={`relative p-4 ${photo ? '-mt-16' : '-mt-12'}`}>
        {/* Icon */}
        <div className="inline-flex p-3 rounded-xl bg-card border border-border shadow-sm mb-3 group-hover:scale-105 transition-transform">
          <Icon className="w-6 h-6 text-primary" strokeWidth={1.5} />
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          {type.includes("with_equipment") && (
            <Badge variant="secondary" className="text-xs">
              <Mic2 className="w-3 h-3 mr-1" strokeWidth={1.5} />
              С аппаратурой
            </Badge>
          )}
          {type.includes("without_equipment") && (
            <Badge variant="outline" className="text-xs">
              <Building2 className="w-3 h-3 mr-1" strokeWidth={1.5} />
              Без аппаратуры
            </Badge>
          )}
          {type.includes("full_service") && (
            <Badge variant="default" className="text-xs">
              <AudioLines className="w-3 h-3 mr-1" strokeWidth={1.5} />
              Под ключ
            </Badge>
          )}
          {type.includes("hourly") && (
            <Badge variant="outline" className="text-xs">
              <Clock className="w-3 h-3 mr-1" strokeWidth={1.5} />
              Почасово
            </Badge>
          )}
          {type.includes("daily") && (
            <Badge variant="outline" className="text-xs">
              <Calendar className="w-3 h-3 mr-1" strokeWidth={1.5} />
              Посуточно
            </Badge>
          )}
        </div>

        {/* Name and Location */}
        <h3 className="text-lg font-semibold mb-2">{name}</h3>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
          <MapPin className="w-4 h-4" strokeWidth={1.5} />
          <span>{location}</span>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{description}</p>

        {/* Equipment */}
        <div className="bg-secondary/30 rounded-lg p-3 mb-3">
          <p className="text-xs font-medium text-muted-foreground mb-1">Оборудование:</p>
          <p className="text-xs text-foreground/80 line-clamp-2">{equipment}</p>
        </div>

        {/* Stats and Price */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-primary fill-primary" strokeWidth={1.5} />
              <span className="font-semibold">{rating}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Users className="w-4 h-4" strokeWidth={1.5} />
              <span>{bookings}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-primary">{formatPrice(price)}</p>
            <p className="text-xs text-muted-foreground">за {label}</p>
          </div>
        </div>

        {/* Action Button */}
        <Button className="w-full bg-gradient-primary hover:shadow-neon">
          Подробнее
        </Button>
        </div>
      </div>
    </Link>
  );
};
