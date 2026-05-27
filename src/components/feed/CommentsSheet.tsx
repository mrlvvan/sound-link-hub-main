import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Trash2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useSettingsStore } from "@/stores/settingsStore";
import { useAuth } from "@/contexts/AuthContext";
import { getBeatComments, addBeatComment, deleteBeatComment, type BeatComment } from "@/lib/music";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface CommentsSheetProps {
  beatId: string;
  isOpen: boolean;
  onClose: () => void;
  onCommentAdded?: () => void;
}

const pluralComments = (n: number) => {
  if (n % 10 === 1 && n % 100 !== 11) return "комментарий";
  if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)) return "комментария";
  return "комментариев";
};

export const CommentsSheet = ({ beatId, isOpen, onClose, onCommentAdded }: CommentsSheetProps) => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { safeAreaTopInset } = useSettingsStore();
  const [comments, setComments] = useState<BeatComment[]>([]);
  const [loading, setLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    getBeatComments(beatId)
      .then(setComments)
      .catch(() => toast.error("Не удалось загрузить комментарии"))
      .finally(() => setLoading(false));
  }, [beatId, isOpen]);

  useEffect(() => {
    if (isOpen) scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments, isOpen]);

  const handleSend = async () => {
    if (!newComment.trim()) return;
    if (!user) { navigate("/login"); return; }

    const text = newComment.trim();
    setNewComment("");
    setSending(true);
    try {
      const comment = await addBeatComment(beatId, user.id, text);
      comment.profiles = {
        id: user.id,
        username: profile?.username ?? "",
        display_name: profile?.display_name ?? null,
        avatar_url: profile?.avatar_url ?? null,
      };
      setComments((prev) => [...prev, comment]);
      onCommentAdded?.();
    } catch {
      setNewComment(text);
      toast.error("Не удалось отправить комментарий");
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      await deleteBeatComment(commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch {
      toast.error("Не удалось удалить комментарий");
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[75vh] p-0 rounded-t-3xl border-0">
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
        </div>

        <SheetHeader className="px-4 pb-3 border-b border-border/50">
          <SheetTitle className="text-center text-base font-semibold">
            {comments.length} {pluralComments(comments.length)}
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-[calc(75vh-130px)] px-4">
          <div className="space-y-5 py-4">
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex gap-2.5 animate-pulse">
                    <div className="w-9 h-9 rounded-full bg-muted flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-muted rounded w-1/4" />
                      <div className="h-3 bg-muted rounded w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : comments.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Комментариев пока нет. Будьте первым!
              </p>
            ) : (
              comments.map((comment) => {
                const author = comment.profiles;
                const name = author?.display_name || author?.username || "Пользователь";
                const isOwn = comment.user_id === user?.id;

                return (
                  <div key={comment.id} className="flex gap-2.5 group">
                    <Avatar className="w-9 h-9 flex-shrink-0">
                      <AvatarImage src={author?.avatar_url ?? undefined} />
                      <AvatarFallback className="bg-primary/20 text-sm font-semibold">
                        {name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-2">
                        <div className="flex items-baseline gap-2">
                          <span className="font-semibold text-sm">@{author?.username || "?"}</span>
                          <span className="text-[11px] text-muted-foreground">
                            {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: ru })}
                          </span>
                        </div>
                        {isOwn && (
                          <button
                            onClick={() => void handleDelete(comment.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <p className="text-sm leading-snug break-words mt-0.5">{comment.text}</p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>

        <div
          className="absolute bottom-0 left-0 right-0 p-3 border-t border-border/50 bg-background/95 backdrop-blur-sm"
          style={{ paddingBottom: `calc(0.75rem + env(safe-area-inset-bottom))` }}
        >
          <div className="flex gap-2 items-center">
            <Avatar className="w-8 h-8 flex-shrink-0">
              <AvatarImage src={profile?.avatar_url ?? undefined} />
              <AvatarFallback className="bg-primary/20 text-xs font-semibold">
                {(profile?.display_name || profile?.username || "?").slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <Input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={user ? "Добавьте комментарий..." : "Войдите, чтобы комментировать"}
              className="flex-1 h-9 text-sm border-0 bg-muted/50 focus-visible:ring-1 focus-visible:ring-primary"
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && void handleSend()}
              disabled={sending}
            />
            <Button
              size="icon"
              onClick={() => void handleSend()}
              disabled={!newComment.trim() || sending}
              className="h-9 w-9"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
