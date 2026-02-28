import { useState, useEffect } from "react";
import { AppLayout } from "@/components/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const { profile, user, refreshProfile } = useAuth();
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);
  const [bookCount, setBookCount] = useState(0);
  const [friendCount, setFriendCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (profile) {
      setUsername(profile.username);
      setBio(profile.bio || "");
    }
  }, [profile]);

  useEffect(() => {
    if (!user) return;
    supabase.from("books").select("id", { count: "exact", head: true }).eq("user_id", user.id).then(({ count }) => setBookCount(count || 0));
    supabase.from("friendships").select("id", { count: "exact", head: true })
      .eq("status", "accepted")
      .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)
      .then(({ count }) => setFriendCount(count || 0));
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({ username, bio }).eq("user_id", user.id);
    if (error) {
      toast({ title: "Failed to update profile", variant: "destructive" });
    } else {
      toast({ title: "Profile updated" });
      refreshProfile();
    }
    setSaving(false);
  };

  return (
    <AppLayout>
      <div className="p-6 max-w-lg">
        <h1 className="text-2xl font-black text-foreground mb-6">Profile</h1>

        <div className="border-2 border-foreground p-6 shadow-[5px_5px_0px_hsl(var(--foreground))] bg-background space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 border-2 border-foreground bg-accent flex items-center justify-center text-2xl font-black text-foreground">
              {profile?.username?.charAt(0).toUpperCase() || "?"}
            </div>
            <div>
              <p className="font-bold text-foreground text-lg">{profile?.username}</p>
              <p className="text-sm text-muted-foreground">{profile?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="border-2 border-foreground p-4 text-center shadow-[3px_3px_0px_hsl(var(--foreground))] bg-accent">
              <p className="text-3xl font-black text-foreground">{bookCount}</p>
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Books</p>
            </div>
            <div className="border-2 border-foreground p-4 text-center shadow-[3px_3px_0px_hsl(var(--foreground))] bg-accent">
              <p className="text-3xl font-black text-foreground">{friendCount}</p>
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Friends</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-sm font-bold text-foreground mb-1 block uppercase tracking-wider">Username</label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border-2 border-foreground focus:shadow-[2px_2px_0px_hsl(var(--foreground))] transition-shadow"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-foreground mb-1 block uppercase tracking-wider">Bio</label>
              <Textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder="Tell others about yourself..."
                className="border-2 border-foreground focus:shadow-[2px_2px_0px_hsl(var(--foreground))] transition-shadow"
              />
            </div>
            <Button
              onClick={handleSave}
              disabled={saving}
              size="sm"
              className="bg-foreground text-background font-bold border-2 border-foreground shadow-[3px_3px_0px_hsl(var(--primary))] hover:shadow-[1px_1px_0px_hsl(var(--primary))] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              {saving ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
