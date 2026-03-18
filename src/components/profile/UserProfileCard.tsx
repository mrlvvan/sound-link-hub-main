import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MutualFollowersIndicator } from "./MutualFollowersIndicator";
import {
  MessageCircle,
  Share2,
  Instagram,
  Twitter,
  Star,
  BadgeCheck,
  Award,
  Crown,
} from "lucide-react";
import { useState } from "react";

interface UserProfileCardProps {
  username: string;
  displayName: string;
  bio: string;
  avatar?: string;
  coverGradient?: string;
  stats: {
    followers: number;
    following: number;
    tracks: number;
    rating: number;
    ordersCompleted: number;
  };
  isFollowing?: boolean;
  mutualFollowers?: Array<{ id: string; username: string; avatar?: string }>;
  mutualFollowersCount?: number;
  socialLinks?: {
    instagram?: string;
    twitter?: string;
  };
  badges?: Array<{
    label: string;
    variant: "verified" | "top" | "pro";
  }>;
  onFollowToggle?: () => void;
  onMessage?: () => void;
  onShare?: () => void;
}

export const UserProfileCard = ({
  username,
  displayName,
  bio,
  avatar,
  coverGradient = "bg-gradient-to-br from-purple-600 via-pink-600 to-red-600",
  stats,
  isFollowing = false,
  mutualFollowers = [],
  mutualFollowersCount = 0,
  socialLinks,
  badges = [],
  onFollowToggle,
  onMessage,
  onShare,
}: UserProfileCardProps) => {
  const [following, setFollowing] = useState(isFollowing);

  const handleFollowToggle = () => {
    setFollowing(!following);
    onFollowToggle?.();
  };

  const getBadgeIcon = (variant: "verified" | "top" | "pro") => {
    switch (variant) {
      case "verified":
        return BadgeCheck;
      case "top":
        return Award;
      case "pro":
        return Crown;
    }
  };

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg">
      {/* Cover Image */}
      <div className={`h-28 md:h-40 ${coverGradient} relative`}>
        <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
      </div>

      {/* Profile Info */}
      <div className="px-3 pb-4 md:px-5 md:pb-5">
        {/* Avatar */}
        <div className="flex justify-between items-start -mt-10 md:-mt-16 mb-3">
          <Avatar className="w-20 h-20 md:w-28 md:h-28 border-4 border-card shadow-xl">
            <AvatarImage src={avatar} alt={displayName} />
            <AvatarFallback className="text-xl md:text-2xl font-bold">
              {displayName[0]}
            </AvatarFallback>
          </Avatar>

          {/* Action Buttons (Desktop) */}
          <div className="hidden md:flex gap-2 mt-4">
            <Button
              variant={following ? "outline" : "default"}
              className="bg-gradient-primary"
              onClick={handleFollowToggle}
            >
              {following ? "Отписаться" : "Подписаться"}
            </Button>
            <Button variant="outline" onClick={onMessage}>
              <MessageCircle className="w-4 h-4 mr-2" strokeWidth={1.5} />
              Сообщение
            </Button>
            <Button variant="ghost" size="icon" onClick={onShare}>
              <Share2 className="w-4 h-4" strokeWidth={1.5} />
            </Button>
          </div>
        </div>

        {/* Name and Bio */}
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h1 className="text-xl md:text-2xl font-bold">{displayName}</h1>
            {badges.map((badge, index) => {
              if (badge.variant === "verified") {
                return (
                  <BadgeCheck 
                    key={index} 
                    className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" 
                    fill="#3b82f6" 
                    stroke="white" 
                    strokeWidth={2}
                  />
                );
              }
              const Icon = getBadgeIcon(badge.variant);
              const bgColor = badge.variant === "top" ? "bg-gradient-to-r from-amber-500 to-orange-600" : "bg-gradient-to-r from-purple-600 to-pink-600";
              return (
                <div key={index} className={`${bgColor} text-white rounded-full px-2 py-0.5 flex items-center gap-1 text-xs font-semibold flex-shrink-0`}>
                  <Icon className="w-3 h-3" strokeWidth={2} />
                  <span>{badge.label}</span>
                </div>
              );
            })}
          </div>
          <p className="text-muted-foreground text-sm mb-2">@{username}</p>
          <p className="text-sm leading-relaxed">{bio}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-5 gap-1 md:gap-3 py-3 md:py-4 border-y border-border mb-3 md:mb-4">
          <button className="text-center hover:bg-muted/50 rounded-lg p-1.5 md:p-2 transition-colors">
            <div className="text-base md:text-xl font-bold">{(stats.followers / 1000).toFixed(1)}k</div>
            <div className="text-[10px] md:text-xs text-muted-foreground">Подписки</div>
          </button>
          <button className="text-center hover:bg-muted/50 rounded-lg p-1.5 md:p-2 transition-colors">
            <div className="text-base md:text-xl font-bold">{stats.following}</div>
            <div className="text-[10px] md:text-xs text-muted-foreground">Подписан</div>
          </button>
          <button className="text-center hover:bg-muted/50 rounded-lg p-1.5 md:p-2 transition-colors">
            <div className="text-base md:text-xl font-bold">{stats.tracks}</div>
            <div className="text-[10px] md:text-xs text-muted-foreground">Треков</div>
          </button>
          <div className="text-center p-1.5 md:p-2">
            <div className="flex items-center justify-center gap-0.5 md:gap-1">
              <Star className="w-3 h-3 md:w-4 md:h-4 fill-accent text-accent" strokeWidth={1.5} />
              <span className="text-base md:text-xl font-bold">{stats.rating.toFixed(1)}</span>
            </div>
            <div className="text-[10px] md:text-xs text-muted-foreground">Рейтинг</div>
          </div>
          <div className="text-center p-1.5 md:p-2">
            <div className="text-base md:text-xl font-bold">{stats.ordersCompleted}</div>
            <div className="text-[10px] md:text-xs text-muted-foreground">Заказов</div>
          </div>
        </div>

        {/* Mutual Followers */}
        {mutualFollowersCount > 0 && (
          <div className="mb-3 md:mb-4">
            <MutualFollowersIndicator
              mutualFollowers={mutualFollowers}
              totalCount={mutualFollowersCount}
            />
          </div>
        )}

        {/* Action Buttons (Mobile) */}
        <div className="flex md:hidden gap-2 mb-3">
          <Button
            variant={following ? "outline" : "default"}
            className="flex-1 bg-gradient-primary text-sm h-9"
            onClick={handleFollowToggle}
          >
            {following ? "Отписаться" : "Подписаться"}
          </Button>
          <Button variant="outline" className="flex-1 text-sm h-9" onClick={onMessage}>
            <MessageCircle className="w-3.5 h-3.5 mr-1.5" strokeWidth={1.5} />
            Сообщение
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={onShare}>
            <Share2 className="w-3.5 h-3.5" strokeWidth={1.5} />
          </Button>
        </div>

        {/* Social Links */}
        {socialLinks && (
          <div className="flex gap-2">
            {socialLinks.instagram && (
              <Button variant="ghost" size="icon" asChild>
                <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                  <Instagram className="w-4 h-4" strokeWidth={1.5} />
                </a>
              </Button>
            )}
            {socialLinks.twitter && (
              <Button variant="ghost" size="icon" asChild>
                <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                  <Twitter className="w-4 h-4" strokeWidth={1.5} />
                </a>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
