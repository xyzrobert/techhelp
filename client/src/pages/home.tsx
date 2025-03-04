import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import type { User } from "@shared/schema";
import { Link } from "wouter";

export default function Home() {
  const { data: onlineHelpers } = useQuery<User[]>({ 
    queryKey: ["/api/helpers/online"] 
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            Get Tech Help from Local Students
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Connect with tech-savvy students for affordable IT support. From hardware repairs to software troubleshooting, help is just a click away.
          </p>
          <Link href="/search">
            <Button size="lg" className="font-semibold">
              Find Help Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Active Helpers Section */}
      <section className="py-16 container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Active Helpers
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
          {onlineHelpers?.map((helper) => (
            <Link key={helper.id} href={`/search?helper=${helper.id}`}>
              <Card className="cursor-pointer hover:bg-accent transition-colors">
                <CardContent className="p-6 text-center">
                  <div className="relative inline-block">
                    <Avatar className="w-16 h-16 mx-auto">
                      <AvatarImage src={`https://avatar.vercel.sh/${helper.username}`} />
                      <AvatarFallback>{helper.username[0]}</AvatarFallback>
                    </Avatar>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                  </div>
                  <h3 className="font-medium mt-3">{helper.name}</h3>
                  <p className="text-sm text-muted-foreground">{helper.rating} ★</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}