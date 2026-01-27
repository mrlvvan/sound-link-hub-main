import { Music2, Headphones, Sliders, Mic, Wand2, Sparkles, Search as SearchIcon, X, ArrowLeft, TrendingUp, Clock, Building2 } from "lucide-react";
import { ServiceCard } from "@/components/search/ServiceCard";
import { GenreCard } from "@/components/search/GenreCard";
import { TopCreatorCard } from "@/components/search/TopCreatorCard";
import { CategoryCard } from "@/components/search/CategoryCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useSettingsStore } from "@/stores/settingsStore";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const { safeAreaTopInset, isFullscreen } = useSettingsStore();
  const navigate = useNavigate();
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [currentTab, setCurrentTab] = useState("services");

  const services = [
    { icon: Music2, title: "Бит на заказ", count: "2.3k услуг", gradient: "bg-gradient-primary" },
    { icon: Headphones, title: "Сведение", count: "1.8k услуг", gradient: "bg-gradient-accent" },
    { icon: Sliders, title: "Мастеринг", count: "920 услуг", gradient: "bg-gradient-to-br from-info to-info/70" },
    { icon: Mic, title: "Вокал под ключ", count: "1.5k услуг", gradient: "bg-gradient-to-br from-pink-600 to-purple-600" },
    { icon: Wand2, title: "Аранжировка", count: "670 услуг", gradient: "bg-gradient-to-br from-orange-600 to-red-600" },
    { icon: Sparkles, title: "Саунд-дизайн", count: "450 услуг", gradient: "bg-gradient-to-br from-cyan-600 to-blue-600" },
  ];

  const genres = [
    { title: "Trap", trackCount: "3.2k треков", gradient: "bg-gradient-to-br from-purple-900 via-purple-600 to-pink-600" },
    { title: "Pop", trackCount: "2.8k треков", gradient: "bg-gradient-to-br from-pink-900 via-pink-600 to-rose-500" },
    { title: "EDM", trackCount: "2.1k треков", gradient: "bg-gradient-to-br from-cyan-900 via-cyan-600 to-blue-600" },
    { title: "Drill", trackCount: "1.9k треков", gradient: "bg-gradient-to-br from-gray-900 via-slate-700 to-purple-900" },
    { title: "JazzHop", trackCount: "1.2k треков", gradient: "bg-gradient-to-br from-amber-900 via-orange-700 to-yellow-600" },
    { title: "Lo-Fi", trackCount: "1.5k треков", gradient: "bg-gradient-to-br from-green-900 via-green-600 to-teal-600" },
  ];

  const trendingSearches = [
    "Trap биты 2025",
    "Drill production",
    "Сведение вокала",
    "Lo-Fi beats",
    "Мастеринг трека"
  ];

  const popularSearches = [
    "Бит на заказ",
    "Mixing & Mastering",
    "Продюсер hip-hop",
    "Вокал под ключ",
    "Sound design"
  ];

  const quickCategories = [
    { icon: Music2, title: "Trap", gradient: "bg-gradient-to-br from-purple-600 to-pink-600", link: null },
    { icon: Headphones, title: "EDM", gradient: "bg-gradient-to-br from-cyan-600 to-blue-600", link: null },
    { icon: Building2, title: "Студии", gradient: "bg-gradient-to-br from-violet-600 to-indigo-600", link: "/studios" },
    { icon: Sliders, title: "Drill", gradient: "bg-gradient-to-br from-gray-700 to-purple-700", link: null },
    { icon: Mic, title: "Pop", gradient: "bg-gradient-to-br from-pink-600 to-rose-500", link: null },
    { icon: Wand2, title: "Hip-Hop", gradient: "bg-gradient-to-br from-orange-600 to-red-600", link: null },
  ];

  const featuredServices = [
    {
      title: "Trap бит под ключ",
      price: 15000,
      rating: 4.9,
      ordersCompleted: 234,
      username: "trapmaster",
      gradient: "bg-gradient-to-br from-purple-600 to-pink-600",
    },
    {
      title: "Сведение + мастеринг",
      price: 8000,
      rating: 5.0,
      ordersCompleted: 189,
      username: "mixpro",
      gradient: "bg-gradient-to-br from-cyan-600 to-blue-600",
    },
    {
      title: "Drill бит production",
      price: 12000,
      rating: 4.8,
      ordersCompleted: 156,
      username: "drillking",
      gradient: "bg-gradient-to-br from-gray-700 to-purple-700",
    },
  ];

  const topWeek = [
    { name: "DJ ProMax", username: "producer_alex", genre: "Trap & Drill", rating: 4.9, orders: 234 },
    { name: "BeatMaster", username: "beatmaster", genre: "EDM", rating: 5.0, orders: 189 },
    { name: "MixWizard", username: "engineer_mike", genre: "Сведение", rating: 4.8, orders: 312 },
  ];

  const mostOrdered = [
    { name: "SoundKing", username: "soundking", genre: "Универсал", rating: 4.9, orders: 567 },
    { name: "VocalPro", username: "singer_maria", genre: "Вокал", rating: 4.7, orders: 445 },
    { name: "TrapLord", username: "traplord", genre: "Trap", rating: 5.0, orders: 389 },
  ];

  const rising = [
    { name: "NewWave", username: "newwave", genre: "EDM", rating: 4.8, likes: 1234, isRising: true },
    { name: "FreshBeats", username: "freshbeats", genre: "Hip-Hop", rating: 4.9, likes: 987, isRising: true },
    { name: "SynthMaster", username: "synthmaster", genre: "Pop", rating: 4.7, likes: 856, isRising: true },
  ];

  const handleClearSearch = () => {
    setSearchValue("");
    setSearchFocused(false);
  };

  const handleTabChange = (value: string) => {
    setCurrentTab(value);
    setSearchFocused(false);
  };

  return (
    <div className="min-h-screen pb-24 lg:pb-6 pt-6 px-4 lg:px-8 max-w-lg lg:max-w-7xl mx-auto" style={{ paddingTop: isFullscreen ? `calc(0.75rem + ${safeAreaTopInset}px)` : '2rem' }}>
      {/* Search Bar */}
      <div className="mb-6 relative">
        <div className="relative">
          {searchFocused && (
            <button
              onClick={handleClearSearch}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
            </button>
          )}
          <Input
            type="search"
            placeholder="Ищи биты, услуги, артистов..."
            className={`h-12 bg-card border-border rounded-xl text-base transition-all ${
              searchFocused ? 'pl-12 pr-10' : 'pl-4 pr-10'
            }`}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => setSearchFocused(true)}
          />
          {searchValue && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" strokeWidth={1.5} />
            </button>
          )}
          {!searchValue && !searchFocused && (
            <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" strokeWidth={1.5} />
          )}
        </div>
      </div>

      {/* Search Suggestions (shown when focused) */}
      {searchFocused ? (
        <div className="space-y-6 animate-fade-in">
          {/* Trending Now */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary" strokeWidth={1.5} />
              <h2 className="text-lg font-semibold">Сейчас в топе</h2>
            </div>
            <div className="space-y-2">
              {trendingSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => setSearchValue(search)}
                  className="w-full text-left px-4 py-3 bg-card border border-border rounded-lg hover:bg-secondary/60 hover:border-border/60 transition-all text-sm"
                >
                  {search}
                </button>
              ))}
            </div>
          </section>

          {/* Most Searched */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-accent" strokeWidth={1.5} />
              <h2 className="text-lg font-semibold">Популярные запросы</h2>
            </div>
            <div className="space-y-2">
              {popularSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => setSearchValue(search)}
                  className="w-full text-left px-4 py-3 bg-card border border-border rounded-lg hover:bg-secondary/60 hover:border-border/60 transition-all text-sm"
                >
                  {search}
                </button>
              ))}
            </div>
          </section>

          {/* Quick Categories Carousel */}
          <section>
            <h2 className="text-lg font-semibold mb-4">Быстрый доступ</h2>
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex gap-3 pb-4">
                {quickCategories.map((category, index) => (
                  <button
                    key={index}
                    onClick={() => category.link && navigate(category.link)}
                    className="relative flex-shrink-0 w-28 h-28 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all hover:scale-105"
                  >
                    <div className={`absolute inset-0 ${category.gradient} opacity-70`} />
                    <div className="absolute inset-0 bg-black/30" />
                    <div className="relative h-full flex flex-col items-center justify-center gap-2">
                      <category.icon className="w-7 h-7 text-white" strokeWidth={1.5} />
                      <span className="text-white text-sm font-semibold">{category.title}</span>
                    </div>
                  </button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </section>
        </div>
      ) : (
        /* Main Content (shown when not focused) */
        <>
          <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="w-full grid grid-cols-3 mb-6">
              <TabsTrigger value="services">Услуги</TabsTrigger>
              <TabsTrigger value="genres">Жанры</TabsTrigger>
              <TabsTrigger value="studios">Студии</TabsTrigger>
            </TabsList>

            {/* Services Tab */}
            <TabsContent value="services" className="space-y-8">
              {/* Featured Services */}
              <section>
                <h2 className="text-xl font-semibold mb-4">Популярные услуги</h2>
                <div className="grid gap-4">
                  {featuredServices.map((service, index) => (
                    <ServiceCard key={index} {...service} />
                  ))}
                </div>
              </section>

              {/* All Services Categories */}
              <section>
                <h2 className="text-xl font-semibold mb-4">Все категории</h2>
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 lg:gap-4">
                  {services.map((service, index) => (
                    <CategoryCard
                      key={index}
                      icon={service.icon}
                      title={service.title}
                      count={service.count}
                      gradient={service.gradient}
                    />
                  ))}
                </div>
              </section>
            </TabsContent>

            {/* Genres Tab */}
            <TabsContent value="genres" className="space-y-8">
              <section>
                <h2 className="text-xl font-semibold mb-4">Популярные жанры</h2>
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 lg:gap-4">
                  {genres.map((genre, index) => (
                    <GenreCard key={index} {...genre} />
                  ))}
                </div>
              </section>
            </TabsContent>

            {/* Studios Tab */}
            <TabsContent value="studios" className="space-y-8">
              <section>
                <h2 className="text-xl font-semibold mb-4">Популярные студии</h2>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate("/studios")}
                    className="w-full bg-card border border-border rounded-xl p-6 hover:shadow-md transition-all hover:scale-[1.01] text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600">
                        <Building2 className="w-6 h-6 text-white" strokeWidth={1.5} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">Профессиональные студии</h3>
                        <p className="text-sm text-muted-foreground">С полным оборудованием для записи</p>
                      </div>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => navigate("/studios")}
                    className="w-full bg-card border border-border rounded-xl p-6 hover:shadow-md transition-all hover:scale-[1.01] text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600">
                        <Building2 className="w-6 h-6 text-white" strokeWidth={1.5} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">Репетиционные базы</h3>
                        <p className="text-sm text-muted-foreground">Помещения для творчества и репетиций</p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => navigate("/studios")}
                    className="w-full bg-card border border-border rounded-xl p-6 hover:shadow-md transition-all hover:scale-[1.01] text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-pink-600 to-purple-600">
                        <Mic className="w-6 h-6 text-white" strokeWidth={1.5} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">Запись под ключ</h3>
                        <p className="text-sm text-muted-foreground">Полный цикл записи с звукорежиссёром</p>
                      </div>
                    </div>
                  </button>
                </div>
              </section>

              <section>
                <Button 
                  onClick={() => navigate("/studios")}
                  className="w-full bg-gradient-primary hover:shadow-neon"
                >
                  Смотреть все студии
                </Button>
              </section>
            </TabsContent>
          </Tabs>

          {/* Top Creators Sections */}
          <section className="mt-8 space-y-8">
            {/* Top of the Week */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Лучшие за неделю</h2>
              <div className="space-y-3">
                {topWeek.map((creator, index) => (
                  <TopCreatorCard key={index} {...creator} />
                ))}
              </div>
            </div>

            {/* Most Ordered */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Самые заказываемые</h2>
              <div className="space-y-3">
                {mostOrdered.map((creator, index) => (
                  <TopCreatorCard key={index} {...creator} />
                ))}
              </div>
            </div>

            {/* Rising Stars */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Новички на подъёме</h2>
              <div className="space-y-3">
                {rising.map((creator, index) => (
                  <TopCreatorCard key={index} {...creator} />
                ))}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default Search;
