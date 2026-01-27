import { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ProfileBadgeProps {
  label: string;
  icon: LucideIcon;
  variant: "verified" | "top" | "pro";
}

export const ProfileBadge = ({ label, icon: Icon, variant }: ProfileBadgeProps) => {
  const variantStyles = {
    verified: "bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-0",
    top: "bg-gradient-to-r from-amber-500 to-orange-600 text-white border-0",
    pro: "bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0",
  };

  return (
    <Badge className={cn("gap-1.5 px-2.5 py-1", variantStyles[variant])}>
      <Icon className="w-3 h-3" strokeWidth={2} />
      <span className="text-xs font-semibold">{label}</span>
    </Badge>
  );
};
