import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertServiceSchema, insertBookingSchema, insertReviewSchema } from "@shared/schema";
import { z } from "zod";

// Create test helpers
const testHelpers = [
  {
    username: "techwhiz",
    password: "test123",
    name: "Alex Chen",
    role: "helper" as const,
    bio: "Computer Science student specializing in hardware repairs",
    skills: ["Hardware", "Networking", "Windows"],
  },
  {
    username: "netguru",
    password: "test123",
    name: "Sarah Smith",
    role: "helper" as const,
    bio: "Network security specialist and PC troubleshooter",
    skills: ["Networking", "Security", "Linux"],
  },
  {
    username: "codemaster",
    password: "test123",
    name: "James Wilson",
    role: "helper" as const,
    bio: "Software developer helping with programming issues",
    skills: ["Programming", "Web Development", "Mobile Apps"],
  }
];

export async function registerRoutes(app: Express) {
  // Users
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: "Invalid user data" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    const user = await storage.getUser(parseInt(req.params.id));
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json(user);
  });

  app.post("/api/users/:id/online", async (req, res) => {
    try {
      const parsedId = parseInt(req.params.id);
      const { isOnline } = z.object({ 
        isOnline: z.boolean() 
      }).parse(req.body);

      const user = await storage.updateUserOnlineStatus(parsedId, isOnline);
      res.json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid request format. Expected: { isOnline: boolean }" });
      } else {
        res.status(404).json({ error: "User not found or invalid request" });
      }
    }
  });

  // Contact endpoint
  app.post("/api/contact/:id", async (req, res) => {
    try {
      const { phoneNumber } = z.object({
        phoneNumber: z.string().min(1, "Phone number is required")
      }).parse(req.body);

      const helper = await storage.getUser(parseInt(req.params.id));
      if (!helper) {
        res.status(404).json({ error: "Helper not found" });
        return;
      }

      // For now, just log the contact request
      console.log(`Contact request for helper ${helper.name} from ${phoneNumber}`);

      res.json({ message: "Contact request sent" });
    } catch (error) {
      res.status(400).json({ error: "Invalid request" });
    }
  });

  app.get("/api/helpers/online", async (_req, res) => {
    const helpers = await storage.getOnlineHelpers();
    res.json(helpers);
  });

  // Services
  app.post("/api/services", async (req, res) => {
    try {
      const serviceData = insertServiceSchema.parse(req.body);
      const service = await storage.createService(serviceData);
      res.json(service);
    } catch (error) {
      res.status(400).json({ error: "Invalid service data" });
    }
  });

  app.get("/api/services/search", async (req, res) => {
    const category = req.query.category as string | undefined;
    const services = await storage.searchServices(category);
    res.json(services);
  });

  app.get("/api/services/:id", async (req, res) => {
    const service = await storage.getService(parseInt(req.params.id));
    if (!service) {
      res.status(404).json({ error: "Service not found" });
      return;
    }
    res.json(service);
  });

  app.get("/api/helpers/:id/services", async (req, res) => {
    const services = await storage.getHelperServices(parseInt(req.params.id));
    res.json(services);
  });

  // Bookings
  app.post("/api/bookings", async (req, res) => {
    try {
      const bookingData = insertBookingSchema.parse(req.body);
      const booking = await storage.createBooking(bookingData);
      res.json(booking);
    } catch (error) {
      res.status(400).json({ error: "Invalid booking data" });
    }
  });

  app.get("/api/bookings/:id", async (req, res) => {
    const booking = await storage.getBooking(parseInt(req.params.id));
    if (!booking) {
      res.status(404).json({ error: "Booking not found" });
      return;
    }
    res.json(booking);
  });

  app.patch("/api/bookings/:id/status", async (req, res) => {
    try {
      const { status } = z.object({
        status: z.enum(["pending", "accepted", "completed", "cancelled"])
      }).parse(req.body);

      const booking = await storage.updateBookingStatus(parseInt(req.params.id), status);
      res.json(booking);
    } catch (error) {
      res.status(400).json({ error: "Invalid status update" });
    }
  });

  // Reviews
  app.post("/api/reviews", async (req, res) => {
    try {
      const reviewData = insertReviewSchema.parse(req.body);
      const review = await storage.createReview(reviewData);
      res.json(review);
    } catch (error) {
      res.status(400).json({ error: "Invalid review data" });
    }
  });

  app.get("/api/services/:id/reviews", async (req, res) => {
    const reviews = await storage.getServiceReviews(parseInt(req.params.id));
    res.json(reviews);
  });

  // Payments
  app.post("/api/payments", async (req, res) => {
    try {
      const paymentData = insertPaymentSchema.parse(req.body);
      const payment = await storage.createPayment(paymentData);
      res.json(payment);
    } catch (error) {
      res.status(400).json({ error: "Invalid payment data" });
    }
  });

  app.get("/api/payments", async (_req, res) => {
    const payments = await storage.getAllPayments();
    res.json(payments);
  });

  app.get("/api/payments/:id", async (req, res) => {
    const payment = await storage.getPayment(parseInt(req.params.id));
    if (!payment) {
      res.status(404).json({ error: "Payment not found" });
      return;
    }
    res.json(payment);
  });

  app.get("/api/bookings/:id/payment", async (req, res) => {
    const payment = await storage.getBookingPayment(parseInt(req.params.id));
    if (!payment) {
      res.status(404).json({ error: "Payment not found for this booking" });
      return;
    }
    res.json(payment);
  });

  app.patch("/api/payments/:id/status", async (req, res) => {
    try {
      const { status } = z.object({
        status: z.enum(["pending", "completed", "cancelled"])
      }).parse(req.body);

      const payment = await storage.updatePaymentStatus(parseInt(req.params.id), status);
      res.json(payment);
    } catch (error) {
      res.status(400).json({ error: "Invalid status update" });
    }
  });

  // Create test helpers
  for (const helper of testHelpers) {
    try {
      const user = await storage.createUser(helper);
      await storage.updateUserOnlineStatus(user.id, true);
    } catch (error) {
      console.error("Error creating test helper:", error);
    }
  }

  const httpServer = createServer(app);
  return httpServer;
}