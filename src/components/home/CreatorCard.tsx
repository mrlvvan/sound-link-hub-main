import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

interface CreatorCardProps {
  username: string;
  avatar?: string;
  genre: string;
  followers?: number;
}

export const CreatorCard = ({ username, avatar, genre }: CreatorCardProps) => {
  return (
    <Link to={`/profile/${username}`}>
      <div className="flex flex-col items-center min-w-[100px] group cursor-pointer">
        <Avatar className="w-20 h-20 mb-3 ring-2 ring-border group-hover:ring-primary transition-all">
          <AvatarImage src={avatar} alt={username} />
          <AvatarFallback className="bg-gradient-primary text-white font-semibold text-lg">
            {username.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <p className="text-sm font-medium truncate w-full text-center group-hover:text-primary transition-colors">
          @{username}
        </p>
        <p className="text-xs text-muted-foreground truncate w-full text-center">{genre}</p>
      </div>
    </Link>
  );
};
