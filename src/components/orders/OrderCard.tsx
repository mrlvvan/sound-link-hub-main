import { Clock, CheckCircle, AlertCircle, MessageCircle, Calendar } from "lucide-react";
import { formatPrice } from "@/lib/formatPrice";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface OrderCardProps {
  id: number | string;
  service: string;
  username: string;
  status: "pending" | "in_progress" | "review" | "completed" | "cancelled";
  deadline: string;
  price: number;
  isClient: boolean;
  createdAt?: string;
}

export const OrderCard = ({
  id,
  service,
  username,
  status,
  deadline,
  price,
  isClient,
  createdAt,
}: OrderCardProps) => {
  const navigate = useNavigate();
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return {
          label: "В ожидании",
          color: "text-info",
          bgColor: "bg-info/10",
          icon: Clock,
        };
      case "in_progress":
        return {
          label: "В работе",
          color: "text-accent",
          bgColor: "bg-accent/10",
          icon: Clock,
        };
      case "review":
        return {
          label: "На проверке",
          color: "text-primary",
          bgColor: "bg-primary/10",
          icon: AlertCircle,
        };
      case "completed":
        return {
          label: "Завершено",
          color: "text-green-500",
          bgColor: "bg-green-500/10",
          icon: CheckCircle,
        };
      case "cancelled":
        return {
          label: "Отменено",
          color: "text-red-500",
          bgColor: "bg-red-500/10",
          icon: AlertCircle,
        };
      default:
        return {
          label: "Неизвестно",
          color: "text-muted-foreground",
          bgColor: "bg-muted/10",
          icon: Clock,
        };
    }
  };

  const statusConfig = getStatusConfig(status);
  const StatusIcon = statusConfig.icon;

  return (
    <div 
      onClick={() => navigate(`/orders/${id}`)}
      className="bg-card border border-border rounded-xl p-4 hover:shadow-neon transition-all cursor-pointer"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-base mb-1">{service}</h3>
          <p className="text-sm text-muted-foreground">
            {isClient ? `от @${username}` : `для @${username}`}
          </p>
        </div>
        <span className="text-lg font-bold text-primary whitespace-nowrap ml-2">
          {formatPrice(price)}
        </span>
      </div>

      {/* Status and deadline */}
      <div className="flex items-center gap-2 mb-3">
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${statusConfig.bgColor}`}>
          <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
          <span className={`text-sm font-medium ${statusConfig.color}`}>
            {statusConfig.label}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">{deadline}</span>
        </div>
      </div>

      {/* Created date if provided */}
      {createdAt && (
        <p className="text-xs text-muted-foreground mb-3">
          Создан: {createdAt}
        </p>
      )}

      {/* Action buttons */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 border-primary/30 hover:border-primary hover:bg-primary/10"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/orders/${id}`);
          }}
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Открыть чат
        </Button>
        {status === "review" && isClient && (
          <Button
            size="sm"
            className="bg-gradient-primary hover:shadow-neon"
          >
            Принять работу
          </Button>
        )}
        {status === "pending" && !isClient && (
          <Button
            size="sm"
            className="bg-gradient-accent hover:shadow-accent"
          >
            Начать работу
          </Button>
        )}
      </div>
    </div>
  );
};
