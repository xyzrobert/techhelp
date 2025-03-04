import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams } from "wouter";
import type { Service, User, InsertBooking } from "@shared/schema";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Book() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();

  const { data: service } = useQuery<Service>({ 
    queryKey: [`/api/services/${id}`] 
  });

  const { data: helper } = useQuery<User>({ 
    queryKey: [`/api/users/${service?.helperId}`],
    enabled: !!service 
  });

  const bookMutation = useMutation({
    mutationFn: async (date: Date) => {
      const booking: InsertBooking = {
        serviceId: parseInt(id),
        clientId: 1, // Mock logged in user
        date
      };
      return apiRequest("POST", "/api/bookings", booking);
    },
    onSuccess: () => {
      toast({
        title: "Booking Confirmed",
        description: "Your session has been booked successfully!"
      });
    }
  });

  if (!service || !helper) {
    return null;
  }

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <Avatar className="w-16 h-16">
              <AvatarImage src={`https://avatar.vercel.sh/${helper.username}`} />
              <AvatarFallback>{helper.username[0]}</AvatarFallback>
            </Avatar>
            
            <div>
              <h1 className="text-2xl font-bold mb-2">{service.title}</h1>
              <p className="text-muted-foreground mb-4">{service.description}</p>
              
              <div className="flex items-center gap-4">
                <div>
                  <p className="font-medium">{helper.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {helper.rating} ★ • {helper.skills?.join(", ")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">Select a Date</h2>
            <Calendar
              mode="single"
              selected={undefined}
              onSelect={(date) => {
                if (date) bookMutation.mutate(date);
              }}
              className="rounded-md border"
            />
          </div>
        </CardContent>

        <CardFooter className="bg-secondary/5 p-6">
          <div className="ml-auto text-right">
            <p className="text-2xl font-bold">
              ${(service.price / 100).toFixed(2)}
            </p>
            <p className="text-sm text-muted-foreground">per hour</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
