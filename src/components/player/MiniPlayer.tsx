import { useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Play, Pause, X, Music } from "lucide-react";
import { useAudioStore } from "@/stores/audioStore";

export const MiniPlayer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastTrackIdRef = useRef<string | null>(null);
  const lastStartTimeRef = useRef<number>(0);

  const {
    currentTrackMeta,
    isPlaying,
    currentTime,
    duration,
    volume,
    setIsPlaying,
    setCurrentTime,
    setDuration,
    reset,
  } = useAudioStore();

  const isOnFeed = location.pathname === "/feed";
  const visible = Boolean(currentTrackMeta) && !isOnFeed;

  // Create / reload audio when track changes
  useEffect(() => {
    if (!currentTrackMeta?.audioUrl) return;

    const isNewTrack = lastTrackIdRef.current !== currentTrackMeta.id;
    lastTrackIdRef.current = currentTrackMeta.id;

    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    const audio = audioRef.current;

    if (isNewTrack) {
      lastStartTimeRef.current = currentTime; // capture time from feed before unmount
      audio.src = currentTrackMeta.audioUrl;
      audio.load();

      const onMeta = () => {
        setDuration(audio.duration);
        // seek to position where feed left off
        if (lastStartTimeRef.current > 0 && lastStartTimeRef.current < audio.duration) {
          audio.currentTime = lastStartTimeRef.current;
        }
      };
      audio.addEventListener("loadedmetadata", onMeta, { once: true });
    }

    const onTime = () => setCurrentTime(audio.currentTime);
    const onEnded = () => { setIsPlaying(false); setCurrentTime(0); };

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnded);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrackMeta?.id, currentTrackMeta?.audioUrl]);

  // Sync play / pause with store
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isOnFeed) {
      audio.pause();
      return;
    }
    if (isPlaying) {
      audio.volume = volume;
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [isPlaying, isOnFeed, volume, setIsPlaying]);

  // Sync volume
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // Cleanup on unmount
  useEffect(() => () => { audioRef.current?.pause(); }, []);

  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const t = Number(e.target.value);
    if (audioRef.current) audioRef.current.currentTime = t;
    setCurrentTime(t);
  }, [setCurrentTime]);

  const handleClose = useCallback(() => {
    audioRef.current?.pause();
    reset();
  }, [reset]);

  const handleTitleClick = useCallback(() => {
    if (currentTrackMeta) navigate("/feed");
  }, [currentTrackMeta, navigate]);

  if (!visible || !currentTrackMeta) return null;

  const progress = duration > 0 ? currentTime / duration : 0;
  const fmtTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="lg:hidden fixed bottom-[calc(4rem+env(safe-area-inset-bottom))] left-0 right-0 z-40 px-2 pb-1">
      <div
        className={`${currentTrackMeta.gradientBg} rounded-2xl shadow-xl overflow-hidden`}
        style={{ boxShadow: "0 -4px 20px rgba(0,0,0,0.3)" }}
      >
        {/* Progress bar */}
        <div className="relative h-0.5 bg-white/20">
          <div
            className="absolute inset-y-0 left-0 bg-white/80 transition-all"
            style={{ width: `${progress * 100}%` }}
          />
          <input
            type="range"
            min={0}
            max={duration || 1}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
          />
        </div>

        <div className="flex items-center gap-3 px-3 py-2.5">
          {/* Icon */}
          <button
            onClick={handleTitleClick}
            className="flex-shrink-0 w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center"
          >
            <Music className="w-4 h-4 text-white" />
          </button>

          {/* Track info */}
          <button onClick={handleTitleClick} className="flex-1 min-w-0 text-left">
            <p className="text-white font-semibold text-sm truncate leading-tight">{currentTrackMeta.name}</p>
            <p className="text-white/70 text-xs truncate">@{currentTrackMeta.username}</p>
          </button>

          {/* Time */}
          <span className="text-white/60 text-[10px] tabular-nums flex-shrink-0">
            {fmtTime(currentTime)}/{fmtTime(duration)}
          </span>

          {/* Play/Pause */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex-shrink-0 w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 text-white" fill="white" />
            ) : (
              <Play className="w-4 h-4 text-white" fill="white" />
            )}
          </button>

          {/* Close */}
          <button
            onClick={handleClose}
            className="flex-shrink-0 w-7 h-7 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X className="w-3.5 h-3.5 text-white/70" />
          </button>
        </div>
      </div>
    </div>
  );
};
