import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, MessageCircle, Star, ArrowRight } from "lucide-react";
import shelfspaceLogo from "@/assets/shelfspace-logo.png";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/books", { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-sm text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const features = [
    {
      icon: BookOpen,
      title: "Track Your Reads",
      description: "Organize books you're reading, completed, or on your wishlist in a clean database view.",
    },
    {
      icon: Star,
      title: "Rate & Review",
      description: "Rate books on a 5-star scale and keep notes on your reading journey.",
    },
    {
      icon: Users,
      title: "Connect with Readers",
      description: "Add friends, see what they're reading, and share recommendations.",
    },
    {
      icon: MessageCircle,
      title: "Real-time Chat",
      description: "Message friends about books in real-time. Discuss your latest reads.",
    },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5 border-b-2 border-foreground bg-background">
        <div className="flex items-center gap-3">
          <img src={shelfspaceLogo} alt="Shelfspace" className="h-8 w-8 object-contain" />
          <span className="text-xl font-bold tracking-tight text-foreground">Shelfspace</span>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => navigate("/auth")}
            className="border-2 border-foreground font-semibold shadow-[3px_3px_0px_hsl(var(--foreground))] hover:shadow-[1px_1px_0px_hsl(var(--foreground))] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          >
            Log in
          </Button>
          <Button
            onClick={() => navigate("/auth")}
            className="bg-foreground text-background font-semibold border-2 border-foreground shadow-[3px_3px_0px_hsl(var(--primary))] hover:shadow-[1px_1px_0px_hsl(var(--primary))] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          >
            Sign up <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-24 pb-20">
        <div className="inline-block border-2 border-foreground bg-background px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-foreground shadow-[4px_4px_0px_hsl(var(--foreground))] mb-8">
          Your reading life, organized
        </div>

        <img src={shelfspaceLogo} alt="Shelfspace" className="h-24 w-24 object-contain mb-6" />

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-foreground max-w-3xl leading-[1.1]">
          Shelfspace
        </h1>
        <p className="mt-4 text-lg sm:text-xl text-muted-foreground max-w-xl font-medium">
          A minimal workspace for readers. Track books, connect with friends, and discuss your reads — all in one clean, structured space.
        </p>

        <div className="mt-10 flex gap-4">
          <Button
            size="lg"
            onClick={() => navigate("/auth")}
            className="bg-foreground text-background text-base font-bold border-2 border-foreground shadow-[5px_5px_0px_hsl(var(--primary))] hover:shadow-[2px_2px_0px_hsl(var(--primary))] hover:translate-x-[3px] hover:translate-y-[3px] transition-all px-8"
          >
            Get Started <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => {
              document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="text-base font-bold border-2 border-foreground shadow-[5px_5px_0px_hsl(var(--foreground))] hover:shadow-[2px_2px_0px_hsl(var(--foreground))] hover:translate-x-[3px] hover:translate-y-[3px] transition-all px-8"
          >
            Learn more
          </Button>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 px-6 pb-24 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-foreground mb-8 border-b-2 border-foreground pb-3 inline-block">
          What you get
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {features.map((f) => (
            <div
              key={f.title}
              className="border-2 border-foreground bg-background p-6 shadow-[5px_5px_0px_hsl(var(--foreground))] hover:shadow-[2px_2px_0px_hsl(var(--foreground))] hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 border-2 border-foreground flex items-center justify-center bg-accent">
                  <f.icon className="h-5 w-5 text-foreground" />
                </div>
                <h3 className="font-bold text-foreground text-lg">{f.title}</h3>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t-2 border-foreground bg-background px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={shelfspaceLogo} alt="Shelfspace" className="h-5 w-5 object-contain" />
          <span className="text-sm font-semibold text-foreground">Shelfspace</span>
        </div>
        <p className="text-xs text-muted-foreground">Built for readers, by readers.</p>
      </footer>
    </div>
  );
};

export default Index;
