
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
import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

// Application interface matching the server
interface Application {
  id: number;
  name: string;
  email: string;
  phone: string;
  problemType: string;
  problemDescription: string;
  urgency: string;
  preferredContactMethod: string;
  previousAttempts?: string;
  deviceInfo: string;
  status: string;
  dateSubmitted: Date;
  assignedToId?: number;
}

export default function AdminPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [location] = useLocation();

  // Check if we're on the correct URL
  if (location !== '/admin') {
    // This redirects to /admin when accessed via /admin/
    window.location.href = '/admin';
  }

  // Sample user (in a real app, this would come from authentication)
  const currentUser = {
    id: 1,
    name: 'Admin User',
    role: 'admin'
  };

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch('/api/applications');
        if (!response.ok) {
          throw new Error('Failed to fetch applications');
        }
        const data = await response.json();
        setApplications(data);
      } catch (err) {
        setError('Error loading applications. Please try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleStatusChange = async (appId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/applications/${appId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          assignedToId: newStatus === 'assigned' ? currentUser.id : undefined
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      const updatedApp = await response.json();
      
      // Update applications list
      setApplications(apps => 
        apps.map(app => app.id === appId ? updatedApp : app)
      );
      
      // Update selected application if it's currently selected
      if (selectedApp && selectedApp.id === appId) {
        setSelectedApp(updatedApp);
      }
    } catch (err) {
      setError('Failed to update status. Please try again.');
      console.error(err);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Ausstehend</Badge>;
      case 'assigned':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Zugewiesen</Badge>;
      case 'in-progress':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800">In Bearbeitung</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Abgeschlossen</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Abgebrochen</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getUrgencyLabel = (urgency: string) => {
    switch (urgency) {
      case 'low': return 'Niedrig';
      case 'medium': return 'Mittel';
      case 'high': return 'Hoch';
      default: return urgency;
    }
  };

  const getProblemTypeLabel = (type: string) => {
    switch (type) {
      case 'hardware': return 'Hardware';
      case 'software': return 'Software';
      case 'network': return 'Netzwerk';
      case 'mobile': return 'Smartphone/Tablet';
      case 'other': return 'Sonstiges';
      default: return type;
    }
  };

  const getContactMethodLabel = (method: string) => {
    switch (method) {
      case 'email': return 'E-Mail';
      case 'phone': return 'Telefon';
      case 'whatsapp': return 'WhatsApp';
      default: return method;
    }
  };

  if (isLoading) {
    return (
      <div className="container py-12 text-center">
        <p>Lade Anwendungsformulare...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-12">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <Button onClick={() => window.location.reload()}>Neu laden</Button>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard - Support Anfragen</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-muted-foreground">Eingeloggt als: {currentUser.name}</span>
          <Button variant="outline" size="sm">Ausloggen</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Supportanfragen</CardTitle>
              <CardDescription>Übersicht aller Anfragen von Studenten</CardDescription>
            </CardHeader>
            <CardContent>
              {applications.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">Keine Anfragen vorhanden</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Problem</TableHead>
                      <TableHead>Dringlichkeit</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Datum</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications.map((app) => (
                      <TableRow key={app.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedApp(app)}>
                        <TableCell>#{app.id}</TableCell>
                        <TableCell>{app.name}</TableCell>
                        <TableCell>{getProblemTypeLabel(app.problemType)}</TableCell>
                        <TableCell>{getUrgencyLabel(app.urgency)}</TableCell>
                        <TableCell>{getStatusBadge(app.status)}</TableCell>
                        <TableCell>{formatDate(app.dateSubmitted)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={(e) => {
                            e.stopPropagation();
                            setSelectedApp(app);
                          }}>
                            Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          {selectedApp ? (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Anfrage #{selectedApp.id}</CardTitle>
                    <CardDescription>Eingereicht am {formatDate(selectedApp.dateSubmitted)}</CardDescription>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setSelectedApp(null)}>
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-1">Status</h3>
                  <Select
                    value={selectedApp.status}
                    onValueChange={(value) => handleStatusChange(selectedApp.id, value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Ausstehend</SelectItem>
                      <SelectItem value="assigned">Zugewiesen</SelectItem>
                      <SelectItem value="in-progress">In Bearbeitung</SelectItem>
                      <SelectItem value="completed">Abgeschlossen</SelectItem>
                      <SelectItem value="cancelled">Abgebrochen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <h3 className="font-semibold mb-1">Kontaktdaten</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-muted-foreground">Name:</span> {selectedApp.name}</p>
                    <p><span className="text-muted-foreground">E-Mail:</span> {selectedApp.email}</p>
                    <p><span className="text-muted-foreground">Telefon:</span> {selectedApp.phone}</p>
                    <p><span className="text-muted-foreground">Bevorzugte Kontaktmethode:</span> {getContactMethodLabel(selectedApp.preferredContactMethod)}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-1">Problembeschreibung</h3>
                  <div className="text-sm bg-muted/50 p-3 rounded">
                    {selectedApp.problemDescription}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-1">Problemtyp</h3>
                    <p className="text-sm">{getProblemTypeLabel(selectedApp.problemType)}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Dringlichkeit</h3>
                    <p className="text-sm">{getUrgencyLabel(selectedApp.urgency)}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-1">Geräteinformationen</h3>
                  <div className="text-sm bg-muted/50 p-3 rounded">
                    {selectedApp.deviceInfo}
                  </div>
                </div>

                {selectedApp.previousAttempts && (
                  <div>
                    <h3 className="font-semibold mb-1">Bisherige Lösungsversuche</h3>
                    <div className="text-sm bg-muted/50 p-3 rounded">
                      {selectedApp.previousAttempts}
                    </div>
                  </div>
                )}
                
                <div className="pt-4">
                  <Button className="w-full">Kontakt aufnehmen</Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground py-20">
                  Wählen Sie eine Anfrage aus, um Details anzuzeigen
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
