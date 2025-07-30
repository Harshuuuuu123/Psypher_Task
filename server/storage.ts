import {
  users,
  events,
  type User,
  type InsertUser,
  type Event,
  type InsertEvent,
  type Tier,
} from "@shared/schema";
import { db } from "./db";
import { eq, lte, sql } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserTier(id: string, tier: Tier): Promise<User>;
  
  // Event operations
  getEventsForTier(userTier: Tier): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;
  seedEvents(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  async updateUserTier(id: string, tier: Tier): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ tier, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Event operations
  async getEventsForTier(userTier: Tier): Promise<Event[]> {
    const tierOrder = { free: 0, silver: 1, gold: 2, platinum: 3 };
    const userTierLevel = tierOrder[userTier];
    
    // Get events where tier level is <= user tier level
    return await db.select().from(events).where(
      sql`CASE 
        WHEN ${events.tier} = 'free' THEN 0
        WHEN ${events.tier} = 'silver' THEN 1  
        WHEN ${events.tier} = 'gold' THEN 2
        WHEN ${events.tier} = 'platinum' THEN 3
      END <= ${userTierLevel}`
    );
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const [newEvent] = await db.insert(events).values(event).returning();
    return newEvent;
  }

  async seedEvents(): Promise<void> {
    // Check if events already exist
    const existingEvents = await db.select().from(events).limit(1);
    if (existingEvents.length > 0) {
      return; // Events already seeded
    }

    const seedEvents: InsertEvent[] = [
      {
        title: "Community Music Festival",
        description: "Join us for an amazing evening of local music and community celebration. Free entry for all music lovers!",
        eventDate: new Date("2024-12-15T19:00:00Z"),
        imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        tier: "free",
      },
      {
        title: "Local Art Gallery Opening",
        description: "Discover emerging local artists at our monthly gallery opening. Refreshments and networking included.",
        eventDate: new Date("2024-12-20T18:00:00Z"),
        imageUrl: "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        tier: "free",
      },
      {
        title: "Exclusive Business Workshop",
        description: "Advanced entrepreneurship workshop with industry leaders. Limited to Silver members and above.",
        eventDate: new Date("2025-01-05T14:00:00Z"),
        imageUrl: "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        tier: "silver",
      },
      {
        title: "Premium Wine Tasting",
        description: "Curated wine tasting experience with sommelier-guided sessions. Exclusive to Silver tier and above.",
        eventDate: new Date("2025-01-12T17:00:00Z"),
        imageUrl: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        tier: "silver",
      },
      {
        title: "VIP Networking Gala",
        description: "High-profile networking event with industry executives and thought leaders.",
        eventDate: new Date("2025-01-25T19:30:00Z"),
        imageUrl: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        tier: "gold",
      },
      {
        title: "Exclusive Members Summit",
        description: "Ultra-exclusive summit with C-level executives and industry pioneers. Platinum members only.",
        eventDate: new Date("2025-02-10T09:00:00Z"),
        imageUrl: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        tier: "platinum",
      },
    ];

    await db.insert(events).values(seedEvents);
  }
}

export const storage = new DatabaseStorage();
