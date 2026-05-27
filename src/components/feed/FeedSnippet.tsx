import { Heart, MessageCircle, Share2, ShoppingBag, MessageSquare, Play } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { useSettingsStore } from "@/stores/settingsStore";
import { Link, useNavigate } from "react-router-dom";
import { CommentsSheet } from "./CommentsSheet";
import { ShareSheet } from "./ShareSheet";
import { BuyConfirmDialog } from "@/components/orders/BuyConfirmDialog";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { useAuth } from "@/contexts/AuthContext";
import { toggleBeatLike, getBeatLikeStatus } from "@/lib/music";
import { useAudioStore } from "@/stores/audioStore";

interface FeedSnippetProps {
  id: string;
  username: string;
  displayName?: string;
  avatarUrl?: string | null;
  userId?: string;
  trackName: string;
  genre: string;
  likes: number;
  comments: number;
  gradientBg: string;
  isActive: boolean;
  description?: string;
  servicePrice?: number;
  commentsData?: never[];
  audioUrl?: string;
}

export const FeedSnippet = ({
  id,
  username,
  displayName,
  avatarUrl,
  userId,
  trackName,
  genre,
  likes,
  comments,
  gradientBg,
  isActive,
  description,
  servicePrice,
  audioUrl = "",
}: FeedSnippetProps) => {
  const { safeAreaTopInset, isFullscreen } = useSettingsStore();
  const { user } = useAuth();
  const navigate = useNavigate();
  const setCurrentTrackMeta = useAudioStore((s) => s.setCurrentTrackMeta);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [commentCount, setCommentCount] = useState(comments);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showBuy, setShowBuy] = useState(false);

  const { togglePlayPause, isPlaying } = useAudioPlayer({
    trackId: id,
    audioUrl,
    isActive,
    autoPlay: true,
  });

  // Sync track meta to store so MiniPlayer can pick it up when navigating away
  useEffect(() => {
    if (isActive && audioUrl) {
      setCurrentTrackMeta({ id, name: trackName, username, audioUrl, gradientBg });
    }
  }, [isActive, audioUrl, id, trackName, username, gradientBg, setCurrentTrackMeta]);

  // Загрузить статус лайка при авторизованном юзере
  useEffect(() => {
    if (!user) return;
    void getBeatLikeStatus(id, user.id).then(setIsLiked);
  }, [id, user]);

  const handleLike = async () => {
    if (!user) { navigate("/login"); return; }
    const newLiked = !isLiked;
    setIsLiked(newLiked);
    setLikeCount((c) => c + (newLiked ? 1 : -1));
    try {
      const count = await toggleBeatLike(id, user.id, !newLiked);
      setLikeCount(count);
    } catch {
      setIsLiked(!newLiked);
      setLikeCount((c) => c + (!newLiked ? 1 : -1));
    }
  };

  const handleMessage = () => {
    if (!user) { navigate("/login"); return; }
    if (userId) navigate(`/messages/${userId}`);
  };

  const isOwnBeat = user && userId && user.id === userId;

  return (
    <div className="relative h-screen w-full snap-start snap-always">
      {/* Background */}
      <div className={`absolute inset-0 ${gradientBg} ${isPlaying ? "animate-gradient-shift" : ""}`}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
      </div>

      {/* Play/Pause overlay */}
      <button onClick={togglePlayPause} className="absolute inset-0 flex items-center justify-center">
        {!isPlaying && (
          <div className="bg-black/40 backdrop-blur-sm rounded-full p-4 animate-scale-in pointer-events-none">
            <Play className="w-12 h-12 text-white" fill="white" />
          </div>
        )}
      </button>

      {/* Content */}
      <div
        className="relative h-full flex flex-col justify-end p-4 pb-20 pointer-events-none"
        style={{ paddingTop: isFullscreen ? `calc(0.5rem + ${safeAreaTopInset}px)` : "1.5rem" }}
      >
        {/* Genre badge */}
        <div
          className="absolute right-4"
          style={{ top: isFullscreen ? `calc(1rem + ${safeAreaTopInset}px)` : "1rem" }}
        >
          <span className="px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-sm text-white text-xs font-medium">
            {genre}
          </span>
        </div>

        {/* Action buttons */}
        <div className="absolute right-4 bottom-1/2 translate-y-1/2 flex flex-col gap-5 items-center pointer-events-auto">
          <button
            onClick={() => void handleLike()}
            className={`flex flex-col items-center gap-0.5 transition-all ${isLiked ? "animate-heart-beat" : ""}`}
          >
            <Heart
              className={`w-7 h-7 transition-all drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] ${
                isLiked ? "fill-red-500 text-red-500" : "text-white hover:scale-110"
              }`}
            />
            <span className="text-white text-xs font-semibold drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
              {likeCount.toLocaleString("ru-RU")}
            </span>
          </button>

          <button
            onClick={() => setShowComments(true)}
            className="flex flex-col items-center gap-0.5 transition-all hover:scale-110"
          >
            <MessageCircle className="w-7 h-7 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
            <span className="text-white text-xs font-semibold drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
              {commentCount.toLocaleString("ru-RU")}
            </span>
          </button>

          <button
            onClick={() => setShowShare(true)}
            className="flex flex-col items-center gap-0.5 transition-all hover:scale-110"
          >
            <Share2 className="w-7 h-7 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
          </button>
        </div>

        {/* Bottom info */}
        <div className="pointer-events-auto space-y-2">
          <div className="flex items-start gap-2">
            <Link to={`/profile/${username}`} className="flex items-center gap-2 group">
              <Avatar className="w-10 h-10 border-2 border-white/30 transition-transform group-hover:scale-110">
                <AvatarImage src={avatarUrl ?? undefined} alt={displayName || username} />
                <AvatarFallback className="bg-gradient-primary text-white font-bold">
                  {username[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="text-white font-semibold text-base group-hover:opacity-90 transition-opacity">
                  @{username}
                </p>
                {displayName && displayName !== username && (
                  <p className="text-white/80 text-xs truncate">{displayName}</p>
                )}
                <p className="text-white/80 text-xs truncate">{trackName}</p>
              </div>
            </Link>
          </div>

          {description && (
            <div className="text-white/90 text-xs leading-relaxed">
              <p className={showFullDescription ? "" : "line-clamp-2"}>{description}</p>
              {description.length > 100 && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="text-white font-medium hover:opacity-80 transition-opacity mt-0.5"
                >
                  {showFullDescription ? "Скрыть" : "ещё..."}
                </button>
              )}
            </div>
          )}

          {/* CTA: купить или написать */}
          {!isOwnBeat && (
            <div className="flex gap-2">
              {servicePrice != null && servicePrice > 0 ? (
                <button
                  onClick={() => setShowBuy(true)}
                  className="flex-1 bg-primary/90 backdrop-blur-sm rounded-xl p-2.5 border border-white/20 hover:bg-primary transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-white" />
                    <span className="text-white font-semibold text-sm">Купить бит</span>
                  </div>
                  <span className="text-white font-bold text-base">
                    ₽{servicePrice.toLocaleString("ru-RU")}
                  </span>
                </button>
              ) : (
                <button
                  onClick={handleMessage}
                  className="flex-1 bg-black/40 backdrop-blur-sm rounded-xl p-2.5 border border-white/20 hover:bg-black/60 transition-colors flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 text-white" />
                  <span className="text-white font-semibold text-sm">Написать @{username}</span>
                </button>
              )}
            </div>
          )}
        </div>

        <CommentsSheet
          beatId={id}
          isOpen={showComments}
          onClose={() => setShowComments(false)}
          onCommentAdded={() => setCommentCount((c) => c + 1)}
        />

        <ShareSheet
          isOpen={showShare}
          onClose={() => setShowShare(false)}
          trackId={id}
          trackName={trackName}
          username={username}
        />

        {userId && servicePrice != null && servicePrice > 0 && (
          <BuyConfirmDialog
            open={showBuy}
            onOpenChange={setShowBuy}
            item={{
              id,
              type: "beat",
              title: trackName,
              price: servicePrice,
              sellerId: userId,
              sellerUsername: username,
            }}
          />
        )}
      </div>
    </div>
  );
};
