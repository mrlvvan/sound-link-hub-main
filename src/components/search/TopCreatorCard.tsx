import { Star, TrendingUp, Heart } from "lucide-react";
import { Link } from "react-router-dom";

interface TopCreatorCardProps {
  name: string;
  username?: string;
  genre: string;
  rating: number;
  orders?: number;
  likes?: number;
  isRising?: boolean;
}

export const TopCreatorCard = ({
  name,
  username,
  genre,
  rating,
  orders,
  likes,
  isRising,
}: TopCreatorCardProps) => {
  const content = (
    <div className="bg-card border border-border rounded-xl p-4 hover:shadow-lg transition-all hover:scale-[1.01] cursor-pointer hover:border-border/60">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-lg font-semibold">
            {name[0]}
          </div>
          <div>
            <h3 className="font-semibold">{name}</h3>
            <p className="text-sm text-muted-foreground">{genre}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-accent fill-accent" strokeWidth={1.5} />
            <span className="font-semibold text-sm">{rating.toFixed(1)}</span>
          </div>
          {orders && (
            <p className="text-xs text-muted-foreground">{orders} заказов</p>
          )}
          {likes && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Heart className="w-3 h-3" strokeWidth={1.5} />
              <span>{likes.toLocaleString('ru-RU')}</span>
            </div>
          )}
          {isRising && (
            <div className="flex items-center gap-1 text-xs text-accent">
              <TrendingUp className="w-3 h-3" strokeWidth={1.5} />
              <span>Рост</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return username ? <Link to={`/profile/${username}`}>{content}</Link> : content;
};
