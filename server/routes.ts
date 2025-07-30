import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./auth";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  setupAuth(app);

  // Seed events on startup
  await storage.seedEvents();

  // Events routes - Get all events (for display with access control)
  app.get("/api/events", isAuthenticated, async (req: any, res) => {
    try {
      const events = await storage.getAllEvents();
      res.json(events);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  // Get events accessible to user tier (for filtered view)
  app.get("/api/events/accessible", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const events = await storage.getEventsForTier(user.tier);
      res.json(events);
    } catch (error) {
      console.error("Error fetching accessible events:", error);
      res.status(500).json({ message: "Failed to fetch accessible events" });
    }
  });

  // Tier upgrade route
  app.patch("/api/user/tier", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { tier } = z.object({ tier: z.enum(["free", "silver", "gold", "platinum"]) }).parse(req.body);
      
      const updatedUser = await storage.updateUserTier(userId, tier);
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user tier:", error);
      res.status(500).json({ message: "Failed to update user tier" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
