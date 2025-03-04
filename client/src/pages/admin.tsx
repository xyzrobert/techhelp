import { FC, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { User, Payment, Booking } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";

const Admin: FC = () => {
  const [activeTab, setActiveTab] = useState("helpers");

  const { data: helpers } = useQuery<User[]>({ 
    queryKey: ["/api/helpers/online"] 
  });

  const { data: payments } = useQuery<Payment[]>({
    queryKey: ["/api/payments"],
    enabled: activeTab === "payments"
  });

  const { data: bookings } = useQuery<Booking[]>({
    queryKey: ["/api/bookings"],
    enabled: activeTab === "payments"
  });

  // Calculate revenue statistics
  const totalRevenue = payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
  const platformRevenue = payments?.reduce((sum, payment) => sum + payment.platformAmount, 0) || 0;
  const studentRevenue = payments?.reduce((sum, payment) => sum + payment.studentAmount, 0) || 0;
  const pendingPayments = payments?.filter(payment => payment.status === "pending").length || 0;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <Tabs defaultValue="helpers" onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="helpers">Manage Helpers</TabsTrigger>
          <TabsTrigger value="payments">Payment Tracking</TabsTrigger>
        </TabsList>
        
        <TabsContent value="helpers">
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
                      checked={helper.isOnline || false}
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
        </TabsContent>
        
        <TabsContent value="payments">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Platform Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{formatCurrency(platformRevenue)}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Helper Earnings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{formatCurrency(studentRevenue)}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Pending Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{pendingPayments}</p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Payment Transactions</CardTitle>
              <CardDescription>Track all payment transactions in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Helper</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments?.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{payment.id}</TableCell>
                      <TableCell>{format(new Date(payment.date), 'dd.MM.yyyy')}</TableCell>
                      <TableCell className="capitalize">{payment.method}</TableCell>
                      <TableCell>{formatCurrency(payment.amount)}</TableCell>
                      <TableCell>{formatCurrency(payment.platformAmount)}</TableCell>
                      <TableCell>{formatCurrency(payment.studentAmount)}</TableCell>
                      <TableCell>
                        <Badge variant={
                          payment.status === "completed" ? "default" : 
                          payment.status === "pending" ? "outline" : "destructive"
                        }>
                          {payment.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  
                  {(!payments || payments.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                        No payment records found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;