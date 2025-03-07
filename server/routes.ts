import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateChatResponse } from "./chat";
import { fetchGithubUpdates } from "./github";
import { insertChatMessageSchema, insertNewsletterSchema, insertPageViewSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import { ZodError } from "zod";
import { v4 as uuidv4 } from "uuid";
import { getWeek, getYear } from "date-fns";

export async function registerRoutes(app: Express): Promise<Server> {
  // Analytics - Record page view
  app.post("/api/analytics/pageview", async (req, res) => {
    try {
      const timestamp = new Date();
      const view = insertPageViewSchema.parse({
        ...req.body,
        timestamp,
        sessionId: req.body.sessionId || uuidv4(),
        weekNumber: getWeek(timestamp),
        weekYear: getYear(timestamp)
      });
      const savedView = await storage.recordPageView(view);
      res.json(savedView);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: fromZodError(error).message });
      } else {
        console.error("Analytics error:", error);
        res.status(500).json({ error: "Failed to record page view" });
      }
    }
  });

  // Analytics - Get metrics with date range
  app.get("/api/analytics/metrics", async (req, res) => {
    try {
      const endDate = req.query.end ? new Date(req.query.end as string) : new Date();
      const startDate = req.query.start ? new Date(req.query.start as string) : new Date(endDate);
      startDate.setDate(startDate.getDate() - 7); // Default to last 7 days if no start date

      const metrics = await storage.getVisitorMetrics(startDate, endDate);

      // Get visit trends
      const views = await storage.getPageViews(startDate, endDate);
      const visitTrends = views.reduce((acc, view) => {
        const date = view.timestamp.toISOString().split("T")[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const trendData = Object.entries(visitTrends)
        .map(([date, visits]) => ({ date, visits, previousVisits: 0 }))
        .sort((a, b) => a.date.localeCompare(b.date));

      // If comparing with previous period, get previous period data
      if (req.query.compare === "true") {
        const previousStartDate = new Date(startDate);
        const previousEndDate = new Date(endDate);
        previousStartDate.setDate(previousStartDate.getDate() - 7);
        previousEndDate.setDate(previousEndDate.getDate() - 7);

        const previousMetrics = await storage.getVisitorMetrics(previousStartDate, previousEndDate);
        const previousViews = await storage.getPageViews(previousStartDate, previousEndDate);

        // Add previous period data to trend data
        const previousVisitTrends = previousViews.reduce((acc, view) => {
          const date = view.timestamp.toISOString().split("T")[0];
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        trendData.forEach(point => {
          const previousDate = new Date(point.date);
          previousDate.setDate(previousDate.getDate() - 7);
          const previousDateStr = previousDate.toISOString().split("T")[0];
          point.previousVisits = previousVisitTrends[previousDateStr] || 0;
        });

        res.json({
          current: metrics,
          previous: previousMetrics,
          visitTrends: trendData,
        });
      } else {
        res.json({
          ...metrics,
          visitTrends: trendData,
        });
      }
    } catch (error) {
      console.error("Analytics metrics error:", error);
      res.status(500).json({ error: "Failed to fetch analytics metrics" });
    }
  });

  // Get all projects
  app.get("/api/projects", async (_req, res) => {
    const projects = await storage.getProjects();
    res.json(projects);
  });

  // Add this right after the '/api/projects' route
  app.post("/api/projects/seed", async (_req, res) => {
    try {
      const golfClubProject = {
        title: "Find My Club",
        description: "A full-stack golf club recommendation platform built with FastAPI, React, and PostgreSQL. Features include user authentication, course submissions, and personalized recommendations.",
        imageUrl: "https://golf-club-ui-lac.vercel.app/homepage.png",
        link: "https://golf-club-ui-lac.vercel.app/",
        tags: ["FastAPI", "React", "PostgreSQL", "Supabase", "Node.js", "Vercel"]
      };

      const project = await storage.addProject(golfClubProject);
      res.json(project);
    } catch (error) {
      console.error("Project seeding error:", error);
      res.status(500).json({ error: "Failed to seed project" });
    }
  });

  // Get chat history
  app.get("/api/chat", async (_req, res) => {
    const messages = await storage.getChatMessages();
    res.json(messages);
  });

  // Send chat message
  app.post("/api/chat", async (req, res) => {
    try {
      const message = insertChatMessageSchema.parse({
        ...req.body,
        timestamp: new Date(req.body.timestamp) // Convert ISO string to Date
      });
      const savedMessage = await storage.addChatMessage(message);

      if (!message.isBot) {
        // Generate personalized response using OpenAI
        const sessionId = 'default'; // Simplified session handling
        const botResponse = await generateChatResponse(message.content);

        const botMessage = await storage.addChatMessage({
          content: botResponse,
          isBot: true,
          timestamp: new Date()
        });

        res.json({ userMessage: savedMessage, botMessage });
      } else {
        res.json({ userMessage: savedMessage });
      }
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: fromZodError(error).message });
      } else {
        console.error("Chat error:", error);
        res.status(500).json({ error: "Failed to process chat message" });
      }
    }
  });

  // Newsletter subscription
  app.post("/api/newsletter", async (req, res) => {
    try {
      const subscription = insertNewsletterSchema.parse(req.body);

      const isSubscribed = await storage.isEmailSubscribed(subscription.email);
      if (isSubscribed) {
        return res.status(400).json({ error: "Email already subscribed" });
      }

      const saved = await storage.addNewsletterSubscription(subscription);
      res.json(saved);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: fromZodError(error).message });
      } else {
        console.error("Newsletter error:", error);
        res.status(500).json({ error: "Failed to process subscription" });
      }
    }
  });

  // Get GitHub updates
  app.get("/api/github-updates", async (_req, res) => {
    try {
      const updates = await storage.getGithubUpdates();
      res.json(updates);
    } catch (error) {
      console.error("GitHub updates error:", error);
      res.status(500).json({ error: "Failed to fetch GitHub updates" });
    }
  });

  // Refresh GitHub data
  app.post("/api/github-updates/refresh", async (_req, res) => {
    try {
      const username = "productparty"; // Your GitHub username
      console.log("Refreshing GitHub data for user:", username);
      const updates = await fetchGithubUpdates(username);
      console.log("Fetched updates:", updates);
      const savedUpdates = await storage.updateGithubData(updates);
      console.log("Saved updates:", savedUpdates);
      res.json(savedUpdates);
    } catch (error) {
      console.error("GitHub refresh error:", error);
      res.status(500).json({ error: "Failed to refresh GitHub data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}