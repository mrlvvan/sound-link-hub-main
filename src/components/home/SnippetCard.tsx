import { Heart, MessageCircle, Share2, Music } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface SnippetCardProps {
  username: string;
  trackName: string;
  genre: string;
  likes: number;
  comments: number;
  gradientBg: string;
}

export const SnippetCard = ({
  username,
  trackName,
  genre,
  likes,
  comments,
  gradientBg,
}: SnippetCardProps) => {
  return (
    <div className="relative rounded-xl overflow-hidden shadow-md bg-card border border-border mb-4">
      {/* Preview area */}
      <div className={`relative h-80 ${gradientBg} flex items-center justify-center`}>
        <div className="absolute inset-0 bg-black/30" />
        <Music className="w-16 h-16 text-white/80" strokeWidth={1.5} />
        
        {/* Author info overlay */}
        <div className="absolute bottom-4 left-4 flex items-center gap-3">
          <Avatar className="w-10 h-10 border-2 border-white/20">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {username[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-white font-semibold text-sm">{username}</p>
            <p className="text-white/70 text-xs">{trackName}</p>
          </div>
        </div>

        {/* Genre badge */}
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm text-white text-xs font-medium">
            {genre}
          </span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-around items-center p-4 bg-card">
        <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
          <Heart className="w-5 h-5" strokeWidth={1.5} />
          <span className="text-sm font-medium">{likes}</span>
        </button>
        
        <button className="flex items-center gap-2 text-muted-foreground hover:text-info transition-colors">
          <MessageCircle className="w-5 h-5" strokeWidth={1.5} />
          <span className="text-sm font-medium">{comments}</span>
        </button>
        
        <button className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors">
          <Share2 className="w-5 h-5" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
};
