import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FeedCardProps {
  title: string;
  subtitle: string;
  imageGradient: string;
}

export const FeedCard = ({ title, subtitle, imageGradient }: FeedCardProps) => {
  return (
    <div className="relative overflow-hidden rounded-xl shadow-md min-h-[180px] group cursor-pointer transition-all hover:shadow-lg hover:scale-[1.01]">
      <div className={`absolute inset-0 ${imageGradient} opacity-15`} />
      <div className="absolute inset-0 bg-gradient-card" />
      
      <div className="relative p-6 flex flex-col justify-between h-full">
        <div>
          <h3 className="text-lg font-semibold mb-1.5">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{subtitle}</p>
        </div>
        
        <Button
          variant="glass"
          size="sm"
          className="self-start mt-5"
        >
          <Play className="w-3.5 h-3.5 mr-2" strokeWidth={1.5} />
          Слушать всё
        </Button>
      </div>
    </div>
  );
};
