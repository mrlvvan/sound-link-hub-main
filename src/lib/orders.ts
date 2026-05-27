import { supabase } from "@/lib/supabase";

export type OrderStatus = "pending" | "accepted" | "paid" | "completed" | "cancelled";
export type OrderItemType = "beat" | "service" | "product";

export type OrderRecord = {
  id: string;
  buyer_id: string;
  seller_id: string;
  item_type: OrderItemType;
  item_id: string;
  amount: number;
  status: OrderStatus;
  license_id: string | null;
  license_name: string | null;
  created_at: string;
  updated_at: string;
  buyer?: { id: string; username: string; display_name: string | null; avatar_url: string | null } | null;
  seller?: { id: string; username: string; display_name: string | null; avatar_url: string | null } | null;
  item_title?: string;
};

export type OrderMessage = {
  id: string;
  order_id: string;
  sender_id: string;
  text: string;
  created_at: string;
  sender?: { id: string; username: string; display_name: string | null; avatar_url: string | null } | null;
};

const orderSelect = `
  id, buyer_id, seller_id, item_type, item_id, amount, status, license_id, license_name, created_at, updated_at,
  buyer:profiles!orders_buyer_id_fkey(id, username, display_name, avatar_url),
  seller:profiles!orders_seller_id_fkey(id, username, display_name, avatar_url)
`;

const msgSelect = `
  id, order_id, sender_id, text, created_at,
  sender:profiles!order_messages_sender_id_fkey(id, username, display_name, avatar_url)
`;

export const createOrder = async (input: {
  buyerId: string;
  sellerId: string;
  itemType: OrderItemType;
  itemId: string;
  amount: number;
  licenseId?: string;
  licenseName?: string;
}): Promise<OrderRecord> => {
  const { data, error } = await supabase
    .from("orders")
    .insert({
      buyer_id: input.buyerId,
      seller_id: input.sellerId,
      item_type: input.itemType,
      item_id: input.itemId,
      amount: input.amount,
      ...(input.licenseId && { license_id: input.licenseId }),
      ...(input.licenseName && { license_name: input.licenseName }),
    })
    .select(orderSelect)
    .single();

  if (error) throw error;
  return data as OrderRecord;
};

export const getMyOrders = async (userId: string): Promise<{
  asBuyer: OrderRecord[];
  asSeller: OrderRecord[];
}> => {
  const [{ data: buyerData, error: e1 }, { data: sellerData, error: e2 }] = await Promise.all([
    supabase
      .from("orders")
      .select(orderSelect)
      .eq("buyer_id", userId)
      .order("created_at", { ascending: false }),
    supabase
      .from("orders")
      .select(orderSelect)
      .eq("seller_id", userId)
      .order("created_at", { ascending: false }),
  ]);

  if (e1) throw e1;
  if (e2) throw e2;

  return {
    asBuyer: (buyerData as OrderRecord[]) ?? [],
    asSeller: (sellerData as OrderRecord[]) ?? [],
  };
};

export const getOrderById = async (orderId: string): Promise<OrderRecord | null> => {
  const { data, error } = await supabase
    .from("orders")
    .select(orderSelect)
    .eq("id", orderId)
    .maybeSingle();

  if (error) throw error;
  return (data as OrderRecord | null) ?? null;
};

export const updateOrderStatus = async (
  orderId: string,
  status: OrderStatus
): Promise<void> => {
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId);

  if (error) throw error;
};

export const getOrderMessages = async (orderId: string): Promise<OrderMessage[]> => {
  const { data, error } = await supabase
    .from("order_messages")
    .select(msgSelect)
    .eq("order_id", orderId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data as OrderMessage[]) ?? [];
};

export const sendOrderMessage = async (
  orderId: string,
  senderId: string,
  text: string
): Promise<OrderMessage> => {
  const { data, error } = await supabase
    .from("order_messages")
    .insert({ order_id: orderId, sender_id: senderId, text })
    .select(msgSelect)
    .single();

  if (error) throw error;
  return data as OrderMessage;
};

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Ожидает",
  accepted: "Принят",
  paid: "Оплачен",
  completed: "Завершён",
  cancelled: "Отменён",
};

export const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "bg-yellow-500/20 text-yellow-600 border-yellow-500/30",
  accepted: "bg-blue-500/20 text-blue-600 border-blue-500/30",
  paid: "bg-cyan-500/20 text-cyan-600 border-cyan-500/30",
  completed: "bg-green-500/20 text-green-600 border-green-500/30",
  cancelled: "bg-red-500/20 text-red-500 border-red-500/30",
};

export const ITEM_TYPE_LABELS: Record<OrderItemType, string> = {
  beat: "Бит",
  service: "Услуга",
  product: "Товар",
};
