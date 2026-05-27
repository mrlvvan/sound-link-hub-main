import { useState } from "react";
import { Music, Briefcase, Package, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSettingsStore } from "@/stores/settingsStore";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { AddBeatDialog } from "@/components/beats/AddBeatDialog";
import { AddServiceDialog } from "@/components/marketplace/AddServiceDialog";
import { AddProductDialog } from "@/components/marketplace/AddProductDialog";

const Studio = () => {
  const { safeAreaTopInset, isFullscreen } = useSettingsStore();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [beatOpen, setBeatOpen] = useState(false);
  const [serviceOpen, setServiceOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);

  const handleOpen = (setter: (v: boolean) => void) => {
    if (!user) { navigate("/login"); return; }
    setter(true);
  };

  const tiles = [
    {
      icon: Music,
      label: "Загрузить бит",
      description: "WAV или MP3 — попадёт в ленту и профиль",
      gradient: "bg-gradient-primary",
      action: () => handleOpen(setBeatOpen),
    },
    {
      icon: Briefcase,
      label: "Добавить услугу",
      description: "Сведение, мастеринг, написание битов и др.",
      gradient: "bg-gradient-accent",
      action: () => handleOpen(setServiceOpen),
    },
    {
      icon: Package,
      label: "Продать товар",
      description: "Сэмпл паки, пресеты, loop kit, стемы",
      gradient: "bg-gradient-to-br from-cyan-600 to-blue-600",
      action: () => handleOpen(setProductOpen),
    },
  ];

  return (
    <div
      className="min-h-screen pb-24 lg:pb-6 px-4 lg:px-8 max-w-lg lg:max-w-3xl mx-auto"
      style={{ paddingTop: isFullscreen ? `calc(1.5rem + ${safeAreaTopInset}px)` : "1.5rem" }}
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Студия</h1>
        <p className="text-muted-foreground text-sm">Загружай биты, создавай услуги и продавай товары</p>
      </div>

      <div className="grid gap-4">
        {tiles.map((tile) => (
          <button
            key={tile.label}
            onClick={tile.action}
            className="w-full text-left group rounded-2xl overflow-hidden border border-border hover:border-primary/40 transition-all hover:shadow-lg"
          >
            <div className="flex items-center gap-5 p-5">
              <div className={`w-14 h-14 rounded-xl ${tile.gradient} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
                <tile.icon className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-base mb-0.5">{tile.label}</p>
                <p className="text-sm text-muted-foreground">{tile.description}</p>
              </div>
              <Plus className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
            </div>
          </button>
        ))}
      </div>

      <div className="mt-8 rounded-xl bg-muted/30 border border-border p-5">
        <p className="text-sm font-medium mb-1">Всё в одном месте</p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Загружённые биты появляются в ленте и в вашем профиле. Услуги и товары видны другим пользователям на странице вашего профиля и в поиске.
        </p>
      </div>

      <AddBeatDialog open={beatOpen} onOpenChange={setBeatOpen} />
      <AddServiceDialog open={serviceOpen} onOpenChange={setServiceOpen} onSuccess={() => {}} />
      <AddProductDialog open={productOpen} onOpenChange={setProductOpen} onSuccess={() => {}} />
    </div>
  );
};

export default Studio;
