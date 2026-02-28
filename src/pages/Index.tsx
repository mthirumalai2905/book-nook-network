import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, MessageCircle, Star, ArrowRight, Search, Zap, Shield, Globe } from "lucide-react";
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
    {
      icon: Search,
      title: "Discover Books",
      description: "Search millions of books via Google Books. Covers, authors, and descriptions fetched instantly.",
    },
    {
      icon: Zap,
      title: "Grid or Table View",
      description: "Switch between table and grid layouts. Your preference is saved automatically.",
    },
  ];

  const stats = [
    { value: "10M+", label: "Books Available" },
    { value: "∞", label: "Bookshelves" },
    { value: "24/7", label: "Real-time Chat" },
    { value: "100%", label: "Free to Use" },
  ];

  const steps = [
    { step: "01", title: "Create your account", description: "Sign up in seconds with just an email and password." },
    { step: "02", title: "Search & add books", description: "Find any book using Google Books and add it to your shelf." },
    { step: "03", title: "Connect with friends", description: "Send friend requests, chat, and share recommendations." },
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
          <img src={shelfspaceLogo} alt="Shelfspace" className="h-12 w-12 object-contain" />
          <span className="text-2xl font-black tracking-tight text-foreground">Shelfspace</span>
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
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-28 pb-24">
        <div className="inline-block border-2 border-foreground bg-background px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-foreground shadow-[4px_4px_0px_hsl(var(--foreground))] mb-10">
          Your reading life, organized
        </div>

        <img src={shelfspaceLogo} alt="Shelfspace" className="h-36 w-36 object-contain mb-8" />

        <h1 className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tight text-foreground max-w-4xl leading-[1.05]">
          Shelfspace
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl font-medium leading-relaxed">
          A minimal workspace for readers. Track books, connect with friends, and discuss your reads — all in one clean, structured space.
        </p>

        <div className="mt-12 flex gap-4">
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

      {/* Stats */}
      <section className="relative z-10 px-6 pb-20 max-w-5xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="border-2 border-foreground bg-background p-6 text-center shadow-[4px_4px_0px_hsl(var(--foreground))]"
            >
              <p className="text-3xl sm:text-4xl font-black text-foreground">{s.value}</p>
              <p className="text-sm text-muted-foreground font-medium mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 px-6 pb-24 max-w-5xl mx-auto">
        <h2 className="text-3xl font-black text-foreground mb-10 border-b-2 border-foreground pb-3 inline-block">
          What you get
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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

      {/* How it works */}
      <section className="relative z-10 px-6 pb-24 max-w-5xl mx-auto">
        <h2 className="text-3xl font-black text-foreground mb-10 border-b-2 border-foreground pb-3 inline-block">
          How it works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {steps.map((s) => (
            <div
              key={s.step}
              className="border-2 border-foreground bg-background p-6 shadow-[5px_5px_0px_hsl(var(--foreground))] relative"
            >
              <span className="text-5xl font-black text-foreground/10 absolute top-4 right-4">{s.step}</span>
              <h3 className="font-bold text-foreground text-lg mb-2">{s.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 pb-24 max-w-3xl mx-auto text-center">
        <div className="border-2 border-foreground bg-background p-12 shadow-[6px_6px_0px_hsl(var(--foreground))]">
          <img src={shelfspaceLogo} alt="Shelfspace" className="h-20 w-20 object-contain mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-black text-foreground mb-4">
            Ready to organize your reading?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Join Shelfspace today. Track your books, connect with friends, and never lose track of a recommendation again.
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/auth")}
            className="bg-foreground text-background text-base font-bold border-2 border-foreground shadow-[5px_5px_0px_hsl(var(--primary))] hover:shadow-[2px_2px_0px_hsl(var(--primary))] hover:translate-x-[3px] hover:translate-y-[3px] transition-all px-10"
          >
            Create your shelf <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t-2 border-foreground bg-background px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={shelfspaceLogo} alt="Shelfspace" className="h-8 w-8 object-contain" />
          <span className="text-sm font-bold text-foreground">Shelfspace</span>
        </div>
        <p className="text-xs text-muted-foreground">Built for readers, by readers.</p>
      </footer>
    </div>
  );
};

export default Index;
