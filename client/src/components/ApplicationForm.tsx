import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, AlertCircle } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(1, "Name ist erforderlich"),
  email: z.string().min(1, "Email ist erforderlich").email("Ungültige Email Adresse"),
  phone: z.string().min(1, "Telefonnummer ist erforderlich"),
  problemType: z.string().min(1, "Problemtyp ist erforderlich"),
  problemDescription: z.string().min(10, "Bitte beschreiben Sie Ihr Problem ausführlicher"),
  urgency: z.enum(["low", "medium", "high"]),
  preferredContactMethod: z.enum(["email", "phone", "either"]),
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
        <CheckCircle className="h-5 w-5 text-green-600" />
        <AlertTitle className="text-green-800">Bewerbung erfolgreich eingereicht!</AlertTitle>
        <AlertDescription className="text-green-700">
          Vielen Dank für Ihre Bewerbung. Wir werden uns so schnell wie möglich bei Ihnen melden.
        </AlertDescription>
        <Button 
          className="mt-4" 
          variant="outline" 
          onClick={() => setSubmitSuccess(false)}
        >
          Neue Bewerbung einreichen
        </Button>
      </Alert>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {submitError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Fehler</AlertTitle>
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Max Mustermann" {...field} />
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
                  <Input type="email" placeholder="max@example.com" {...field} />
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

          <FormField
            control={form.control}
            name="problemType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Problemtyp</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Wählen Sie einen Problemtyp" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="hardware">Hardware Problem</SelectItem>
                    <SelectItem value="software">Software Problem</SelectItem>
                    <SelectItem value="network">Netzwerkproblem</SelectItem>
                    <SelectItem value="printer">Druckerproblem</SelectItem>
                    <SelectItem value="email">Email Problem</SelectItem>
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
                  placeholder="Bitte beschreiben Sie Ihr Problem detailliert..." 
                  rows={4}
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
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Wählen Sie die Dringlichkeit" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Niedrig - kann warten</SelectItem>
                    <SelectItem value="medium">Mittel - sollte bald behoben werden</SelectItem>
                    <SelectItem value="high">Hoch - dringend</SelectItem>
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
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Wählen Sie die Kontaktmethode" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="phone">Telefon</SelectItem>
                    <SelectItem value="either">Beides</SelectItem>
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
                  placeholder="Haben Sie bereits versucht, das Problem zu lösen?" 
                  rows={3}
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
                  placeholder="Betriebssystem, Gerätetyp, Modell, etc." 
                  rows={2}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isSubmitting}
        >
          {isSubmitting ? "Wird gesendet..." : "Bewerbung absenden"}
        </Button>
      </form>
    </Form>
  );
}