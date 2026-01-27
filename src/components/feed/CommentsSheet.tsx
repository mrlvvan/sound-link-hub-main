import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Heart, Send } from "lucide-react";
import { useState } from "react";
import { useSettingsStore } from "@/stores/settingsStore";

interface Comment {
  id: string;
  username: string;
  text: string;
  likes: number;
  timestamp: string;
}

interface CommentsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  comments: Comment[];
  totalComments: number;
}

export const CommentsSheet = ({ isOpen, onClose, comments, totalComments }: CommentsSheetProps) => {
  const [newComment, setNewComment] = useState("");
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  const { safeAreaTopInset } = useSettingsStore();

  const handleLikeComment = (commentId: string) => {
    setLikedComments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  const handleSendComment = () => {
    if (newComment.trim()) {
      // Here would be API call to send comment
      setNewComment("");
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[75vh] p-0 rounded-t-3xl border-0">
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
        </div>

        <SheetHeader className="px-4 pb-3 border-b border-border/50">
          <SheetTitle className="text-center text-base font-semibold">
            {totalComments} {totalComments === 1 ? 'комментарий' : totalComments < 5 ? 'комментария' : 'комментариев'}
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-[calc(75vh-120px)] px-4">
          <div className="space-y-5 py-4">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-2.5 group">
                <Avatar className="w-9 h-9 shrink-0">
                  <AvatarFallback className="bg-gradient-primary text-white text-sm font-semibold">
                    {comment.username[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-0.5">
                    <span className="font-semibold text-sm">@{comment.username}</span>
                    <span className="text-[11px] text-muted-foreground">{comment.timestamp}</span>
                  </div>
                  <p className="text-sm text-foreground leading-snug break-words mb-1.5">{comment.text}</p>
                  
                  <button
                    onClick={() => handleLikeComment(comment.id)}
                    className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 transition-colors ${
                        likedComments.has(comment.id)
                          ? "fill-red-500 text-red-500"
                          : ""
                      }`}
                    />
                    <span className="font-medium">
                      {comment.likes + (likedComments.has(comment.id) ? 1 : 0)}
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-border/50 bg-background/95 backdrop-blur-sm" style={{ paddingBottom: `calc(0.75rem + env(safe-area-inset-bottom))` }}>
          <div className="flex gap-2 items-center">
            <Avatar className="w-8 h-8 shrink-0">
              <AvatarFallback className="bg-muted text-foreground text-xs">
                You
              </AvatarFallback>
            </Avatar>
            <Input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Добавьте комментарий..."
              className="flex-1 h-9 text-sm border-0 bg-muted/50 focus-visible:ring-1 focus-visible:ring-primary"
              onKeyPress={(e) => e.key === "Enter" && handleSendComment()}
            />
            <Button
              size="icon"
              onClick={handleSendComment}
              disabled={!newComment.trim()}
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
