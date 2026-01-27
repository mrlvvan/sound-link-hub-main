import { Eye } from "lucide-react";
import { formatPrice } from "@/lib/formatPrice";

interface ProfileServiceCardProps {
  title: string;
  price: number;
  views: number;
  ordersCompleted: number;
}

export const ProfileServiceCard = ({
  title,
  price,
  views,
  ordersCompleted,
}: ProfileServiceCardProps) => {
  return (
    <div className="bg-card border border-border rounded-xl p-4 hover:shadow-lg transition-all hover:scale-[1.01] cursor-pointer hover:border-border/60">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-base flex-1 pr-2 leading-snug">{title}</h3>
        <span className="text-lg font-bold text-primary whitespace-nowrap">
          {formatPrice(price)}
        </span>
      </div>
      
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5" strokeWidth={1.5} />
          <span>{views.toLocaleString('ru-RU')} просмотров</span>
        </div>
        <span>•</span>
        <span>{ordersCompleted} выполнено</span>
      </div>
    </div>
  );
};
