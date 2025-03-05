
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Admin() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <Tabs defaultValue="users">
        <TabsList className="mb-4">
          <TabsTrigger value="users">Benutzer</TabsTrigger>
          <TabsTrigger value="services">Dienstleistungen</TabsTrigger>
          <TabsTrigger value="bookings">Buchungen</TabsTrigger>
          <TabsTrigger value="payments">Zahlungen</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Benutzer Verwaltung</CardTitle>
              <CardDescription>Alle registrierten Benutzer und Helfer verwalten</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>Hier können Sie Benutzer verwalten, verifizieren und bearbeiten.</p>
                {/* Benutzer-Tabelle oder -Liste hier einfügen */}
                <div className="border rounded p-4">
                  <p className="text-muted-foreground">Benutzer-Daten werden hier angezeigt.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="services">
          <Card>
            <CardHeader>
              <CardTitle>Dienstleistungsverwaltung</CardTitle>
              <CardDescription>Alle angebotenen Dienstleistungen überprüfen</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>Hier können Sie Dienstleistungen überprüfen, genehmigen oder ablehnen.</p>
                {/* Dienstleistungs-Tabelle oder -Liste hier einfügen */}
                <div className="border rounded p-4">
                  <p className="text-muted-foreground">Dienste werden hier angezeigt.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>Buchungsverwaltung</CardTitle>
              <CardDescription>Alle getätigten Buchungen überwachen</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>Hier können Sie alle Buchungen einsehen und den Status überwachen.</p>
                {/* Buchungs-Tabelle oder -Liste hier einfügen */}
                <div className="border rounded p-4">
                  <p className="text-muted-foreground">Buchungen werden hier angezeigt.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Zahlungsverwaltung</CardTitle>
              <CardDescription>Zahlungsübersicht und -abwicklung</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>Hier können Sie Zahlungen überwachen und verwalten.</p>
                {/* Zahlungs-Tabelle oder -Liste hier einfügen */}
                <div className="border rounded p-4">
                  <p className="text-muted-foreground">Zahlungen werden hier angezeigt.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
