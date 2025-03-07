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
import LiveChat from "@/components/LiveChat";
import { validatePhoneNumber } from "@/lib/validation";
import { ContactSuccessSlider } from "@/components/ui/contact-success-slider";
import { SearchGuide } from "@/components/ui/search-guide";

export default function Search() {
  const { toast } = useToast();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [showSuccessSlider, setShowSuccessSlider] = useState(false);
  const [location] = useLocation();
  const category = new URLSearchParams(location.split('?')[1] || '').get("category");
  const [activeChat, setActiveChat] = useState<number | null>(null);
  const [showGuide, setShowGuide] = useState(true);

  const { data: helpers } = useQuery<User[]>({ 
    queryKey: ["/api/helpers/online"] 
  });

  const { data: services } = useQuery<Service[]>({ 
    queryKey: ["/api/services/search", category],
    enabled: !!category
  });

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhoneNumber(value);
    setPhoneError(validatePhoneNumber(value));
  };

  const handleContact = async (helper: User) => {
    const error = validatePhoneNumber(phoneNumber);
    if (error) {
      setPhoneError(error);
      return;
    }

    try {
      await apiRequest("POST", `/api/contact/${helper.id}`, { phoneNumber });
      setShowSuccessSlider(true);
      setPhoneNumber("");
      setPhoneError("");
      toast({
        title: "Success",
        description: "Your contact request has been sent.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send contact request. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Verfügbare Helfer</h1>

        <SearchGuide />

        <div className="grid gap-6">
          {helpers?.map((helper) => (
            <Card key={helper.id} className="transition-all hover:border-green-200">
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
                          Antwortet in ~{Math.floor(Math.random() * 20) + 10} Min
                        </div>
                      </Badge>
                      <Badge variant="outline" className="bg-blue-50">Online</Badge>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="lg" variant="outline" className="text-lg py-6 px-8">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                          Rückruf anfordern
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="text-2xl mb-2">Kontakt mit {helper.name}</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                          <p className="mb-4 text-lg">
                            Bitte geben Sie Ihre Telefonnummer ein. {helper.name} wird Sie zurückrufen.
                          </p>
                          <div className="space-y-2">
                            <Input
                              placeholder="Ihre Telefonnummer"
                              value={phoneNumber}
                              onChange={handlePhoneChange}
                              type="tel"
                              className={`text-lg p-6 ${phoneError ? "border-red-500" : ""}`}
                              aria-invalid={!!phoneError}
                              aria-describedby={phoneError ? "phone-error" : undefined}
                            />
                            {phoneError && (
                              <p id="phone-error" className="text-sm text-red-500">
                                {phoneError}
                              </p>
                            )}
                          </div>
                          <Button 
                            onClick={() => handleContact(helper)}
                            className="w-full mt-4 text-lg py-6 bg-[#22c55e] hover:bg-[#16a34a] text-white"
                            disabled={!!phoneError}
                          >
                            Anfrage senden
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <ContactSuccessSlider
          open={showSuccessSlider}
          onClose={() => setShowSuccessSlider(false)}
        />

        {activeChat && (
          <LiveChat
            helperId={activeChat}
            helperName={helpers?.find(h => h.id === activeChat)?.name || ""}
            helperUsername={helpers?.find(h => h.id === activeChat)?.username || ""}
            onClose={() => setActiveChat(null)}
          />
        )}
      </div>
    </div>
  );
}