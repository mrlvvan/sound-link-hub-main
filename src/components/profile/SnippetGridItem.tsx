import { Music } from "lucide-react";
import { Link } from "react-router-dom";

interface SnippetGridItemProps {
  title: string;
  genre: string;
  gradient: string;
  to?: string;
}

export const SnippetGridItem = ({ title, genre, gradient, to }: SnippetGridItemProps) => {
  const content = (
    <div className="relative rounded-xl overflow-hidden h-32 shadow-md hover:shadow-lg transition-all cursor-pointer group hover:scale-[1.02]">
      <div className={`absolute inset-0 ${gradient} opacity-70`} />
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
      
      <div className="absolute inset-0 flex items-center justify-center">
        <Music className="w-7 h-7 text-white/70 group-hover:text-white/90 group-hover:scale-105 transition-all" strokeWidth={1.5} />
      </div>
      
      <div className="absolute bottom-2 left-2 right-2">
        <h3 className="text-white font-semibold text-sm mb-0.5 truncate">{title}</h3>
        <p className="text-white/60 text-xs">{genre}</p>
      </div>
    </div>
  );

  return to ? <Link to={to}>{content}</Link> : content;
};
