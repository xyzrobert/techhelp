import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertServiceSchema, insertBookingSchema, insertReviewSchema } from "@shared/schema";
import { z } from "zod";

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
      const { isOnline } = z.object({ isOnline: z.boolean() }).parse(req.body);
      const user = await storage.updateUserOnlineStatus(parseInt(req.params.id), isOnline);
      res.json(user);
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

  const httpServer = createServer(app);
  // Generate test helpers if none exist
  (async () => {
    const helpers = await storage.getOnlineHelpers();
    if (helpers.length === 0) {
      const testHelpers = [
        {
          username: "techwhiz",
          password: "test123",
          name: "Alex Chen",
          role: "helper",
          bio: "Computer Science student specializing in hardware repairs",
          skills: ["Hardware", "Networking", "Windows"],
          verified: true
        },
        {
          username: "netguru",
          password: "test123",
          name: "Sarah Smith",
          role: "helper",
          bio: "Network security specialist and PC troubleshooter",
          skills: ["Networking", "Security", "Linux"],
          verified: true
        },
        {
          username: "codemaster",
          password: "test123",
          name: "James Wilson",
          role: "helper",
          bio: "Software developer helping with programming issues",
          skills: ["Programming", "Web Development", "Mobile Apps"],
          verified: false
        }
      ];

      for (const helper of testHelpers) {
        await storage.createUser(helper);
      }
    }
  })();
  return httpServer;
}