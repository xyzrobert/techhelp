import { Link } from "wouter";
import { Button } from "./button";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import type { User } from "@shared/schema";
import { Settings } from "lucide-react";

export function Nav() {
  const { data: user } = useQuery<User>({ 
    queryKey: ["/api/users/1"],
    enabled: false 
  });

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <Link href="/">
          <a className="text-2xl font-bold">SmartFreund</a>
        </Link>

        <div className="flex items-center ml-auto space-x-4">
          <Link href="/search">
            <Button variant="ghost" className="text-sm">
              Aktive Helfer
            </Button>
          </Link>

          {user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Settings className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <Link href="/profile">
                    <DropdownMenuItem>
                      Mein Profil
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/admin">
                    <DropdownMenuItem>
                      Helfer verwalten
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuContent>
              </DropdownMenu>
              <Link href="/profile">
                <Avatar className="cursor-pointer">
                  <AvatarImage src={`https://avatar.vercel.sh/${user.username}`} />
                  <AvatarFallback>{user.username[0]}</AvatarFallback>
                </Avatar>
              </Link>
            </>
          ) : (
            <Button size="sm">Anmelden</Button>
          )}
        </div>
      </div>
    </nav>
  );
}