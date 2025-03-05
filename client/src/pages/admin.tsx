import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";


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

// Custom hook to get the current location
function useLocation() {
  const [location, setLocation] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setLocation(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  return [location];
}

export default function AdminPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [location] = useLocation();

  // Check if we're on the correct URL
  useEffect(() => {
    if (location !== '/admin' && location !== '/admin/') {
      window.location.href = '/admin';
    }
  }, [location]);

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

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/applications/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update application status');
      }

      // Update the applications list with the new status
      setApplications(prevApps =>
        prevApps.map(app =>
          app.id === id ? { ...app, status: newStatus } : app
        )
      );
    } catch (err) {
      setError('Error updating status. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <Tabs defaultValue="applications">
        <TabsList className="mb-4">
          <TabsTrigger value="applications">Bewerbungen</TabsTrigger>
          <TabsTrigger value="users">Benutzer</TabsTrigger>
          <TabsTrigger value="services">Dienstleistungen</TabsTrigger>
          <TabsTrigger value="bookings">Buchungen</TabsTrigger>
          <TabsTrigger value="payments">Zahlungen</TabsTrigger>
        </TabsList>

        <TabsContent value="applications">
          <Card>
            <CardHeader>
              <CardTitle>Bewerbungsverwaltung</CardTitle>
              <CardDescription>Alle eingegangenen Studentenbewerbungen ansehen und bearbeiten</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p>Lädt Bewerbungen...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Problemtyp</TableHead>
                        <TableHead>Dringlichkeit</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Datum</TableHead>
                        <TableHead>Aktionen</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {applications.map(app => (
                        <TableRow key={app.id}>
                          <TableCell>{app.name}</TableCell>
                          <TableCell>{app.problemType}</TableCell>
                          <TableCell>
                            <Badge variant={app.urgency === 'high' ? 'destructive' : app.urgency === 'medium' ? 'warning' : 'outline'}>
                              {app.urgency === 'high' ? 'Hoch' : app.urgency === 'medium' ? 'Mittel' : 'Niedrig'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={app.status === 'pending' ? 'outline' : app.status === 'reviewing' ? 'secondary' : app.status === 'approved' ? 'success' : 'destructive'}>
                              {app.status === 'pending' ? 'Ausstehend' : app.status === 'reviewing' ? 'In Prüfung' : app.status === 'approved' ? 'Genehmigt' : 'Abgelehnt'}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(app.dateSubmitted).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm" onClick={() => setSelectedApp(app)}>
                              Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {/* Application details dialog */}
                  {selectedApp && (
                    <Dialog open={!!selectedApp} onOpenChange={(open) => !open && setSelectedApp(null)}>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Bewerbung von {selectedApp.name}</DialogTitle>
                          <DialogDescription>
                            Eingereicht am {new Date(selectedApp.dateSubmitted).toLocaleDateString()}
                          </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <h3 className="font-semibold col-span-4">Kontaktinformationen</h3>
                            <div className="col-span-2">
                              <p className="text-sm font-medium">Email:</p>
                              <p className="text-sm">{selectedApp.email}</p>
                            </div>
                            <div className="col-span-2">
                              <p className="text-sm font-medium">Telefon:</p>
                              <p className="text-sm">{selectedApp.phone}</p>
                            </div>
                            <div className="col-span-4">
                              <p className="text-sm font-medium">Bevorzugte Kontaktmethode:</p>
                              <p className="text-sm">{selectedApp.preferredContactMethod}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 gap-4 pt-4">
                            <h3 className="font-semibold">Problembeschreibung</h3>
                            <div>
                              <p className="text-sm font-medium">Problemtyp:</p>
                              <p className="text-sm">{selectedApp.problemType}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Dringlichkeit:</p>
                              <p className="text-sm">{selectedApp.urgency === 'high' ? 'Hoch' : selectedApp.urgency === 'medium' ? 'Mittel' : 'Niedrig'}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Beschreibung:</p>
                              <p className="text-sm whitespace-pre-wrap">{selectedApp.problemDescription}</p>
                            </div>
                            {selectedApp.previousAttempts && (
                              <div>
                                <p className="text-sm font-medium">Bisherige Lösungsversuche:</p>
                                <p className="text-sm whitespace-pre-wrap">{selectedApp.previousAttempts}</p>
                              </div>
                            )}
                            <div>
                              <p className="text-sm font-medium">Geräteinformationen:</p>
                              <p className="text-sm">{selectedApp.deviceInfo}</p>
                            </div>
                          </div>
                        </div>

                        <DialogFooter className="flex justify-between">
                          <div className="space-x-2">
                            <Button
                              variant={selectedApp.status === 'reviewing' ? 'secondary' : 'outline'}
                              onClick={() => handleStatusChange(selectedApp.id, 'reviewing')}
                              disabled={selectedApp.status === 'reviewing'}
                            >
                              In Prüfung
                            </Button>
                            <Button
                              variant={selectedApp.status === 'approved' ? 'default' : 'outline'}
                              onClick={() => handleStatusChange(selectedApp.id, 'approved')}
                              disabled={selectedApp.status === 'approved'}
                            >
                              Genehmigen
                            </Button>
                            <Button
                              variant={selectedApp.status === 'rejected' ? 'destructive' : 'outline'}
                              onClick={() => handleStatusChange(selectedApp.id, 'rejected')}
                              disabled={selectedApp.status === 'rejected'}
                            >
                              Ablehnen
                            </Button>
                          </div>
                          <Button variant="outline" onClick={() => setSelectedApp(null)}>
                            Schließen
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Benutzerverwaltung</CardTitle>
              <CardDescription>Alle registrierten Benutzer anzeigen und verwalten</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>Hier können Sie Benutzer anzeigen und verwalten.</p>
                <div className="border rounded p-4">
                  <p className="text-muted-foreground">Benutzerdaten werden hier angezeigt.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services">
          <Card>
            <CardHeader>
              <CardTitle>Dienstleistungen</CardTitle>
              <CardDescription>Alle angebotenen Dienstleistungen verwalten</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>Hier können Sie Dienstleistungen einsehen und verwalten.</p>
                <div className="border rounded p-4">
                  <p className="text-muted-foreground">Dienstleistungsdaten werden hier angezeigt.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>Buchungsverwaltung</CardTitle>
              <CardDescription>Alle getätigten Buchungen einsehen</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>Hier können Sie Buchungen einsehen und verwalten.</p>
                <div className="border rounded p-4">
                  <p className="text-muted-foreground">Buchungsdaten werden hier angezeigt.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Zahlungsübersicht</CardTitle>
              <CardDescription>Alle Zahlungen und Transaktionen verwalten</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>Hier können Sie Zahlungen und Transaktionen einsehen und verwalten.</p>
                <div className="border rounded p-4">
                  <p className="text-muted-foreground">Zahlungsdaten werden hier angezeigt.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper component for displaying application list
function ApplicationList() {
  // This component will be implemented later.
  return <div>Application List Component</div>;
}

export { ApplicationList };