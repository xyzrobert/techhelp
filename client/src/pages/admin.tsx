
import { FC, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { User, Payment, Booking } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const Admin: FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const queryClient = useQueryClient();
  const [simulateOpen, setSimulateOpen] = useState(false);
  const [paymentData, setPaymentData] = useState({
    amount: 39,
    studentAmount: 25,
    platformAmount: 14,
    method: "online",
    bookingId: 1
  });

  const { data: helpers = [] } = useQuery<User[]>({ 
    queryKey: ["/api/helpers/online"] 
  });

  const { data: payments = [] } = useQuery<Payment[]>({
    queryKey: ["/api/payments"]
  });

  const { data: bookings = [] } = useQuery<Booking[]>({
    queryKey: ["/api/bookings"]
  });

  // Calculate revenue statistics
  const totalRevenue = payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
  const platformRevenue = payments?.reduce((sum, payment) => sum + payment.platformAmount, 0) || 0;
  const studentRevenue = payments?.reduce((sum, payment) => sum + payment.studentAmount, 0) || 0;
  const pendingPayments = payments?.filter(payment => payment.status === "pending").length || 0;
  const completedPayments = payments?.filter(payment => payment.status === "completed").length || 0;

  const createPaymentMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          date: new Date().toISOString(),
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create payment');
      }
      
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/payments"] });
      setSimulateOpen(false);
    },
  });

  const updatePaymentStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number, status: string }) => {
      const response = await fetch(`/api/payments/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update payment status');
      }
      
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/payments"] });
    },
  });

  const handleSimulatePayment = () => {
    createPaymentMutation.mutate(paymentData);
  };

  const handleStatusChange = (id: number, status: string) => {
    updatePaymentStatusMutation.mutate({ id, status });
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="helpers">Helpers</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalRevenue / 100)}</div>
                <p className="text-xs text-muted-foreground">Lifetime sales</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Platform Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(platformRevenue / 100)}</div>
                <p className="text-xs text-muted-foreground">Platform earnings</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Student Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(studentRevenue / 100)}</div>
                <p className="text-xs text-muted-foreground">Paid to students</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingPayments}</div>
                <p className="text-xs text-muted-foreground">Awaiting processing</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="helpers">
          <Card>
            <CardHeader>
              <CardTitle>Active Helpers</CardTitle>
              <CardDescription>Manage student helpers and their availability.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Skills</TableHead>
                    <TableHead>Online</TableHead>
                    <TableHead>Verified</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {helpers?.map((helper) => (
                    <TableRow key={helper.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${helper.username}`} />
                            <AvatarFallback>{helper.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          {helper.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {helper.skills?.map((skill, i) => (
                            <Badge key={i} variant="outline">{skill}</Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Switch checked={helper.isOnline} />
                      </TableCell>
                      <TableCell>
                        <Switch checked={helper.verified} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payments">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Payments</CardTitle>
                <CardDescription>Track and manage all payments through the platform.</CardDescription>
              </div>
              <Dialog open={simulateOpen} onOpenChange={setSimulateOpen}>
                <DialogTrigger asChild>
                  <Button>Simulate Payment</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Simulate New Payment</DialogTitle>
                    <DialogDescription>
                      Create a test payment to simulate a transaction in the system.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="amount" className="text-right">
                        Amount (€)
                      </Label>
                      <Input
                        id="amount"
                        type="number"
                        className="col-span-3"
                        value={paymentData.amount}
                        onChange={(e) => setPaymentData({
                          ...paymentData,
                          amount: Number(e.target.value),
                          studentAmount: Math.round(Number(e.target.value) * 0.64),
                          platformAmount: Math.round(Number(e.target.value) * 0.36)
                        })}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="studentAmount" className="text-right">
                        Student Amount
                      </Label>
                      <Input
                        id="studentAmount"
                        type="number"
                        className="col-span-3"
                        value={paymentData.studentAmount}
                        onChange={(e) => setPaymentData({
                          ...paymentData,
                          studentAmount: Number(e.target.value),
                          platformAmount: paymentData.amount - Number(e.target.value)
                        })}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="platformAmount" className="text-right">
                        Platform Amount
                      </Label>
                      <Input
                        id="platformAmount"
                        type="number"
                        className="col-span-3"
                        value={paymentData.platformAmount}
                        onChange={(e) => setPaymentData({
                          ...paymentData,
                          platformAmount: Number(e.target.value),
                          studentAmount: paymentData.amount - Number(e.target.value)
                        })}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="method" className="text-right">
                        Payment Method
                      </Label>
                      <Select 
                        value={paymentData.method}
                        onValueChange={(value) => setPaymentData({...paymentData, method: value})}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cash">Cash</SelectItem>
                          <SelectItem value="online">Online</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="bookingId" className="text-right">
                        Booking ID
                      </Label>
                      <Input
                        id="bookingId"
                        type="number"
                        className="col-span-3"
                        value={paymentData.bookingId}
                        onChange={(e) => setPaymentData({...paymentData, bookingId: Number(e.target.value)})}
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button 
                      onClick={handleSimulatePayment}
                      disabled={createPaymentMutation.isPending}
                    >
                      {createPaymentMutation.isPending ? "Processing..." : "Create Payment"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Booking ID</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments?.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{payment.id}</TableCell>
                      <TableCell>{format(new Date(payment.date), 'MMM d, yyyy')}</TableCell>
                      <TableCell>{payment.bookingId}</TableCell>
                      <TableCell>{formatCurrency(payment.amount / 100)}</TableCell>
                      <TableCell>
                        <Badge variant={payment.method === 'online' ? 'default' : 'outline'}>
                          {payment.method.charAt(0).toUpperCase() + payment.method.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            payment.status === 'completed' ? 'success' : 
                            payment.status === 'pending' ? 'warning' : 'destructive'
                          }
                        >
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={payment.status}
                          onValueChange={(value) => handleStatusChange(payment.id, value)}
                          disabled={updatePaymentStatusMutation.isPending}
                        >
                          <SelectTrigger className="w-[130px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                  {payments.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        No payments found. Use "Simulate Payment" to create test data.
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
