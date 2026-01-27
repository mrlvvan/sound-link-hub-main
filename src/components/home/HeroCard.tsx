import { Play, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface HeroCardProps {
  title: string;
  subtitle: string;
  type?: "track" | "creator" | "collection";
  gradient: string;
  link: string;
}

export const HeroCard = ({ title, subtitle, gradient, link }: HeroCardProps) => {
  return (
    <Link to={link} className="block">
      <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all group min-h-[200px]">
        <div className={`absolute inset-0 ${gradient} opacity-20`} />
        <div className="absolute inset-0 bg-gradient-card" />
        
        {/* Decorative Music Note */}
        <Music 
          className="absolute -right-6 -bottom-6 w-32 h-32 text-foreground/5 rotate-[-15deg] group-hover:rotate-[-20deg] transition-transform duration-500" 
          strokeWidth={1.5} 
        />
        
        <div className="relative p-7 flex flex-col justify-between h-full">
          <div>
            <h2 className="text-2xl font-bold mb-2.5">{title}</h2>
            <p className="text-base text-muted-foreground leading-relaxed">{subtitle}</p>
          </div>
          
          <Button
            variant="glass"
            size="sm"
            className="self-start mt-5"
          >
            <Play className="w-3.5 h-3.5 mr-2" strokeWidth={1.5} fill="currentColor" />
            Слушать
          </Button>
        </div>
      </div>
    </Link>
  );
};
