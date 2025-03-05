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
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, XCircle, AlertTriangle, User, Info } from "lucide-react";

interface Verification {
  id: number;
  userId: number;
  routerSetup: string;
  wpsExplanation: string;
  firewallSetting: string;
  windowsIssue: string;
  cableTypes: string;
  technicalExperience: string;
  toolsUsed: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  reviewedBy?: number;
  reviewedAt?: string;
  feedback?: string;
  userName?: string;
  userEmail?: string;
}

export default function AdminPage() {
  const [, navigate] = useLocation();
  const [selectedVerification, setSelectedVerification] = useState<Verification | null>(null);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Check if user is admin
  const { data: userData } = useQuery({
    queryKey: ['/api/auth/me'],
    onError: () => {
      navigate('/login');
    }
  });

  useEffect(() => {
    if (userData && userData.user.role !== 'admin') {
      navigate('/');
    }
  }, [userData, navigate]);

  // Fetch all verifications
  const { data: verifications, refetch } = useQuery<Verification[]>({
    queryKey: ['/api/admin/verifications'],
    onError: () => {
      setError("Fehler beim Laden der Verifikationen");
    }
  });

  const pendingVerifications = verifications?.filter(v => v.status === 'pending') || [];
  const reviewedVerifications = verifications?.filter(v => v.status !== 'pending') || [];

  const handleApprove = async () => {
    if (!selectedVerification) return;
    
    try {
      const response = await fetch(`/api/admin/verifications/${selectedVerification.id}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'approved',
          feedback: feedback,
        }),
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Fehler bei der Genehmigung");
      }
      
      setSuccess("Verifizierung erfolgreich genehmigt");
      refetch();
      setSelectedVerification(null);
      setFeedback("");
    } catch (err: any) {
      setError(err.message);
    }
  };
  
  const handleReject = async () => {
    if (!selectedVerification) return;
    
    if (!feedback.trim()) {
      setError("Bitte gib ein Feedback an, warum die Verifizierung abgelehnt wurde");
      return;
    }
    
    try {
      const response = await fetch(`/api/admin/verifications/${selectedVerification.id}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'rejected',
          feedback: feedback,
        }),
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Fehler bei der Ablehnung");
      }
      
      setSuccess("Verifizierung erfolgreich abgelehnt");
      refetch();
      setSelectedVerification(null);
      setFeedback("");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Admin-Panel</h1>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Fehler</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert className="mb-4 bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertTitle>Erfolg</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
      
      <Tabs defaultValue="pending">
        <TabsList className="mb-4">
          <TabsTrigger value="pending">
            Ausstehend
            {pendingVerifications.length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {pendingVerifications.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="reviewed">Bearbeitet</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Ausstehende Verifizierungen</CardTitle>
                  <CardDescription>
                    Anfragen, die noch nicht geprüft wurden
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {pendingVerifications.length === 0 ? (
                    <p className="text-muted-foreground">Keine ausstehenden Verifizierungen</p>
                  ) : (
                    <div className="space-y-2">
                      {pendingVerifications.map((verification) => (
                        <div
                          key={verification.id}
                          className={`p-3 rounded-md cursor-pointer border ${
                            selectedVerification?.id === verification.id
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                          onClick={() => setSelectedVerification(verification)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{verification.userName || `Benutzer #${verification.userId}`}</p>
                              <p className="text-sm text-muted-foreground">{verification.userEmail}</p>
                            </div>
                            <Badge variant="outline">Neu</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(verification.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-2">
              {selectedVerification ? (
                <Card>
                  <CardHeader>
                    <div className="flex justify-between">
                      <div>
                        <CardTitle>Verifizierung prüfen</CardTitle>
                        <CardDescription>
                          Eingereicht am {new Date(selectedVerification.createdAt).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <Badge>
                        {selectedVerification.status === 'pending' ? 'Ausstehend' :
                         selectedVerification.status === 'approved' ? 'Genehmigt' : 'Abgelehnt'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Benutzerinfo
                        </h3>
                        <div className="mt-2 p-3 rounded-md bg-gray-50">
                          <p><strong>ID:</strong> {selectedVerification.userId}</p>
                          <p><strong>Name:</strong> {selectedVerification.userName || 'Nicht verfügbar'}</p>
                          <p><strong>Email:</strong> {selectedVerification.userEmail || 'Nicht verfügbar'}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium">Router & Netzwerk-Wissen</h3>
                        <Separator className="my-2" />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                          <div className="p-3 rounded-md bg-gray-50">
                            <p className="text-sm font-medium mb-1">Gateway-Adresse</p>
                            <p className="text-sm">
                              Antwort: {selectedVerification.routerSetup === 'c' ? (
                                <span className="text-green-600 font-medium">Korrekt (192.168.1.1)</span>
                              ) : (
                                <span className="text-red-600 font-medium">Falsch</span>
                              )}
                            </p>
                          </div>
                          
                          <div className="p-3 rounded-md bg-gray-50">
                            <p className="text-sm font-medium mb-1">WPS Erklärung</p>
                            <p className="text-sm break-words whitespace-pre-wrap">
                              {selectedVerification.wpsExplanation}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium">Windows & Systemkenntnisse</h3>
                        <Separator className="my-2" />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                          <div className="p-3 rounded-md bg-gray-50">
                            <p className="text-sm font-medium mb-1">Firewall-Einstellungen</p>
                            <p className="text-sm">
                              Antwort: {selectedVerification.firewallSetting === 'c' ? (
                                <span className="text-green-600 font-medium">Korrekt (Win+R, firewall.cpl)</span>
                              ) : (
                                <span className="text-red-600 font-medium">Falsch</span>
                              )}
                            </p>
                          </div>
                          
                          <div className="p-3 rounded-md bg-gray-50">
                            <p className="text-sm font-medium mb-1">Windows-Startprobleme</p>
                            <p className="text-sm">
                              Antwort: {selectedVerification.windowsIssue === 'b' ? (
                                <span className="text-green-600 font-medium">Korrekt (Autostart prüfen)</span>
                              ) : (
                                <span className="text-red-600 font-medium">Falsch</span>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium">Hardware & Kabel</h3>
                        <Separator className="my-2" />
                        
                        <div className="p-3 rounded-md bg-gray-50 mt-3">
                          <p className="text-sm font-medium mb-1">Kabelempfehlung</p>
                          <p className="text-sm">
                            Antwort: {selectedVerification.cableTypes === 'c' ? (
                              <span className="text-green-600 font-medium">Korrekt (CAT6-Ethernetkabel)</span>
                            ) : (
                              <span className="text-red-600 font-medium">Falsch</span>
                            )}
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium">Erfahrung & Tools</h3>
                        <Separator className="my-2" />
                        
                        <div className="space-y-3 mt-3">
                          <div className="p-3 rounded-md bg-gray-50">
                            <p className="text-sm font-medium mb-1">Technische Erfahrung</p>
                            <p className="text-sm break-words whitespace-pre-wrap">
                              {selectedVerification.technicalExperience}
                            </p>
                          </div>
                          
                          <div className="p-3 rounded-md bg-gray-50">
                            <p className="text-sm font-medium mb-1">Verwendete Tools</p>
                            <p className="text-sm">{selectedVerification.toolsUsed}</p>
                          </div>
                        </div>
                      </div>
                      
                      {selectedVerification.status === 'pending' && (
                        <div>
                          <h3 className="font-medium flex items-center gap-2">
                            <Info className="h-4 w-4" />
                            Feedback geben
                          </h3>
                          <Textarea
                            placeholder="Optionales Feedback für den Benutzer..."
                            className="mt-2"
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                          />
                          
                          <div className="flex justify-end gap-2 mt-4">
                            <Button 
                              variant="outline" 
                              onClick={handleReject}
                              className="flex items-center gap-1"
                            >
                              <XCircle className="h-4 w-4" />
                              Ablehnen
                            </Button>
                            <Button 
                              onClick={handleApprove}
                              className="flex items-center gap-1"
                            >
                              <CheckCircle className="h-4 w-4" />
                              Genehmigen
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      {selectedVerification.status !== 'pending' && selectedVerification.feedback && (
                        <div>
                          <h3 className="font-medium">Feedback</h3>
                          <div className="p-3 rounded-md bg-gray-50 mt-2">
                            <p className="text-sm">{selectedVerification.feedback}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="flex items-center justify-center h-full min-h-[300px] border rounded-lg p-8">
                  <div className="text-center">
                    <h3 className="text-lg font-medium mb-2">Keine Verifizierung ausgewählt</h3>
                    <p className="text-muted-foreground">
                      Wähle eine Verifizierung aus der Liste aus, um die Details zu sehen
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="reviewed">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Bearbeitete Verifizierungen</CardTitle>
                  <CardDescription>
                    Bereits geprüfte Anfragen
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {reviewedVerifications.length === 0 ? (
                    <p className="text-muted-foreground">Keine bearbeiteten Verifizierungen</p>
                  ) : (
                    <div className="space-y-2">
                      {reviewedVerifications.map((verification) => (
                        <div
                          key={verification.id}
                          className={`p-3 rounded-md cursor-pointer border ${
                            selectedVerification?.id === verification.id
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                          onClick={() => setSelectedVerification(verification)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{verification.userName || `Benutzer #${verification.userId}`}</p>
                              <p className="text-sm text-muted-foreground">{verification.userEmail}</p>
                            </div>
                            <Badge variant={verification.status === 'approved' ? 'default' : 'destructive'}>
                              {verification.status === 'approved' ? 'Genehmigt' : 'Abgelehnt'}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Geprüft: {verification.reviewedAt ? new Date(verification.reviewedAt).toLocaleDateString() : 'Unbekannt'}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-2">
              {selectedVerification ? (
                <Card>
                  <CardHeader>
                    <div className="flex justify-between">
                      <div>
                        <CardTitle>Verifizierungsdetails</CardTitle>
                        <CardDescription>
                          Eingereicht am {new Date(selectedVerification.createdAt).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <Badge variant={selectedVerification.status === 'approved' ? 'default' : 'destructive'}>
                        {selectedVerification.status === 'approved' ? 'Genehmigt' : 'Abgelehnt'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Gleicher Inhalt wie im "pending" Tab */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Benutzerinfo
                        </h3>
                        <div className="mt-2 p-3 rounded-md bg-gray-50">
                          <p><strong>ID:</strong> {selectedVerification.userId}</p>
                          <p><strong>Name:</strong> {selectedVerification.userName || 'Nicht verfügbar'}</p>
                          <p><strong>Email:</strong> {selectedVerification.userEmail || 'Nicht verfügbar'}</p>
                        </div>
                      </div>
                      
                      {/* Weitere Abschnitte wie im "pending" Tab */}
                      
                      {selectedVerification.feedback && (
                        <div>
                          <h3 className="font-medium">Feedback</h3>
                          <div className="p-3 rounded-md bg-gray-50 mt-2">
                            <p className="text-sm">{selectedVerification.feedback}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="flex items-center justify-center h-full min-h-[300px] border rounded-lg p-8">
                  <div className="text-center">
                    <h3 className="text-lg font-medium mb-2">Keine Verifizierung ausgewählt</h3>
                    <p className="text-muted-foreground">
                      Wähle eine Verifizierung aus der Liste aus, um die Details zu sehen
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
