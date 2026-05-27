import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getUnreadCount, subscribeToMessages } from "@/lib/messages";
import { getMyOrders } from "@/lib/orders";
import { useLocation } from "react-router-dom";

export type UnreadCounts = {
  messages: number;
  orders: number;
};

export const useUnreadCounts = (): UnreadCounts => {
  const { user } = useAuth();
  const location = useLocation();
  const [messages, setMessages] = useState(0);
  const [orders, setOrders] = useState(0);
  const unsubRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!user) {
      setMessages(0);
      setOrders(0);
      return;
    }

    void getUnreadCount(user.id).then(setMessages);

    void getMyOrders(user.id).then(({ asBuyer, asSeller }) => {
      const active = new Set(["pending", "accepted"]);
      const count = [...asBuyer, ...asSeller].filter((o) => active.has(o.status)).length;
      setOrders(count);
    });

    unsubRef.current = subscribeToMessages(user.id, () => {
      if (!location.pathname.startsWith("/messages")) {
        setMessages((c) => c + 1);
      }
    });

    return () => {
      unsubRef.current?.();
      unsubRef.current = null;
    };
  }, [user?.id]);

  // Clear message badge when on the messages page
  useEffect(() => {
    if (location.pathname.startsWith("/messages")) {
      setMessages(0);
    }
  }, [location.pathname]);

  return { messages, orders };
};
