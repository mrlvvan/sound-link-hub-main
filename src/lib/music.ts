import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { createNotification } from "@/lib/notifications";

export const TRACKS_STORAGE_BUCKET = "beats";
export const PROFILE_STORAGE_BUCKET = "profile-assets";
export const TRACK_MAX_SIZE_BYTES = 100 * 1024 * 1024;
export const AVATAR_MAX_SIZE_BYTES = 5 * 1024 * 1024;
export const DEFAULT_TRACK_GRADIENT = "bg-gradient-to-br from-purple-900 via-purple-700 to-pink-600";

export const GRADIENT_OPTIONS = [
  { value: "bg-gradient-to-br from-purple-900 via-purple-700 to-pink-600", label: "Фиолетовый" },
  { value: "bg-gradient-to-br from-cyan-900 via-cyan-600 to-blue-600", label: "Циан" },
  { value: "bg-gradient-to-br from-green-900 via-green-600 to-teal-600", label: "Зелёный" },
  { value: "bg-gradient-to-br from-orange-900 via-red-700 to-pink-600", label: "Оранжевый" },
  { value: "bg-gradient-to-br from-gray-900 via-slate-700 to-purple-900", label: "Серый" },
  { value: "bg-gradient-to-br from-pink-900 via-purple-700 to-indigo-600", label: "Розовый" },
] as const;

export const GENRE_OPTIONS = [
  { label: "Trap", slug: "trap" },
  { label: "Drill", slug: "drill" },
  { label: "EDM", slug: "edm" },
  { label: "Lo-Fi", slug: "lo-fi" },
  { label: "Hip-Hop", slug: "hip-hop" },
  { label: "R&B", slug: "r-and-b" },
  { label: "Pop", slug: "pop" },
  { label: "JazzHop", slug: "jazzhop" },
  { label: "Другое", slug: "other" },
] as const;

const GENRE_ALIASES: Record<string, string> = {
  lofi: "lo-fi",
  "lo fi": "lo-fi",
  "hip hop": "hip-hop",
  hiphop: "hip-hop",
  rb: "r-and-b",
  rnb: "r-and-b",
};

const AUDIO_CONTENT_TYPES: Record<string, string> = {
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
};

const IMAGE_CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

export type ProfileRecord = {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  role?: "user" | "admin";
};

export type TrackRecord = {
  id: string;
  user_id: string;
  track_name: string;
  genre: string;
  description: string | null;
  audio_url: string | null;
  cover_gradient: string | null;
  service_title: string | null;
  service_price: number | null;
  likes_count: number | null;
  created_at?: string;
  profiles?: Pick<ProfileRecord, "id" | "username" | "display_name" | "avatar_url"> | null;
};

export type TrackCard = {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  trackName: string;
  genre: string;
  genreSlug: string;
  description: string;
  likes: number;
  comments: number;
  gradientBg: string;
  serviceTitle: string;
  servicePrice: number;
  audioUrl: string;
  createdAt: string | null;
};

export type SearchResults = {
  tracks: TrackCard[];
  profiles: ProfileRecord[];
};

type UploadTrackInput = {
  user: User;
  trackName: string;
  genre: string;
  description?: string;
  audioFile: File;
  coverGradient?: string;
  serviceTitle?: string;
  servicePrice?: number;
};

type SaveProfileInput = {
  user: User;
  username: string;
  displayName: string;
  bio: string;
  avatarFile?: File | null;
};

const trimOrNull = (value?: string | null) => {
  const normalized = value?.trim();
  return normalized ? normalized : null;
};

const getFileExtension = (fileName: string) => {
  const lastDotIndex = fileName.lastIndexOf(".");
  return lastDotIndex === -1 ? "" : fileName.slice(lastDotIndex).toLowerCase();
};

const sanitizeUsername = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .replace(/_{2,}/g, "_")
    .slice(0, 24);

const uniqueById = <T extends { id: string }>(items: T[]) => {
  const map = new Map<string, T>();
  for (const item of items) {
    map.set(item.id, item);
  }
  return Array.from(map.values());
};

export const getGenreLabel = (value: string) => {
  const normalized = normalizeGenreSlug(value);
  const match = GENRE_OPTIONS.find((item) => item.slug === normalized);
  if (match) return match.label;

  const trimmed = value.trim();
  return trimmed || "Другое";
};

export const normalizeGenreSlug = (value: string) => {
  const base = value
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9а-яё]+/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return GENRE_ALIASES[base] ?? base;
};

export const getGenreLink = (value: string) => `/search?genre=${encodeURIComponent(normalizeGenreSlug(value))}`;

export const getTrackFeedPath = (trackId: string) => `/feed?track=${encodeURIComponent(trackId)}`;

export const buildTrackShareUrl = (trackId: string) =>
  `${window.location.origin}${getTrackFeedPath(trackId)}`;

const assertTrackFile = (file: File) => {
  const extension = getFileExtension(file.name);
  const contentType = AUDIO_CONTENT_TYPES[extension];

  if (!contentType) {
    throw new Error("Поддерживаются только MP3 и WAV файлы");
  }
  if (file.size > TRACK_MAX_SIZE_BYTES) {
    throw new Error("Размер трека не должен превышать 100 МБ");
  }
  if (file.type && file.type !== contentType && !(extension === ".wav" && file.type === "audio/x-wav")) {
    throw new Error("Неверный тип файла. Используйте MP3 или WAV");
  }

  return { extension, contentType };
};

const assertAvatarFile = (file: File) => {
  const extension = getFileExtension(file.name);
  const contentType = IMAGE_CONTENT_TYPES[extension];

  if (!contentType) {
    throw new Error("Для аватара поддерживаются JPG, PNG и WEBP");
  }
  if (file.size > AVATAR_MAX_SIZE_BYTES) {
    throw new Error("Размер аватара не должен превышать 5 МБ");
  }

  return { extension, contentType };
};

const buildTrackPath = (userId: string, extension: string) => `${userId}/${crypto.randomUUID()}${extension}`;
const buildAvatarPath = (userId: string, extension: string) => `${userId}/avatar-${crypto.randomUUID()}${extension}`;

const escapeIlike = (value: string) => value.replace(/[%_,]/g, " ").trim();

const getProfileSeed = (user: User) => {
  const metadata = user.user_metadata ?? {};
  const emailPrefix = user.email?.split("@")[0] ?? `user_${user.id.slice(0, 8)}`;
  const requestedUsername = sanitizeUsername(typeof metadata.username === "string" ? metadata.username : emailPrefix);
  const username = requestedUsername || `user_${user.id.slice(0, 8)}`;
  const displayNameSource =
    typeof metadata.display_name === "string"
      ? metadata.display_name
      : typeof metadata.full_name === "string"
        ? metadata.full_name
        : username;
  const avatarSource = typeof metadata.avatar_url === "string" ? metadata.avatar_url : null;
  const displayName = trimOrNull(displayNameSource) ?? username;

  return {
    username,
    display_name: displayName,
    avatar_url: trimOrNull(avatarSource),
    bio: null as string | null,
  };
};

const isUsernameTakenByAnotherUser = async (username: string, userId: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", username)
    .neq("id", userId)
    .limit(1);

  if (error) throw error;

  return Boolean(data && data.length > 0);
};

const resolveUniqueUsername = async (base: string, userId: string) => {
  const candidateBase = sanitizeUsername(base) || `user_${userId.slice(0, 8)}`;
  let candidate = candidateBase;

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const taken = await isUsernameTakenByAnotherUser(candidate, userId);
    if (!taken) return candidate;
    candidate = `${candidateBase}_${userId.slice(attempt, attempt + 4) || userId.slice(0, 4)}`;
  }

  return `${candidateBase}_${userId.slice(0, 6)}`;
};

export const mapTrackRecordToCard = (row: TrackRecord): TrackCard => {
  const username = row.profiles?.username ?? "unknown";
  const displayName = row.profiles?.display_name ?? username;

  return {
    id: row.id,
    userId: row.user_id,
    username,
    displayName,
    avatarUrl: row.profiles?.avatar_url ?? null,
    trackName: row.track_name,
    genre: row.genre,
    genreSlug: normalizeGenreSlug(row.genre),
    description: row.description ?? "",
    likes: row.likes_count ?? 0,
    comments: 0,
    gradientBg: row.cover_gradient || DEFAULT_TRACK_GRADIENT,
    serviceTitle: row.service_title || "Аренда студии",
    servicePrice: row.service_price ?? 2500,
    audioUrl: row.audio_url || "",
    createdAt: row.created_at ?? null,
  };
};

const baseTrackSelect = `
  id,
  user_id,
  track_name,
  genre,
  description,
  audio_url,
  cover_gradient,
  service_title,
  service_price,
  likes_count,
  created_at,
  profiles!beats_user_id_fkey(id, username, display_name, avatar_url)
`;

export const ensureProfile = async (user: User) => {
  const seed = getProfileSeed(user);
  const username = await resolveUniqueUsername(seed.username, user.id);

  const { data, error } = await supabase
    .from("profiles")
    .upsert(
      {
        id: user.id,
        username,
        display_name: seed.display_name,
        avatar_url: seed.avatar_url,
      },
      { onConflict: "id" }
    )
    .select("id, username, display_name, avatar_url, bio, role")
    .single();

  if (error) throw error;

  return data as ProfileRecord;
};

export const getProfileByUserId = async (userId: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url, bio, role")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;
  return (data as ProfileRecord | null) ?? null;
};

export const saveProfile = async ({ user, username, displayName, bio, avatarFile }: SaveProfileInput) => {
  const normalizedUsername = sanitizeUsername(username);

  if (normalizedUsername.length < 3) {
    throw new Error("Username должен содержать минимум 3 символа");
  }

  if (await isUsernameTakenByAnotherUser(normalizedUsername, user.id)) {
    throw new Error("Этот username уже занят");
  }

  let avatarUrl: string | null | undefined;
  if (avatarFile) {
    const { extension, contentType } = assertAvatarFile(avatarFile);
    const avatarPath = buildAvatarPath(user.id, extension);
    const { error: uploadError } = await supabase.storage
      .from(PROFILE_STORAGE_BUCKET)
      .upload(avatarPath, avatarFile, { contentType, upsert: true });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from(PROFILE_STORAGE_BUCKET).getPublicUrl(avatarPath);
    avatarUrl = data.publicUrl;
  }

  const payload = {
    id: user.id,
    username: normalizedUsername,
    display_name: trimOrNull(displayName) ?? normalizedUsername,
    bio: trimOrNull(bio),
    ...(avatarUrl ? { avatar_url: avatarUrl } : {}),
  };

  const { data, error } = await supabase
    .from("profiles")
    .upsert(payload, { onConflict: "id" })
    .select("id, username, display_name, avatar_url, bio, role")
    .single();

  if (error) throw error;

  return data as ProfileRecord;
};

export const uploadTrack = async ({
  user,
  trackName,
  genre,
  description,
  audioFile,
  coverGradient,
  serviceTitle,
  servicePrice,
}: UploadTrackInput) => {
  const cleanedTrackName = trackName.trim();
  if (!cleanedTrackName) throw new Error("Укажите название трека");

  const genreLabel = getGenreLabel(genre);
  const { extension, contentType } = assertTrackFile(audioFile);
  const filePath = buildTrackPath(user.id, extension);

  const { error: uploadError } = await supabase.storage
    .from(TRACKS_STORAGE_BUCKET)
    .upload(filePath, audioFile, { contentType, upsert: false });

  if (uploadError) throw uploadError;

  const { data: publicUrlData } = supabase.storage.from(TRACKS_STORAGE_BUCKET).getPublicUrl(filePath);

  const { data, error } = await supabase
    .from("beats")
    .insert({
      user_id: user.id,
      track_name: cleanedTrackName,
      genre: genreLabel,
      description: trimOrNull(description),
      audio_url: publicUrlData.publicUrl,
      cover_gradient: coverGradient || DEFAULT_TRACK_GRADIENT,
      service_title: trimOrNull(serviceTitle) ?? "Аренда студии",
      service_price: servicePrice && Number.isFinite(servicePrice) ? servicePrice : 2500,
    })
    .select(baseTrackSelect)
    .single();

  if (error) throw error;

  return mapTrackRecordToCard(data as TrackRecord);
};

export const getFeedTracks = async ({ limit = 50 }: { limit?: number } = {}) => {
  const { data, error } = await supabase
    .from("beats")
    .select(baseTrackSelect)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;

  return ((data as TrackRecord[] | null) ?? []).map(mapTrackRecordToCard);
};

export const getTrackById = async (trackId: string) => {
  const { data, error } = await supabase
    .from("beats")
    .select(baseTrackSelect)
    .eq("id", trackId)
    .maybeSingle();

  if (error) throw error;
  return data ? mapTrackRecordToCard(data as TrackRecord) : null;
};

export const getTracksByUserId = async (userId: string) => {
  const { data, error } = await supabase
    .from("beats")
    .select(baseTrackSelect)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return ((data as TrackRecord[] | null) ?? []).map(mapTrackRecordToCard);
};

export const getPublicProfileByUsername = async (username: string) => {
  const normalizedUsername = sanitizeUsername(username);
  const { data, error } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url, bio, role")
    .eq("username", normalizedUsername)
    .maybeSingle();

  if (error) throw error;
  return (data as ProfileRecord | null) ?? null;
};

export const searchPlatform = async ({
  query,
  genre,
  limit = 24,
}: {
  query?: string;
  genre?: string;
  limit?: number;
}) => {
  const genreLabel = genre ? getGenreLabel(genre) : "";
  const rawQuery = query?.trim() ?? "";
  const safeQuery = escapeIlike(rawQuery);
  const wildcard = safeQuery ? `%${safeQuery}%` : "";

  let tracksQuery = supabase
    .from("beats")
    .select(baseTrackSelect)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (genreLabel) {
    tracksQuery = tracksQuery.ilike("genre", genreLabel);
  }
  if (wildcard) {
    tracksQuery = tracksQuery.or(`track_name.ilike.${wildcard},description.ilike.${wildcard},genre.ilike.${wildcard}`);
  }

  let profilesQuery = supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url, bio, role")
    .limit(Math.max(8, Math.floor(limit / 2)));

  if (wildcard) {
    profilesQuery = profilesQuery.or(`username.ilike.${wildcard},display_name.ilike.${wildcard}`);
  } else if (genreLabel) {
    profilesQuery = profilesQuery.limit(8);
  }

  const [{ data: trackRows, error: tracksError }, { data: profileRows, error: profilesError }] = await Promise.all([
    tracksQuery,
    profilesQuery,
  ]);

  if (tracksError) throw tracksError;
  if (profilesError) throw profilesError;

  const profileMatches = (profileRows as ProfileRecord[] | null) ?? [];
  const trackMatches = ((trackRows as TrackRecord[] | null) ?? []).map(mapTrackRecordToCard);

  let profileTrackMatches: TrackCard[] = [];
  if (wildcard && profileMatches.length > 0) {
    const { data, error } = await supabase
      .from("beats")
      .select(baseTrackSelect)
      .in(
        "user_id",
        profileMatches.map((profile) => profile.id)
      )
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    profileTrackMatches = ((data as TrackRecord[] | null) ?? []).map(mapTrackRecordToCard);
  }

  return {
    tracks: uniqueById([...trackMatches, ...profileTrackMatches]),
    profiles: profileMatches,
  } satisfies SearchResults;
};

export const getPlatformHighlights = async () => {
  const tracks = await getFeedTracks({ limit: 24 });
  const creatorsMap = new Map<string, { id: string; username: string; displayName: string; avatarUrl: string | null; count: number; genre: string }>();
  const genreMap = new Map<string, { slug: string; label: string; count: number }>();

  for (const track of tracks) {
    const existingCreator = creatorsMap.get(track.userId);
    creatorsMap.set(track.userId, {
      id: track.userId,
      username: track.username,
      displayName: track.displayName,
      avatarUrl: track.avatarUrl,
      count: (existingCreator?.count ?? 0) + 1,
      genre: existingCreator?.genre ?? track.genre,
    });

    const existingGenre = genreMap.get(track.genreSlug);
    genreMap.set(track.genreSlug, {
      slug: track.genreSlug,
      label: track.genre,
      count: (existingGenre?.count ?? 0) + 1,
    });
  }

  return {
    recentTracks: tracks.slice(0, 8),
    topCreators: Array.from(creatorsMap.values())
      .sort((left, right) => right.count - left.count)
      .slice(0, 8),
    genres: Array.from(genreMap.values())
      .sort((left, right) => right.count - left.count)
      .slice(0, 8),
  };
};

// ──────────────────────────────────────────────────────────────
// Лайки
// ──────────────────────────────────────────────────────────────

export const getBeatLikeStatus = async (
  beatId: string,
  userId: string
): Promise<boolean> => {
  const { data } = await supabase
    .from("beat_likes")
    .select("beat_id")
    .eq("beat_id", beatId)
    .eq("user_id", userId)
    .maybeSingle();
  return Boolean(data);
};

export const toggleBeatLike = async (
  beatId: string,
  userId: string,
  currentlyLiked: boolean
): Promise<number> => {
  if (currentlyLiked) {
    await supabase.from("beat_likes").delete().eq("beat_id", beatId).eq("user_id", userId);
    await supabase.rpc("decrement_likes", { beat_id: beatId }).catch(() => null);
  } else {
    await supabase.from("beat_likes").insert({ beat_id: beatId, user_id: userId });
    await supabase.rpc("increment_likes", { beat_id: beatId }).catch(() => null);
    // notify beat owner (fire-and-forget)
    void (async () => {
      const { data: beat } = await supabase
        .from("beats")
        .select("user_id, track_name, profiles!beats_user_id_fkey(username)")
        .eq("id", beatId)
        .maybeSingle();
      if (beat && beat.user_id !== userId) {
        const liker = await supabase.from("profiles").select("username, display_name").eq("id", userId).maybeSingle();
        const likerName = (liker.data as { username: string; display_name: string | null } | null)?.display_name
          || (liker.data as { username: string } | null)?.username || "Кто-то";
        await createNotification({
          userId: (beat as { user_id: string }).user_id,
          type: "like",
          title: `${likerName} лайкнул ваш бит`,
          body: (beat as { track_name: string }).track_name,
          data: { fromUserId: userId, beatId },
        }).catch(() => null);
      }
    })();
  }
  const { data } = await supabase
    .from("beats")
    .select("likes_count")
    .eq("id", beatId)
    .maybeSingle();
  return (data as { likes_count: number } | null)?.likes_count ?? 0;
};

// ──────────────────────────────────────────────────────────────
// Комментарии
// ──────────────────────────────────────────────────────────────

export type BeatComment = {
  id: string;
  beat_id: string;
  user_id: string;
  text: string;
  created_at: string;
  profiles?: Pick<ProfileRecord, "id" | "username" | "display_name" | "avatar_url"> | null;
};

export const getBeatComments = async (beatId: string): Promise<BeatComment[]> => {
  const { data, error } = await supabase
    .from("beat_comments")
    .select("id, beat_id, user_id, text, created_at, profiles(id, username, display_name, avatar_url)")
    .eq("beat_id", beatId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data as BeatComment[]) ?? [];
};

export const addBeatComment = async (
  beatId: string,
  userId: string,
  text: string
): Promise<BeatComment> => {
  const { data, error } = await supabase
    .from("beat_comments")
    .insert({ beat_id: beatId, user_id: userId, text: text.trim() })
    .select("id, beat_id, user_id, text, created_at, profiles(id, username, display_name, avatar_url)")
    .single();

  if (error) throw error;
  return data as BeatComment;
};

export const deleteBeatComment = async (commentId: string): Promise<void> => {
  const { error } = await supabase.from("beat_comments").delete().eq("id", commentId);
  if (error) throw error;
};

// ──────────────────────────────────────────────────────────────
// Подписки
// ──────────────────────────────────────────────────────────────

export const getFollowStatus = async (
  followerId: string,
  followingId: string
): Promise<boolean> => {
  const { data } = await supabase
    .from("follows")
    .select("follower_id")
    .eq("follower_id", followerId)
    .eq("following_id", followingId)
    .maybeSingle();
  return Boolean(data);
};

export const toggleFollow = async (
  followerId: string,
  followingId: string,
  currentlyFollowing: boolean
): Promise<void> => {
  if (currentlyFollowing) {
    await supabase.from("follows").delete().eq("follower_id", followerId).eq("following_id", followingId);
  } else {
    await supabase.from("follows").insert({ follower_id: followerId, following_id: followingId });
    // notify the followed user (fire-and-forget)
    void (async () => {
      const { data: follower } = await supabase
        .from("profiles")
        .select("username, display_name")
        .eq("id", followerId)
        .maybeSingle();
      const name = (follower as { display_name: string | null; username: string } | null)?.display_name
        || (follower as { username: string } | null)?.username || "Кто-то";
      const uname = (follower as { username: string } | null)?.username ?? "";
      await createNotification({
        userId: followingId,
        type: "follow",
        title: `${name} подписался на вас`,
        data: { fromUserId: followerId, fromUsername: uname },
      }).catch(() => null);
    })();
  }
};

export const getFollowCounts = async (
  userId: string
): Promise<{ followers: number; following: number }> => {
  const [{ count: followers }, { count: following }] = await Promise.all([
    supabase.from("follows").select("follower_id", { count: "exact", head: true }).eq("following_id", userId),
    supabase.from("follows").select("following_id", { count: "exact", head: true }).eq("follower_id", userId),
  ]);
  return { followers: followers ?? 0, following: following ?? 0 };
};

export const deleteBeat = async (beatId: string): Promise<void> => {
  const { error } = await supabase.from("beats").delete().eq("id", beatId);
  if (error) throw error;
};
