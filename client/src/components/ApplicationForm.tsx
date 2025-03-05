
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
