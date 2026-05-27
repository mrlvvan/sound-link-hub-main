import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Music, Upload, X, ChevronDown, ChevronUp } from "lucide-react";
import { GENRE_OPTIONS, uploadTrack } from "@/lib/music";
import { upsertBeatLicenses, LICENSE_TIERS, type LicenseName } from "@/lib/licenses";

type AddBeatDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
};

export const AddBeatDialog = ({ open, onOpenChange, onSuccess }: AddBeatDialogProps) => {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [trackName, setTrackName] = useState("");
  const [genre, setGenre] = useState("");
  const [description, setDescription] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [showLicenses, setShowLicenses] = useState(false);
  const [licensePrices, setLicensePrices] = useState<Partial<Record<LicenseName, string>>>({});

  const resetForm = () => {
    setTrackName("");
    setGenre("");
    setDescription("");
    setAudioFile(null);
    setLicensePrices({});
    setShowLicenses(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setAudioFile(file);
    if (file && !trackName) {
      const name = file.name.replace(/\.(wav|mp3)$/i, "").replace(/[-_]/g, " ");
      setTrackName(name.slice(0, 60));
    }
  };

  const handleLicensePrice = (name: LicenseName, value: string) => {
    setLicensePrices((prev) => ({ ...prev, [name]: value }));
  };

  // When mp3 price is set, auto-suggest WAV and Exclusive if empty
  const handleMp3Blur = () => {
    const mp3 = parseInt(licensePrices.mp3 ?? "", 10);
    if (!mp3 || mp3 <= 0) return;
    setLicensePrices((prev) => ({
      wav: prev.wav || String(mp3 * 2),
      exclusive: prev.exclusive || String(mp3 * 5),
      ...prev,
      mp3: prev.mp3,
    }));
  };

  const getMinPrice = () => {
    const prices = Object.values(licensePrices)
      .map((v) => parseInt(v ?? "", 10))
      .filter((v) => !isNaN(v) && v > 0);
    return prices.length > 0 ? Math.min(...prices) : undefined;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { toast.error("Войдите, чтобы добавить бит"); return; }
    if (!trackName.trim()) { toast.error("Введите название"); return; }
    if (!genre) { toast.error("Выберите жанр"); return; }
    if (!audioFile) { toast.error("Выберите аудиофайл"); return; }

    setLoading(true);
    try {
      const minPrice = getMinPrice();
      const track = await uploadTrack({
        user,
        trackName,
        genre,
        description,
        audioFile,
        servicePrice: minPrice,
      });

      // Create license tiers if any prices set
      const licenseInputs: Partial<Record<LicenseName, number>> = {};
      for (const tier of LICENSE_TIERS) {
        const val = parseInt(licensePrices[tier.name] ?? "", 10);
        if (!isNaN(val) && val > 0) licenseInputs[tier.name] = val;
      }
      if (Object.keys(licenseInputs).length > 0) {
        await upsertBeatLicenses(track.id, licenseInputs);
      }

      toast.success("Бит опубликован");
      resetForm();
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
            <Music className="w-5 h-5 text-primary" />
            Загрузить бит
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Файл */}
          <div
            className="relative border-2 border-dashed border-border rounded-xl p-4 text-center cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            {audioFile ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <Music className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-sm font-medium truncate">{audioFile.name}</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setAudioFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                  className="ml-2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-1">
                <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                <p className="text-sm font-medium">Нажмите или перетащите файл</p>
                <p className="text-xs text-muted-foreground">WAV или MP3, до 100 МБ</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".wav,.mp3,audio/wav,audio/x-wav,audio/mpeg"
              onChange={handleFileChange}
              disabled={loading}
              className="hidden"
            />
          </div>

          {/* Название */}
          <div className="space-y-1.5">
            <Label htmlFor="trackName">Название *</Label>
            <Input
              id="trackName"
              placeholder="Dark Drill Beat"
              value={trackName}
              onChange={(e) => setTrackName(e.target.value)}
              disabled={loading}
              maxLength={80}
            />
          </div>

          {/* Жанр */}
          <div className="space-y-1.5">
            <Label>Жанр *</Label>
            <Select value={genre} onValueChange={setGenre} disabled={loading}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите жанр" />
              </SelectTrigger>
              <SelectContent>
                {GENRE_OPTIONS.map((g) => (
                  <SelectItem key={g.slug} value={g.label}>{g.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Описание */}
          <div className="space-y-1.5">
            <Label htmlFor="description">Описание <span className="text-muted-foreground text-xs">(необязательно)</span></Label>
            <Textarea
              id="description"
              placeholder="Расскажите о треке..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              disabled={loading}
            />
          </div>

          {/* License tiers */}
          <div className="border border-border rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setShowLicenses(!showLicenses)}
              className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium hover:bg-muted/50 transition-colors"
            >
              <span className="flex items-center gap-2">
                <span>Тарифы лицензий</span>
                {getMinPrice() != null && (
                  <span className="text-xs text-primary font-normal">от ₽{getMinPrice()!.toLocaleString("ru-RU")}</span>
                )}
              </span>
              {showLicenses ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
            </button>

            {showLicenses && (
              <div className="border-t border-border divide-y divide-border/50">
                {LICENSE_TIERS.map((tier) => (
                  <div key={tier.name} className="px-4 py-3 space-y-1">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <span className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded border ${tier.badgeClass} mb-1`}>
                          {tier.sublabel}
                        </span>
                        <p className="text-xs text-muted-foreground leading-tight">{tier.description}</p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <span className="text-sm text-muted-foreground">₽</span>
                        <Input
                          type="number"
                          min={1}
                          placeholder="—"
                          value={licensePrices[tier.name] ?? ""}
                          onChange={(e) => handleLicensePrice(tier.name, e.target.value)}
                          onBlur={tier.name === "mp3" ? handleMp3Blur : undefined}
                          disabled={loading}
                          className="w-24 h-8 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <p className="px-4 py-2 text-[10px] text-muted-foreground bg-muted/20">
                  Совет: введите цену MP3 — WAV и Exclusive заполнятся автоматически (×2 и ×5)
                </p>
              </div>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loading || !audioFile || !trackName || !genre}>
            {loading ? "Загружаю..." : "Опубликовать"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
