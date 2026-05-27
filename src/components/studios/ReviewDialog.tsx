import { useState } from "react";
import { Star } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createReview } from "@/lib/reviews";
import { toast } from "sonner";

interface ReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studioId: string;
  studioName: string;
  bookingId: string;
  reviewerId: string;
  onSubmitted: () => void;
}

export const ReviewDialog = ({
  open,
  onOpenChange,
  studioId,
  studioName,
  bookingId,
  reviewerId,
  onSubmitted,
}: ReviewDialogProps) => {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) { toast.error("Выберите оценку"); return; }
    setSaving(true);
    try {
      await createReview({ studioId, reviewerId, bookingId, rating, comment });
      toast.success("Отзыв оставлен!");
      onSubmitted();
      onOpenChange(false);
    } catch {
      toast.error("Не удалось сохранить отзыв");
    } finally {
      setSaving(false);
    }
  };

  const stars = [1, 2, 3, 4, 5];
  const display = hovered || rating;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Оставить отзыв</DialogTitle>
          <p className="text-sm text-muted-foreground">{studioName}</p>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Stars */}
          <div className="flex justify-center gap-2">
            {stars.map((s) => (
              <button
                key={s}
                onMouseEnter={() => setHovered(s)}
                onMouseLeave={() => setHovered(0)}
                onClick={() => setRating(s)}
                className="transition-transform hover:scale-110 active:scale-95"
              >
                <Star
                  className={`w-9 h-9 transition-colors ${
                    s <= display ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                  }`}
                />
              </button>
            ))}
          </div>
          <p className="text-center text-sm font-medium text-muted-foreground min-h-[20px]">
            {display === 1 && "Очень плохо"}
            {display === 2 && "Плохо"}
            {display === 3 && "Нормально"}
            {display === 4 && "Хорошо"}
            {display === 5 && "Отлично!"}
          </p>

          <Textarea
            placeholder="Напишите что-нибудь о студии (необязательно)..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            maxLength={500}
          />
          <p className="text-[10px] text-muted-foreground text-right">{comment.length}/500</p>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            Пропустить
          </Button>
          <Button onClick={() => void handleSubmit()} disabled={saving || rating === 0}>
            {saving ? "Сохраняем..." : "Отправить"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
