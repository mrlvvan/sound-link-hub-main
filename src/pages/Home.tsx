import { FeedCard } from "@/components/home/FeedCard";
import { HeroCard } from "@/components/home/HeroCard";
import { GenreGridCard } from "@/components/home/GenreGridCard";
import { CreatorCard } from "@/components/home/CreatorCard";
import { StudioMiniCard } from "@/components/home/StudioMiniCard";
import { Music, TrendingUp, Disc3, Radio, Headphones, Mic2, Guitar, Drum } from "lucide-react";
import { Link } from "react-router-dom";
import { useSettingsStore } from "@/stores/settingsStore";
import { useDragScroll } from "@/hooks/useDragScroll";

const Home = () => {
  const { safeAreaTopInset, isFullscreen } = useSettingsStore();
  const collectionsScrollRef = useDragScroll();
  const studiosScrollRef = useDragScroll();
  const tracksScrollRef = useDragScroll();
  const creatorsScrollRef = useDragScroll();
  
  const collections = [
    {
      title: "Топ битмейкеров недели",
      subtitle: "Популярные продюсеры в Trap и Drill",
      gradient: "bg-gradient-primary",
      link: "/feed",
    },
    {
      title: "Новое в Trap",
      subtitle: "Свежие биты и сэмплы",
      gradient: "bg-gradient-accent",
      link: "/feed",
    },
    {
      title: "Горячие услуги",
      subtitle: "Сведение за 24ч • Биты на заказ",
      gradient: "bg-gradient-to-br from-info to-info/50",
      link: "/feed",
    },
    {
      title: "Drill подборка",
      subtitle: "Лучшие drill биты месяца",
      gradient: "bg-gradient-to-br from-destructive to-destructive/50",
      link: "/feed",
    },
  ];

  const genres = [
    { name: "Trap", icon: Disc3, gradient: "bg-gradient-primary", trackCount: "1.2k треков", link: "/search?genre=trap" },
    { name: "Drill", icon: Radio, gradient: "bg-gradient-to-br from-red-500 to-orange-500", trackCount: "850 треков", link: "/search?genre=drill" },
    { name: "EDM", icon: Headphones, gradient: "bg-gradient-to-br from-cyan-500 to-blue-500", trackCount: "2.1k треков", link: "/search?genre=edm" },
    { name: "Lo-Fi", icon: Music, gradient: "bg-gradient-to-br from-pink-500 to-purple-500", trackCount: "950 треков", link: "/search?genre=lofi" },
    { name: "Hip-Hop", icon: Mic2, gradient: "bg-gradient-accent", trackCount: "3.5k треков", link: "/search?genre=hiphop" },
    { name: "R&B", icon: Guitar, gradient: "bg-gradient-to-br from-indigo-500 to-purple-600", trackCount: "670 треков", link: "/search?genre=rnb" },
  ];

  const studios = [
    { name: "Pro Sound Studio", location: "Москва, ЦАО", pricePerHour: 2000, gradient: "bg-gradient-to-br from-violet-600 to-indigo-600" },
    { name: "Beat Cave", location: "Москва, СВАО", pricePerHour: 1500, gradient: "bg-gradient-to-br from-purple-600 to-pink-600" },
    { name: "Репбаза на Таганке", location: "Москва, Таганка", pricePerHour: 800, gradient: "bg-gradient-to-br from-orange-600 to-red-600" },
    { name: "Sound Lab", location: "Москва, ЗАО", pricePerHour: 1800, gradient: "bg-gradient-to-br from-blue-600 to-cyan-600" },
    { name: "Underground Records", location: "Москва, ЮАО", pricePerHour: 1200, gradient: "bg-gradient-to-br from-emerald-600 to-teal-600" },
  ];

  const recentTracks = [
    { username: "trapmaster", genre: "Drill" },
    { username: "synth_wave", genre: "EDM" },
    { username: "lo_fi_beats", genre: "Lo-Fi" },
    { username: "drill_king", genre: "Drill" },
    { username: "trap_god", genre: "Trap" },
    { username: "beat_maker", genre: "Hip-Hop" },
    { username: "producer_x", genre: "R&B" },
    { username: "sound_wizard", genre: "EDM" },
  ];

  const topCreators = [
    { username: "trapmaster", genre: "Trap", followers: 12500 },
    { username: "drill_king", genre: "Drill", followers: 8900 },
    { username: "edm_producer", genre: "EDM", followers: 15200 },
    { username: "lofi_master", genre: "Lo-Fi", followers: 6700 },
    { username: "beat_wizard", genre: "Hip-Hop", followers: 11300 },
    { username: "sound_engineer", genre: "R&B", followers: 5400 },
  ];

  return (
    <div className="min-h-screen pb-24 lg:pb-6 pt-6 max-w-lg lg:max-w-7xl mx-auto px-4 lg:px-8" style={{ paddingTop: isFullscreen ? `calc(0.75rem + ${safeAreaTopInset}px)` : '2rem' }}>
      {/* Header - скрыт на десктопе, так как есть в сайдбаре */}
      <div className="mb-6 lg:hidden">
        <h1 className="text-3xl font-bold mb-2">SoundLinker</h1>
        <p className="text-muted-foreground">Слушай. Создавай. Работай.</p>
      </div>

      {/* Hero Card */}
      <div className="mb-8">
        <HeroCard
          title="Трек дня"
          subtitle="Новый drill бит от @trapmaster — уже в топе недели"
          gradient="bg-gradient-primary"
          link="/feed"
        />
      </div>

      {/* Подборки - Grid на десктопе, Scroll на мобиле */}
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">🎵 Подборки</h2>
          <Link to="/feed" className="text-primary text-sm font-medium hover:text-primary/80 transition-colors">
            Все
          </Link>
        </div>
        <div ref={collectionsScrollRef} className="flex lg:grid lg:grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-4 overflow-x-auto lg:overflow-x-visible scrollbar-hide pb-2 scroll-smooth">
          {collections.map((collection, index) => (
            <div key={index} className="min-w-[280px] lg:min-w-0 flex-shrink-0">
              <Link to={collection.link}>
                <FeedCard
                  title={collection.title}
                  subtitle={collection.subtitle}
                  imageGradient={collection.gradient}
                />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Жанры - Grid */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">🎸 Жанры</h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 lg:gap-4">
          {genres.map((genre, index) => (
            <GenreGridCard
              key={index}
              name={genre.name}
              icon={genre.icon}
              gradient={genre.gradient}
              trackCount={genre.trackCount}
              link={genre.link}
            />
          ))}
        </div>
      </div>

      {/* Аренда студий - Grid на десктопе, Scroll на мобиле */}
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">🏢 Аренда студий</h2>
          <Link to="/studios" className="text-primary text-sm font-medium hover:text-primary/80 transition-colors">
            Все студии
          </Link>
        </div>
        <div ref={studiosScrollRef} className="flex lg:grid lg:grid-cols-2 xl:grid-cols-5 gap-3 lg:gap-4 overflow-x-auto lg:overflow-x-visible scrollbar-hide pb-2 scroll-smooth">
          {studios.map((studio, index) => (
            <div key={index} className="min-w-[200px] lg:min-w-0 flex-shrink-0">
              <StudioMiniCard
                name={studio.name}
                location={studio.location}
                pricePerHour={studio.pricePerHour}
                gradient={studio.gradient}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Последние треки - Grid на десктопе, Scroll на мобиле */}
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">🔥 Последние треки</h2>
          <Link to="/feed" className="text-primary text-sm font-medium hover:text-primary/80 transition-colors flex items-center gap-1">
            <TrendingUp className="w-4 h-4" strokeWidth={1.5} />
            Смотреть всё
          </Link>
        </div>
        <div ref={tracksScrollRef} className="flex lg:grid lg:grid-cols-4 xl:grid-cols-8 gap-3 lg:gap-4 overflow-x-auto lg:overflow-x-visible scrollbar-hide pb-2 scroll-smooth">
          {recentTracks.map((track, index) => (
            <Link
              key={index}
              to="/feed"
              className="min-w-[110px] lg:min-w-0 flex-shrink-0 relative rounded-xl overflow-hidden h-28 lg:h-32 shadow-sm hover:shadow-md transition-all cursor-pointer group bg-gradient-to-br from-primary/15 to-accent/15 hover:scale-[1.02]"
            >
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Music className="w-6 h-6 text-white/70 group-hover:text-white/90 transition-colors" strokeWidth={1.5} />
              </div>
              <div className="absolute bottom-2 left-2 right-2">
                <p className="text-white text-xs font-medium truncate">@{track.username}</p>
                <p className="text-white/60 text-xs">{track.genre}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Топ продюсеров - Grid на десктопе, Scroll на мобиле */}
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">⭐ Топ продюсеров</h2>
          <Link to="/search" className="text-primary text-sm font-medium hover:text-primary/80 transition-colors">
            Все
          </Link>
        </div>
        <div ref={creatorsScrollRef} className="flex lg:grid lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto lg:overflow-x-visible scrollbar-hide pb-2 scroll-smooth">
          {topCreators.map((creator, index) => (
            <div key={index} className="min-w-[140px] lg:min-w-0 flex-shrink-0">
              <CreatorCard
                username={creator.username}
                genre={creator.genre}
                followers={creator.followers}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
