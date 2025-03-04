import { useQuery } from "@tanstack/react-query";
import type { Service, User } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Search() {
  const { toast } = useToast();
  const [phoneNumber, setPhoneNumber] = useState("");

  const { data: helpers } = useQuery<User[]>({ 
    queryKey: ["/api/helpers/online"] 
  });

  const handleContact = async (helper: User) => {
    try {
      await apiRequest("POST", `/api/contact/${helper.id}`, { phoneNumber });
      toast({
        title: "Anfrage gesendet",
        description: "Der Helfer wird sich bald bei Ihnen melden.",
      });
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Bitte versuchen Sie es später erneut.",
        variant: "destructive",
      });
    }
  };

  const { data: services } = useQuery<Service[]>({ 
    queryKey: ["/api/services/search", category],
  });

  const [location] = useLocation();
  const category = new URLSearchParams(location.split('?')[1]).get("category");


  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Verfügbare Helfer</h1>

      <div className="grid gap-6">
        {helpers?.map((helper) => (
          <Card key={helper.id}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={`https://avatar.vercel.sh/${helper.username}`} />
                    <AvatarFallback>{helper.username[0]}</AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{helper.name}</h3>
                  <p className="text-muted-foreground mb-2">{helper.bio}</p>
                  <div className="flex gap-2">
                    {helper.skills?.map((skill) => (
                      <Badge key={skill} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="lg">Kontaktieren</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Helfer kontaktieren</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                      <p className="mb-4">
                        Bitte geben Sie Ihre Telefonnummer ein. {helper.name} wird Sie zurückrufen.
                      </p>
                      <Input
                        placeholder="Ihre Telefonnummer"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        type="tel"
                        className="mb-4"
                      />
                      <Button 
                        onClick={() => handleContact(helper)}
                        className="w-full"
                      >
                        Anfrage senden
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <h1 className="text-3xl font-bold mb-6 mt-8">
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
  );
}