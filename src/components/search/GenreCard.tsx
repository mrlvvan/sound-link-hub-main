import { Music } from "lucide-react";

interface GenreCardProps {
  title: string;
  trackCount: string;
  gradient: string;
}

export const GenreCard = ({ title, trackCount, gradient }: GenreCardProps) => {
  return (
    <button className="relative overflow-hidden rounded-xl h-32 shadow-md hover:shadow-lg transition-all group hover:scale-[1.01]">
      <div className={`absolute inset-0 ${gradient} opacity-60`} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      
      <div className="relative h-full flex flex-col items-center justify-center text-center p-4">
        <Music className="w-7 h-7 text-white/90 mb-2.5 group-hover:scale-105 transition-transform" strokeWidth={1.5} />
        <h3 className="font-semibold text-white text-base mb-1">{title}</h3>
        <p className="text-xs text-white/70">{trackCount}</p>
      </div>
    </button>
  );
};
