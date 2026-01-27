import { Building2, Mic2, Clock, Calendar, Home, AudioLines } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatPrice } from "@/lib/formatPrice";

interface StudioFiltersProps {
  filters: {
    type: string;
    equipment: string;
    priceRange: number[];
    city: string;
    district: string;
  };
  setFilters: (filters: any) => void;
}

const cityDistricts: Record<string, string[]> = {
  "Москва": ["Центр (ЦАО)", "Север (САО)", "Юго-Запад (ЮЗАО)", "Запад (ЗАО)", "Восток (ВАО)", "Юго-Восток (ЮВАО)"],
  "Санкт-Петербург": ["Центральный", "Невский", "Приморский", "Василеостровский", "Петроградский", "Московский"],
  "Новосибирск": ["Центральный", "Заельцовский", "Октябрьский", "Ленинский", "Калининский"],
  "Екатеринбург": ["Центр", "Верх-Исетский", "Кировский", "Ленинский", "Октябрьский"],
  "Казань": ["Вахитовский", "Приволжский", "Советский", "Московский", "Ново-Савиновский"],
  "Нижний Новгород": ["Нижегородский", "Приокский", "Советский", "Автозаводский", "Канавинский"],
};

export const StudioFilters = ({ filters, setFilters }: StudioFiltersProps) => {
  return (
    <div className="space-y-4 mb-6">
      {/* Rental Type */}
      <div>
        <label className="text-sm font-medium mb-2 block">Тип аренды</label>
        <Tabs
          value={filters.type}
          onValueChange={(value) => setFilters({ ...filters, type: value })}
          className="w-full"
        >
          <TabsList className="w-full grid grid-cols-4 h-auto">
            <TabsTrigger value="all" className="text-xs py-2">
              Все
            </TabsTrigger>
            <TabsTrigger value="hourly" className="text-xs py-2">
              <Clock className="w-3 h-3 mr-1" strokeWidth={1.5} />
              Часы
            </TabsTrigger>
            <TabsTrigger value="daily" className="text-xs py-2">
              <Calendar className="w-3 h-3 mr-1" strokeWidth={1.5} />
              Дни
            </TabsTrigger>
            <TabsTrigger value="monthly" className="text-xs py-2">
              <Home className="w-3 h-3 mr-1" strokeWidth={1.5} />
              Мес
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Equipment Type */}
      <div>
        <label className="text-sm font-medium mb-2 block">Наличие аппаратуры</label>
        <Tabs
          value={filters.equipment}
          onValueChange={(value) => setFilters({ ...filters, equipment: value })}
          className="w-full"
        >
          <TabsList className="w-full grid grid-cols-3 h-auto">
            <TabsTrigger value="all" className="text-xs py-2">
              Все
            </TabsTrigger>
            <TabsTrigger value="with" className="text-xs py-2">
              <Mic2 className="w-3 h-3 mr-1" strokeWidth={1.5} />
              С аппар.
            </TabsTrigger>
            <TabsTrigger value="without" className="text-xs py-2">
              <Building2 className="w-3 h-3 mr-1" strokeWidth={1.5} />
              Без
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Price Range with Manual Input */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Прайс</Label>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <Label htmlFor="minPrice" className="text-xs text-muted-foreground">От (₽)</Label>
            <Input
              id="minPrice"
              type="number"
              value={filters.priceRange[0]}
              onChange={(e) => {
                const min = parseInt(e.target.value) || 0;
                setFilters({ 
                  ...filters, 
                  priceRange: [Math.min(min, filters.priceRange[1]), filters.priceRange[1]] 
                });
              }}
              className="mt-1"
              placeholder="0"
            />
          </div>
          <div className="flex-1">
            <Label htmlFor="maxPrice" className="text-xs text-muted-foreground">До (₽)</Label>
            <Input
              id="maxPrice"
              type="number"
              value={filters.priceRange[1]}
              onChange={(e) => {
                const max = parseInt(e.target.value) || 100000;
                setFilters({ 
                  ...filters, 
                  priceRange: [filters.priceRange[0], Math.max(max, filters.priceRange[0])] 
                });
              }}
              className="mt-1"
              placeholder="100000"
            />
          </div>
        </div>
        <Slider
          min={0}
          max={100000}
          step={1000}
          value={filters.priceRange}
          onValueChange={(value) => setFilters({ ...filters, priceRange: value })}
          className="py-2"
        />
      </div>

      {/* City */}
      <div>
        <label className="text-sm font-medium mb-2 block">Город</label>
        <Select
          value={filters.city}
          onValueChange={(value) => setFilters({ ...filters, city: value, district: "all" })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Выберите город" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все города</SelectItem>
            <SelectItem value="Москва">Москва</SelectItem>
            <SelectItem value="Санкт-Петербург">Санкт-Петербург</SelectItem>
            <SelectItem value="Новосибирск">Новосибирск</SelectItem>
            <SelectItem value="Екатеринбург">Екатеринбург</SelectItem>
            <SelectItem value="Казань">Казань</SelectItem>
            <SelectItem value="Нижний Новгород">Нижний Новгород</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* District */}
      <div>
        <label className="text-sm font-medium mb-2 block">Район</label>
        <Select
          value={filters.district}
          onValueChange={(value) => setFilters({ ...filters, district: value })}
          disabled={filters.city === "all"}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Выберите район" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все районы</SelectItem>
            {filters.city !== "all" && cityDistricts[filters.city]?.map((district) => (
              <SelectItem key={district} value={district}>{district}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
