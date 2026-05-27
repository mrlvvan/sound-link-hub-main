import { supabase } from "@/lib/supabase";

export type ReviewRecord = {
  id: string;
  studio_id: string;
  reviewer_id: string;
  booking_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  reviewer?: {
    id: string;
    username: string;
    display_name: string | null;
    avatar_url: string | null;
  } | null;
};

const reviewSelect = `id, studio_id, reviewer_id, booking_id, rating, comment, created_at,
  reviewer:profiles!studio_reviews_reviewer_id_fkey(id, username, display_name, avatar_url)`;

export const getStudioReviews = async (studioId: string): Promise<ReviewRecord[]> => {
  const { data, error } = await supabase
    .from("studio_reviews")
    .select(reviewSelect)
    .eq("studio_id", studioId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as ReviewRecord[]) ?? [];
};

export const getStudioRating = async (studioId: string): Promise<{ avg: number; count: number }> => {
  const { data, error } = await supabase
    .from("studio_reviews")
    .select("rating")
    .eq("studio_id", studioId);
  if (error) throw error;
  const rows = (data as { rating: number }[]) ?? [];
  if (rows.length === 0) return { avg: 0, count: 0 };
  const avg = rows.reduce((sum, r) => sum + r.rating, 0) / rows.length;
  return { avg: Math.round(avg * 10) / 10, count: rows.length };
};

export const hasReviewed = async (bookingId: string): Promise<boolean> => {
  const { data } = await supabase
    .from("studio_reviews")
    .select("id")
    .eq("booking_id", bookingId)
    .maybeSingle();
  return Boolean(data);
};

export const createReview = async (input: {
  studioId: string;
  reviewerId: string;
  bookingId: string;
  rating: number;
  comment?: string;
}): Promise<ReviewRecord> => {
  const { data, error } = await supabase
    .from("studio_reviews")
    .insert({
      studio_id: input.studioId,
      reviewer_id: input.reviewerId,
      booking_id: input.bookingId,
      rating: input.rating,
      comment: input.comment?.trim() || null,
    })
    .select(reviewSelect)
    .single();
  if (error) throw error;
  return data as ReviewRecord;
};
