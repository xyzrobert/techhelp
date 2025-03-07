import React from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { setUser } = useAuth();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Login successful
      setUser(data.user);
      toast({
        title: "Willkommen zurück!",
        description: "Sie wurden erfolgreich eingeloggt.",
      });
      setLocation("/dashboard");
    } catch (error) {
      toast({
        title: "Login fehlgeschlagen",
        description: error instanceof Error ? error.message : "Bitte überprüfen Sie Ihren Benutzernamen und Ihr Passwort",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo or App Name */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary mb-2">TechHelp</h1>
          <p className="text-xl text-gray-600">Helfer Login</p>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl">Anmelden</CardTitle>
            <CardDescription className="text-lg">
              Melden Sie sich an, um Ihre Rückrufanfragen zu verwalten
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-lg">
                  Benutzername
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="text-lg h-12 border-2"
                  placeholder="Ihr Benutzername"
                  required
                  autoComplete="username"
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-lg">
                  Passwort
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="text-lg h-12 border-2 pr-12"
                    placeholder="Ihr Passwort"
                    required
                    autoComplete="current-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Passwort verbergen" : "Passwort anzeigen"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-500" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-500" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full text-lg h-12"
                disabled={isLoading}
              >
                {isLoading ? "Anmeldung..." : "Anmelden"}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-4">
              <Button
                variant="link"
                className="text-lg text-primary"
                onClick={() => setLocation("/forgot-password")}
              >
                Passwort vergessen?
              </Button>

              <div className="text-lg">
                Noch kein Helfer-Konto?{" "}
                <Button
                  variant="link"
                  className="text-lg text-primary font-semibold"
                  onClick={() => setLocation("/helper-signup")}
                >
                  Hier registrieren
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Help Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border-2 border-gray-100">
          <h2 className="text-xl font-semibold mb-4">Brauchen Sie Hilfe?</h2>
          <ul className="space-y-3 text-lg">
            <li className="flex items-center">
              <span className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center mr-3">1</span>
              Geben Sie Ihren Benutzernamen ein
            </li>
            <li className="flex items-center">
              <span className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center mr-3">2</span>
              Geben Sie Ihr Passwort ein
            </li>
            <li className="flex items-center">
              <span className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center mr-3">3</span>
              Klicken Sie auf "Anmelden"
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
