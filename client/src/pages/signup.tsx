
import SignupForm from "@/components/SignupForm";

export default function SignupPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Student Sign Up</h1>
      <SignupForm />
      <p className="text-center mt-4">
        Are you a student with tech skills? <a href="/helper-signup" className="text-blue-500 hover:underline">Sign up as a Helper</a>
      </p>
    </div>
  );
}
import React, { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
      setError("Alle Felder sind erforderlich");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwörter stimmen nicht überein");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role: "student" // Role is hardcoded for student registration
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registrierung fehlgeschlagen");
      }

      // Registration successful
      setLocation('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Studenten Registrierung</CardTitle>
          <CardDescription>
            Registriere dich als Student um Hilfe bei technischen Problemen zu erhalten
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dein vollständiger Name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">E-Mail</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="deine.email@beispiel.de"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Passwort</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Passwort bestätigen</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Registrierung läuft..." : "Registrieren"}
            </Button>
            
            <div className="text-center text-sm text-muted-foreground mt-4">
              Bereits registriert?{" "}
              <a
                onClick={() => setLocation("/login")}
                className="text-primary underline cursor-pointer"
              >
                Einloggen
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
