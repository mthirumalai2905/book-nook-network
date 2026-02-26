import { useState, useEffect } from "react";
import { AppLayout } from "@/components/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Search, UserPlus, UserMinus, Check, X } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Profile = Tables<"profiles">;
type Friendship = Tables<"friendships">;

interface FriendWithProfile extends Friendship {
  profile?: Profile;
}

export default function Friends() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Profile[]>([]);
  const [friends, setFriends] = useState<FriendWithProfile[]>([]);
  const [pendingReceived, setPendingReceived] = useState<FriendWithProfile[]>([]);
  const [pendingSent, setPendingSent] = useState<FriendWithProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFriendships = async () => {
    if (!user) return;
    const { data: friendships } = await supabase
      .from("friendships")
      .select("*")
      .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`);

    if (!friendships) return;

    // Get all relevant user IDs
    const userIds = new Set<string>();
    friendships.forEach((f) => {
      userIds.add(f.requester_id === user.id ? f.addressee_id : f.requester_id);
    });

    const { data: profiles } = await supabase
      .from("profiles")
      .select("*")
      .in("user_id", Array.from(userIds));

    const profileMap = new Map(profiles?.map((p) => [p.user_id, p]) || []);

    const enriched = friendships.map((f) => ({
      ...f,
      profile: profileMap.get(f.requester_id === user.id ? f.addressee_id : f.requester_id),
    }));

    setFriends(enriched.filter((f) => f.status === "accepted"));
    setPendingReceived(enriched.filter((f) => f.status === "pending" && f.addressee_id === user.id));
    setPendingSent(enriched.filter((f) => f.status === "pending" && f.requester_id === user.id));
    setLoading(false);
  };

  useEffect(() => {
    fetchFriendships();
  }, [user]);

  const searchUsers = async () => {
    if (!searchQuery.trim() || !user) return;
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .ilike("username", `%${searchQuery}%`)
      .neq("user_id", user.id)
      .limit(10);
    setSearchResults(data || []);
  };

  const sendRequest = async (addresseeId: string) => {
    if (!user) return;
    const { error } = await supabase.from("friendships").insert({
      requester_id: user.id,
      addressee_id: addresseeId,
    });
    if (error) {
      toast({ title: error.message.includes("duplicate") ? "Request already sent" : "Failed to send request", variant: "destructive" });
    } else {
      toast({ title: "Friend request sent!" });
      fetchFriendships();
    }
  };

  const respondRequest = async (id: string, accept: boolean) => {
    if (accept) {
      await supabase.from("friendships").update({ status: "accepted" }).eq("id", id);
      toast({ title: "Friend request accepted!" });
    } else {
      await supabase.from("friendships").delete().eq("id", id);
      toast({ title: "Request declined" });
    }
    fetchFriendships();
  };

  const removeFriend = async (id: string) => {
    await supabase.from("friendships").delete().eq("id", id);
    toast({ title: "Friend removed" });
    fetchFriendships();
  };

  return (
    <AppLayout>
      <div className="p-6 max-w-2xl">
        <h1 className="text-xl font-semibold text-foreground mb-6">Friends</h1>

        {/* Search users */}
        <div className="mb-8">
          <h2 className="text-sm font-medium text-foreground mb-2">Find people</h2>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchUsers()}
                className="pl-9"
              />
            </div>
            <Button size="sm" variant="outline" onClick={searchUsers}>Search</Button>
          </div>
          {searchResults.length > 0 && (
            <div className="mt-2 border border-border rounded-md divide-y divide-border">
              {searchResults.map((p) => (
                <div key={p.id} className="flex items-center justify-between px-4 py-2">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                      {p.username.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm text-foreground">{p.username}</span>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => sendRequest(p.user_id)}>
                    <UserPlus className="h-3.5 w-3.5 mr-1" /> Add
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending received */}
        {pendingReceived.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-medium text-foreground mb-2">Pending Requests</h2>
            <div className="border border-border rounded-md divide-y divide-border">
              {pendingReceived.map((f) => (
                <div key={f.id} className="flex items-center justify-between px-4 py-2">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                      {f.profile?.username?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <span className="text-sm text-foreground">{f.profile?.username}</span>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" onClick={() => respondRequest(f.id, true)}>
                      <Check className="h-3.5 w-3.5" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => respondRequest(f.id, false)}>
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Friends list */}
        <div>
          <h2 className="text-sm font-medium text-foreground mb-2">
            Your Friends ({friends.length})
          </h2>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : friends.length === 0 ? (
            <div className="border border-dashed border-border rounded-lg p-8 text-center">
              <p className="text-muted-foreground text-sm">No friends yet. Search for people above!</p>
            </div>
          ) : (
            <div className="border border-border rounded-md divide-y divide-border">
              {friends.map((f) => (
                <div key={f.id} className="flex items-center justify-between px-4 py-2">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                      {f.profile?.username?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <span className="text-sm text-foreground">{f.profile?.username}</span>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => removeFriend(f.id)} className="text-muted-foreground hover:text-destructive">
                    <UserMinus className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
