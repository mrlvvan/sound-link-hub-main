import { supabase } from "@/lib/supabase";

export type BookingStatus = "pending" | "confirmed" | "active" | "completed" | "cancelled";

export type StudioRecord = {
  id: string;
  owner_id: string;
  name: string;
  description: string | null;
  address: string;
  city: string;
  price_per_hour: number;
  price_per_day: number | null;
  equipment: string | null;
  photos: string[];
  created_at: string;
  owner?: {
    id: string;
    username: string;
    display_name: string | null;
    avatar_url: string | null;
  } | null;
};

export type BookingRecord = {
  id: string;
  studio_id: string;
  renter_id: string;
  owner_id: string;
  start_time: string;
  end_time: string;
  total_price: number;
  status: BookingStatus;
  note: string | null;
  created_at: string;
  studio?: StudioRecord | null;
  renter?: {
    id: string;
    username: string;
    display_name: string | null;
    avatar_url: string | null;
  } | null;
  owner?: {
    id: string;
    username: string;
    display_name: string | null;
    avatar_url: string | null;
  } | null;
};

export type BookingMessage = {
  id: string;
  booking_id: string;
  sender_id: string;
  text: string;
  created_at: string;
  sender?: {
    id: string;
    username: string;
    display_name: string | null;
    avatar_url: string | null;
  } | null;
};

export const STATUS_LABELS: Record<BookingStatus, string> = {
  pending: "Ожидание",
  confirmed: "Подтверждено",
  active: "Активно",
  completed: "Завершено",
  cancelled: "Отменено",
};

export const STATUS_COLORS: Record<BookingStatus, string> = {
  pending: "text-yellow-500 border-yellow-500/30 bg-yellow-500/10",
  confirmed: "text-green-500 border-green-500/30 bg-green-500/10",
  active: "text-blue-500 border-blue-500/30 bg-blue-500/10",
  completed: "text-primary border-primary/30 bg-primary/10",
  cancelled: "text-red-500 border-red-500/30 bg-red-500/10",
};

const studioSelect = `id, owner_id, name, description, address, city, price_per_hour, price_per_day, equipment, photos, created_at,
  owner:profiles!studios_owner_id_fkey(id, username, display_name, avatar_url)`;

const bookingSelect = `id, studio_id, renter_id, owner_id, start_time, end_time, total_price, status, note, created_at,
  studio:studios(id, name, address, city, price_per_hour, photos),
  renter:profiles!bookings_renter_id_fkey(id, username, display_name, avatar_url),
  owner:profiles!bookings_owner_id_fkey(id, username, display_name, avatar_url)`;

export const getStudios = async (params?: { city?: string; query?: string; limit?: number; ownerId?: string }): Promise<StudioRecord[]> => {
  let q = supabase.from("studios").select(studioSelect).order("created_at", { ascending: false });
  if (params?.city && params.city !== "all") q = q.eq("city", params.city);
  if (params?.ownerId) q = q.eq("owner_id", params.ownerId);
  if (params?.query) {
    const w = `%${params.query.trim()}%`;
    q = q.or(`name.ilike.${w},description.ilike.${w},address.ilike.${w}`);
  }
  if (params?.limit) q = q.limit(params.limit);
  const { data, error } = await q;
  if (error) throw error;
  return (data as StudioRecord[]) ?? [];
};

export const getStudioById = async (id: string): Promise<StudioRecord | null> => {
  const { data, error } = await supabase
    .from("studios")
    .select(studioSelect)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data as StudioRecord | null;
};

export const createStudio = async (
  ownerId: string,
  input: {
    name: string;
    description?: string;
    address: string;
    city: string;
    pricePerHour: number;
    pricePerDay?: number;
    equipment?: string;
    photos?: string[];
  }
): Promise<StudioRecord> => {
  const { data, error } = await supabase
    .from("studios")
    .insert({
      owner_id: ownerId,
      name: input.name.trim(),
      description: input.description?.trim() || null,
      address: input.address.trim(),
      city: input.city.trim(),
      price_per_hour: input.pricePerHour,
      price_per_day: input.pricePerDay ?? null,
      equipment: input.equipment?.trim() || null,
      photos: input.photos ?? [],
    })
    .select(studioSelect)
    .single();
  if (error) throw error;
  return data as StudioRecord;
};

export const getMyBookings = async (userId: string): Promise<{ asRenter: BookingRecord[]; asOwner: BookingRecord[] }> => {
  const [{ data: renterData, error: rErr }, { data: ownerData, error: oErr }] = await Promise.all([
    supabase.from("bookings").select(bookingSelect).eq("renter_id", userId).order("created_at", { ascending: false }),
    supabase.from("bookings").select(bookingSelect).eq("owner_id", userId).order("created_at", { ascending: false }),
  ]);
  if (rErr) throw rErr;
  if (oErr) throw oErr;
  return {
    asRenter: (renterData as BookingRecord[]) ?? [],
    asOwner: (ownerData as BookingRecord[]) ?? [],
  };
};

export const getBookingById = async (id: string): Promise<BookingRecord | null> => {
  const { data, error } = await supabase
    .from("bookings")
    .select(bookingSelect)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data as BookingRecord | null;
};

export const createBooking = async (input: {
  studioId: string;
  renterId: string;
  ownerId: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  note?: string;
}): Promise<BookingRecord> => {
  const { data, error } = await supabase
    .from("bookings")
    .insert({
      studio_id: input.studioId,
      renter_id: input.renterId,
      owner_id: input.ownerId,
      start_time: input.startTime,
      end_time: input.endTime,
      total_price: input.totalPrice,
      note: input.note?.trim() || null,
      status: "pending",
    })
    .select(bookingSelect)
    .single();
  if (error) throw error;
  return data as BookingRecord;
};

export const updateBookingStatus = async (id: string, status: BookingStatus): Promise<void> => {
  const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
  if (error) throw error;
};

export const getBookingMessages = async (bookingId: string): Promise<BookingMessage[]> => {
  const { data, error } = await supabase
    .from("booking_messages")
    .select(`id, booking_id, sender_id, text, created_at,
      sender:profiles!booking_messages_sender_id_fkey(id, username, display_name, avatar_url)`)
    .eq("booking_id", bookingId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data as BookingMessage[]) ?? [];
};

export const sendBookingMessage = async (bookingId: string, senderId: string, text: string): Promise<BookingMessage> => {
  const { data, error } = await supabase
    .from("booking_messages")
    .insert({ booking_id: bookingId, sender_id: senderId, text: text.trim() })
    .select(`id, booking_id, sender_id, text, created_at,
      sender:profiles!booking_messages_sender_id_fkey(id, username, display_name, avatar_url)`)
    .single();
  if (error) throw error;
  return data as BookingMessage;
};
