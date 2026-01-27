import { useState } from "react";
import { Building2, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { StudioCard } from "@/components/studios/StudioCard";
import { StudioFilters } from "@/components/studios/StudioFilters";
import { useSettingsStore } from "@/stores/settingsStore";

const Studios = () => {
  const { safeAreaTopInset, isFullscreen } = useSettingsStore();
  const [searchValue, setSearchValue] = useState("");
  const [filters, setFilters] = useState({
    type: "all",
    equipment: "all",
    priceRange: [0, 50000],
    city: "all",
    district: "all",
  });

  const studios = [
    {
      id: 1,
      name: "Studio Flow",
      type: ["with_equipment", "hourly", "daily"],
      pricePerHour: 2000,
      pricePerDay: 15000,
      city: "Москва",
      location: "Москва, ЦАО",
      district: "Центр (ЦАО)",
      rating: 4.9,
      bookings: 342,
      photo: "/images/studios/studio-flow-1.jpg",
      equipment: "Neumann U87, SSL Console, Yamaha HS8, Apollo Interface",
      description: "Профессиональная студия в центре Москвы с полным комплектом оборудования для записи и сведения",
      gradient: "bg-gradient-to-br from-violet-600 to-indigo-600",
      promotionType: 'vip' as const,
    },
    {
      id: 2,
      name: "Репбаза Central",
      type: ["without_equipment", "hourly", "monthly"],
      pricePerHour: 500,
      pricePerMonth: 80000,
      city: "Москва",
      location: "Москва, ЮЗАО",
      district: "Юго-Запад (ЮЗАО)",
      rating: 4.7,
      bookings: 189,
      photo: "/images/studios/repbaza-central.jpg",
      equipment: "Базовая звукоизоляция, помещение 20м²",
      description: "Просторная репетиционная база для творчества. Подходит для записи демо и репетиций",
      gradient: "bg-gradient-to-br from-purple-600 to-blue-600",
    },
    {
      id: 3,
      name: "Premium Records",
      type: ["full_service", "session"],
      pricePerSession: 25000,
      city: "Москва",
      location: "Москва, САО",
      district: "Север (САО)",
      rating: 5.0,
      bookings: 156,
      photo: "/images/studios/premium-records.jpg",
      equipment: "Полный цикл записи, сведения и мастеринга. Звукорежиссёр включен",
      description: "Запись трека под ключ в профессиональной студии с опытным звукорежиссёром",
      gradient: "bg-gradient-to-br from-pink-600 to-purple-600",
      promotionType: 'recommended' as const,
    },
    {
      id: 4,
      name: "Sound Lab Pro",
      type: ["with_equipment", "hourly", "daily"],
      pricePerHour: 3000,
      pricePerDay: 20000,
      city: "Санкт-Петербург",
      location: "Санкт-Петербург, Невский район",
      district: "Невский",
      rating: 4.8,
      bookings: 267,
      photo: "/images/studios/studio-flow-2.jpg",
      equipment: "Neumann TLM 103, Focusrite ISA430, Adam A7X, Pro Tools HD",
      description: "Современная студия с профессиональным оборудованием и акустической обработкой",
      gradient: "bg-gradient-to-br from-cyan-600 to-blue-600",
    },
    {
      id: 5,
      name: "Базовая Репа",
      type: ["without_equipment", "daily", "monthly"],
      pricePerDay: 3000,
      pricePerMonth: 60000,
      city: "Екатеринбург",
      location: "Екатеринбург, Центр",
      district: "Центр",
      rating: 4.5,
      bookings: 98,
      photo: "/images/studios/bazovaya-repa.jpg",
      equipment: "Пустое помещение 15м², звукоизоляция",
      description: "Доступная репетиционная база для начинающих артистов и долгосрочной аренды",
      gradient: "bg-gradient-to-br from-orange-600 to-red-600",
    },
    {
      id: 6,
      name: "Trap House Studio",
      type: ["with_equipment", "full_service", "hourly"],
      pricePerHour: 2500,
      pricePerSession: 30000,
      city: "Казань",
      location: "Казань, Вахитовский район",
      district: "Вахитовский",
      rating: 4.9,
      bookings: 423,
      photo: "/images/studios/trap-house.jpg",
      equipment: "Shure SM7B, UAD Apollo, Genelec 8040, Ableton Live Suite",
      description: "Специализация на Trap и Hip-Hop продакшене. Запись, сведение, битмейкинг",
      gradient: "bg-gradient-to-br from-purple-900 via-purple-700 to-pink-600",
      promotionType: 'vip' as const,
    },
  ];

  const filteredStudios = studios.filter((studio) => {
    if (searchValue && !studio.name.toLowerCase().includes(searchValue.toLowerCase()) &&
        !studio.location.toLowerCase().includes(searchValue.toLowerCase())) {
      return false;
    }
    
    if (filters.type !== "all" && !studio.type.includes(filters.type)) {
      return false;
    }
    
    if (filters.equipment === "with" && !studio.type.includes("with_equipment") && !studio.type.includes("full_service")) {
      return false;
    }
    
    if (filters.equipment === "without" && !studio.type.includes("without_equipment")) {
      return false;
    }
    
    const price = studio.pricePerHour || studio.pricePerDay || studio.pricePerSession || 0;
    if (price < filters.priceRange[0] || price > filters.priceRange[1]) {
      return false;
    }
    
    if (filters.city !== "all" && studio.city !== filters.city) {
      return false;
    }
    
    if (filters.district !== "all" && studio.district !== filters.district) {
      return false;
    }
    
    return true;
  });

  // Sort by promotion priority: VIP > Recommended > Standard
  const sortedStudios = [...filteredStudios].sort((a, b) => {
    const promotionPriority = { vip: 3, recommended: 2, standard: 1 };
    const aPriority = promotionPriority[a.promotionType || 'standard'];
    const bPriority = promotionPriority[b.promotionType || 'standard'];
    return bPriority - aPriority;
  });

  return (
    <div className="min-h-screen pb-24 lg:pb-6 pt-6 px-4 lg:px-8 max-w-lg lg:max-w-7xl mx-auto" style={{ paddingTop: isFullscreen ? `calc(0.75rem + ${safeAreaTopInset}px)` : '2rem' }}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Building2 className="w-7 h-7 text-primary" strokeWidth={1.5} />
          <h1 className="text-3xl font-bold">Аренда студий</h1>
        </div>
        <p className="text-muted-foreground">От репбазы до профессиональной студии</p>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" strokeWidth={1.5} />
          <Input
            type="search"
            placeholder="Название студии или район..."
            className="h-12 bg-card border-border rounded-xl text-base pl-10"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>

      {/* Filters */}
      <StudioFilters filters={filters} setFilters={setFilters} />

      {/* Results */}
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          Найдено студий: <span className="font-semibold text-foreground">{filteredStudios.length}</span>
        </p>
      </div>

      {/* Studios Grid */}
      <div className="flex flex-col gap-5">
        {sortedStudios.map((studio) => (
          <StudioCard key={studio.id} {...studio} />
        ))}
      </div>

      {filteredStudios.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" strokeWidth={1.5} />
          <p className="text-muted-foreground">Студии не найдены</p>
          <p className="text-sm text-muted-foreground/70 mt-1">Попробуйте изменить фильтры</p>
        </div>
      )}
    </div>
  );
};

export default Studios;
