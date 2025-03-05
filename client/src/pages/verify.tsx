
import { useState } from "react";
import { useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertCircle } from "lucide-react";

const formSchema = z.object({
  routerSetup: z.enum(["a", "b", "c", "d"], {
    required_error: "Bitte wähle eine Antwort",
  }),
  wpsExplanation: z.string().min(20, {
    message: "Die Erklärung sollte mindestens 20 Zeichen lang sein",
  }),
  firewallSetting: z.enum(["a", "b", "c", "d"], {
    required_error: "Bitte wähle eine Antwort",
  }),
  windowsIssue: z.enum(["a", "b", "c", "d"], {
    required_error: "Bitte wähle eine Antwort",
  }),
  cableTypes: z.enum(["a", "b", "c", "d"], {
    required_error: "Bitte wähle eine Antwort",
  }),
  technicalExperience: z.string().min(50, {
    message: "Bitte beschreibe deine Erfahrung ausführlicher (mind. 50 Zeichen)",
  }),
  toolsUsed: z.string().min(10, {
    message: "Bitte gib mindestens ein Tool an, mit dem du gearbeitet hast",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function VerifyPage() {
  const [, navigate] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      wpsExplanation: "",
      technicalExperience: "",
      toolsUsed: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/verifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Verifizierung fehlgeschlagen");
      }

      setSuccess(true);
      setTimeout(() => {
        navigate("/profile");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Ein Fehler ist aufgetreten");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container max-w-3xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Helfer-Verifizierung</CardTitle>
          <CardDescription>
            Beantworte die folgenden technischen Fragen, um dich als qualifizierter Helfer zu verifizieren.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Fehler</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-4 bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertTitle>Erfolgreich eingereicht</AlertTitle>
              <AlertDescription>
                Deine Verifizierung wurde erfolgreich eingereicht und wird geprüft.
              </AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div>
                <h3 className="text-lg font-medium">Router & Netzwerk-Wissen</h3>
                <Separator className="my-2" />
                
                <FormField
                  control={form.control}
                  name="routerSetup"
                  render={({ field }) => (
                    <FormItem className="my-6">
                      <FormLabel>Welche der folgenden IP-Adressen wird üblicherweise als Standard-Gateway-Adresse für Heimnetzwerke verwendet?</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="a" />
                            </FormControl>
                            <FormLabel className="font-normal">172.16.0.1</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="b" />
                            </FormControl>
                            <FormLabel className="font-normal">10.0.0.1</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="c" />
                            </FormControl>
                            <FormLabel className="font-normal">192.168.1.1</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="d" />
                            </FormControl>
                            <FormLabel className="font-normal">127.0.0.1</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="wpsExplanation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Erkläre kurz, was WPS ist und wie es funktioniert.</FormLabel>
                      <FormControl>
                        <Textarea placeholder="WPS steht für..." {...field} className="min-h-[100px]" />
                      </FormControl>
                      <FormDescription>
                        Beschreibe die Funktion und mögliche Sicherheitsprobleme.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <h3 className="text-lg font-medium">Windows & Systemkenntnisse</h3>
                <Separator className="my-2" />
                
                <FormField
                  control={form.control}
                  name="firewallSetting"
                  render={({ field }) => (
                    <FormItem className="my-6">
                      <FormLabel>Wie öffnet man die Windows Firewall-Einstellungen am schnellsten?</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="a" />
                            </FormControl>
                            <FormLabel className="font-normal">Über den Task-Manager (Strg+Alt+Entf)</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="b" />
                            </FormControl>
                            <FormLabel className="font-normal">In der Systemsteuerung unter "System und Sicherheit"</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="c" />
                            </FormControl>
                            <FormLabel className="font-normal">Win+R, dann "firewall.cpl" eingeben</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="d" />
                            </FormControl>
                            <FormLabel className="font-normal">Im Startmenü nach "Firewall" suchen</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="windowsIssue"
                  render={({ field }) => (
                    <FormItem className="my-6">
                      <FormLabel>Ein Windows-Computer startet sehr langsam. Was sollte man zuerst überprüfen?</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="a" />
                            </FormControl>
                            <FormLabel className="font-normal">Das BIOS aktualisieren</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="b" />
                            </FormControl>
                            <FormLabel className="font-normal">Den Startordner und Autostart-Programme überprüfen</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="c" />
                            </FormControl>
                            <FormLabel className="font-normal">Windows neu installieren</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="d" />
                            </FormControl>
                            <FormLabel className="font-normal">Die Grafikkartentreiber aktualisieren</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <h3 className="text-lg font-medium">Hardware & Kabel</h3>
                <Separator className="my-2" />
                
                <FormField
                  control={form.control}
                  name="cableTypes"
                  render={({ field }) => (
                    <FormItem className="my-6">
                      <FormLabel>Welches Kabel würdest du für eine stabile Internetverbindung mit hoher Bandbreite zwischen Router und PC über größere Distanz empfehlen?</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="a" />
                            </FormControl>
                            <FormLabel className="font-normal">USB-Kabel</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="b" />
                            </FormControl>
                            <FormLabel className="font-normal">HDMI-Kabel</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="c" />
                            </FormControl>
                            <FormLabel className="font-normal">CAT6-Ethernetkabel</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="d" />
                            </FormControl>
                            <FormLabel className="font-normal">VGA-Kabel</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <h3 className="text-lg font-medium">Persönliche Erfahrung</h3>
                <Separator className="my-2" />
                
                <FormField
                  control={form.control}
                  name="technicalExperience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Beschreibe deine technische Erfahrung und wie du anderen bei Computerproblemen geholfen hast.</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Meine Erfahrung umfasst..." {...field} className="min-h-[150px]" />
                      </FormControl>
                      <FormDescription>
                        Nenne konkrete Beispiele aus deiner Erfahrung.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="toolsUsed"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Mit welchen Diagnose-Tools oder Software hast du bereits gearbeitet?</FormLabel>
                      <FormControl>
                        <Input placeholder="z.B. CPU-Z, Malwarebytes, Cmd, PowerShell..." {...field} />
                      </FormControl>
                      <FormDescription>
                        Lisate Tools auf, die du für Fehlerbehebung oder Systemdiagnose verwendest.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Wird eingereicht..." : "Verifizierung einreichen"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
