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
    <aside className="w-60 h-screen border-r border-border bg-sidebar flex flex-col flex-shrink-0">
      <div className="p-4 border-b border-border">
        <h1 className="text-base font-semibold text-foreground flex items-center gap-2">
          <img src={shelfspaceLogo} alt="Shelfspace" className="h-6 w-6 object-contain" />
          Shelfspace
        </h1>
      </div>

      <nav className="flex-1 p-2 space-y-0.5">
        {navItems.map((item) => (
          <NavLink
            key={item.url}
            to={item.url}
            className="notion-sidebar-item"
            activeClassName="active"
          >
            <item.icon className="h-4 w-4" />
            <span>{item.title}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-2 mb-2 px-2">
          <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-foreground">
            {profile?.username?.charAt(0).toUpperCase() || "?"}
          </div>
          <span className="text-sm text-foreground truncate flex-1">{profile?.username || "User"}</span>
        </div>
        <button
          onClick={handleSignOut}
          className="notion-sidebar-item w-full text-destructive hover:bg-destructive/10"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}
