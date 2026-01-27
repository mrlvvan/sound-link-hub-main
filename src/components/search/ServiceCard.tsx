import { Star, CheckCircle } from "lucide-react";
import { formatPrice } from "@/lib/formatPrice";

interface ServiceCardProps {
  title: string;
  price: number;
  rating: number;
  ordersCompleted: number;
  username: string;
  gradient: string;
}

export const ServiceCard = ({
  title,
  price,
  rating,
  ordersCompleted,
  username,
  gradient,
}: ServiceCardProps) => {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all group cursor-pointer hover:scale-[1.01] hover:border-border/60">
      {/* Preview gradient */}
      <div className={`h-24 ${gradient} relative`}>
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors backdrop-blur-[2px]" />
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-base flex-1 pr-2 leading-snug">{title}</h3>
          <span className="text-lg font-bold text-primary whitespace-nowrap">
            {formatPrice(price)}
          </span>
        </div>

        <p className="text-sm text-muted-foreground mb-3">@{username}</p>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-accent fill-accent" strokeWidth={1.5} />
            <span className="font-semibold">{rating.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <CheckCircle className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span>{ordersCompleted} выполнено</span>
          </div>
        </div>
      </div>
    </div>
  );
};
