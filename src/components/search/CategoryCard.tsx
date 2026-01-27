import { LucideIcon } from "lucide-react";

interface CategoryCardProps {
  icon: LucideIcon;
  title: string;
  count: string;
  gradient: string;
}

export const CategoryCard = ({ icon: Icon, title, count, gradient }: CategoryCardProps) => {
  return (
    <button className="relative overflow-hidden rounded-xl p-6 shadow-sm hover:shadow-md transition-all group bg-card border border-border hover:border-border/60 hover:scale-[1.01]">
      
      <div className="relative flex flex-col items-center text-center gap-3">
        <div className="p-3 rounded-lg bg-secondary/50 group-hover:bg-secondary/70 transition-colors">
          <Icon className="w-6 h-6 text-foreground/80" strokeWidth={1.5} />
        </div>
        <div>
          <h3 className="font-semibold text-sm">{title}</h3>
          <p className="text-xs text-muted-foreground mt-1">{count}</p>
        </div>
      </div>
    </button>
  );
};
