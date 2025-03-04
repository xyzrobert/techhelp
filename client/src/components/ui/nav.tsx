import { Link } from "wouter";
import { Button } from "./button";

export function Nav() {
  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <Link href="/">
          <a className="text-2xl font-bold">SmartFreund</a>
        </Link>

        <div className="flex items-center ml-auto">
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