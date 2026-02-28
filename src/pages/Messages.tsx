import { useState, useEffect, useRef } from "react";
import { AppLayout } from "@/components/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { format } from "date-fns";
import type { Tables } from "@/integrations/supabase/types";

type Profile = Tables<"profiles">;
type Message = Tables<"messages">;

export default function Messages() {
  const { user } = useAuth();
  const [friends, setFriends] = useState<Profile[]>([]);
  const [selectedFriend, setSelectedFriend] = useState<Profile | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch friends
  useEffect(() => {
    if (!user) return;
    const fetchFriends = async () => {
      const { data: friendships } = await supabase
        .from("friendships")
        .select("*")
        .eq("status", "accepted")
        .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`);

      if (!friendships?.length) return;

      const ids = friendships.map((f) =>
        f.requester_id === user.id ? f.addressee_id : f.requester_id
      );

      const { data: profiles } = await supabase
        .from("profiles")
        .select("*")
        .in("user_id", ids);

      setFriends(profiles || []);
    };
    fetchFriends();
  }, [user]);

  // Fetch messages for selected friend
  const fetchMessages = async () => {
    if (!user || !selectedFriend) return;
    const { data } = await supabase
      .from("messages")
      .select("*")
      .or(
        `and(sender_id.eq.${user.id},receiver_id.eq.${selectedFriend.user_id}),and(sender_id.eq.${selectedFriend.user_id},receiver_id.eq.${user.id})`
      )
      .order("created_at", { ascending: true });
    setMessages(data || []);

    await supabase
      .from("messages")
      .update({ read: true })
      .eq("sender_id", selectedFriend.user_id)
      .eq("receiver_id", user.id)
      .eq("read", false);
  };

  useEffect(() => {
    fetchMessages();
  }, [selectedFriend, user]);

  useEffect(() => {
    if (!user || !selectedFriend) return;
    const channel = supabase
      .channel("messages-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const msg = payload.new as Message;
          if (
            (msg.sender_id === user.id && msg.receiver_id === selectedFriend.user_id) ||
            (msg.sender_id === selectedFriend.user_id && msg.receiver_id === user.id)
          ) {
            setMessages((prev) => [...prev, msg]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, selectedFriend]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !user || !selectedFriend || sending) return;
    setSending(true);
    await supabase.from("messages").insert({
      sender_id: user.id,
      receiver_id: selectedFriend.user_id,
      message: newMessage.trim(),
    });
    setNewMessage("");
    setSending(false);
  };

  return (
    <AppLayout>
      <div className="flex h-screen">
        {/* Friends sidebar */}
        <div className="w-64 border-r-2 border-foreground flex flex-col flex-shrink-0 bg-background">
          <div className="p-3 border-b-2 border-foreground">
            <h2 className="text-sm font-black text-foreground uppercase tracking-wider">Messages</h2>
          </div>
          <div className="flex-1 overflow-auto">
            {friends.length === 0 ? (
              <p className="text-xs text-muted-foreground p-3 font-medium">Add friends to start chatting</p>
            ) : (
              friends.map((friend) => (
                <button
                  key={friend.id}
                  onClick={() => setSelectedFriend(friend)}
                  className={`w-full flex items-center gap-2 px-3 py-3 text-left transition-all border-b-2 border-foreground/10 ${
                    selectedFriend?.id === friend.id
                      ? "bg-accent border-l-4 !border-l-foreground"
                      : "hover:bg-accent/50"
                  }`}
                >
                  <div className="h-8 w-8 border-2 border-foreground bg-accent flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {friend.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-foreground truncate">{friend.username}</span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          {selectedFriend ? (
            <>
              <div className="p-3 border-b-2 border-foreground flex items-center gap-2 bg-background">
                <div className="h-8 w-8 border-2 border-foreground bg-accent flex items-center justify-center text-xs font-bold">
                  {selectedFriend.username.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-bold text-foreground">{selectedFriend.username}</span>
              </div>

              <div className="flex-1 overflow-auto p-4 space-y-2">
                {messages.map((msg) => {
                  const isMine = msg.sender_id === user?.id;
                  return (
                    <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[70%] px-3 py-2 text-sm border-2 border-foreground ${
                        isMine
                          ? "bg-foreground text-background shadow-[2px_2px_0px_hsl(var(--primary))]"
                          : "bg-background text-foreground shadow-[2px_2px_0px_hsl(var(--foreground))]"
                      }`}>
                        <p>{msg.message}</p>
                        <p className={`text-[10px] mt-1 ${isMine ? "text-background/60" : "text-muted-foreground"}`}>
                          {format(new Date(msg.created_at), "h:mm a")}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-3 border-t-2 border-foreground flex gap-2 bg-background">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  className="border-2 border-foreground focus:shadow-[2px_2px_0px_hsl(var(--foreground))] transition-shadow"
                />
                <Button
                  size="sm"
                  onClick={sendMessage}
                  disabled={sending || !newMessage.trim()}
                  className="bg-foreground text-background border-2 border-foreground shadow-[2px_2px_0px_hsl(var(--primary))] hover:shadow-[0px_0px_0px] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm font-medium">
              Select a friend to start chatting
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
