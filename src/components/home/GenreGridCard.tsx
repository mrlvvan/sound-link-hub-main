import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface GenreGridCardProps {
  name: string;
  icon: LucideIcon;
  gradient: string;
  link: string;
  trackCount?: string;
}

export const GenreGridCard = ({ name, icon: Icon, gradient, link, trackCount }: GenreGridCardProps) => {
  return (
    <Link to={link}>
      <div className="relative overflow-hidden rounded-xl h-32 shadow-sm hover:shadow-md transition-all group hover:scale-[1.02]">
        <div className={`absolute inset-0 ${gradient} opacity-70`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        <div className="relative h-full flex flex-col items-center justify-center text-center p-4">
          <Icon className="w-8 h-8 text-white/90 mb-2.5 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
          <h3 className="font-semibold text-white text-base mb-0.5">{name}</h3>
          {trackCount && <p className="text-xs text-white/60">{trackCount}</p>}
        </div>
      </div>
    </Link>
  );
};
