import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Star, Users } from "lucide-react";
import { Link } from "react-router-dom";

interface UserProfileMiniCardProps {
  username: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  followers: number;
  rating: number;
  isFollowing?: boolean;
  onFollowToggle?: () => void;
}

export const UserProfileMiniCard = ({
  username,
  displayName,
  avatar,
  bio,
  followers,
  rating,
  isFollowing = false,
  onFollowToggle,
}: UserProfileMiniCardProps) => {
  return (
    <div className="bg-card border border-border rounded-xl p-4 hover:shadow-md transition-all">
      <div className="flex items-center gap-3">
        <Link to={`/profile/${username}`}>
          <Avatar className="w-12 h-12 cursor-pointer hover:scale-105 transition-transform">
            <AvatarImage src={avatar} alt={displayName} />
            <AvatarFallback>{displayName[0]}</AvatarFallback>
          </Avatar>
        </Link>

        <div className="flex-1 min-w-0">
          <Link to={`/profile/${username}`}>
            <h3 className="font-semibold truncate hover:text-primary transition-colors">
              {displayName}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground">@{username}</p>
          {bio && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{bio}</p>
          )}
        </div>

        <div className="flex flex-col items-end gap-2">
          <Button
            variant={isFollowing ? "outline" : "default"}
            size="sm"
            onClick={onFollowToggle}
            className="whitespace-nowrap"
          >
            {isFollowing ? "Отписаться" : "Подписаться"}
          </Button>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" strokeWidth={1.5} />
              <span>{followers.toLocaleString("ru-RU")}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-accent text-accent" strokeWidth={1.5} />
              <span>{rating.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
