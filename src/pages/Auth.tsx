import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { BookOpen } from "lucide-react";
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
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="flex items-center justify-center gap-2 mb-8">
          <BookOpen className="h-8 w-8 text-foreground" />
          <h1 className="text-2xl font-semibold text-foreground">BookCircle</h1>
        </div>

        <div className="border border-border rounded-lg p-6 bg-card">
          <h2 className="text-lg font-medium mb-1 text-foreground">
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
              />
            )}
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Loading..." : isSignUp ? "Sign up" : "Sign in"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
