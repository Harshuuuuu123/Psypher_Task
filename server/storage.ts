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
      // Free Tier Events
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
        title: "Tech Meetup & Networking",
        description: "Connect with local developers and tech enthusiasts. Pizza and drinks provided. Perfect for beginners!",
        eventDate: new Date("2025-01-08T18:30:00Z"),
        imageUrl: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        tier: "free",
      },
      {
        title: "Yoga in the Park",
        description: "Start your weekend with relaxing yoga session in Central Park. Bring your own mat and enjoy nature!",
        eventDate: new Date("2025-01-11T08:00:00Z"),
        imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        tier: "free",
      },
      
      // Silver Tier Events
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
        title: "Culinary Masterclass",
        description: "Learn from Michelin-starred chefs in this hands-on cooking experience. Limited to 20 participants.",
        eventDate: new Date("2025-01-18T15:00:00Z"),
        imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        tier: "silver",
      },
      
      // Gold Tier Events
      {
        title: "VIP Networking Gala",
        description: "High-profile networking event with industry executives and thought leaders. Black-tie dress code.",
        eventDate: new Date("2025-01-25T19:30:00Z"),
        imageUrl: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        tier: "gold",
      },
      {
        title: "Private Art Auction",
        description: "Exclusive art auction featuring rare pieces from renowned artists. Champagne reception included.",
        eventDate: new Date("2025-02-02T18:00:00Z"),
        imageUrl: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        tier: "gold",
      },
      {
        title: "Investment Summit",
        description: "Meet with top-tier investors and venture capitalists. Pitch opportunities for qualified startups.",
        eventDate: new Date("2025-02-15T10:00:00Z"),
        imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        tier: "gold",
      },
      
      // Platinum Tier Events
      {
        title: "Exclusive Members Summit",
        description: "Ultra-exclusive summit with Fortune 500 CEOs and industry pioneers. Platinum members only.",
        eventDate: new Date("2025-02-10T09:00:00Z"),
        imageUrl: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        tier: "platinum",
      },
      {
        title: "Private Jet Experience",
        description: "Luxury travel experience to exclusive destination with world-class amenities and networking.",
        eventDate: new Date("2025-03-05T06:00:00Z"),
        imageUrl: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        tier: "platinum",
      },
    ];

    await db.insert(events).values(seedEvents);
  }
}

export const storage = new DatabaseStorage();
