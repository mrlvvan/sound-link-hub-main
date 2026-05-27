import { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Briefcase } from "lucide-react";
import { SERVICE_CATEGORIES, createService } from "@/lib/marketplace";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
};

export const AddServiceDialog = ({ open, onOpenChange, onSuccess }: Props) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const reset = () => { setTitle(""); setCategory(""); setPrice(""); setDescription(""); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { toast.error("Войдите в аккаунт"); return; }
    if (!title.trim()) { toast.error("Введите название"); return; }
    if (!category) { toast.error("Выберите категорию"); return; }
    const priceNum = parseInt(price, 10);
    if (!price || isNaN(priceNum) || priceNum < 0) { toast.error("Введите корректную цену"); return; }

    setLoading(true);
    try {
      await createService(user, { title, category, price: priceNum, description });
      toast.success("Услуга добавлена");
      reset();
      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Ошибка");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-primary" />
            Добавить услугу
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="svc-title">Название *</Label>
            <Input
              id="svc-title"
              placeholder="Профессиональное сведение трека"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
              maxLength={80}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Категория *</Label>
            <Select value={category} onValueChange={setCategory} disabled={loading}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите категорию" />
              </SelectTrigger>
              <SelectContent>
                {SERVICE_CATEGORIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="svc-price">Цена, ₽ *</Label>
            <Input
              id="svc-price"
              type="number"
              min={0}
              placeholder="3000"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="svc-desc">Описание <span className="text-muted-foreground text-xs">(необязательно)</span></Label>
            <Textarea
              id="svc-desc"
              placeholder="Что входит в услугу, сроки, что нужно от заказчика..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              disabled={loading}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading || !title || !category || !price}
          >
            {loading ? "Добавляю..." : "Добавить услугу"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
