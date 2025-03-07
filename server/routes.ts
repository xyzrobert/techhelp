import type { Express } from "express";
import { createServer } from "http";
import { db } from "./db";
import { users, contactRequests } from "@shared/schema";
import { eq, and } from "drizzle-orm";

// Create test helpers
const testHelpers = [
  {
    username: "techwhiz",
    password: "test123",
    name: "Alex Chen",
    role: "helper" as const,
    bio: "Computer Science student specializing in hardware repairs",
    skills: ["Hardware", "Networking", "Windows"],
    isOnline: true,
  },
  {
    username: "netguru",
    password: "test123",
    name: "Sarah Smith",
    role: "helper" as const,
    bio: "Network security specialist and PC troubleshooter",
    skills: ["Networking", "Security", "Linux"],
    isOnline: true,
  },
  {
    username: "codemaster",
    password: "test123",
    name: "James Wilson",
    role: "helper" as const,
    bio: "Software developer helping with programming issues",
    skills: ["Programming", "Web Development", "Mobile Apps"],
    isOnline: true,
  }
];

export async function registerRoutes(app: Express) {
  // Users
  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await db.query.users.findFirst({
        where: eq(users.id, parseInt(req.params.id))
      });
      
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  // Contact request
  app.post("/api/contact/:helperId", async (req, res) => {
    try {
      const helperId = parseInt(req.params.helperId);
      const { phoneNumber } = req.body;

      // Verify helper exists
      const helper = await db.query.users.findFirst({
        where: and(
          eq(users.id, helperId),
          eq(users.role, "helper")
        )
      });

      if (!helper) {
        res.status(404).json({ error: "Helper not found" });
        return;
      }

      // Create contact request
      const [request] = await db.insert(contactRequests)
        .values({
          helperId,
          clientPhone: phoneNumber,
        })
        .returning();

      // TODO: Send notification to helper (email/push notification)
      // For now, just log it
      console.log(`New contact request for helper ${helper.name}: ${phoneNumber}`);

      res.json(request);
    } catch (error) {
      console.error("Failed to create contact request:", error);
      res.status(500).json({ error: "Failed to create contact request" });
    }
  });

  // Get online helpers
  app.get("/api/helpers/online", async (req, res) => {
    try {
      const onlineHelpers = await db.query.users.findMany({
        where: and(
          eq(users.role, "helper"),
          eq(users.isOnline, true)
        )
      });
      
      // Remove passwords from response
      const helpersWithoutPasswords = onlineHelpers.map(helper => {
        const { password: _, ...helperWithoutPassword } = helper;
        return helperWithoutPassword;
      });
      
      res.json(helpersWithoutPasswords);
    } catch (error) {
      console.error("Failed to fetch online helpers:", error);
      res.status(500).json({ error: "Failed to fetch online helpers" });
    }
  });

  app.post("/api/users/:id/online", async (req, res) => {
    try {
      const parsedId = parseInt(req.params.id);
      const { isOnline } = req.body;

      const [user] = await db
        .update(users)
        .set({ isOnline })
        .where(eq(users.id, parsedId))
        .returning();

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ error: "Failed to update user status" });
    }
  });

  // Create test helpers
  for (const helper of testHelpers) {
    try {
      // Check if helper already exists
      const existing = await db.query.users.findFirst({
        where: eq(users.username, helper.username)
      });

      if (!existing) {
        // Insert helper with isOnline already set to true
        const [user] = await db.insert(users).values(helper).returning();
        console.log(`Created test helper: ${helper.name}`);
      }
    } catch (error) {
      console.error("Error creating test helper:", error);
    }
  }

  const httpServer = createServer(app);
  return httpServer;
}