import { useEffect, useState } from "react";
import { FeedCard } from "@/components/home/FeedCard";
import { HeroCard } from "@/components/home/HeroCard";
import { GenreGridCard } from "@/components/home/GenreGridCard";
import { CreatorCard } from "@/components/home/CreatorCard";
import { SnippetCard } from "@/components/home/SnippetCard";
import { Music, TrendingUp, Disc3, Radio, Headphones, Mic2, Guitar } from "lucide-react";
import { Link } from "react-router-dom";
import { useSettingsStore } from "@/stores/settingsStore";
import { useDragScroll } from "@/hooks/useDragScroll";
import { getPlatformHighlights, getTrackFeedPath, type TrackCard } from "@/lib/music";

const GENRE_META: Record<string, { icon: React.ElementType; gradient: string }> = {
  trap:    { icon: Disc3,      gradient: "bg-gradient-primary" },
  drill:   { icon: Radio,      gradient: "bg-gradient-to-br from-red-500 to-orange-500" },
  edm:     { icon: Headphones, gradient: "bg-gradient-to-br from-cyan-500 to-blue-500" },
  "lo-fi": { icon: Music,      gradient: "bg-gradient-to-br from-pink-500 to-purple-500" },
  "hip-hop":{ icon: Mic2,      gradient: "bg-gradient-accent" },
  "r-and-b":{ icon: Guitar,    gradient: "bg-gradient-to-br from-indigo-500 to-purple-600" },
};

const TRACK_GRADIENTS = [
  "bg-gradient-to-br from-purple-900 via-purple-700 to-pink-600",
  "bg-gradient-to-br from-cyan-900 via-cyan-600 to-blue-600",
  "bg-gradient-to-br from-green-900 via-green-600 to-teal-600",
  "bg-gradient-to-br from-orange-900 via-red-700 to-pink-600",
  "bg-gradient-to-br from-gray-900 via-slate-700 to-purple-900",
  "bg-gradient-to-br from-pink-900 via-purple-700 to-indigo-600",
];

const collections = [
  { title: "Топ битмейкеров недели", subtitle: "Популярные продюсеры в Trap и Drill", gradient: "bg-gradient-primary", link: "/feed" },
  { title: "Новое в Trap", subtitle: "Свежие биты и сэмплы", gradient: "bg-gradient-accent", link: "/search?genre=trap" },
  { title: "Горячие услуги", subtitle: "Сведение за 24ч · Биты на заказ", gradient: "bg-gradient-to-br from-cyan-600 to-blue-600", link: "/search" },
  { title: "Аренда студий", subtitle: "Профессиональные студии рядом с вами", gradient: "bg-gradient-to-br from-violet-600 to-indigo-600", link: "/studios" },
];

const Home = () => {
  const { safeAreaTopInset, isFullscreen } = useSettingsStore();
  const collectionsScrollRef = useDragScroll();
  const tracksScrollRef = useDragScroll();
  const creatorsScrollRef = useDragScroll();

  const [recentTracks, setRecentTracks] = useState<TrackCard[]>([]);
  const [topCreators, setTopCreators] = useState<Array<{
    id: string; username: string; displayName: string; avatarUrl: string | null; count: number; genre: string;
  }>>([]);
  const [genres, setGenres] = useState<Array<{ slug: string; label: string; count: number }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPlatformHighlights()
      .then((data) => {
        setRecentTracks(data.recentTracks);
        setTopCreators(data.topCreators);
        setGenres(data.genres);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div
      className="min-h-screen pb-24 lg:pb-6 pt-6 max-w-lg lg:max-w-7xl mx-auto px-4 lg:px-8"
      style={{ paddingTop: isFullscreen ? `calc(0.75rem + ${safeAreaTopInset}px)` : "2rem" }}
    >
      {/* Mobile header */}
      <div className="mb-6 lg:hidden">
        <h1 className="text-3xl font-bold mb-1">SoundLinker</h1>
        <p className="text-muted-foreground text-sm">Слушай. Создавай. Работай.</p>
      </div>

      {/* Hero */}
      <div className="mb-8">
        <HeroCard
          title="Маркетплейс для продюсеров"
          subtitle="Биты, услуги, товары — всё в одном месте. Найди свой звук."
          gradient="bg-gradient-primary"
          link="/feed"
        />
      </div>

      {/* Подборки */}
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Подборки</h2>
          <Link to="/feed" className="text-primary text-sm font-medium">Все</Link>
        </div>
        <div
          ref={collectionsScrollRef}
          className="flex lg:grid lg:grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-4 overflow-x-auto lg:overflow-x-visible scrollbar-hide pb-2"
        >
          {collections.map((c, i) => (
            <div key={i} className="min-w-[260px] lg:min-w-0 flex-shrink-0">
              <Link to={c.link}>
                <FeedCard title={c.title} subtitle={c.subtitle} imageGradient={c.gradient} />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Жанры — реальные из БД, fallback — статические */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Жанры</h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 lg:gap-4">
          {(genres.length > 0
            ? genres.slice(0, 6)
            : [
                { slug: "trap", label: "Trap", count: 0 },
                { slug: "drill", label: "Drill", count: 0 },
                { slug: "edm", label: "EDM", count: 0 },
                { slug: "lo-fi", label: "Lo-Fi", count: 0 },
                { slug: "hip-hop", label: "Hip-Hop", count: 0 },
                { slug: "r-and-b", label: "R&B", count: 0 },
              ]
          ).map((g, i) => {
            const meta = GENRE_META[g.slug] ?? { icon: Music, gradient: TRACK_GRADIENTS[i % TRACK_GRADIENTS.length] };
            return (
              <GenreGridCard
                key={g.slug}
                name={g.label}
                icon={meta.icon}
                gradient={meta.gradient}
                trackCount={g.count > 0 ? `${g.count} треков` : "Открыть"}
                link={`/search?genre=${g.slug}`}
              />
            );
          })}
        </div>
      </div>

      {/* Свежие треки — реальные */}
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Свежие биты</h2>
          <Link to="/feed" className="text-primary text-sm font-medium flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            Лента
          </Link>
        </div>
        {loading ? (
          <div className="flex gap-3 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="min-w-[110px] h-28 rounded-xl bg-muted animate-pulse flex-shrink-0" />
            ))}
          </div>
        ) : recentTracks.length > 0 ? (
          <div
            ref={tracksScrollRef}
            className="flex lg:grid lg:grid-cols-4 xl:grid-cols-8 gap-3 lg:gap-4 overflow-x-auto lg:overflow-x-visible scrollbar-hide pb-2"
          >
            {recentTracks.map((track, i) => (
              <Link
                key={track.id}
                to={getTrackFeedPath(track.id)}
                className="min-w-[110px] lg:min-w-0 flex-shrink-0 relative rounded-xl overflow-hidden h-28 lg:h-32 shadow-sm hover:shadow-md transition-all group hover:scale-[1.02]"
              >
                <div className={`absolute inset-0 ${track.gradientBg || TRACK_GRADIENTS[i % TRACK_GRADIENTS.length]}`} />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Music className="w-6 h-6 text-white/70 group-hover:text-white/90 transition-colors" />
                </div>
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-white text-xs font-semibold truncate">{track.trackName}</p>
                  <p className="text-white/60 text-[10px] truncate">@{track.username}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground text-center">
            Биты появятся здесь после первых загрузок
          </div>
        )}
      </div>

      {/* Топ продюсеров — реальные */}
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Топ продюсеров</h2>
          <Link to="/search" className="text-primary text-sm font-medium">Все</Link>
        </div>
        {loading ? (
          <div className="flex gap-4 overflow-hidden">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="min-w-[140px] h-36 rounded-xl bg-muted animate-pulse flex-shrink-0" />
            ))}
          </div>
        ) : topCreators.length > 0 ? (
          <div
            ref={creatorsScrollRef}
            className="flex lg:grid lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto lg:overflow-x-visible scrollbar-hide pb-2"
          >
            {topCreators.map((creator, i) => (
              <div key={creator.id} className="min-w-[140px] lg:min-w-0 flex-shrink-0">
                <CreatorCard
                  username={creator.username}
                  genre={creator.genre}
                  followers={creator.count}
                  avatarUrl={creator.avatarUrl}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground text-center">
            Топ появится после загрузки первых треков
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
