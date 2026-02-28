import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import shelfspaceLogo from "@/assets/shelfspace-logo.png";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        if (!username.trim()) {
          toast({ title: "Username is required", variant: "destructive" });
          setLoading(false);
          return;
        }
        const { error } = await signUp(email, password, username);
        if (error) throw error;
        toast({ title: "Account created! Check your email to verify." });
      } else {
        const { error } = await signIn(email, password);
        if (error) throw error;
        navigate("/books");
      }
    } catch (err: any) {
      toast({ title: err.message || "Authentication failed", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="w-full max-w-sm animate-fade-in relative z-10">
        <div className="flex flex-col items-center gap-3 mb-8">
          <img src={shelfspaceLogo} alt="Shelfspace" className="h-16 w-16 object-contain" />
          <h1 className="text-3xl font-black text-foreground">Shelfspace</h1>
        </div>

        <div className="border-2 border-foreground p-6 bg-card shadow-[5px_5px_0px_hsl(var(--foreground))]">
          <h2 className="text-lg font-bold mb-1 text-foreground">
            {isSignUp ? "Create an account" : "Welcome back"}
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            {isSignUp ? "Sign up to start tracking your reading" : "Sign in to your account"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            {isSignUp && (
              <Input
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="border-2 border-foreground focus:shadow-[2px_2px_0px_hsl(var(--foreground))] transition-shadow"
              />
            )}
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-2 border-foreground focus:shadow-[2px_2px_0px_hsl(var(--foreground))] transition-shadow"
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="border-2 border-foreground focus:shadow-[2px_2px_0px_hsl(var(--foreground))] transition-shadow"
            />
            <Button
              type="submit"
              className="w-full bg-foreground text-background font-bold border-2 border-foreground shadow-[3px_3px_0px_hsl(var(--primary))] hover:shadow-[1px_1px_0px_hsl(var(--primary))] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
              disabled={loading}
            >
              {loading ? "Loading..." : isSignUp ? "Sign up" : "Sign in"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-muted-foreground hover:text-foreground font-medium transition-colors"
            >
              {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
