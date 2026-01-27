import { useState } from "react";
import { Building2, Upload, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSettingsStore } from "@/stores/settingsStore";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AddStudio = () => {
  const { safeAreaTopInset, isFullscreen } = useSettingsStore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    district: "",
    equipment: "",
    rules: "",
    pricePerHour: "",
    pricePerDay: "",
    pricePerMonth: "",
    pricePerSession: "",
    contact: "",
    studioType: "", // Single choice: withEquipment, withoutEquipment, fullService
    rentalPeriods: {
      hourly: false,
      daily: false,
      monthly: false,
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.description || !formData.location) {
      toast.error("Заполните все обязательные поля");
      return;
    }

    // Check if studio type is selected
    if (!formData.studioType) {
      toast.error("Выберите тип студии");
      return;
    }

    // Check if at least one rental period is selected
    const hasRentalPeriod = Object.values(formData.rentalPeriods).some(v => v);
    if (!hasRentalPeriod) {
      toast.error("Выберите хотя бы один период аренды");
      return;
    }

    toast.success("Студия успешно добавлена!");
    navigate("/profile");
  };

  const handleRentalPeriodChange = (key: string) => {
    setFormData({
      ...formData,
      rentalPeriods: {
        ...formData.rentalPeriods,
        [key]: !formData.rentalPeriods[key as keyof typeof formData.rentalPeriods],
      },
    });
  };

  return (
    <div className="min-h-screen pb-24 lg:pb-6 pt-6 px-4 lg:px-8 max-w-lg lg:max-w-4xl mx-auto" style={{ paddingTop: isFullscreen ? `calc(0.75rem + ${safeAreaTopInset}px)` : '2rem' }}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Building2 className="w-7 h-7 text-primary" strokeWidth={1.5} />
          <h1 className="text-3xl font-bold">Добавить студию</h1>
        </div>
        <p className="text-muted-foreground">Разместите вашу студию для аренды</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Название студии *</Label>
            <Input
              id="name"
              placeholder="Studio Flow"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1.5"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Описание *</Label>
            <Textarea
              id="description"
              placeholder="Профессиональная студия в центре Москвы..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1.5 min-h-24"
              required
            />
          </div>
        </div>

        {/* Studio Type - Single Choice */}
        <div className="space-y-3">
          <Label>Тип студии * <span className="text-xs text-muted-foreground font-normal">(выберите один)</span></Label>
          <RadioGroup
            value={formData.studioType}
            onValueChange={(value) => setFormData({ ...formData, studioType: value })}
            className="space-y-2.5 bg-secondary/20 rounded-xl p-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="withEquipment" id="withEquipment" />
              <label htmlFor="withEquipment" className="text-sm font-medium cursor-pointer">
                С аппаратурой
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="withoutEquipment" id="withoutEquipment" />
              <label htmlFor="withoutEquipment" className="text-sm font-medium cursor-pointer">
                Без аппаратуры (репбаза)
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="fullService" id="fullService" />
              <label htmlFor="fullService" className="text-sm font-medium cursor-pointer">
                Запись под ключ
              </label>
            </div>
          </RadioGroup>
        </div>

        {/* Rental Period - Multiple Choice */}
        <div className="space-y-3">
          <Label>Период аренды * <span className="text-xs text-muted-foreground font-normal">(можно выбрать несколько)</span></Label>
          <div className="space-y-2.5 bg-secondary/20 rounded-xl p-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hourly"
                checked={formData.rentalPeriods.hourly}
                onCheckedChange={() => handleRentalPeriodChange("hourly")}
              />
              <label htmlFor="hourly" className="text-sm font-medium cursor-pointer">
                Почасово
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="daily"
                checked={formData.rentalPeriods.daily}
                onCheckedChange={() => handleRentalPeriodChange("daily")}
              />
              <label htmlFor="daily" className="text-sm font-medium cursor-pointer">
                Посуточно
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="monthly"
                checked={formData.rentalPeriods.monthly}
                onCheckedChange={() => handleRentalPeriodChange("monthly")}
              />
              <label htmlFor="monthly" className="text-sm font-medium cursor-pointer">
                Длительная аренда (месяц+)
              </label>
            </div>
          </div>
        </div>

        {/* Pricing - Always Visible */}
        <div className="space-y-4">
          <Label>Прайс</Label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="pricePerHour" className="text-xs text-muted-foreground">За час (₽)</Label>
              <Input
                id="pricePerHour"
                type="number"
                placeholder="2000"
                value={formData.pricePerHour}
                onChange={(e) => setFormData({ ...formData, pricePerHour: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="pricePerDay" className="text-xs text-muted-foreground">За день (₽)</Label>
              <Input
                id="pricePerDay"
                type="number"
                placeholder="15000"
                value={formData.pricePerDay}
                onChange={(e) => setFormData({ ...formData, pricePerDay: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="pricePerMonth" className="text-xs text-muted-foreground">За месяц (₽)</Label>
              <Input
                id="pricePerMonth"
                type="number"
                placeholder="80000"
                value={formData.pricePerMonth}
                onChange={(e) => setFormData({ ...formData, pricePerMonth: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="pricePerSession" className="text-xs text-muted-foreground">За сессию (₽)</Label>
              <Input
                id="pricePerSession"
                type="number"
                placeholder="25000"
                value={formData.pricePerSession}
                onChange={(e) => setFormData({ ...formData, pricePerSession: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="location">Адрес *</Label>
            <Input
              id="location"
              placeholder="Москва, ул. Примерная, д. 1"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="mt-1.5"
              required
            />
          </div>

          <div>
            <Label htmlFor="district">Район</Label>
            <Select
              value={formData.district}
              onValueChange={(value) => setFormData({ ...formData, district: value })}
            >
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Выберите район" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Центр">Центр (ЦАО)</SelectItem>
                <SelectItem value="Север">Север (САО)</SelectItem>
                <SelectItem value="Юго-Запад">Юго-Запад (ЮЗАО)</SelectItem>
                <SelectItem value="Запад">Запад (ЗАО)</SelectItem>
                <SelectItem value="Восток">Восток (ВАО)</SelectItem>
                <SelectItem value="Юго-Восток">Юго-Восток (ЮВАО)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Equipment */}
        <div>
          <Label htmlFor="equipment">Оборудование</Label>
          <Textarea
            id="equipment"
            placeholder="Neumann U87, SSL Console, Yamaha HS8..."
            value={formData.equipment}
            onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
            className="mt-1.5 min-h-20"
          />
          <p className="text-xs text-muted-foreground mt-1">Опишите доступное оборудование</p>
        </div>

        {/* Rules */}
        <div>
          <Label htmlFor="rules">Правила студии</Label>
          <Textarea
            id="rules"
            placeholder="Запрещено курение, еда и напитки..."
            value={formData.rules}
            onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
            className="mt-1.5 min-h-20"
          />
        </div>

        {/* Contact */}
        <div>
          <Label htmlFor="contact">Контакт для связи</Label>
          <Input
            id="contact"
            placeholder="Telegram: @username или +7 (XXX) XXX-XX-XX"
            value={formData.contact}
            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
            className="mt-1.5"
          />
        </div>

        {/* Photos Upload Placeholder */}
        <div>
          <Label>Фотографии студии</Label>
          <div className="mt-1.5 border-2 border-dashed border-border rounded-xl p-8 text-center bg-secondary/20 hover:bg-secondary/30 transition-colors cursor-pointer">
            <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" strokeWidth={1.5} />
            <p className="text-sm text-muted-foreground mb-1">Загрузите фото студии</p>
            <p className="text-xs text-muted-foreground/70">До 10 фотографий, JPG/PNG, до 5MB</p>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => navigate("/profile")}
          >
            Отмена
          </Button>
          <Button type="submit" className="flex-1 bg-gradient-primary hover:shadow-neon">
            <Plus className="w-4 h-4 mr-2" strokeWidth={1.5} />
            Добавить студию
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddStudio;
