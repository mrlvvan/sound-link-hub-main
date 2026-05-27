import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MessageSquare, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { getConversations, type Conversation } from "@/lib/messages";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";

const Messages = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!user) { navigate("/login"); return; }

    const load = async () => {
      setLoading(true);
      try {
        const data = await getConversations(user.id);
        setConversations(data);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [user, navigate]);

  const filtered = conversations.filter((c) =>
    c.partnerDisplayName.toLowerCase().includes(search.toLowerCase()) ||
    c.partnerUsername.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-24 lg:pb-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-lg border-b border-border z-10 px-4 py-4 space-y-3">
        <h1 className="text-xl font-bold">Сообщения</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Поиск по диалогам..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="px-4 pt-2">
        {loading ? (
          <div className="space-y-3 pt-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-12 h-12 rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/3" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <MessageSquare className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="font-semibold text-lg">
              {search ? "Диалоги не найдены" : "Нет сообщений"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {search
                ? "Попробуйте другой запрос"
                : "Напишите кому-нибудь, открыв его профиль"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((conv) => (
              <Link
                key={conv.partnerId}
                to={`/messages/${conv.partnerId}`}
                className="flex items-center gap-3 py-3 hover:bg-muted/40 -mx-4 px-4 transition-colors"
              >
                <Avatar className="w-12 h-12 flex-shrink-0">
                  <AvatarImage src={conv.partnerAvatarUrl ?? undefined} />
                  <AvatarFallback className="bg-primary/20 font-semibold">
                    {conv.partnerDisplayName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-sm truncate">{conv.partnerDisplayName}</span>
                    <span className="text-[11px] text-muted-foreground flex-shrink-0">
                      {formatDistanceToNow(new Date(conv.lastAt), { addSuffix: true, locale: ru })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-0.5">
                    <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                    {conv.unreadCount > 0 && (
                      <Badge variant="default" className="flex-shrink-0 h-5 min-w-5 text-[11px] px-1.5">
                        {conv.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
