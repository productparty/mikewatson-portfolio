import { pgTable, text, serial, timestamp, boolean, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  link: text("link").notNull(),
  tags: text("tags").array().notNull(),
});

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  isBot: boolean("is_bot").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const newsletter = pgTable("newsletter", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
});

export const githubUpdates = pgTable("github_updates", {
  id: serial("id").primaryKey(),
  repoName: text("repo_name").notNull(),
  description: text("description"),
  stars: text("stars").notNull(),
  lastUpdated: timestamp("last_updated").notNull(),
  language: text("language"),
  url: text("url").notNull(),
});

export const pageViews = pgTable("page_views", {
  id: serial("id").primaryKey(),
  path: text("path").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  sessionId: text("session_id").notNull(),
  referrer: text("referrer"),
  userAgent: text("user_agent"),
  // Add week number for easier weekly comparisons
  weekNumber: integer("week_number").notNull(),
  weekYear: integer("week_year").notNull(),
});

export const visitorSessions = pgTable("visitor_sessions", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull().unique(),
  startTime: timestamp("start_time").notNull().defaultNow(),
  endTime: timestamp("end_time"),
  deviceType: text("device_type"),
  browser: text("browser"),
  country: text("country"),
  weekNumber: integer("week_number").notNull(),
  weekYear: integer("week_year").notNull(),
});

export const interactionEvents = pgTable("interaction_events", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  eventType: text("event_type").notNull(),
  eventData: text("event_data"),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const promptEvaluations = pgTable("prompt_evaluations", {
  id: serial("id").primaryKey(),
  promptText: text("prompt_text").notNull(),
  provider: text("provider").notNull(), // 'claude' | 'openai'
  model: text("model").notNull(),
  testScenario: text("test_scenario").notNull(),
  variationName: text("variation_name"), // 'A', 'B', 'C', etc.
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const evaluationResults = pgTable("evaluation_results", {
  id: serial("id").primaryKey(),
  evaluationId: integer("evaluation_id").notNull().references(() => promptEvaluations.id, { onDelete: "cascade" }),
  planOutput: text("plan_output").notNull(),
  qualityScores: jsonb("quality_scores").notNull(), // { structure: number, completeness: number, clarity: number }
  assertionsPassed: jsonb("assertions_passed"), // { hasOverview: boolean, hasPlan: boolean, hasTodos: boolean, validMarkdown: boolean }
  feedback: text("feedback"), // Detailed feedback text
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertProjectSchema = createInsertSchema(projects).omit({ id: true });
export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({ id: true });
export const insertNewsletterSchema = createInsertSchema(newsletter).omit({ id: true });
export const insertGithubUpdateSchema = createInsertSchema(githubUpdates).omit({ id: true });
export const insertPageViewSchema = createInsertSchema(pageViews).omit({ id: true });
export const insertVisitorSessionSchema = createInsertSchema(visitorSessions).omit({ id: true });
export const insertInteractionEventSchema = createInsertSchema(interactionEvents).omit({ id: true });
export const insertPromptEvaluationSchema = createInsertSchema(promptEvaluations).omit({ id: true, createdAt: true });
export const insertEvaluationResultSchema = createInsertSchema(evaluationResults).omit({ id: true, createdAt: true });

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type Newsletter = typeof newsletter.$inferSelect;
export type InsertNewsletter = z.infer<typeof insertNewsletterSchema>;
export type GithubUpdate = typeof githubUpdates.$inferSelect;
export type InsertGithubUpdate = z.infer<typeof insertGithubUpdateSchema>;
export type PageView = typeof pageViews.$inferSelect;
export type InsertPageView = z.infer<typeof insertPageViewSchema>;
export type VisitorSession = typeof visitorSessions.$inferSelect;
export type InsertVisitorSession = z.infer<typeof insertVisitorSessionSchema>;
export type InteractionEvent = typeof interactionEvents.$inferSelect;
export type InsertInteractionEvent = z.infer<typeof insertInteractionEventSchema>;
export type PromptEvaluation = typeof promptEvaluations.$inferSelect;
export type InsertPromptEvaluation = z.infer<typeof insertPromptEvaluationSchema>;
export type EvaluationResult = typeof evaluationResults.$inferSelect;
export type InsertEvaluationResult = z.infer<typeof insertEvaluationResultSchema>;