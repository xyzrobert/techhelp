
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  name: z.string().min(2, "Name muss mindestens 2 Zeichen lang sein"),
  email: z.string().email("Ungültige Email-Adresse"),
  phone: z.string().min(5, "Bitte geben Sie eine gültige Telefonnummer ein"),
  problemType: z.enum(["hardware", "software", "network", "mobile", "other"]),
  problemDescription: z.string().min(10, "Bitte beschreiben Sie Ihr Problem genauer"),
  urgency: z.enum(["low", "medium", "high"]),
  preferredContactMethod: z.enum(["email", "phone", "whatsapp"]),
  previousAttempts: z.string().optional(),
  deviceInfo: z.string().min(2, "Bitte geben Sie Informationen zu Ihrem Gerät an"),
});

type FormData = z.infer<typeof formSchema>;

export default function ApplicationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      problemType: "hardware",
      problemDescription: "",
      urgency: "medium",
      preferredContactMethod: "email",
      previousAttempts: "",
      deviceInfo: "",
    },
  });

  async function onSubmit(data: FormData) {
    setIsSubmitting(true);
    setSubmitError("");
    
    try {
      const response = await fetch("/api/applications/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Ein Fehler ist aufgetreten");
      }
      
      setSubmitSuccess(true);
      form.reset();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Ein unbekannter Fehler ist aufgetreten");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitSuccess) {
    return (
      <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-6 text-center">
        <h3 className="text-xl font-semibold mb-2">Anfrage erfolgreich gesendet!</h3>
        <p className="mb-4">Vielen Dank für Ihre Anfrage. Ein technischer Helfer wird sich in Kürze bei Ihnen melden.</p>
        <Button onClick={() => setSubmitSuccess(false)} variant="outline">Neue Anfrage stellen</Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Technische Hilfe anfordern</h2>
      
      {submitError && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
          {submitError}
        </div>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Ihr vollständiger Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="ihre.email@beispiel.de" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefonnummer</FormLabel>
                  <FormControl>
                    <Input placeholder="+49 123 456789" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="problemType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Art des Problems</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Wählen Sie die Art des Problems" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="hardware">Hardware Problem</SelectItem>
                      <SelectItem value="software">Software Problem</SelectItem>
                      <SelectItem value="network">Netzwerk Problem</SelectItem>
                      <SelectItem value="mobile">Smartphone/Tablet Problem</SelectItem>
                      <SelectItem value="other">Sonstiges</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="problemDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Problembeschreibung</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Bitte beschreiben Sie Ihr technisches Problem so detailliert wie möglich..." 
                    className="min-h-[120px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="urgency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dringlichkeit</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Wählen Sie die Dringlichkeit" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="low">Niedrig (in den nächsten Tagen)</SelectItem>
                      <SelectItem value="medium">Mittel (in den nächsten 24 Stunden)</SelectItem>
                      <SelectItem value="high">Hoch (so schnell wie möglich)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="preferredContactMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bevorzugte Kontaktmethode</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Wählen Sie Ihre bevorzugte Kontaktmethode" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="phone">Telefon</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="previousAttempts"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bisherige Lösungsversuche (optional)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Was haben Sie bereits versucht, um das Problem zu lösen?" 
                    className="min-h-[80px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="deviceInfo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Geräteinformationen</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Gerät, Betriebssystem, Software-Version, etc." 
                    className="min-h-[80px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Wird gesendet..." : "Hilfe anfordern"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2 } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(1, "Name ist erforderlich"),
  email: z.string()
    .min(1, "Email ist erforderlich")
    .email("Ungültige Email-Adresse"),
  phone: z.string().min(1, "Telefonnummer ist erforderlich"),
  problemType: z.string().min(1, "Problemtyp ist erforderlich"),
  problemDescription: z.string()
    .min(10, "Problembeschreibung muss mindestens 10 Zeichen lang sein"),
  urgency: z.enum(["low", "medium", "high"], {
    required_error: "Bitte Dringlichkeit auswählen",
  }),
  preferredContactMethod: z.enum(["email", "phone", "either"], {
    required_error: "Bitte bevorzugte Kontaktmethode auswählen",
  }),
  previousAttempts: z.string().optional(),
  deviceInfo: z.string().min(1, "Geräteinformationen sind erforderlich"),
});

type FormValues = z.infer<typeof formSchema>;

export default function ApplicationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      problemType: "",
      problemDescription: "",
      urgency: "medium",
      preferredContactMethod: "either",
      previousAttempts: "",
      deviceInfo: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Fehler beim Senden der Bewerbung');
      }
      
      setSubmitSuccess(true);
      form.reset();
    } catch (error) {
      console.error('Application submission error:', error);
      setSubmitError(error instanceof Error ? error.message : 'Unbekannter Fehler');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <Alert className="bg-green-50 border-green-200">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-800">Bewerbung erfolgreich gesendet!</AlertTitle>
        <AlertDescription className="text-green-700">
          Vielen Dank für deine Bewerbung. Wir werden uns bald bei dir melden.
        </AlertDescription>
        <Button 
          className="mt-4"
          onClick={() => setSubmitSuccess(false)}
        >
          Neue Bewerbung erstellen
        </Button>
      </Alert>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {submitError && (
          <Alert variant="destructive">
            <AlertTitle>Fehler</AlertTitle>
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Persönliche Informationen</h3>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vollständiger Name</FormLabel>
                <FormControl>
                  <Input placeholder="Max Mustermann" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="max@beispiel.de" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefonnummer</FormLabel>
                  <FormControl>
                    <Input placeholder="+49 123 456789" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="preferredContactMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bevorzugte Kontaktmethode</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="email" id="email" />
                      <Label htmlFor="email">Email</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="phone" id="phone" />
                      <Label htmlFor="phone">Telefon</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="either" id="either" />
                      <Label htmlFor="either">Beides ist in Ordnung</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-lg font-medium">Problem Details</h3>

          <FormField
            control={form.control}
            name="problemType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Art des Problems</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Wähle eine Kategorie" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="hardware">Computer/Hardware Problem</SelectItem>
                    <SelectItem value="software">Software/Programm Problem</SelectItem>
                    <SelectItem value="network">Internet/Netzwerk Problem</SelectItem>
                    <SelectItem value="smartphone">Smartphone/Tablet Problem</SelectItem>
                    <SelectItem value="printer">Drucker/Scanner Problem</SelectItem>
                    <SelectItem value="other">Sonstiges</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="urgency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dringlichkeit</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Wie dringend ist dein Problem?" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Niedrig - Kann warten</SelectItem>
                    <SelectItem value="medium">Mittel - In einigen Tagen</SelectItem>
                    <SelectItem value="high">Hoch - So schnell wie möglich</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="problemDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Problembeschreibung</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Beschreibe dein Problem so genau wie möglich..."
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="previousAttempts"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bisherige Lösungsversuche (optional)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Was hast du bereits versucht, um das Problem zu lösen?"
                    className="min-h-[80px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="deviceInfo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Geräteinformationen</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="z.B. Windows 10 PC, iPhone 12, Samsung Galaxy S21..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button 
          type="submit" 
          className="w-full sm:w-auto"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Wird gesendet..." : "Bewerbung absenden"}
        </Button>
      </form>
    </Form>
  );
}
