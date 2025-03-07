import { Link } from "wouter";
import { Button } from "./button";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Avatar, AvatarFallback } from "./avatar";
import { User, LogOut, HelpCircle } from "lucide-react";

export function Nav() {
  const { user, isAuthenticated, logout } = useAuth();
  
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const startTutorial = () => {
    localStorage.removeItem('hasSeenOnboarding');
    window.location.href = '/';
  };

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <Link href="/">
          <span className="text-2xl font-bold cursor-pointer">klarfix</span>
        </Link>

        <div className="mx-auto flex items-center gap-4">
          {!isAuthenticated && (
            <Link href="/signup">
              <Button variant="ghost" className="text-lg">
                Als hilfe registrieren
              </Button>
            </Link>
          )}
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-primary"
            onClick={startTutorial}
            title="Tutorial starten"
          >
            <HelpCircle className="h-5 w-5" />
          </Button>
          
          <Link href="/search">
            <Button variant="ghost" className="text-lg">
              Aktive Helfer
            </Button>
          </Link>
          
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar>
                    <AvatarFallback>
                      {user?.username?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    {user?.username && (
                      <p className="font-medium">{user.username}</p>
                    )}
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <div className="flex items-center gap-2 w-full">
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <div className="flex items-center gap-2 w-full">
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button variant="outline" className="text-lg">
                Anmelden
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
