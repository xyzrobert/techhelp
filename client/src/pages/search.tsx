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
import { useLocation } from "wouter";
import { LiveChat } from "@/components/LiveChat";

export default function Search() {
  const { toast } = useToast();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [location] = useLocation();
  const category = new URLSearchParams(location.split('?')[1] || '').get("category");
  const [activeChat, setActiveChat] = useState<number | null>(null);

  const { data: helpers } = useQuery<User[]>({ 
    queryKey: ["/api/helpers/online"] 
  });

  const { data: services } = useQuery<Service[]>({ 
    queryKey: ["/api/services/search", category],
    enabled: !!category
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
                    <Badge variant="outline" className="bg-green-50">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        Antwortet in ca. {Math.floor(Math.random() * 20) + 10} min
                      </div>
                    </Badge>
                    <Badge variant="outline" className="bg-blue-50">Online</Badge>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="lg" variant="outline">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                        Anrufen lassen
                      </Button>
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
                  
                  <Button size="lg" onClick={() => setActiveChat(helper.id)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                    Live Chat
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Live Chat */}
      {activeChat !== null && helpers && (
        <LiveChat
          helperId={activeChat}
          helperName={helpers.find(h => h.id === activeChat)?.name || "Helfer"}
          helperUsername={helpers.find(h => h.id === activeChat)?.username || "helfer"}
          onClose={() => setActiveChat(null)}
        />
      )}

      {/* Only show services section if category is selected */}
      {category && (
        <>
          <h2 className="text-3xl font-bold mb-6 mt-8">
            Verfügbare Dienste
            <Badge className="ml-2">{category}</Badge>
          </h2>

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
                      <p className="text-sm text-muted-foreground">pro Stunde</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}