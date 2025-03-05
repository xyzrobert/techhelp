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
import { CheckCircle, XCircle, AlertCircle, User, Info } from "lucide-react";

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
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [, navigate] = useLocation();
  const [selectedVerification, setSelectedVerification] = useState<Verification | null>(null);
  const [feedback, setFeedback] = useState("");
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

  // Fetch all verifications
  const { data: verifications, refetch } = useQuery<Verification[]>({
    queryKey: ['/api/admin/verifications'],
    onError: () => {
      setError("Fehler beim Laden der Verifikationen");
    }
  });

  const pendingVerifications = verifications?.filter(v => v.status === 'pending') || [];
  const reviewedVerifications = verifications?.filter(v => v.status !== 'pending') || [];

  const handleApproveVerification = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/verifications/${id}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ feedback }),
      });

      if (!response.ok) {
        throw new Error('Failed to approve verification');
      }

      setSuccess("Verifizierung erfolgreich genehmigt");
      setSelectedVerification(null);
      setFeedback("");
      refetch();
    } catch (err) {
      setError('Fehler bei der Genehmigung. Bitte versuchen Sie es erneut.');
      console.error(err);
    }
  };

  const handleRejectVerification = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/verifications/${id}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ feedback }),
      });

      if (!response.ok) {
        throw new Error('Failed to reject verification');
      }

      setSuccess("Verifizierung erfolgreich abgelehnt");
      setSelectedVerification(null);
      setFeedback("");
      refetch();
    } catch (err) {
      setError('Fehler bei der Ablehnung. Bitte versuchen Sie es erneut.');
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <Tabs defaultValue="applications">
        <TabsList className="mb-4">
          <TabsTrigger value="applications">Anfragen</TabsTrigger>
          <TabsTrigger value="verifications">
            Verifizierungen
            {pendingVerifications.length > 0 && (
              <Badge variant="destructive" className="ml-2">{pendingVerifications.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="applications">
          {/* Applications section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Anfragen</CardTitle>
                  <CardDescription>Alle eingegangenen Hilfsanfragen</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <p>Lädt...</p>
                  ) : error ? (
                    <p className="text-red-500">{error}</p>
                  ) : applications.length === 0 ? (
                    <p>Keine Anfragen vorhanden.</p>
                  ) : (
                    <ul className="space-y-2">
                      {applications.map((app) => (
                        <li 
                          key={app.id} 
                          className={`p-2 border rounded cursor-pointer ${
                            selectedApp?.id === app.id ? 'bg-blue-50 border-blue-500' : ''
                          }`}
                          onClick={() => setSelectedApp(app)}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">{app.name}</p>
                              <p className="text-sm text-gray-500">{app.problemType}</p>
                            </div>
                            <Badge
                              className={
                                app.status === 'pending' ? 'bg-yellow-500' :
                                app.status === 'in_progress' ? 'bg-blue-500' :
                                app.status === 'completed' ? 'bg-green-500' :
                                'bg-red-500'
                              }
                            >
                              {app.status}
                            </Badge>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-2">
              {selectedApp ? (
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{selectedApp.name}</CardTitle>
                        <CardDescription>Anfrage vom {new Date(selectedApp.dateSubmitted).toLocaleDateString()}</CardDescription>
                      </div>
                      <Badge
                        className={
                          selectedApp.status === 'pending' ? 'bg-yellow-500' :
                          selectedApp.status === 'in_progress' ? 'bg-blue-500' :
                          selectedApp.status === 'completed' ? 'bg-green-500' :
                          'bg-red-500'
                        }
                      >
                        {selectedApp.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Kontakt Information</h3>
                        <p>Email: {selectedApp.email}</p>
                        <p>Telefon: {selectedApp.phone}</p>
                        <p>Bevorzugte Kontaktmethode: {selectedApp.preferredContactMethod}</p>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Problem Details</h3>
                        <p><strong>Typ:</strong> {selectedApp.problemType}</p>
                        <p><strong>Dringlichkeit:</strong> {selectedApp.urgency}</p>
                        <p><strong>Beschreibung:</strong></p>
                        <p className="whitespace-pre-line">{selectedApp.problemDescription}</p>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Technische Information</h3>
                        <p><strong>Geräteinformation:</strong> {selectedApp.deviceInfo}</p>
                        {selectedApp.previousAttempts && (
                          <>
                            <p><strong>Frühere Lösungsversuche:</strong></p>
                            <p className="whitespace-pre-line">{selectedApp.previousAttempts}</p>
                          </>
                        )}
                      </div>

                      <Separator />

                      <div className="flex space-x-2">
                        {selectedApp.status === 'pending' && (
                          <Button 
                            onClick={() => handleStatusChange(selectedApp.id, 'in_progress')}
                            className="bg-blue-500 hover:bg-blue-600"
                          >
                            In Bearbeitung nehmen
                          </Button>
                        )}

                        {selectedApp.status === 'in_progress' && (
                          <Button 
                            onClick={() => handleStatusChange(selectedApp.id, 'completed')}
                            className="bg-green-500 hover:bg-green-600"
                          >
                            Als abgeschlossen markieren
                          </Button>
                        )}

                        {(selectedApp.status === 'pending' || selectedApp.status === 'in_progress') && (
                          <Button 
                            onClick={() => handleStatusChange(selectedApp.id, 'cancelled')}
                            variant="destructive"
                          >
                            Anfrage abbrechen
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center text-gray-500">
                    <Info className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2">Wählen Sie eine Anfrage aus, um die Details zu sehen.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="verifications">
          {/* Verification section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Verifizierungen</CardTitle>
                  <CardDescription>Verifizierungsanfragen von Helfern</CardDescription>
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
                    <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
                      <CheckCircle className="h-4 w-4" />
                      <AlertTitle>Erfolg</AlertTitle>
                      <AlertDescription>{success}</AlertDescription>
                    </Alert>
                  )}

                  <Tabs defaultValue="pending">
                    <TabsList className="mb-4 w-full">
                      <TabsTrigger value="pending" className="flex-1">
                        Ausstehend
                        {pendingVerifications.length > 0 && (
                          <Badge variant="destructive" className="ml-2">{pendingVerifications.length}</Badge>
                        )}
                      </TabsTrigger>
                      <TabsTrigger value="reviewed" className="flex-1">Geprüft</TabsTrigger>
                    </TabsList>

                    <TabsContent value="pending">
                      {pendingVerifications.length === 0 ? (
                        <p className="text-center text-gray-500 py-4">Keine ausstehenden Verifizierungen</p>
                      ) : (
                        <ul className="space-y-2">
                          {pendingVerifications.map((verification) => (
                            <li 
                              key={verification.id}
                              className={`p-2 border rounded cursor-pointer ${
                                selectedVerification?.id === verification.id ? 'bg-blue-50 border-blue-500' : ''
                              }`}
                              onClick={() => setSelectedVerification(verification)}
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="font-medium">{verification.userName || 'Unbekannt'}</p>
                                  <p className="text-sm text-gray-500">{new Date(verification.createdAt).toLocaleDateString()}</p>
                                </div>
                                <Badge className="bg-yellow-500">Ausstehend</Badge>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </TabsContent>

                    <TabsContent value="reviewed">
                      {reviewedVerifications.length === 0 ? (
                        <p className="text-center text-gray-500 py-4">Keine geprüften Verifizierungen</p>
                      ) : (
                        <ul className="space-y-2">
                          {reviewedVerifications.map((verification) => (
                            <li 
                              key={verification.id}
                              className={`p-2 border rounded cursor-pointer ${
                                selectedVerification?.id === verification.id ? 'bg-blue-50 border-blue-500' : ''
                              }`}
                              onClick={() => setSelectedVerification(verification)}
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="font-medium">{verification.userName || 'Unbekannt'}</p>
                                  <p className="text-sm text-gray-500">{new Date(verification.createdAt).toLocaleDateString()}</p>
                                </div>
                                <Badge 
                                  className={verification.status === 'approved' ? 'bg-green-500' : 'bg-red-500'}
                                >
                                  {verification.status === 'approved' ? 'Genehmigt' : 'Abgelehnt'}
                                </Badge>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-2">
              {selectedVerification ? (
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{selectedVerification.userName || 'Unbekannt'}</CardTitle>
                        <CardDescription>
                          {selectedVerification.userEmail || 'Keine E-Mail'} • 
                          Eingereicht am {new Date(selectedVerification.createdAt).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <Badge 
                        className={
                          selectedVerification.status === 'pending' ? 'bg-yellow-500' :
                          selectedVerification.status === 'approved' ? 'bg-green-500' : 'bg-red-500'
                        }
                      >
                        {selectedVerification.status === 'pending' ? 'Ausstehend' :
                         selectedVerification.status === 'approved' ? 'Genehmigt' : 'Abgelehnt'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Router-Setup Erklärung</h3>
                        <p className="whitespace-pre-line">{selectedVerification.routerSetup}</p>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="text-sm font-medium text-gray-500">WPS-Erklärung</h3>
                        <p className="whitespace-pre-line">{selectedVerification.wpsExplanation}</p>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Firewall-Einstellungen</h3>
                        <p className="whitespace-pre-line">{selectedVerification.firewallSetting}</p>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Windows-Problem Lösung</h3>
                        <p className="whitespace-pre-line">{selectedVerification.windowsIssue}</p>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Kabeltypen</h3>
                        <p className="whitespace-pre-line">{selectedVerification.cableTypes}</p>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Technische Erfahrung</h3>
                        <p className="whitespace-pre-line">{selectedVerification.technicalExperience}</p>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Werkzeuge und Software</h3>
                        <p className="whitespace-pre-line">{selectedVerification.toolsUsed}</p>
                      </div>

                      {selectedVerification.status === 'pending' && (
                        <>
                          <Separator />

                          <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-2">Feedback (optional)</h3>
                            <Textarea 
                              placeholder="Geben Sie hier Ihr Feedback ein..."
                              value={feedback}
                              onChange={(e) => setFeedback(e.target.value)}
                              className="w-full"
                              rows={3}
                            />
                          </div>

                          <div className="flex space-x-2">
                            <Button 
                              onClick={() => handleApproveVerification(selectedVerification.id)}
                              className="bg-green-500 hover:bg-green-600"
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Genehmigen
                            </Button>

                            <Button 
                              onClick={() => handleRejectVerification(selectedVerification.id)}
                              variant="destructive"
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Ablehnen
                            </Button>
                          </div>
                        </>
                      )}

                      {selectedVerification.status !== 'pending' && selectedVerification.feedback && (
                        <>
                          <Separator />

                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Admin Feedback</h3>
                            <p className="whitespace-pre-line">{selectedVerification.feedback}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center text-gray-500">
                    <User className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2">Wählen Sie eine Verifizierung aus, um die Details zu sehen.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Application list component for future use
function ApplicationList() {
  return <div>Application List Component</div>;
}

export { ApplicationList };