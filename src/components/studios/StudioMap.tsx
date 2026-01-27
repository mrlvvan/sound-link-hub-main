import { MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StudioMapProps {
  coordinates: [number, number];
  location: string;
  name: string;
}

export const StudioMap = ({ coordinates, location, name }: StudioMapProps) => {
  const openInYandexMaps = () => {
    window.open(`https://yandex.ru/maps/?pt=${coordinates[1]},${coordinates[0]}&z=16&l=map`, '_blank');
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Местоположение</h2>
      
      <div className="bg-secondary/30 rounded-xl p-4 mb-4">
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" strokeWidth={1.5} />
          <div>
            <p className="font-medium mb-1">Адрес студии</p>
            <p className="text-sm text-muted-foreground">{location}</p>
          </div>
        </div>
      </div>

      <div className="relative rounded-xl overflow-hidden border border-border h-[400px] bg-secondary/30">
        <iframe
          title={`Карта - ${name}`}
          src={`https://yandex.ru/map-widget/v1/?ll=${coordinates[1]},${coordinates[0]}&z=16&l=map&pt=${coordinates[1]},${coordinates[0]},pm2rdm`}
          width="100%"
          height="100%"
          frameBorder="0"
          allowFullScreen
          className="w-full h-full"
        />
      </div>

      <Button 
        variant="outline" 
        className="w-full mt-4 gap-2"
        onClick={openInYandexMaps}
      >
        <ExternalLink className="w-4 h-4" />
        Открыть в Яндекс.Картах
      </Button>
    </div>
  );
};
