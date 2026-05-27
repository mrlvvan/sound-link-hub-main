import { useState } from "react";
import { Building2, Upload, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSettingsStore } from "@/stores/settingsStore";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { createStudio } from "@/lib/bookings";
import { toast } from "sonner";

const CITIES = ["Москва", "Санкт-Петербург", "Екатеринбург", "Казань", "Новосибирск", "Краснодар", "Другой"];

const AddStudio = () => {
  const { safeAreaTopInset, isFullscreen } = useSettingsStore();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Москва");
  const [equipment, setEquipment] = useState("");
  const [pricePerHour, setPricePerHour] = useState("");
  const [pricePerDay, setPricePerDay] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { navigate("/login"); return; }

    if (!name.trim() || !address.trim() || !pricePerHour) {
      toast.error("Заполните обязательные поля: название, адрес и цена за час");
      return;
    }

    const hourly = Number(pricePerHour);
    if (!hourly || hourly <= 0) {
      toast.error("Введите корректную цену за час");
      return;
    }

    setSaving(true);
    try {
      await createStudio(user.id, {
        name: name.trim(),
        description: description.trim() || undefined,
        address: address.trim(),
        city,
        pricePerHour: hourly,
        pricePerDay: pricePerDay ? Number(pricePerDay) : undefined,
        equipment: equipment.trim() || undefined,
      });
      toast.success("Студия добавлена!");
      navigate("/studios");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Не удалось добавить студию");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="min-h-screen pb-24 lg:pb-6 px-4 lg:px-8 max-w-lg lg:max-w-2xl mx-auto"
      style={{ paddingTop: isFullscreen ? `calc(0.75rem + ${safeAreaTopInset}px)` : "2rem" }}
    >
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Building2 className="w-7 h-7 text-primary" strokeWidth={1.5} />
          <h1 className="text-3xl font-bold">Добавить студию</h1>
        </div>
        <p className="text-muted-foreground">Разместите вашу студию для аренды</p>
      </div>

      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-5">
        <div>
          <Label htmlFor="name">Название студии *</Label>
          <Input
            id="name"
            placeholder="Studio Flow"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1.5"
            disabled={saving}
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Описание</Label>
          <Textarea
            id="description"
            placeholder="Профессиональная студия в центре города..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1.5 min-h-24"
            disabled={saving}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="city">Город</Label>
            <Select value={city} onValueChange={setCity} disabled={saving}>
              <SelectTrigger className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CITIES.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="address">Адрес *</Label>
            <Input
              id="address"
              placeholder="ул. Тверская, д. 1"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-1.5"
              disabled={saving}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="pricePerHour">Цена за час (₽) *</Label>
            <Input
              id="pricePerHour"
              type="number"
              min="0"
              placeholder="2000"
              value={pricePerHour}
              onChange={(e) => setPricePerHour(e.target.value)}
              className="mt-1.5"
              disabled={saving}
              required
            />
          </div>
          <div>
            <Label htmlFor="pricePerDay">Цена за день (₽)</Label>
            <Input
              id="pricePerDay"
              type="number"
              min="0"
              placeholder="15000"
              value={pricePerDay}
              onChange={(e) => setPricePerDay(e.target.value)}
              className="mt-1.5"
              disabled={saving}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="equipment">Оборудование</Label>
          <Textarea
            id="equipment"
            placeholder="Neumann U87, SSL Console, Yamaha HS8..."
            value={equipment}
            onChange={(e) => setEquipment(e.target.value)}
            className="mt-1.5 min-h-20"
            disabled={saving}
          />
          <p className="text-xs text-muted-foreground mt-1">Опишите доступное оборудование</p>
        </div>

        <div>
          <Label>Фотографии студии</Label>
          <div className="mt-1.5 border-2 border-dashed border-border rounded-xl p-8 text-center bg-secondary/20 hover:bg-secondary/30 transition-colors">
            <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" strokeWidth={1.5} />
            <p className="text-sm text-muted-foreground mb-1">Загрузите фото студии</p>
            <p className="text-xs text-muted-foreground/70">Скоро будет доступно</p>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => navigate("/studios")}
            disabled={saving}
          >
            Отмена
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-gradient-primary hover:shadow-neon"
            disabled={saving}
          >
            <Plus className="w-4 h-4 mr-2" strokeWidth={1.5} />
            {saving ? "Добавляем..." : "Добавить студию"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddStudio;
