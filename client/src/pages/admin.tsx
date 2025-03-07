import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { User, Service, Booking, Payment, ContactRequest } from "@shared/schema";
import { format } from "date-fns";

export default function Admin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch data
  const { data: users } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
  });

  const { data: services } = useQuery<Service[]>({
    queryKey: ["/api/admin/services"],
  });

  const { data: bookings } = useQuery<Booking[]>({
    queryKey: ["/api/admin/bookings"],
  });

  const { data: payments } = useQuery<Payment[]>({
    queryKey: ["/api/admin/payments"],
  });

  const { data: contactRequests } = useQuery<ContactRequest[]>({
    queryKey: ["/api/admin/contact-requests"],
  });

  // Mutations
  const updateUserMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<User> }) => {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error("Failed to update user");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({
        title: "Success",
        description: "User updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete user");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateContactRequestMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<ContactRequest> }) => {
      const response = await fetch(`/api/admin/contact-requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error("Failed to update contact request");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/contact-requests"] });
      toast({
        title: "Success",
        description: "Contact request updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <Tabs defaultValue="users">
        <TabsList className="mb-4">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="contact-requests">Contact Requests</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage all registered users and helpers</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Online</TableHead>
                    <TableHead>Verified</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users?.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === "helper" ? "default" : "secondary"}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={user.isOnline}
                          onCheckedChange={(checked) =>
                            updateUserMutation.mutate({
                              id: user.id,
                              updates: { isOnline: checked },
                            })
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={user.verified}
                          onCheckedChange={(checked) =>
                            updateUserMutation.mutate({
                              id: user.id,
                              updates: { verified: checked },
                            })
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">Edit</Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit User</DialogTitle>
                                <DialogDescription>
                                  Update user information
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                  <Label htmlFor="name">Name</Label>
                                  <Input
                                    id="name"
                                    defaultValue={user.name}
                                    onChange={(e) =>
                                      updateUserMutation.mutate({
                                        id: user.id,
                                        updates: { name: e.target.value },
                                      })
                                    }
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor="bio">Bio</Label>
                                  <Input
                                    id="bio"
                                    defaultValue={user.bio || ""}
                                    onChange={(e) =>
                                      updateUserMutation.mutate({
                                        id: user.id,
                                        updates: { bio: e.target.value },
                                      })
                                    }
                                  />
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              if (confirm("Are you sure you want to delete this user?")) {
                                deleteUserMutation.mutate(user.id);
                              }
                            }}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="services">
          <Card>
            <CardHeader>
              <CardTitle>Service Management</CardTitle>
              <CardDescription>Review and manage all services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>Here you can review and manage services.</p>
                {/* Service management UI will be added here */}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>Booking Management</CardTitle>
              <CardDescription>Monitor all bookings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>Here you can monitor and manage all bookings.</p>
                {/* Booking management UI will be added here */}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payment Management</CardTitle>
              <CardDescription>Payment overview and processing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>Here you can monitor and manage payments.</p>
                {/* Payment management UI will be added here */}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="contact-requests">
          <Card>
            <CardHeader>
              <CardTitle>Contact Requests</CardTitle>
              <CardDescription>Manage callback requests from clients</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Helper</TableHead>
                    <TableHead>Client Phone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contactRequests?.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        {format(new Date(request.createdAt), "PPp")}
                      </TableCell>
                      <TableCell>{request.helper?.name}</TableCell>
                      <TableCell>{request.clientPhone}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            request.status === "contacted"
                              ? "outline"
                              : request.status === "failed"
                              ? "destructive"
                              : "default"
                          }
                          className={
                            request.status === "contacted"
                              ? "bg-green-50 text-green-700"
                              : undefined
                          }
                        >
                          {request.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">Update</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Update Contact Request</DialogTitle>
                              <DialogDescription>
                                Update the status and add notes
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid gap-2">
                                <Label>Status</Label>
                                <Select
                                  defaultValue={request.status}
                                  onValueChange={(value) =>
                                    updateContactRequestMutation.mutate({
                                      id: request.id,
                                      updates: { status: value },
                                    })
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="contacted">Contacted</SelectItem>
                                    <SelectItem value="failed">Failed</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="grid gap-2">
                                <Label>Notes</Label>
                                <Textarea
                                  defaultValue={request.notes || ""}
                                  onChange={(e) =>
                                    updateContactRequestMutation.mutate({
                                      id: request.id,
                                      updates: { notes: e.target.value },
                                    })
                                  }
                                  placeholder="Add notes about the contact attempt..."
                                />
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
