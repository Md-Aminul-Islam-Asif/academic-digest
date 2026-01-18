import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { 
  Book, 
  LayoutDashboard, 
  ArrowLeftRight, 
  Calculator, 
  Percent, 
  MessageSquare, 
  LogOut,
  User,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navigation() {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  if (!user) return null;

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/books", label: "Books", icon: Book },
    { href: "/transactions", label: "Issue/Return", icon: ArrowLeftRight },
    { href: "/calendar", label: "Calendar", icon: Calendar },
    { href: "/fees", label: "Fees", icon: Calculator },
    { href: "/discounts", label: "Discounts", icon: Percent },
    { href: "/feedback", label: "Feedback", icon: MessageSquare },
  ];

  return (
    <nav className="glass-nav sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Book className="h-6 w-6 text-primary" />
          <span className="font-display font-bold text-xl tracking-tight hidden md:inline-block">
            UniLib System
          </span>
        </div>

        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location === link.href;
            return (
              <Link key={link.href} href={link.href}>
                <div 
                  className={`
                    px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 cursor-pointer
                    ${isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}
                  `}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </div>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">{user.name}</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => logout()}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div className="md:hidden flex overflow-x-auto px-4 py-2 gap-2 border-t border-border/20 no-scrollbar">
         {links.map((link) => {
            const Icon = link.icon;
            const isActive = location === link.href;
            return (
              <Link key={link.href} href={link.href}>
                <div 
                  className={`
                    flex-shrink-0 px-3 py-2 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1 cursor-pointer border
                    ${isActive 
                      ? "bg-primary text-primary-foreground border-primary" 
                      : "bg-background border-border text-muted-foreground hover:border-primary/50"}
                  `}
                >
                  <Icon className="h-3 w-3" />
                  {link.label}
                </div>
              </Link>
            );
          })}
      </div>
    </nav>
  );
}
