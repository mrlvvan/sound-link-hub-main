import { StudioMiniCard } from "@/components/home/StudioMiniCard";
import { useDragScroll } from "@/hooks/useDragScroll";

interface SimilarStudiosProps {
  currentStudioId: number;
}

export const SimilarStudios = ({ currentStudioId }: SimilarStudiosProps) => {
  const scrollRef = useDragScroll();
  
  // Mock data - would filter out current studio and show similar ones
  const similarStudios = [
    {
      id: 2,
      name: "Sound Lab Pro",
      location: "Москва, ЗАО",
      pricePerHour: 3000,
      gradient: "bg-gradient-to-br from-cyan-600 to-blue-600"
    },
    {
      id: 3,
      name: "Premium Records",
      location: "Москва, САО",
      pricePerHour: 2500,
      gradient: "bg-gradient-to-br from-pink-600 to-purple-600"
    },
    {
      id: 4,
      name: "Trap House Studio",
      location: "Москва, ЮВАО",
      pricePerHour: 2500,
      gradient: "bg-gradient-to-br from-purple-900 via-purple-700 to-pink-600"
    },
    {
      id: 5,
      name: "Репбаза Central",
      location: "Москва, ЮЗАО",
      pricePerHour: 500,
      gradient: "bg-gradient-to-br from-purple-600 to-blue-600"
    }
  ].filter(studio => studio.id !== currentStudioId);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Похожие студии</h2>
      
      <div ref={scrollRef} className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 scroll-smooth">
        {similarStudios.map((studio) => (
          <StudioMiniCard key={studio.id} {...studio} />
        ))}
      </div>
    </div>
  );
};
