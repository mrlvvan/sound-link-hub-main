import { useEffect, useState } from "react";
import { Building2, MapPin, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StudioCard } from "@/components/studios/StudioCard";
import { useSettingsStore } from "@/stores/settingsStore";
import { getStudios, type StudioRecord } from "@/lib/bookings";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const GRADIENTS = [
  "bg-gradient-to-br from-violet-600 to-indigo-600",
  "bg-gradient-to-br from-purple-600 to-blue-600",
  "bg-gradient-to-br from-pink-600 to-purple-600",
  "bg-gradient-to-br from-cyan-600 to-blue-600",
  "bg-gradient-to-br from-orange-600 to-red-600",
  "bg-gradient-to-br from-purple-900 via-purple-700 to-pink-600",
];

const studioToCardProps = (s: StudioRecord, idx: number) => ({
  id: s.id,
  name: s.name,
  type: s.price_per_day ? ["with_equipment", "hourly", "daily"] : ["with_equipment", "hourly"],
  pricePerHour: s.price_per_hour,
  pricePerDay: s.price_per_day ?? undefined,
  location: `${s.city}, ${s.address}`,
  description: s.description ?? undefined,
  equipment: s.equipment ?? undefined,
  gradient: GRADIENTS[idx % GRADIENTS.length],
  photo: s.photos[0] ?? undefined,
});

const Studios = () => {
  const { safeAreaTopInset, isFullscreen } = useSettingsStore();
  const [searchValue, setSearchValue] = useState("");
  const [studios, setStudios] = useState<StudioRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStudios({ limit: 50 })
      .then(setStudios)
      .catch(() => toast.error("Не удалось загрузить студии"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = studios.filter((s) => {
    if (!searchValue) return true;
    const q = searchValue.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.address.toLowerCase().includes(q) ||
      s.city.toLowerCase().includes(q)
    );
  });

  return (
    <div
      className="min-h-screen pb-24 lg:pb-6 px-4 lg:px-8 max-w-lg lg:max-w-7xl mx-auto"
      style={{ paddingTop: isFullscreen ? `calc(0.75rem + ${safeAreaTopInset}px)` : "2rem" }}
    >
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="w-7 h-7 text-primary" strokeWidth={1.5} />
            <h1 className="text-3xl font-bold">Аренда студий</h1>
          </div>
          <p className="text-muted-foreground">От репбазы до профессиональной студии</p>
        </div>
        <Link to="/add-studio">
          <Button variant="outline" size="sm" className="gap-1.5">
            <Plus className="w-4 h-4" />
            Добавить
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" strokeWidth={1.5} />
          <Input
            type="search"
            placeholder="Название, город или адрес..."
            className="h-12 bg-card border-border rounded-xl text-base pl-10"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col gap-5">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-64 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <>
          <p className="text-sm text-muted-foreground mb-4">
            Найдено студий: <span className="font-semibold text-foreground">{filtered.length}</span>
          </p>
          <div className="flex flex-col gap-5">
            {filtered.map((s, i) => (
              <StudioCard key={s.id} {...studioToCardProps(s, i)} />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-16">
          <Building2 className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" strokeWidth={1.5} />
          <p className="font-semibold text-lg mb-1">
            {searchValue ? "Ничего не найдено" : "Студий пока нет"}
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            {searchValue
              ? "Попробуйте другой запрос"
              : "Станьте первым и добавьте свою студию на платформу"}
          </p>
          {!searchValue && (
            <Link to="/add-studio">
              <Button className="bg-gradient-primary hover:shadow-neon">
                <Plus className="w-4 h-4 mr-2" />
                Добавить студию
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default Studios;
