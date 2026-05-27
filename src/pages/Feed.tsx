import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Plus, RefreshCcw } from "lucide-react";
import { FeedSnippet } from "@/components/feed/FeedSnippet";
import { AddBeatDialog } from "@/components/beats/AddBeatDialog";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { getFeedTracks, type TrackCard } from "@/lib/music";

const Feed = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const highlightedTrackId = searchParams.get("track");
  const [activeIndex, setActiveIndex] = useState(0);
  const [addBeatOpen, setAddBeatOpen] = useState(false);
  const [tracks, setTracks] = useState<TrackCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const loadBeats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFeedTracks();
      setTracks(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Не удалось загрузить ленту";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadBeats();
  }, []);

  useEffect(() => {
    if (!highlightedTrackId || tracks.length === 0 || !containerRef.current) return;

    const selectedIndex = tracks.findIndex((track) => track.id === highlightedTrackId);
    if (selectedIndex === -1) return;

    setActiveIndex(selectedIndex);
    containerRef.current.scrollTo({
      top: selectedIndex * window.innerHeight,
      behavior: "smooth",
    });
  }, [highlightedTrackId, tracks]);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const scrollPosition = containerRef.current.scrollTop;
      const windowHeight = window.innerHeight;
      const newIndex = Math.round(scrollPosition / windowHeight);

      if (newIndex !== activeIndex && newIndex >= 0 && newIndex < tracks.length) {
        setActiveIndex(newIndex);
      }
    };

    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [activeIndex, tracks.length]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 text-center">
        <div>
          <p className="text-lg font-medium">Загружаем ленту</p>
          <p className="text-sm text-muted-foreground">Подтягиваем уже опубликованные биты</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md text-center space-y-4">
          <div>
            <p className="text-lg font-semibold">Лента сейчас недоступна</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
          <Button onClick={() => void loadBeats()} className="gap-2">
            <RefreshCcw className="w-4 h-4" />
            Повторить
          </Button>
        </div>
      </div>
    );
  }

  if (tracks.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md text-center space-y-4">
          <div>
            <p className="text-lg font-semibold">В ленте пока нет треков</p>
            <p className="text-sm text-muted-foreground">
              Опубликуйте первый бит, и он появится здесь без моков и заглушек.
            </p>
          </div>
          {user && (
            <Button onClick={() => setAddBeatOpen(true)}>
              Опубликовать трек
            </Button>
          )}
          <AddBeatDialog
            open={addBeatOpen}
            onOpenChange={setAddBeatOpen}
            onSuccess={() => void loadBeats()}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="h-screen overflow-y-scroll snap-y snap-mandatory lg:snap-none scroll-smooth max-w-lg lg:max-w-4xl mx-auto"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <style>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      {tracks.map((track, index) => (
        <FeedSnippet
          key={track.id}
          id={track.id}
          userId={track.userId}
          username={track.username}
          displayName={track.displayName}
          avatarUrl={track.avatarUrl}
          trackName={track.trackName}
          genre={track.genre}
          likes={track.likes}
          comments={track.comments}
          gradientBg={track.gradientBg}
          isActive={index === activeIndex}
          description={track.description}
          servicePrice={track.servicePrice}
          audioUrl={track.audioUrl}
        />
      ))}
      {user && (
        <>
          <Button
            onClick={() => setAddBeatOpen(true)}
            size="icon"
            className="fixed bottom-20 right-4 lg:bottom-8 lg:right-8 w-14 h-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 z-40"
          >
            <Plus className="w-7 h-7" />
          </Button>
          <AddBeatDialog
            open={addBeatOpen}
            onOpenChange={setAddBeatOpen}
            onSuccess={() => void loadBeats()}
          />
        </>
      )}
    </div>
  );
};

export default Feed;
