import React from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ContactSuccessSlider } from "@/components/ui/contact-success-slider";
import type { User } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Phone, Calendar, Clock, MapPin, Star, ThumbsUp, Shield, ArrowDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const PHONE_REGEX = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

function StepArrow() {
  return (
    <div className="flex justify-center my-6">
      <ArrowDown className="h-12 w-12 text-green-600 animate-bounce" />
    </div>
  );
}

export default function HelperProfile({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [phoneError, setPhoneError] = React.useState("");
  const [showSuccessSlider, setShowSuccessSlider] = React.useState(false);
  const [showCallbackDialog, setShowCallbackDialog] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const { data: helper } = useQuery<User>({
    queryKey: ['helper', params.id],
    queryFn: async () => {
      const response = await fetch(`/api/helpers/${params.id}`);
      if (!response.ok) throw new Error('Failed to fetch helper');
      return response.json();
    },
  });

  const contactMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/contact/${params.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber }),
      });
      if (!response.ok) throw new Error("Failed to submit contact request");
      return response.json();
    },
    onSuccess: () => {
      setShowSuccessSlider(true);
      setPhoneNumber("");
      setPhoneError("");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const validatePhoneNumber = (number: string) => {
    if (!number) {
      return "Phone number is required";
    }
    if (!PHONE_REGEX.test(number)) {
      return "Please enter a valid phone number";
    }
    return "";
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhoneNumber(value);
    setPhoneError(validatePhoneNumber(value));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const error = validatePhoneNumber(phoneNumber);
    if (error) {
      setPhoneError(error);
      return;
    }
    contactMutation.mutate();
  };

  const handleCallbackRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/contact/${params.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber }),
      });

      if (!response.ok) throw new Error('Failed to submit request');

      toast({
        title: "Anfrage gesendet!",
        description: "Der Helfer wird Sie in Kürze zurückrufen.",
      });
      setShowCallbackDialog(false);
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Ihre Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es später erneut.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!helper) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Step 1: Helper Info */}
      <div className="relative mb-12">
        <div className="absolute -top-8 left-4 bg-green-600 text-white text-2xl font-bold rounded-full w-12 h-12 flex items-center justify-center">
          1
        </div>
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/3">
                <div className="w-40 h-40 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-6xl">👨‍💻</span>
                </div>
              </div>
              <div className="md:w-2/3 space-y-6">
                <h1 className="text-4xl font-bold">{helper?.name}</h1>
                <div className="flex items-center gap-3 text-lg">
                  <MapPin className="h-6 w-6" />
                  <span>München, 5km entfernt</span>
                </div>
                <div className="flex items-center gap-3 text-lg">
                  <Star className="h-6 w-6 text-yellow-400" />
                  <span className="font-medium">{helper?.rating || "Neu"}</span>
                  <span>(Noch keine Bewertungen)</span>
                </div>
                <div className="flex items-center gap-3 text-lg">
                  <ThumbsUp className="h-6 w-6 text-primary" />
                  <span>Verifizierter Helfer</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <StepArrow />

      {/* Step 2: Call to Action */}
      <div className="relative mb-12">
        <div className="absolute -top-8 left-4 bg-green-600 text-white text-2xl font-bold rounded-full w-12 h-12 flex items-center justify-center">
          2
        </div>
        <Card className="max-w-4xl mx-auto bg-green-50 border-green-200">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <h2 className="text-3xl font-semibold text-green-700">
                Möchten Sie technische Hilfe von {helper?.name}?
              </h2>
              <p className="text-xl text-green-600">
                Geben Sie Ihre Telefonnummer ein und {helper?.name} ruft Sie zurück!
              </p>
              <div className="flex flex-col items-center gap-4">
                <Button
                  size="lg"
                  className="text-2xl py-8 px-12 bg-[#22c55e] hover:bg-[#16a34a] text-white rounded-xl"
                  onClick={() => setShowCallbackDialog(true)}
                >
                  <Phone className="mr-3 h-8 w-8" />
                  Rückruf anfordern
                </Button>
                <p className="text-lg text-green-600 flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Kostenlos und unverbindlich
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <StepArrow />

      {/* Step 3: Expertise */}
      <div className="relative mb-12">
        <div className="absolute -top-8 left-4 bg-green-600 text-white text-2xl font-bold rounded-full w-12 h-12 flex items-center justify-center">
          3
        </div>
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-8">
            <h2 className="text-3xl font-semibold mb-8">Was {helper?.name} für Sie tun kann:</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {helper?.skills?.map((skill, index) => (
                <Card key={index} className="border-2">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      {getSkillIcon(skill)}
                      <h3 className="text-xl font-medium">{skill}</h3>
                    </div>
                    <ul className="space-y-3 text-lg">
                      {getSkillDetails(skill).map((detail, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">✓</span>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Privacy Info */}
      <Card className="max-w-4xl mx-auto bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Shield className="h-6 w-6 text-blue-600 mt-1" />
            <div>
              <h3 className="text-lg font-medium text-blue-800 mb-2">Ihre Daten sind bei uns sicher</h3>
              <ul className="space-y-2 text-blue-700">
                <li>• Ihre Telefonnummer wird nur an den ausgewählten Helfer weitergegeben</li>
                <li>• Keine versteckten Kosten oder Verpflichtungen</li>
                <li>• Sie können den Rückruf jederzeit ablehnen</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Callback Dialog */}
      <Dialog open={showCallbackDialog} onOpenChange={setShowCallbackDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-3xl mb-4">Rückruf anfordern</DialogTitle>
            <DialogDescription className="text-xl">
              Geben Sie Ihre Telefonnummer ein und {helper?.name} ruft Sie zurück
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCallbackRequest} className="space-y-6">
            <div className="space-y-4">
              <label htmlFor="phone" className="text-xl font-medium block">
                Ihre Telefonnummer
              </label>
              <input
                id="phone"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full p-6 text-xl border-2 rounded-lg"
                placeholder="0123 456789"
                required
              />
              <p className="text-lg text-muted-foreground">
                {helper?.name} wird Sie schnellstmöglich zurückrufen
              </p>
            </div>
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCallbackDialog(false)}
                className="text-lg py-6 px-8"
              >
                Abbrechen
              </Button>
              <Button
                type="submit"
                className="bg-[#22c55e] hover:bg-[#16a34a] text-white text-lg py-6 px-8"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Wird gesendet..." : "Rückruf anfordern"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <ContactSuccessSlider
        open={showSuccessSlider}
        onClose={() => setShowSuccessSlider(false)}
      />
    </div>
  );
}

function getSkillIcon(skill: string) {
  const icons: Record<string, JSX.Element> = {
    'Computer & Internet': <div className="text-4xl">💻</div>,
    'Smartphone & Tablet': <div className="text-4xl">📱</div>,
    'Smart Home': <div className="text-4xl">🏠</div>,
  };
  return icons[skill] || <div className="text-4xl">🔧</div>;
}

function getSkillDetails(skill: string): string[] {
  const skillDetails: Record<string, string[]> = {
    'Computer & Internet': [
      'Windows & Mac Einrichtung',
      'WLAN-Verbindung herstellen',
      'Drucker anschließen',
      'Programme installieren',
    ],
    'Smartphone & Tablet': [
      'iPhone & Android einrichten',
      'Apps installieren & erklären',
      'Fotos & Kontakte übertragen',
      'E-Mail einrichten',
    ],
    'Smart Home': [
      'Fernseher & Streaming einrichten',
      'Alexa & Google Assistant',
      'Intelligente Beleuchtung',
      'Videotelefonie einrichten',
    ],
  };

  return skillDetails[skill] || ['Allgemeine Unterstützung'];
} 