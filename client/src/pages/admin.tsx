import { useQuery } from "@tanstack/react-query";
import type { User } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

export default function Admin() {
  const { data: helpers } = useQuery<User[]>({ 
    queryKey: ["/api/helpers/online"] 
  });

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Manage Helpers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {helpers?.map((helper) => (
              <div key={helper.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={`https://avatar.vercel.sh/${helper.username}`} />
                    <AvatarFallback>{helper.username[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{helper.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {helper.skills?.join(", ")}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <Badge variant={helper.verified ? "default" : "outline"}>
                    {helper.verified ? "Verified" : "Unverified"}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <Switch 
                      checked={helper.isOnline}
                      onCheckedChange={(checked) => {
                        // Will implement status toggle later
                        console.log("Toggle status", helper.id, checked);
                      }}
                    />
                    <span className="text-sm text-muted-foreground">
                      {helper.isOnline ? "Online" : "Offline"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
