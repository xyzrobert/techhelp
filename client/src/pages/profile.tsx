import { useQuery } from "@tanstack/react-query";
import type { User, Booking, Service } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function Profile() {
  const { data: user } = useQuery<User>({ 
    queryKey: ["/api/users/1"] // Mock logged in user
  });

  const { data: bookings } = useQuery<Booking[]>({ 
    queryKey: ["/api/users/1/bookings"],
    enabled: !!user 
  });

  const { data: services } = useQuery<Service[]>({ 
    queryKey: ["/api/helpers/1/services"],
    enabled: !!user && user.role === "helper"
  });

  if (!user) return null;

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Card */}
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarImage src={`https://avatar.vercel.sh/${user.username}`} />
                <AvatarFallback>{user.username[0]}</AvatarFallback>
              </Avatar>
              <h1 className="text-2xl font-bold mb-1">{user.name}</h1>
              <p className="text-muted-foreground mb-4">{user.username}</p>
              
              <div className="flex justify-center gap-2 mb-4">
                <Badge>{user.role}</Badge>
                {user.verified && (
                  <Badge variant="secondary">Verified</Badge>
                )}
              </div>

              {user.bio && (
                <p className="text-sm text-muted-foreground">{user.bio}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2">
          {user.role === "helper" ? (
            <Card>
              <CardHeader>
                <CardTitle>My Services</CardTitle>
              </CardHeader>
              <CardContent>
                {services?.map((service) => (
                  <div
                    key={service.id}
                    className="flex justify-between items-center py-4 border-b last:border-0"
                  >
                    <div>
                      <h3 className="font-medium">{service.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {service.description}
                      </p>
                    </div>
                    <Badge>{service.category}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>My Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                {bookings?.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex justify-between items-center py-4 border-b last:border-0"
                  >
                    <div>
                      <p className="font-medium">
                        {format(new Date(booking.date), "PPP")}
                      </p>
                      <Badge variant="secondary">{booking.status}</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
