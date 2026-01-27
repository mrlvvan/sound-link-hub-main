import { Calendar } from "lucide-react";
import { formatPrice } from "@/lib/formatPrice";

interface PurchaseItemProps {
  service: string;
  provider: string;
  date: string;
  price: number;
  status: "completed" | "cancelled";
}

export const PurchaseItem = ({
  service,
  provider,
  date,
  price,
  status,
}: PurchaseItemProps) => {
  return (
    <div className="bg-card border border-border rounded-xl p-4 hover:shadow-card transition-all">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h3 className="font-semibold text-sm mb-1">{service}</h3>
          <p className="text-xs text-muted-foreground">от @{provider}</p>
        </div>
        <span className="text-base font-bold text-primary whitespace-nowrap ml-2">
          {formatPrice(price)}
        </span>
      </div>
      
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1 text-muted-foreground">
          <Calendar className="w-3 h-3" />
          <span>{date}</span>
        </div>
        <span className={status === "completed" ? "text-green-500" : "text-red-500"}>
          {status === "completed" ? "Завершено" : "Отменено"}
        </span>
      </div>
    </div>
  );
};
