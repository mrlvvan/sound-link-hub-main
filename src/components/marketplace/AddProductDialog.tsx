import { useState, useRef } from "react";
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
import { Package, Upload, X } from "lucide-react";
import { PRODUCT_TYPES, createProduct } from "@/lib/marketplace";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
};

export const AddProductDialog = ({ open, onOpenChange, onSuccess }: Props) => {
  const { user } = useAuth();
  const mainFileRef = useRef<HTMLInputElement>(null);
  const previewFileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [productType, setProductType] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [mainFile, setMainFile] = useState<File | null>(null);
  const [previewFile, setPreviewFile] = useState<File | null>(null);

  const reset = () => {
    setTitle(""); setProductType(""); setPrice(""); setDescription("");
    setMainFile(null); setPreviewFile(null);
    if (mainFileRef.current) mainFileRef.current.value = "";
    if (previewFileRef.current) previewFileRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { toast.error("Войдите в аккаунт"); return; }
    if (!title.trim()) { toast.error("Введите название"); return; }
    if (!productType) { toast.error("Выберите тип"); return; }
    if (!mainFile) { toast.error("Загрузите файл"); return; }
    const priceNum = parseInt(price, 10);
    if (!price || isNaN(priceNum) || priceNum < 0) { toast.error("Введите корректную цену"); return; }

    setLoading(true);
    try {
      await createProduct(user, {
        title, productType, price: priceNum, description,
        audioFile: mainFile, previewFile,
      });
      toast.success("Товар добавлен");
      reset();
      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Ошибка загрузки");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            Добавить товар
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Главный файл */}
          <div className="space-y-1.5">
            <Label>Файл товара * <span className="text-muted-foreground text-xs">(ZIP, WAV, MP3…)</span></Label>
            <div
              className="border-2 border-dashed border-border rounded-xl p-3 text-center cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => mainFileRef.current?.click()}
            >
              {mainFile ? (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium truncate">{mainFile.name}</span>
                  <button type="button" onClick={(e) => { e.stopPropagation(); setMainFile(null); if (mainFileRef.current) mainFileRef.current.value = ""; }}>
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Upload className="w-4 h-4" />
                  <span className="text-sm">Выбрать файл</span>
                </div>
              )}
              <input ref={mainFileRef} type="file" accept="*/*" onChange={(e) => setMainFile(e.target.files?.[0] ?? null)} disabled={loading} className="hidden" />
            </div>
          </div>

          {/* Превью (mp3 для прослушки) */}
          <div className="space-y-1.5">
            <Label>Превью MP3 <span className="text-muted-foreground text-xs">(необязательно, для прослушки)</span></Label>
            <div
              className="border border-border rounded-xl p-2.5 cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => previewFileRef.current?.click()}
            >
              {previewFile ? (
                <div className="flex items-center justify-between">
                  <span className="text-sm truncate">{previewFile.name}</span>
                  <button type="button" onClick={(e) => { e.stopPropagation(); setPreviewFile(null); if (previewFileRef.current) previewFileRef.current.value = ""; }}>
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">Загрузить превью...</span>
              )}
              <input ref={previewFileRef} type="file" accept=".mp3,audio/mpeg" onChange={(e) => setPreviewFile(e.target.files?.[0] ?? null)} disabled={loading} className="hidden" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="prod-title">Название *</Label>
            <Input
              id="prod-title"
              placeholder="Dark Trap Kit Vol.1"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
              maxLength={80}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Тип *</Label>
            <Select value={productType} onValueChange={setProductType} disabled={loading}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите тип" />
              </SelectTrigger>
              <SelectContent>
                {PRODUCT_TYPES.map((p) => (
                  <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="prod-price">Цена, ₽ *</Label>
            <Input
              id="prod-price"
              type="number"
              min={0}
              placeholder="999"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="prod-desc">Описание <span className="text-muted-foreground text-xs">(необязательно)</span></Label>
            <Textarea
              id="prod-desc"
              placeholder="Состав, формат файлов, количество семплов..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              disabled={loading}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading || !title || !productType || !price || !mainFile}
          >
            {loading ? "Загружаю..." : "Добавить товар"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
