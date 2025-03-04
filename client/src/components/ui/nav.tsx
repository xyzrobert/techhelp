
import { Link } from "wouter";
import { Button } from "./button";

export function Nav() {
  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <Link href="/">
          <span className="text-2xl font-bold cursor-pointer">klarfix</span>
        </Link>

        <div className="mx-auto flex items-center">
          <Link href="/signup">
            <Button variant="ghost" className="text-lg">
              Studenten Registrierung
            </Button>
          </Link>
        </div>

        <div className="flex items-center">
          <Link href="/search">
            <Button variant="ghost" className="text-lg">
              Aktive Helfer
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
