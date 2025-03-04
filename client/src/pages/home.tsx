import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import type { User } from "@shared/schema";
import { Link } from "wouter";
import { Monitor, Smartphone, Network, HardDrive, Wrench } from "lucide-react";

const categories = [
  { icon: Monitor, label: "Software", slug: "software" },
  { icon: HardDrive, label: "Hardware", slug: "hardware" },
  { icon: Network, label: "Network", slug: "network" },
  { icon: Smartphone, label: "Mobile", slug: "mobile" },
  { icon: Wrench, label: "Other", slug: "other" },
];

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

      {/* Categories */}
      <section className="py-16 container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          What do you need help with?
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link key={cat.slug} href={`/search?category=${cat.slug}`}>
              <Card className="cursor-pointer hover:bg-accent transition-colors">
                <CardContent className="p-6 text-center">
                  <cat.icon className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="font-medium">{cat.label}</h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Online Helpers */}
      <section className="py-16 bg-secondary/10">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Online Helpers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {onlineHelpers?.slice(0, 4).map((helper) => (
              <Card key={helper.id}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={`https://avatar.vercel.sh/${helper.username}`} />
                      <AvatarFallback>{helper.username[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{helper.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {helper.skills?.join(", ")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}