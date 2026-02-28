import { Users, MessageCircle, User, LogOut, Search, BookOpen } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import shelfspaceLogo from "@/assets/shelfspace-logo.png";

const navItems = [
  { title: "My Books", url: "/books", icon: BookOpen },
  { title: "Search Books", url: "/search", icon: Search },
  { title: "Friends", url: "/friends", icon: Users },
  { title: "Messages", url: "/messages", icon: MessageCircle },
  { title: "Profile", url: "/profile", icon: User },
];

export function AppSidebar() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <aside className="w-60 h-screen border-r-2 border-foreground bg-background flex flex-col flex-shrink-0">
      <div className="p-4 border-b-2 border-foreground">
        <h1 className="text-lg font-black text-foreground flex items-center gap-3">
          <img src={shelfspaceLogo} alt="Shelfspace" className="h-10 w-10 object-contain" />
          Shelfspace
        </h1>
      </div>

      <nav className="flex-1 p-2 space-y-0.5">
        {navItems.map((item) => (
          <NavLink
            key={item.url}
            to={item.url}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent border-2 border-transparent hover:border-foreground hover:shadow-[2px_2px_0px_hsl(var(--foreground))] transition-all cursor-pointer"
            activeClassName="bg-accent text-foreground border-2 !border-foreground shadow-[2px_2px_0px_hsl(var(--foreground))]"
          >
            <item.icon className="h-4 w-4" />
            <span>{item.title}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t-2 border-foreground">
        <div className="flex items-center gap-2 mb-2 px-2">
          <div className="h-8 w-8 border-2 border-foreground bg-accent flex items-center justify-center text-xs font-bold text-foreground">
            {profile?.username?.charAt(0).toUpperCase() || "?"}
          </div>
          <span className="text-sm font-medium text-foreground truncate flex-1">{profile?.username || "User"}</span>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 px-3 py-2 w-full text-sm font-medium text-destructive hover:bg-destructive/10 border-2 border-transparent hover:border-destructive transition-all"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}
