import { Users } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface MutualFollower {
  id: string;
  username: string;
  avatar?: string;
}

interface MutualFollowersIndicatorProps {
  mutualFollowers: MutualFollower[];
  totalCount: number;
  onClick?: () => void;
}

export const MutualFollowersIndicator = ({
  mutualFollowers,
  totalCount,
  onClick,
}: MutualFollowersIndicatorProps) => {
  if (totalCount === 0) return null;

  const displayFollowers = mutualFollowers.slice(0, 3);
  const remainingCount = totalCount - displayFollowers.length;

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
    >
      <div className="flex -space-x-2">
        {displayFollowers.map((follower) => (
          <Avatar key={follower.id} className="w-6 h-6 border-2 border-background">
            <AvatarImage src={follower.avatar} alt={follower.username} />
            <AvatarFallback className="text-xs">
              {follower.username[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        ))}
      </div>
      <div className="flex items-center gap-1">
        <Users className="w-3.5 h-3.5" strokeWidth={1.5} />
        <span>
          {totalCount === 1
            ? "1 общий подписчик"
            : `${totalCount} ${totalCount < 5 ? "общих подписчика" : "общих подписчиков"}`}
        </span>
      </div>
    </button>
  );
};
