import { db } from "./db";
import { eq, and, desc, gte, lte } from "drizzle-orm";
import {
  projects,
  chatMessages,
  newsletter,
  githubUpdates,
  pageViews,
  visitorSessions,
  interactionEvents,
  type Project,
  type InsertProject,
  type ChatMessage,
  type InsertChatMessage,
  type Newsletter,
  type InsertNewsletter,
  type GithubUpdate,
  type InsertGithubUpdate,
  type PageView,
  type InsertPageView,
  type VisitorSession,
  type InsertVisitorSession,
  type InteractionEvent,
  type InsertInteractionEvent,
} from "@shared/schema";

export interface IStorage {
  // Projects
  getProjects(): Promise<Project[]>;
  addProject(project: InsertProject): Promise<Project>;

  // Chat
  getChatMessages(): Promise<ChatMessage[]>;
  addChatMessage(message: InsertChatMessage): Promise<ChatMessage>;

  // Newsletter
  addNewsletterSubscription(sub: InsertNewsletter): Promise<Newsletter>;
  isEmailSubscribed(email: string): Promise<boolean>;

  // GitHub Updates
  getGithubUpdates(): Promise<GithubUpdate[]>;
  updateGithubData(updates: InsertGithubUpdate[]): Promise<GithubUpdate[]>;

  // Analytics
  recordPageView(view: InsertPageView): Promise<PageView>;
  startVisitorSession(session: InsertVisitorSession): Promise<VisitorSession>;
  updateVisitorSession(sessionId: string, endTime: Date): Promise<VisitorSession>;
  recordInteractionEvent(event: InsertInteractionEvent): Promise<InteractionEvent>;

  // Analytics Queries
  getPageViews(startDate: Date, endDate: Date): Promise<PageView[]>;
  getVisitorSessions(startDate: Date, endDate: Date): Promise<VisitorSession[]>;
  getInteractionEvents(startDate: Date, endDate: Date): Promise<InteractionEvent[]>;
  getVisitorMetrics(startDate: Date, endDate: Date): Promise<{
    totalVisitors: number;
    averageSessionDuration: number;
    popularPages: { path: string; views: number }[];
  }>;
}

export class DatabaseStorage implements IStorage {
  async getProjects(): Promise<Project[]> {
    return db.select().from(projects);
  }

  async addProject(project: InsertProject): Promise<Project> {
    const [inserted] = await db.insert(projects).values(project).returning();
    return inserted;
  }

  async getChatMessages(): Promise<ChatMessage[]> {
    return db.select().from(chatMessages).orderBy(chatMessages.timestamp);
  }

  async addChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const [inserted] = await db.insert(chatMessages).values(message).returning();
    return inserted;
  }

  async addNewsletterSubscription(sub: InsertNewsletter): Promise<Newsletter> {
    const [inserted] = await db.insert(newsletter).values(sub).returning();
    return inserted;
  }

  async isEmailSubscribed(email: string): Promise<boolean> {
    const [existing] = await db
      .select()
      .from(newsletter)
      .where(eq(newsletter.email, email));
    return !!existing;
  }

  async getGithubUpdates(): Promise<GithubUpdate[]> {
    return db
      .select()
      .from(githubUpdates)
      .orderBy(desc(githubUpdates.lastUpdated));
  }

  async updateGithubData(updates: InsertGithubUpdate[]): Promise<GithubUpdate[]> {
    // Delete existing records and insert new ones
    await db.delete(githubUpdates);
    return db.insert(githubUpdates).values(updates).returning();
  }

  async recordPageView(view: InsertPageView): Promise<PageView> {
    const [inserted] = await db.insert(pageViews).values(view).returning();
    return inserted;
  }

  async startVisitorSession(session: InsertVisitorSession): Promise<VisitorSession> {
    const [inserted] = await db.insert(visitorSessions).values(session).returning();
    return inserted;
  }

  async updateVisitorSession(sessionId: string, endTime: Date): Promise<VisitorSession> {
    const [updated] = await db
      .update(visitorSessions)
      .set({ endTime })
      .where(eq(visitorSessions.sessionId, sessionId))
      .returning();
    return updated;
  }

  async recordInteractionEvent(event: InsertInteractionEvent): Promise<InteractionEvent> {
    const [inserted] = await db.insert(interactionEvents).values(event).returning();
    return inserted;
  }

  async getPageViews(startDate: Date, endDate: Date): Promise<PageView[]> {
    return db
      .select()
      .from(pageViews)
      .where(
        and(
          gte(pageViews.timestamp, startDate),
          lte(pageViews.timestamp, endDate)
        )
      )
      .orderBy(desc(pageViews.timestamp));
  }

  async getVisitorSessions(startDate: Date, endDate: Date): Promise<VisitorSession[]> {
    return db
      .select()
      .from(visitorSessions)
      .where(
        and(
          gte(visitorSessions.startTime, startDate),
          lte(visitorSessions.startTime, endDate)
        )
      )
      .orderBy(desc(visitorSessions.startTime));
  }

  async getInteractionEvents(startDate: Date, endDate: Date): Promise<InteractionEvent[]> {
    return db
      .select()
      .from(interactionEvents)
      .where(
        and(
          gte(interactionEvents.timestamp, startDate),
          lte(interactionEvents.timestamp, endDate)
        )
      )
      .orderBy(desc(interactionEvents.timestamp));
  }

  async getVisitorMetrics(startDate: Date, endDate: Date): Promise<{
    totalVisitors: number;
    averageSessionDuration: number;
    popularPages: { path: string; views: number }[];
  }> {
    // Get sessions within date range
    const sessions = await this.getVisitorSessions(startDate, endDate);
    const views = await this.getPageViews(startDate, endDate);

    // Calculate total unique visitors
    const uniqueVisitors = new Set(sessions.map(s => s.sessionId)).size;

    // Calculate average session duration
    const completedSessions = sessions.filter(s => s.endTime);
    const totalDuration = completedSessions.reduce((sum, session) => {
      return sum + (session.endTime!.getTime() - session.startTime.getTime());
    }, 0);
    const avgDuration = completedSessions.length ? totalDuration / completedSessions.length : 0;

    // Calculate popular pages
    const pageCount = views.reduce((acc, view) => {
      acc[view.path] = (acc[view.path] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const popularPages = Object.entries(pageCount)
      .map(([path, views]) => ({ path, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);

    return {
      totalVisitors: uniqueVisitors,
      averageSessionDuration: avgDuration,
      popularPages,
    };
  }
}

export const storage = new DatabaseStorage();