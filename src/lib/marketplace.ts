import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export const SERVICE_CATEGORIES = [
  { value: "mixing",      label: "Сведение" },
  { value: "mastering",   label: "Мастеринг" },
  { value: "recording",   label: "Запись" },
  { value: "beats",       label: "Написание битов" },
  { value: "production",  label: "Продюсирование" },
  { value: "vocal",       label: "Вокал" },
  { value: "arrangement", label: "Аранжировка" },
  { value: "other",       label: "Другое" },
] as const;

export const PRODUCT_TYPES = [
  { value: "beat",         label: "Бит" },
  { value: "sample_pack",  label: "Сэмпл пак" },
  { value: "loop_kit",     label: "Loop Kit" },
  { value: "midi_kit",     label: "MIDI Kit" },
  { value: "preset_pack",  label: "Пресеты" },
  { value: "stems",        label: "Стемы" },
] as const;

export type ServiceRecord = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  price: number;
  category: string;
  created_at: string;
  profiles?: {
    id: string;
    username: string;
    display_name: string | null;
    avatar_url: string | null;
  } | null;
};

export type ProductRecord = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  price: number;
  file_url: string;
  preview_url: string | null;
  product_type: string;
  created_at: string;
  profiles?: {
    id: string;
    username: string;
    display_name: string | null;
    avatar_url: string | null;
  } | null;
};

const serviceSelect = `id, user_id, title, description, price, category, created_at,
  profiles(id, username, display_name, avatar_url)`;

const productSelect = `id, user_id, title, description, price, file_url, preview_url, product_type, created_at,
  profiles(id, username, display_name, avatar_url)`;

export const getServicesByUserId = async (userId: string): Promise<ServiceRecord[]> => {
  const { data, error } = await supabase
    .from("services")
    .select(serviceSelect)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as ServiceRecord[]) ?? [];
};

export const getProductsByUserId = async (userId: string): Promise<ProductRecord[]> => {
  const { data, error } = await supabase
    .from("products")
    .select(productSelect)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as ProductRecord[]) ?? [];
};

export const createService = async (
  user: User,
  input: { title: string; description?: string; price: number; category: string }
): Promise<ServiceRecord> => {
  const { data, error } = await supabase
    .from("services")
    .insert({
      user_id: user.id,
      title: input.title.trim(),
      description: input.description?.trim() || null,
      price: input.price,
      category: input.category,
    })
    .select(serviceSelect)
    .single();

  if (error) throw error;
  return data as ServiceRecord;
};

export const deleteService = async (serviceId: string): Promise<void> => {
  const { error } = await supabase.from("services").delete().eq("id", serviceId);
  if (error) throw error;
};

export const createProduct = async (
  user: User,
  input: {
    title: string;
    description?: string;
    price: number;
    productType: string;
    audioFile: File;
    previewFile?: File | null;
  }
): Promise<ProductRecord> => {
  const ext = input.audioFile.name.split(".").pop()?.toLowerCase() || "zip";
  const filePath = `${user.id}/${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("products")
    .upload(filePath, input.audioFile, { upsert: false });

  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage.from("products").getPublicUrl(filePath);

  let previewUrl: string | null = null;
  if (input.previewFile) {
    const previewExt = input.previewFile.name.split(".").pop()?.toLowerCase() || "mp3";
    const previewPath = `${user.id}/preview-${crypto.randomUUID()}.${previewExt}`;
    const { error: previewErr } = await supabase.storage
      .from("beats")
      .upload(previewPath, input.previewFile, { upsert: false });
    if (!previewErr) {
      const { data: pd } = supabase.storage.from("beats").getPublicUrl(previewPath);
      previewUrl = pd.publicUrl;
    }
  }

  const { data, error } = await supabase
    .from("products")
    .insert({
      user_id: user.id,
      title: input.title.trim(),
      description: input.description?.trim() || null,
      price: input.price,
      file_url: urlData.publicUrl,
      preview_url: previewUrl,
      product_type: input.productType,
    })
    .select(productSelect)
    .single();

  if (error) throw error;
  return data as ProductRecord;
};

export const deleteProduct = async (productId: string): Promise<void> => {
  const { error } = await supabase.from("products").delete().eq("id", productId);
  if (error) throw error;
};

export const getCategoryLabel = (value: string): string =>
  SERVICE_CATEGORIES.find((c) => c.value === value)?.label ?? value;

export const getProductTypeLabel = (value: string): string =>
  PRODUCT_TYPES.find((p) => p.value === value)?.label ?? value;

export const searchMarketplace = async ({
  query,
  limit = 20,
}: {
  query: string;
  limit?: number;
}): Promise<{ services: ServiceRecord[]; products: ProductRecord[] }> => {
  const safe = query.trim().replace(/[%_]/g, " ").trim();
  if (!safe) return { services: [], products: [] };
  const wildcard = `%${safe}%`;

  const [{ data: sData, error: sErr }, { data: pData, error: pErr }] = await Promise.all([
    supabase
      .from("services")
      .select(serviceSelect)
      .or(`title.ilike.${wildcard},description.ilike.${wildcard}`)
      .order("created_at", { ascending: false })
      .limit(limit),
    supabase
      .from("products")
      .select(productSelect)
      .or(`title.ilike.${wildcard},description.ilike.${wildcard}`)
      .order("created_at", { ascending: false })
      .limit(limit),
  ]);

  if (sErr) throw sErr;
  if (pErr) throw pErr;

  return {
    services: (sData as ServiceRecord[]) ?? [],
    products: (pData as ProductRecord[]) ?? [],
  };
};
