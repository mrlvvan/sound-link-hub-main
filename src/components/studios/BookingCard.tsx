import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, Clock, MessageCircle } from "lucide-react";
import { formatPrice } from "@/lib/formatPrice";
import { Button } from "@/components/ui/button";

interface BookingCardProps {
  id: number;
  studio: string;
  photo: string;
  address: string;
  startDate: string;
  endDate: string;
  duration: string;
  status: "pending" | "confirmed" | "active" | "completed" | "cancelled";
  price: number;
  ownerUsername: string;
}

export const BookingCard = ({
  id,
  studio,
  photo,
  address,
  startDate,
  duration,
  status,
  price,
  ownerUsername,
}: BookingCardProps) => {
  const navigate = useNavigate();

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return { label: "Ожидает подтверждения", color: "text-info", bgColor: "bg-info/10" };
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

  const statusConfig = getStatusConfig(status);

  return (
    <div
      onClick={() => navigate(`/bookings/${id}`)}
      className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-neon transition-all cursor-pointer"
    >
      <div className="flex gap-3 p-4">
        {/* Studio Photo */}
        <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted shrink-0">
          <img
            src={photo}
            alt={studio}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base mb-1 truncate">{studio}</h3>
          
          {/* Status */}
          <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full ${statusConfig.bgColor} mb-2`}>
            <span className={`text-xs font-medium ${statusConfig.color}`}>
              {statusConfig.label}
            </span>
          </div>

          {/* Details */}
          <div className="space-y-1 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span className="truncate">{startDate}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{duration}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span className="truncate">{address}</span>
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="text-right shrink-0">
          <p className="text-lg font-bold text-primary">{formatPrice(price)}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="border-t border-border px-4 py-3">
        <Button
          variant="outline"
          size="sm"
          className="w-full border-primary/30 hover:border-primary hover:bg-primary/10"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/bookings/${id}`);
          }}
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Открыть чат
        </Button>
      </div>
    </div>
  );
};
