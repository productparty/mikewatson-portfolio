import { db, hasDatabase } from "./db";
import { eq, and, desc, gte, lte } from "drizzle-orm";
import {
  projects,
  chatMessages,
  newsletter,
  githubUpdates,
  pageViews,
  visitorSessions,
  interactionEvents,
  // Note: promptEvaluations and evaluationResults are now in-memory only
  type PromptEvaluation,
  type EvaluationResult,
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
  type InsertPromptEvaluation,
  type InsertEvaluationResult,
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

  // Prompt Evaluations
  createPromptEvaluation(evaluation: InsertPromptEvaluation): Promise<PromptEvaluation>;
  createEvaluationResult(result: InsertEvaluationResult): Promise<EvaluationResult>;
  getEvaluationHistory(limit?: number): Promise<(PromptEvaluation & { results: EvaluationResult[] })[]>;
  getEvaluationById(id: number): Promise<PromptEvaluation & { results: EvaluationResult[] } | null>;
}

export class DatabaseStorage implements IStorage {
  // Database-dependent methods - only work if DATABASE_URL is set
  async getProjects(): Promise<Project[]> {
    if (!hasDatabase()) {
      throw new Error("Database not configured. DATABASE_URL is required for this feature.");
    }
    return db.select().from(projects);
  }

  async addProject(project: InsertProject): Promise<Project> {
    if (!hasDatabase()) {
      throw new Error("Database not configured. DATABASE_URL is required for this feature.");
    }
    const [inserted] = await db.insert(projects).values(project).returning();
    return inserted;
  }

  async getChatMessages(): Promise<ChatMessage[]> {
    if (!hasDatabase()) {
      return []; // Return empty array if no database
    }
    return db.select().from(chatMessages).orderBy(chatMessages.timestamp);
  }

  async addChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    if (!hasDatabase()) {
      throw new Error("Database not configured. DATABASE_URL is required for this feature.");
    }
    const [inserted] = await db.insert(chatMessages).values(message).returning();
    return inserted;
  }

  async addNewsletterSubscription(sub: InsertNewsletter): Promise<Newsletter> {
    if (!hasDatabase()) {
      throw new Error("Database not configured. DATABASE_URL is required for this feature.");
    }
    const [inserted] = await db.insert(newsletter).values(sub).returning();
    return inserted;
  }

  async isEmailSubscribed(email: string): Promise<boolean> {
    if (!hasDatabase()) {
      return false;
    }
    const [existing] = await db
      .select()
      .from(newsletter)
      .where(eq(newsletter.email, email));
    return !!existing;
  }

  async getGithubUpdates(): Promise<GithubUpdate[]> {
    if (!hasDatabase()) {
      return [];
    }
    return db
      .select()
      .from(githubUpdates)
      .orderBy(desc(githubUpdates.lastUpdated));
  }

  async updateGithubData(updates: InsertGithubUpdate[]): Promise<GithubUpdate[]> {
    if (!hasDatabase()) {
      throw new Error("Database not configured. DATABASE_URL is required for this feature.");
    }
    // Delete existing records and insert new ones
    await db.delete(githubUpdates);
    return db.insert(githubUpdates).values(updates).returning();
  }

  async recordPageView(view: InsertPageView): Promise<PageView> {
    if (!hasDatabase()) {
      // Return a mock object if no database
      return { ...view, id: Date.now(), timestamp: view.timestamp || new Date() } as PageView;
    }
    const [inserted] = await db.insert(pageViews).values(view).returning();
    return inserted;
  }

  async startVisitorSession(session: InsertVisitorSession): Promise<VisitorSession> {
    if (!hasDatabase()) {
      return { ...session, id: Date.now(), startTime: session.startTime || new Date() } as VisitorSession;
    }
    const [inserted] = await db.insert(visitorSessions).values(session).returning();
    return inserted;
  }

  async updateVisitorSession(sessionId: string, endTime: Date): Promise<VisitorSession> {
    if (!hasDatabase()) {
      throw new Error("Database not configured. DATABASE_URL is required for this feature.");
    }
    const [updated] = await db
      .update(visitorSessions)
      .set({ endTime })
      .where(eq(visitorSessions.sessionId, sessionId))
      .returning();
    return updated;
  }

  async recordInteractionEvent(event: InsertInteractionEvent): Promise<InteractionEvent> {
    if (!hasDatabase()) {
      return { ...event, id: Date.now(), timestamp: event.timestamp || new Date() } as InteractionEvent;
    }
    const [inserted] = await db.insert(interactionEvents).values(event).returning();
    return inserted;
  }

  async getPageViews(startDate: Date, endDate: Date): Promise<PageView[]> {
    if (!hasDatabase()) {
      return [];
    }
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
    if (!hasDatabase()) {
      return [];
    }
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
    if (!hasDatabase()) {
      return [];
    }
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
    if (!hasDatabase()) {
      return {
        totalVisitors: 0,
        averageSessionDuration: 0,
        popularPages: [],
      };
    }
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

  // In-memory storage for prompt evaluations (no database needed)
  private evaluationStore: (PromptEvaluation & { results: EvaluationResult[] })[] = [];
  private nextEvaluationId = 1;
  private nextResultId = 1;

  async createPromptEvaluation(
    evaluation: InsertPromptEvaluation
  ): Promise<PromptEvaluation> {
    const newEvaluation: PromptEvaluation = {
      id: this.nextEvaluationId++,
      promptText: evaluation.promptText,
      provider: evaluation.provider as "claude" | "openai",
      model: evaluation.model,
      testScenario: evaluation.testScenario,
      variationName: evaluation.variationName || null,
      createdAt: new Date(),
    };
    
    // Add to store with empty results array
    this.evaluationStore.push({ ...newEvaluation, results: [] });
    
    return newEvaluation;
  }

  async createEvaluationResult(
    result: InsertEvaluationResult
  ): Promise<EvaluationResult> {
    const newResult: EvaluationResult = {
      id: this.nextResultId++,
      evaluationId: result.evaluationId,
      planOutput: result.planOutput,
      qualityScores: result.qualityScores as any,
      assertionsPassed: result.assertionsPassed as any,
      feedback: result.feedback || null,
      createdAt: new Date(),
    };

    // Find the evaluation and add the result
    const evaluation = this.evaluationStore.find(
      (e) => e.id === result.evaluationId
    );
    if (evaluation) {
      evaluation.results.push(newResult);
    }

    return newResult;
  }

  async getEvaluationHistory(
    limit: number = 50
  ): Promise<(PromptEvaluation & { results: EvaluationResult[] })[]> {
    return this.evaluationStore
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async getEvaluationById(
    id: number
  ): Promise<(PromptEvaluation & { results: EvaluationResult[] }) | null> {
    return this.evaluationStore.find((e) => e.id === id) || null;
  }
}

export const storage = new DatabaseStorage();