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
        <h1 className="text-xl font-semibold text-foreground mb-6">Profile</h1>

        <div className="border border-border rounded-lg p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center text-2xl font-semibold text-foreground">
              {profile?.username?.charAt(0).toUpperCase() || "?"}
            </div>
            <div>
              <p className="font-medium text-foreground">{profile?.username}</p>
              <p className="text-sm text-muted-foreground">{profile?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="notion-card text-center">
              <p className="text-2xl font-semibold text-foreground">{bookCount}</p>
              <p className="text-xs text-muted-foreground">Books</p>
            </div>
            <div className="notion-card text-center">
              <p className="text-2xl font-semibold text-foreground">{friendCount}</p>
              <p className="text-xs text-muted-foreground">Friends</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Username</label>
              <Input value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Bio</label>
              <Textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} placeholder="Tell others about yourself..." />
            </div>
            <Button onClick={handleSave} disabled={saving} size="sm">
              {saving ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
