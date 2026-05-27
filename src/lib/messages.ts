import { supabase } from "@/lib/supabase";

export type DirectMessage = {
  id: string;
  sender_id: string;
  receiver_id: string;
  text: string;
  read_at: string | null;
  created_at: string;
  sender?: {
    id: string;
    username: string;
    display_name: string | null;
    avatar_url: string | null;
  } | null;
};

export type Conversation = {
  partnerId: string;
  partnerUsername: string;
  partnerDisplayName: string;
  partnerAvatarUrl: string | null;
  lastMessage: string;
  lastAt: string;
  unreadCount: number;
};

const dmSelect = `
  id, sender_id, receiver_id, text, read_at, created_at,
  sender:profiles!direct_messages_sender_id_fkey(id, username, display_name, avatar_url)
`;

export const getConversations = async (userId: string): Promise<Conversation[]> => {
  const { data, error } = await supabase
    .from("direct_messages")
    .select(`
      id, sender_id, receiver_id, text, read_at, created_at,
      sender:profiles!direct_messages_sender_id_fkey(id, username, display_name, avatar_url),
      receiver:profiles!direct_messages_receiver_id_fkey(id, username, display_name, avatar_url)
    `)
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .order("created_at", { ascending: false });

  if (error) throw error;

  const map = new Map<string, Conversation>();

  for (const row of (data ?? []) as Array<DirectMessage & { receiver?: DirectMessage["sender"] }>) {
    const isOwn = row.sender_id === userId;
    const partner = isOwn ? row.receiver : row.sender;
    if (!partner) continue;

    if (!map.has(partner.id)) {
      map.set(partner.id, {
        partnerId: partner.id,
        partnerUsername: partner.username,
        partnerDisplayName: partner.display_name || partner.username,
        partnerAvatarUrl: partner.avatar_url ?? null,
        lastMessage: row.text,
        lastAt: row.created_at,
        unreadCount: !isOwn && !row.read_at ? 1 : 0,
      });
    } else if (!isOwn && !row.read_at) {
      const conv = map.get(partner.id)!;
      conv.unreadCount += 1;
    }
  }

  return Array.from(map.values());
};

export const getMessagesWith = async (
  userId: string,
  partnerId: string
): Promise<DirectMessage[]> => {
  const { data, error } = await supabase
    .from("direct_messages")
    .select(dmSelect)
    .or(
      `and(sender_id.eq.${userId},receiver_id.eq.${partnerId}),and(sender_id.eq.${partnerId},receiver_id.eq.${userId})`
    )
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data as DirectMessage[]) ?? [];
};

export const sendDirectMessage = async (
  senderId: string,
  receiverId: string,
  text: string
): Promise<DirectMessage> => {
  const { data, error } = await supabase
    .from("direct_messages")
    .insert({ sender_id: senderId, receiver_id: receiverId, text })
    .select(dmSelect)
    .single();

  if (error) throw error;
  return data as DirectMessage;
};

export const markMessagesRead = async (userId: string, partnerId: string) => {
  await supabase
    .from("direct_messages")
    .update({ read_at: new Date().toISOString() })
    .eq("receiver_id", userId)
    .eq("sender_id", partnerId)
    .is("read_at", null);
};

export const getUnreadCount = async (userId: string): Promise<number> => {
  const { count, error } = await supabase
    .from("direct_messages")
    .select("id", { count: "exact", head: true })
    .eq("receiver_id", userId)
    .is("read_at", null);

  if (error) return 0;
  return count ?? 0;
};

export const subscribeToMessages = (
  userId: string,
  onNew: (msg: DirectMessage) => void
) => {
  const channel = supabase
    .channel(`dm-inbox-${userId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "direct_messages",
        filter: `receiver_id=eq.${userId}`,
      },
      (payload) => onNew(payload.new as DirectMessage)
    )
    .subscribe();

  return () => supabase.removeChannel(channel);
};
