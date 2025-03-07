import type { Express } from "express";
import { db } from "./db";
import { users, services, bookings, payments, contactRequests } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export function registerAdminRoutes(app: Express) {
  // Get all users
  app.get("/api/admin/users", async (req, res) => {
    try {
      const allUsers = await db.query.users.findMany();
      const usersWithoutPasswords = allUsers.map(user => {
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      res.json(usersWithoutPasswords);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  // Update user
  app.patch("/api/admin/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const updates = req.body;

      // Don't allow updating password through this endpoint
      const { password: _, ...safeUpdates } = updates;

      const [updatedUser] = await db
        .update(users)
        .set(safeUpdates)
        .where(eq(users.id, userId))
        .returning();

      if (!updatedUser) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      const { password: __, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Failed to update user:", error);
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  // Delete user
  app.delete("/api/admin/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const [deletedUser] = await db
        .delete(users)
        .where(eq(users.id, userId))
        .returning();

      if (!deletedUser) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Failed to delete user:", error);
      res.status(500).json({ error: "Failed to delete user" });
    }
  });

  // Get all services
  app.get("/api/admin/services", async (req, res) => {
    try {
      const allServices = await db.query.services.findMany();
      res.json(allServices);
    } catch (error) {
      console.error("Failed to fetch services:", error);
      res.status(500).json({ error: "Failed to fetch services" });
    }
  });

  // Update service
  app.patch("/api/admin/services/:id", async (req, res) => {
    try {
      const serviceId = parseInt(req.params.id);
      const updates = req.body;

      const [updatedService] = await db
        .update(services)
        .set(updates)
        .where(eq(services.id, serviceId))
        .returning();

      if (!updatedService) {
        res.status(404).json({ error: "Service not found" });
        return;
      }

      res.json(updatedService);
    } catch (error) {
      console.error("Failed to update service:", error);
      res.status(500).json({ error: "Failed to update service" });
    }
  });

  // Delete service
  app.delete("/api/admin/services/:id", async (req, res) => {
    try {
      const serviceId = parseInt(req.params.id);
      const [deletedService] = await db
        .delete(services)
        .where(eq(services.id, serviceId))
        .returning();

      if (!deletedService) {
        res.status(404).json({ error: "Service not found" });
        return;
      }

      res.json({ message: "Service deleted successfully" });
    } catch (error) {
      console.error("Failed to delete service:", error);
      res.status(500).json({ error: "Failed to delete service" });
    }
  });

  // Get all bookings
  app.get("/api/admin/bookings", async (req, res) => {
    try {
      const allBookings = await db.query.bookings.findMany();
      res.json(allBookings);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
      res.status(500).json({ error: "Failed to fetch bookings" });
    }
  });

  // Update booking status
  app.patch("/api/admin/bookings/:id", async (req, res) => {
    try {
      const bookingId = parseInt(req.params.id);
      const { status } = req.body;

      const [updatedBooking] = await db
        .update(bookings)
        .set({ status })
        .where(eq(bookings.id, bookingId))
        .returning();

      if (!updatedBooking) {
        res.status(404).json({ error: "Booking not found" });
        return;
      }

      res.json(updatedBooking);
    } catch (error) {
      console.error("Failed to update booking:", error);
      res.status(500).json({ error: "Failed to update booking" });
    }
  });

  // Get all payments
  app.get("/api/admin/payments", async (req, res) => {
    try {
      const allPayments = await db.query.payments.findMany();
      res.json(allPayments);
    } catch (error) {
      console.error("Failed to fetch payments:", error);
      res.status(500).json({ error: "Failed to fetch payments" });
    }
  });

  // Update payment status
  app.patch("/api/admin/payments/:id", async (req, res) => {
    try {
      const paymentId = parseInt(req.params.id);
      const { status } = req.body;

      const [updatedPayment] = await db
        .update(payments)
        .set({ status })
        .where(eq(payments.id, paymentId))
        .returning();

      if (!updatedPayment) {
        res.status(404).json({ error: "Payment not found" });
        return;
      }

      res.json(updatedPayment);
    } catch (error) {
      console.error("Failed to update payment:", error);
      res.status(500).json({ error: "Failed to update payment" });
    }
  });

  // Get all contact requests
  app.get("/api/admin/contact-requests", async (req, res) => {
    try {
      const requests = await db.query.contactRequests.findMany({
        orderBy: [desc(contactRequests.createdAt)],
        with: {
          helper: {
            columns: {
              id: true,
              name: true,
              username: true,
            },
          },
        },
      });
      res.json(requests);
    } catch (error) {
      console.error("Failed to fetch contact requests:", error);
      res.status(500).json({ error: "Failed to fetch contact requests" });
    }
  });

  // Update contact request status
  app.patch("/api/admin/contact-requests/:id", async (req, res) => {
    try {
      const requestId = parseInt(req.params.id);
      const { status, notes } = req.body;

      const [updatedRequest] = await db
        .update(contactRequests)
        .set({ 
          status, 
          notes,
          updatedAt: new Date()
        })
        .where(eq(contactRequests.id, requestId))
        .returning();

      if (!updatedRequest) {
        res.status(404).json({ error: "Contact request not found" });
        return;
      }

      res.json(updatedRequest);
    } catch (error) {
      console.error("Failed to update contact request:", error);
      res.status(500).json({ error: "Failed to update contact request" });
    }
  });
} 