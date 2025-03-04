import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import type { Service, User } from "@shared/schema";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

export default function Search() {
  const [location] = useLocation();
  const category = new URLSearchParams(location.split('?')[1]).get("category");

  const { data: services } = useQuery<Service[]>({ 
    queryKey: ["/api/services/search", category],
  });

  const { data: helpers } = useQuery<User[]>({ 
    queryKey: ["/api/helpers/online"] 
  });

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Online Helpers</h2>
              <div className="space-y-4">
                {helpers?.map((helper) => (
                  <div key={helper.id} className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={`https://avatar.vercel.sh/${helper.username}`} />
                        <AvatarFallback>{helper.username[0]}</AvatarFallback>
                      </Avatar>
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                    </div>
                    <div>
                      <p className="font-medium">{helper.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {helper.rating} ★
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-6">
            Available Services
            {category && <Badge className="ml-2">{category}</Badge>}
          </h1>

          <div className="grid gap-6">
            {services?.map((service) => (
              <Card key={service.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        {service.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {service.description}
                      </p>
                      <Badge variant="secondary" className="mt-2">
                        {service.category}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">
                        ${(service.price / 100).toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground">per hour</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-secondary/5 p-6">
                  <Link href={`/book/${service.id}`}>
                    <Button className="ml-auto">Book Now</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}