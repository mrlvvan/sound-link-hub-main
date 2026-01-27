import { Mic2, Headphones, Radio, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Equipment {
  category: string;
  items: string[];
}

interface StudioEquipmentListProps {
  equipment: Equipment[];
}

export const StudioEquipmentList = ({ equipment }: StudioEquipmentListProps) => {
  const getIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "микрофоны":
        return Mic2;
      case "мониторы":
        return Headphones;
      case "интерфейсы":
        return Radio;
      default:
        return Zap;
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Оборудование</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {equipment.map((eq) => {
          const Icon = getIcon(eq.category);
          return (
            <div key={eq.category} className="bg-secondary/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-primary" strokeWidth={1.5} />
                </div>
                <h3 className="font-semibold">{eq.category}</h3>
              </div>
              <div className="space-y-2">
                {eq.items.map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
