import { Link, useLocation } from "wouter";
import { Button } from "./button";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import type { User } from "@shared/schema";
import { Settings } from "lucide-react";

export function Nav() {
  const [location] = useLocation();
  const { data: user } = useQuery<User>({ 
    queryKey: ["/api/users/1"], // Mock logged in user
    enabled: false 
  });

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <a className="text-2xl font-bold">TechBuddy</a>
          </Link>
        </div>

        <div className="flex items-center ml-auto space-x-4">
          <Link href="/search">
            <Button
              variant={location === "/search" ? "default" : "ghost"}
              className="text-sm"
            >
              Find Help
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                Manage Helpers
              </DropdownMenuItem>
              <DropdownMenuItem>
                View Reports
              </DropdownMenuItem>
              <DropdownMenuItem>
                Settings
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {user ? (
            <Link href="/profile">
              <Avatar className="cursor-pointer">
                <AvatarImage src={`https://avatar.vercel.sh/${user.username}`} />
                <AvatarFallback>{user.username[0]}</AvatarFallback>
              </Avatar>
            </Link>
          ) : (
            <Button size="sm">Sign In</Button>
          )}
        </div>
      </div>
    </nav>
  );
}