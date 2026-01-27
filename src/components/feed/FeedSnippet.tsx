import { Heart, MessageCircle, Share2, ShoppingBag, Play, Calendar } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useSettingsStore } from "@/stores/settingsStore";
import { Link } from "react-router-dom";
import { CommentsSheet } from "./CommentsSheet";
import { ShareSheet } from "./ShareSheet";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";

interface Comment {
  id: string;
  username: string;
  text: string;
  likes: number;
  timestamp: string;
}

interface FeedSnippetProps {
  id: string;
  username: string;
  trackName: string;
  genre: string;
  likes: number;
  comments: number;
  gradientBg: string;
  isActive: boolean;
  description?: string;
  serviceTitle?: string;
  servicePrice?: number;
  commentsData?: Comment[];
  audioUrl?: string;
}

export const FeedSnippet = ({
  id,
  username,
  trackName,
  genre,
  likes,
  comments,
  gradientBg,
  isActive,
  description,
  serviceTitle = "Аренда студии",
  servicePrice = 2500,
  commentsData = [],
  audioUrl = "/audio/62757_232225.mp3",
}: FeedSnippetProps) => {
  const { safeAreaTopInset, isFullscreen } = useSettingsStore();
  const [isLiked, setIsLiked] = useState(false);
  const [currentLikes, setCurrentLikes] = useState(likes);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showShare, setShowShare] = useState(false);

  const { togglePlayPause, isPlaying } = useAudioPlayer({
    trackId: id,
    audioUrl,
    isActive,
    autoPlay: true,
  });

  const handleLike = () => {
    setIsLiked(!isLiked);
    setCurrentLikes(isLiked ? currentLikes - 1 : currentLikes + 1);
  };

  return (
    <div className="relative h-screen w-full snap-start snap-always">
      {/* Background */}
      <div className={`absolute inset-0 ${gradientBg} ${isPlaying ? 'animate-gradient-shift' : ''}`}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
      </div>

      {/* Play/Pause overlay */}
      <button
        onClick={togglePlayPause}
        className="absolute inset-0 flex items-center justify-center"
      >
        {!isPlaying && (
          <div className="bg-black/40 backdrop-blur-sm rounded-full p-4 animate-scale-in pointer-events-none">
            <Play className="w-12 h-12 text-white" fill="white" />
          </div>
        )}
      </button>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end p-4 pb-20 pointer-events-none" style={{ paddingTop: isFullscreen ? `calc(0.5rem + ${safeAreaTopInset}px)` : '1.5rem' }}>
        {/* Top: Genre badge */}
        <div 
          className="absolute right-4"
          style={{ top: isFullscreen ? `calc(1rem + ${safeAreaTopInset}px)` : '1rem' }}
        >
          <span className="px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-sm text-white text-xs font-medium">
            {genre}
          </span>
        </div>

        {/* Action buttons - positioned absolutely on the right */}
        <div className="absolute right-4 bottom-1/2 translate-y-1/2 flex flex-col gap-5 items-center pointer-events-auto">
          <button
            onClick={handleLike}
            className={`flex flex-col items-center gap-0.5 transition-all ${
              isLiked ? "animate-heart-beat" : ""
            }`}
          >
            <Heart
              className={`w-7 h-7 transition-all drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] ${
                isLiked
                  ? "fill-red-500 text-red-500"
                  : "text-white hover:scale-110"
              }`}
            />
            <span className="text-white text-xs font-semibold drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
              {currentLikes.toLocaleString('ru-RU')}
            </span>
          </button>

          <button
            onClick={() => setShowComments(true)}
            className="flex flex-col items-center gap-0.5 transition-all hover:scale-110 active:animate-rotate-share"
          >
            <MessageCircle className="w-7 h-7 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
            <span className="text-white text-xs font-semibold drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
              {comments.toLocaleString('ru-RU')}
            </span>
          </button>

          <button
            onClick={() => setShowShare(true)}
            className="flex flex-col items-center gap-0.5 transition-all hover:scale-110 active:animate-rotate-share"
          >
            <Share2 className="w-7 h-7 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
          </button>
        </div>

        {/* Bottom: Track info */}
        <div className="pointer-events-auto space-y-2">
          <div className="flex items-start gap-2">
            <Link to={`/profile/${username}`} className="flex items-center gap-2 group">
              <Avatar className="w-10 h-10 border-2 border-white/30 transition-transform group-hover:scale-110">
                <AvatarFallback className="bg-gradient-primary text-white font-bold">
                  {username[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="text-white font-semibold text-base group-hover:opacity-90 transition-opacity">@{username}</p>
                <p className="text-white/80 text-xs truncate">{trackName}</p>
              </div>
            </Link>
          </div>

          {description && (
            <div className="text-white/90 text-xs leading-relaxed">
              <p className={showFullDescription ? "" : "line-clamp-2"}>
                {description}
              </p>
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

          {/* Service booking card */}
          <button className="w-full bg-gradient-to-r from-primary/80 to-primary backdrop-blur-sm rounded-lg p-2.5 border border-white/20 hover:scale-[1.02] transition-transform shadow-lg group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-white/20 rounded-md p-1.5 group-hover:bg-white/30 transition-colors">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-white font-semibold text-xs">{serviceTitle}</p>
                  <p className="text-white/90 text-[10px]">Нажмите для заказа</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-bold text-base">₽{servicePrice}</p>
                <p className="text-white/80 text-[10px]">за час</p>
              </div>
            </div>
          </button>
        </div>

        {/* Comments Sheet */}
        <CommentsSheet
          isOpen={showComments}
          onClose={() => setShowComments(false)}
          comments={commentsData}
          totalComments={comments}
        />

        {/* Share Sheet */}
        <ShareSheet
          isOpen={showShare}
          onClose={() => setShowShare(false)}
          trackName={trackName}
          username={username}
        />
      </div>
    </div>
  );
};
