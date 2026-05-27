import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Building2, Search as SearchIcon, X, Briefcase, Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSettingsStore } from "@/stores/settingsStore";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { TopCreatorCard } from "@/components/search/TopCreatorCard";
import {
  GENRE_OPTIONS,
  getGenreLink,
  getPlatformHighlights,
  getTrackFeedPath,
  searchPlatform,
  type ProfileRecord,
  type TrackCard,
} from "@/lib/music";
import {
  searchMarketplace,
  getCategoryLabel,
  getProductTypeLabel,
  type ServiceRecord,
  type ProductRecord,
} from "@/lib/marketplace";
import { getStudios, type StudioRecord } from "@/lib/bookings";

const Search = () => {
  const { safeAreaTopInset, isFullscreen } = useSettingsStore();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get("q") ?? "");
  const [selectedGenre, setSelectedGenre] = useState(searchParams.get("genre") ?? "");
  const [tracks, setTracks] = useState<TrackCard[]>([]);
  const [profiles, setProfiles] = useState<ProfileRecord[]>([]);
  const [services, setServices] = useState<ServiceRecord[]>([]);
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [studios, setStudios] = useState<StudioRecord[]>([]);
  const [highlightTracks, setHighlightTracks] = useState<TrackCard[]>([]);
  const [highlightCreators, setHighlightCreators] = useState<Array<{ id: string; username: string; displayName: string; avatarUrl: string | null; count: number; genre: string }>>([]);
  const [highlightGenres, setHighlightGenres] = useState<Array<{ slug: string; label: string; count: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSearchValue(searchParams.get("q") ?? "");
    setSelectedGenre(searchParams.get("genre") ?? "");
  }, [searchParams]);

  const hasFilters = Boolean(searchValue.trim() || selectedGenre);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        if (hasFilters) {
          const [beatResults, marketResults, studioResults] = await Promise.all([
            searchPlatform({ query: searchValue, genre: selectedGenre }),
            searchMarketplace({ query: searchValue }),
            searchValue.trim() ? getStudios({ query: searchValue, limit: 20 }) : Promise.resolve([]),
          ]);
          setTracks(beatResults.tracks);
          setProfiles(beatResults.profiles);
          setServices(marketResults.services);
          setProducts(marketResults.products);
          setStudios(studioResults);
        } else {
          const highlights = await getPlatformHighlights();
          setHighlightTracks(highlights.recentTracks);
          setHighlightCreators(highlights.topCreators);
          setHighlightGenres(highlights.genres);
          setTracks([]);
          setProfiles([]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Не удалось загрузить поиск");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [hasFilters, searchValue, selectedGenre]);

  const gradients = useMemo(
    () => [
      "bg-gradient-to-br from-purple-900 via-purple-600 to-pink-600",
      "bg-gradient-to-br from-cyan-900 via-cyan-600 to-blue-600",
      "bg-gradient-to-br from-green-900 via-green-600 to-teal-600",
      "bg-gradient-to-br from-orange-900 via-red-700 to-pink-600",
      "bg-gradient-to-br from-gray-900 via-slate-700 to-purple-900",
      "bg-gradient-to-br from-pink-900 via-purple-700 to-indigo-600",
    ],
    []
  );

  const updateParams = (next: { q?: string; genre?: string }) => {
    const params = new URLSearchParams(searchParams);

    if (next.q !== undefined) {
      const trimmed = next.q.trim();
      if (trimmed) params.set("q", trimmed);
      else params.delete("q");
    }

    if (next.genre !== undefined) {
      if (next.genre) params.set("genre", next.genre);
      else params.delete("genre");
    }

    setSearchParams(params);
  };

  const handleClearSearch = () => {
    setSearchValue("");
    updateParams({ q: "", genre: selectedGenre });
  };

  const handleGenreSelect = (genreSlug: string) => {
    const nextGenre = genreSlug === selectedGenre ? "" : genreSlug;
    setSelectedGenre(nextGenre);
    updateParams({ q: searchValue, genre: nextGenre });
  };

  return (
    <div className="min-h-screen pb-24 lg:pb-6 pt-6 px-4 lg:px-8 max-w-lg lg:max-w-7xl mx-auto" style={{ paddingTop: isFullscreen ? `calc(0.75rem + ${safeAreaTopInset}px)` : '2rem' }}>
      <div className="mb-6 relative">
        <div className="relative">
          <button
            onClick={handleClearSearch}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
          </button>
          <Input
            type="search"
            placeholder="Ищи биты, услуги, артистов..."
            className="h-12 bg-card border-border rounded-xl text-base transition-all pl-12 pr-10"
            value={searchValue}
            onChange={(e) => {
              const nextValue = e.target.value;
              setSearchValue(nextValue);
              updateParams({ q: nextValue, genre: selectedGenre });
            }}
          />
          {searchValue && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" strokeWidth={1.5} />
            </button>
          )}
          {!searchValue && (
            <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" strokeWidth={1.5} />
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {GENRE_OPTIONS.map((genre, index) => (
          <button
            key={genre.slug}
            onClick={() => handleGenreSelect(genre.slug)}
            className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
              selectedGenre === genre.slug ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
            }`}
          >
            {genre.label}
          </button>
        ))}
        <Button variant="outline" size="sm" onClick={() => navigate("/studios")} className="rounded-full">
          <Building2 className="w-4 h-4 mr-2" />
          Студии
        </Button>
      </div>

      {loading ? (
        <div className="py-16 text-center text-muted-foreground">Загружаем результаты поиска...</div>
      ) : error ? (
        <div className="py-16 text-center">
          <p className="font-medium mb-2">Поиск временно недоступен</p>
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => updateParams({ q: searchValue, genre: selectedGenre })}>Повторить</Button>
        </div>
      ) : (
        <>
          {hasFilters ? (
            <Tabs defaultValue="beats">
              <TabsList className="w-full flex overflow-x-auto gap-1 mb-5 h-auto p-1 scrollbar-hide">
                <TabsTrigger value="beats" className="text-xs gap-1 flex-shrink-0">
                  Биты
                  {tracks.length > 0 && <Badge variant="secondary" className="h-4 text-[10px] px-1">{tracks.length}</Badge>}
                </TabsTrigger>
                <TabsTrigger value="services" className="text-xs gap-1 flex-shrink-0">
                  Услуги
                  {services.length > 0 && <Badge variant="secondary" className="h-4 text-[10px] px-1">{services.length}</Badge>}
                </TabsTrigger>
                <TabsTrigger value="products" className="text-xs gap-1 flex-shrink-0">
                  Товары
                  {products.length > 0 && <Badge variant="secondary" className="h-4 text-[10px] px-1">{products.length}</Badge>}
                </TabsTrigger>
                <TabsTrigger value="studios" className="text-xs gap-1 flex-shrink-0">
                  Студии
                  {studios.length > 0 && <Badge variant="secondary" className="h-4 text-[10px] px-1">{studios.length}</Badge>}
                </TabsTrigger>
                <TabsTrigger value="people" className="text-xs gap-1 flex-shrink-0">
                  Авторы
                  {profiles.length > 0 && <Badge variant="secondary" className="h-4 text-[10px] px-1">{profiles.length}</Badge>}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="beats">
                {tracks.length > 0 ? (
                  <div className="grid gap-3">
                    {tracks.map((track) => (
                      <Link key={track.id} to={getTrackFeedPath(track.id)} className="rounded-xl border border-border bg-card p-4 hover:shadow-md transition-all">
                        <div className="flex items-start gap-4">
                          <div className={`h-14 w-14 shrink-0 rounded-xl ${track.gradientBg}`} />
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <p className="font-semibold text-sm truncate">{track.trackName}</p>
                              <span className="rounded-full bg-secondary px-2 py-0.5 text-xs">{track.genre}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">@{track.username}</p>
                            {track.servicePrice != null && track.servicePrice > 0 && (
                              <p className="text-primary text-sm font-bold mt-1">₽{track.servicePrice.toLocaleString("ru-RU")}</p>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-border p-8 text-sm text-muted-foreground text-center">Треков не найдено</div>
                )}
              </TabsContent>

              <TabsContent value="services" className="space-y-3">
                {services.length > 0 ? (
                  services.map((s) => (
                    <Link key={s.id} to={`/profile/${s.profiles?.username}`} className="block rounded-xl border border-border bg-card p-4 hover:shadow-md transition-all">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-sm">{s.title}</span>
                            <Badge variant="outline" className="text-[10px] h-4 px-1.5">{getCategoryLabel(s.category)}</Badge>
                          </div>
                          {s.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{s.description}</p>}
                          <p className="text-xs text-muted-foreground mt-1">@{s.profiles?.username}</p>
                        </div>
                        <p className="text-primary font-bold text-sm flex-shrink-0">от ₽{s.price.toLocaleString("ru-RU")}</p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="rounded-xl border border-dashed border-border p-8 text-sm text-muted-foreground text-center">Услуг не найдено</div>
                )}
              </TabsContent>

              <TabsContent value="products" className="space-y-3">
                {products.length > 0 ? (
                  products.map((p) => (
                    <Link key={p.id} to={`/profile/${p.profiles?.username}`} className="block rounded-xl border border-border bg-card p-4 hover:shadow-md transition-all">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-sm">{p.title}</span>
                            <Badge variant="outline" className="text-[10px] h-4 px-1.5">{getProductTypeLabel(p.product_type)}</Badge>
                          </div>
                          {p.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{p.description}</p>}
                          <p className="text-xs text-muted-foreground mt-1">@{p.profiles?.username}</p>
                        </div>
                        <p className="text-primary font-bold text-sm flex-shrink-0">₽{p.price.toLocaleString("ru-RU")}</p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="rounded-xl border border-dashed border-border p-8 text-sm text-muted-foreground text-center">Товаров не найдено</div>
                )}
              </TabsContent>

              <TabsContent value="studios" className="space-y-3">
                {studios.length > 0 ? (
                  studios.map((s) => (
                    <Link key={s.id} to={`/studios/${s.id}`} className="block rounded-xl border border-border bg-card p-4 hover:shadow-md transition-all">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-sm">{s.name}</span>
                            <Badge variant="outline" className="text-[10px] h-4 px-1.5">{s.city}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{s.address}</p>
                          {s.equipment && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{s.equipment}</p>}
                        </div>
                        <p className="text-primary font-bold text-sm flex-shrink-0">₽{s.price_per_hour.toLocaleString("ru-RU")}/ч</p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="rounded-xl border border-dashed border-border p-8 text-sm text-muted-foreground text-center">Студий не найдено</div>
                )}
              </TabsContent>

              <TabsContent value="people" className="space-y-3">
                {profiles.length > 0 ? (
                  profiles.map((profile) => (
                    <TopCreatorCard key={profile.id} name={profile.display_name || profile.username} username={profile.username} genre="Автор" rating={0} />
                  ))
                ) : (
                  <div className="rounded-xl border border-dashed border-border p-8 text-sm text-muted-foreground text-center">Авторов не найдено</div>
                )}
              </TabsContent>
            </Tabs>
          ) : (
            <div className="space-y-8">
              <section>
                <h2 className="text-xl font-semibold mb-4">Популярные жанры</h2>
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {(highlightGenres.length > 0 ? highlightGenres : GENRE_OPTIONS).map((genre, index) => {
                    const label = "label" in genre ? genre.label : genre.label;
                    const slug = "slug" in genre ? genre.slug : genre.slug;
                    const count = "count" in genre ? genre.count : 0;
                    return (
                      <Link
                        key={slug}
                        to={getGenreLink(slug)}
                        className={`relative overflow-hidden rounded-xl h-32 p-4 flex flex-col justify-end text-white ${gradients[index % gradients.length]}`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="relative">
                          <p className="font-semibold text-base">{label}</p>
                          <p className="text-xs text-white/70">{count > 0 ? `${count} треков` : "Смотреть жанр"}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>

              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Свежие треки</h2>
                  <Link to="/feed" className="text-sm text-primary">Открыть ленту</Link>
                </div>
                {highlightTracks.length > 0 ? (
                  <div className="grid gap-3">
                    {highlightTracks.map((track) => (
                      <Link
                        key={track.id}
                        to={getTrackFeedPath(track.id)}
                        className="rounded-xl border border-border bg-card p-4 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start gap-4">
                          <div className={`h-16 w-16 shrink-0 rounded-xl ${track.gradientBg}`} />
                          <div className="min-w-0">
                            <p className="font-semibold truncate">{track.trackName}</p>
                            <p className="text-sm text-muted-foreground">@{track.username}</p>
                            <p className="text-xs text-muted-foreground mt-1">{track.genre}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
                    Пока нечего показать. Треки появятся после публикации первых битов.
                  </div>
                )}
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">Авторы платформы</h2>
                {highlightCreators.length > 0 ? (
                  <div className="space-y-3">
                    {highlightCreators.map((creator) => (
                      <TopCreatorCard
                        key={creator.id}
                        name={creator.displayName}
                        username={creator.username}
                        genre={creator.genre}
                        rating={creator.count > 0 ? 5 : 0}
                        likes={creator.count}
                        isRising={creator.count >= 2}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
                    Авторы появятся здесь после загрузки первых треков.
                  </div>
                )}
              </section>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Search;
