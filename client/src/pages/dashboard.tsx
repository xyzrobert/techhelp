import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { Phone, Clock, Check, X } from "lucide-react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

type ContactRequest = {
  id: number;
  clientPhone: string;
  status: "pending" | "contacted" | "completed" | "cancelled";
  createdAt: string;
  notes?: string;
};

export default function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: contactRequests } = useQuery<ContactRequest[]>({
    queryKey: ["/api/contact-requests", user?.id],
    enabled: !!user,
  });

  const updateRequestStatus = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: ContactRequest["status"] }) => {
      const response = await fetch(`/api/contact-requests/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contact-requests", user?.id] });
      toast({
        title: "Status aktualisiert",
        description: "Der Status der Anfrage wurde erfolgreich aktualisiert.",
      });
    },
    onError: () => {
      toast({
        title: "Fehler",
        description: "Der Status konnte nicht aktualisiert werden. Bitte versuchen Sie es erneut.",
        variant: "destructive",
      });
    },
  });

  const handleStatusUpdate = (id: number, status: ContactRequest["status"]) => {
    updateRequestStatus.mutate({ id, status });
  };

  if (!user) {
    return (
      <div className="container mx-auto p-8">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Zugriff verweigert</h2>
            <p className="text-lg text-muted-foreground">
              Sie müssen sich als Helfer anmelden, um auf das Dashboard zuzugreifen.
            </p>
            <Button className="mt-4" onClick={() => window.location.href = "/login"}>
              Zum Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusColor = (status: ContactRequest["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "contacted":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "completed":
        return "bg-green-50 text-green-700 border-green-200";
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "";
    }
  };

  const getStatusText = (status: ContactRequest["status"]) => {
    switch (status) {
      case "pending":
        return "Ausstehend";
      case "contacted":
        return "Kontaktiert";
      case "completed":
        return "Abgeschlossen";
      case "cancelled":
        return "Abgebrochen";
      default:
        return status;
    }
  };

  return (
    <div className="container mx-auto p-8">
      {/* Helper Profile Summary */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={`https://avatar.vercel.sh/${user.username}`} />
              <AvatarFallback>{user.username[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold mb-2">{user.username}</h1>
              <div className="flex gap-2">
                <Badge variant="outline" className="bg-green-50">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    Online
                  </div>
                </Badge>
                <Badge variant="outline" className="bg-blue-50">Helfer</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Rückrufanfragen</CardTitle>
          <CardDescription>
            Verwalten Sie hier Ihre Rückrufanfragen von Hilfesuchenden
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {contactRequests?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Keine Rückrufanfragen vorhanden
              </div>
            ) : (
              contactRequests?.map((request) => (
                <Card key={request.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Phone className="h-5 w-5 text-muted-foreground" />
                          <span className="text-lg font-medium">{request.clientPhone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>
                            Anfrage vom {format(new Date(request.createdAt), "dd. MMMM yyyy 'um' HH:mm 'Uhr'", { locale: de })}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={getStatusColor(request.status)}>
                          {getStatusText(request.status)}
                        </Badge>
                        {request.status === "pending" && (
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-green-600 border-green-200 hover:bg-green-50"
                              onClick={() => handleStatusUpdate(request.id, "contacted")}
                              disabled={updateRequestStatus.isPending}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Kontaktiert
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-red-600 border-red-200 hover:bg-red-50"
                              onClick={() => handleStatusUpdate(request.id, "cancelled")}
                              disabled={updateRequestStatus.isPending}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Ablehnen
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    {request.notes && (
                      <div className="mt-4 p-3 bg-muted/50 rounded-lg text-muted-foreground">
                        {request.notes}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 