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
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Music, Upload } from "lucide-react";

const STORAGE_BUCKET = "beats";

const GENRES = ["Trap", "Drill", "EDM", "Lo-Fi", "Hip-Hop", "R&B", "Pop", "JazzHop", "Другое"];
const GRADIENTS = [
  { value: "bg-gradient-to-br from-purple-900 via-purple-700 to-pink-600", label: "Фиолетовый" },
  { value: "bg-gradient-to-br from-cyan-900 via-cyan-600 to-blue-600", label: "Циан" },
  { value: "bg-gradient-to-br from-green-900 via-green-600 to-teal-600", label: "Зелёный" },
  { value: "bg-gradient-to-br from-orange-900 via-red-700 to-pink-600", label: "Оранжевый" },
  { value: "bg-gradient-to-br from-gray-900 via-slate-700 to-purple-900", label: "Серый" },
  { value: "bg-gradient-to-br from-pink-900 via-purple-700 to-indigo-600", label: "Розовый" },
];

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
  const [coverGradient, setCoverGradient] = useState(GRADIENTS[0].value);
  const [serviceTitle, setServiceTitle] = useState("Аренда студии");
  const [servicePrice, setServicePrice] = useState("2500");

  const resetForm = () => {
    setTrackName("");
    setGenre("");
    setDescription("");
    setAudioFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Войдите, чтобы добавить бит");
      return;
    }
    if (!trackName.trim() || !genre) {
      toast.error("Заполните название и жанр");
      return;
    }
    if (!audioFile) {
      toast.error("Выберите WAV-файл");
      return;
    }
    if (!audioFile.name.toLowerCase().endsWith(".wav")) {
      toast.error("Доступен только формат WAV");
      return;
    }

    setLoading(true);
    try {
      const fileExt = audioFile.name.slice(-4).toLowerCase();
      const fileName = `${user.id}/${crypto.randomUUID()}${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(fileName, audioFile, { contentType: "audio/wav", upsert: false });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(fileName);
      const audioUrl = urlData.publicUrl;

      const { error } = await supabase.from("beats").insert({
        user_id: user.id,
        track_name: trackName.trim(),
        genre: genre.trim(),
        description: description.trim() || null,
        audio_url: audioUrl,
        cover_gradient: coverGradient,
        service_title: serviceTitle.trim() || "Аренда студии",
        service_price: parseInt(servicePrice, 10) || 2500,
      });
      if (error) throw error;

      toast.success("Бит добавлен в ленту!");
      resetForm();
      onOpenChange(false);
      onSuccess?.();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Ошибка добавления";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Music className="w-5 h-5" />
            Добавить бит
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="trackName">Название трека *</Label>
            <Input
              id="trackName"
              placeholder="Dark Drill Beat"
              value={trackName}
              onChange={(e) => setTrackName(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div>
            <Label htmlFor="genre">Жанр *</Label>
            <Select value={genre} onValueChange={setGenre} required>
              <SelectTrigger id="genre" disabled={loading}>
                <SelectValue placeholder="Выберите жанр" />
              </SelectTrigger>
              <SelectContent>
                {GENRES.map((g) => (
                  <SelectItem key={g} value={g}>
                    {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="audioFile">WAV-файл *</Label>
            <input
              ref={fileInputRef}
              id="audioFile"
              type="file"
              accept=".wav,audio/wav"
              onChange={(e) => setAudioFile(e.target.files?.[0] ?? null)}
              disabled={loading}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Только формат WAV
            </p>
            {audioFile && (
              <p className="text-xs text-primary mt-1">
                Выбран: {audioFile.name}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              placeholder="Расскажите о треке..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              disabled={loading}
            />
          </div>
          <div>
            <Label>Оформление</Label>
            <Select value={coverGradient} onValueChange={setCoverGradient} disabled={loading}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {GRADIENTS.map((g) => (
                  <SelectItem key={g.value} value={g.value}>
                    {g.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="serviceTitle">Услуга</Label>
              <Input
                id="serviceTitle"
                placeholder="Аренда студии"
                value={serviceTitle}
                onChange={(e) => setServiceTitle(e.target.value)}
                disabled={loading}
              />
            </div>
            <div>
              <Label htmlFor="servicePrice">Цена, ₽</Label>
              <Input
                id="servicePrice"
                type="number"
                min={0}
                placeholder="2500"
                value={servicePrice}
                onChange={(e) => setServicePrice(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Добавляю..." : "Опубликовать"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
