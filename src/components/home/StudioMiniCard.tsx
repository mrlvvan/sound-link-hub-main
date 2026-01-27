import { Building2, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

interface StudioMiniCardProps {
  name: string;
  location: string;
  pricePerHour: number;
  image?: string;
  gradient?: string;
}

export const StudioMiniCard = ({ name, location, pricePerHour, gradient = "bg-gradient-to-br from-violet-600 to-indigo-600" }: StudioMiniCardProps) => {
  return (
    <Link to="/studios">
      <div className="relative overflow-hidden rounded-xl min-w-[200px] h-40 shadow-sm hover:shadow-md transition-all group hover:scale-[1.02]">
        <div className={`absolute inset-0 ${gradient}`} />
        <Building2 className="absolute right-3 bottom-3 w-16 h-16 text-white/10 group-hover:text-white/15 transition-colors" strokeWidth={1} />
        
        <div className="relative h-full p-4 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-white text-base mb-1.5 line-clamp-1">{name}</h3>
            <div className="flex items-center gap-1 text-white/80 text-xs mb-2">
              <MapPin className="w-3 h-3" strokeWidth={2} />
              <span className="truncate">{location}</span>
            </div>
          </div>
          
          <div className="text-white">
            <p className="text-sm font-medium">от {pricePerHour} ₽/час</p>
          </div>
        </div>
      </div>
    </Link>
  );
};
