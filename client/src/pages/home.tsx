import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="text-center px-4">
        <h1 className="text-4xl sm:text-5xl font-bold mb-6">
          SmartFreund
        </h1>
        <p className="text-xl text-muted-foreground mb-12 max-w-2xl">
          Technische Hilfe von vertrauenswürdigen Helfern in Ihrer Nähe
        </p>
        <Link href="/search">
          <Button size="lg" className="text-xl py-6 px-12 rounded-full">
            Hilfe finden
          </Button>
        </Link>
      </div>
    </div>
  );
}