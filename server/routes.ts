import type { Express } from "express";
import { createServer, type Server } from "http";
import rateLimit from "express-rate-limit";
import { storage } from "./storage";
import { generateChatResponse } from "./openai";
import { streamPortfolioChat, checkRateLimit, generatePortfolioChatResponse } from "./anthropic";
import { fetchGithubUpdates } from "./github";
import { runEvaluation } from "./prompt-evaluator";
import { insertChatMessageSchema, insertNewsletterSchema, insertPageViewSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import { ZodError } from "zod";
import { v4 as uuidv4 } from "uuid";
import { getWeek, getYear } from "date-fns";

// IP-based rate limiting for chat endpoints (prevents API abuse)
const chatRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 30, // 30 requests per hour per IP (generous for real users, restrictive for abuse)
  message: {
    error: "Rate limit exceeded",
    message: "Too many requests from this IP. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Use X-Forwarded-For header when behind a proxy (Vercel, etc.)
  keyGenerator: (req) => {
    return (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.ip || "unknown";
  },
});

// Constants for input validation
const MAX_MESSAGE_LENGTH = 2000;

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

  // Send chat message (legacy endpoint using OpenAI)
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
        const botResponse = await generateChatResponse(message.content, sessionId);

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

  // Portfolio AI Chat - Check rate limit
  app.get("/api/portfolio-chat/status", (req, res) => {
    const sessionId = (req.query.sessionId as string) || "anonymous";
    const status = checkRateLimit(sessionId);
    res.json(status);
  });

  // Portfolio AI Chat - Streaming endpoint using Server-Sent Events
  app.post("/api/portfolio-chat/stream", chatRateLimiter, async (req, res) => {
    const { message, sessionId = uuidv4() } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    // Input validation: max message length
    if (message.length > MAX_MESSAGE_LENGTH) {
      return res.status(400).json({
        error: "Message too long",
        message: `Message must be ${MAX_MESSAGE_LENGTH} characters or less`,
      });
    }

    // Input validation: reject empty/whitespace-only messages
    if (!message.trim()) {
      return res.status(400).json({ error: "Message cannot be empty" });
    }

    // Check rate limit
    const rateLimit = checkRateLimit(sessionId);
    if (!rateLimit.allowed) {
      return res.status(429).json({
        error: "Rate limit exceeded",
        message: "You've reached the message limit. Please try again later.",
      });
    }

    // Set up SSE headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Session-Id", sessionId);

    try {
      // Stream the response
      for await (const chunk of streamPortfolioChat(message, sessionId)) {
        res.write(`data: ${JSON.stringify({ type: "chunk", content: chunk })}\n\n`);
      }

      // Send completion event
      res.write(`data: ${JSON.stringify({ type: "done", remaining: rateLimit.remaining - 1 })}\n\n`);
      res.end();
    } catch (error) {
      console.error("Portfolio chat stream error:", error);
      res.write(`data: ${JSON.stringify({ type: "error", message: "An error occurred" })}\n\n`);
      res.end();
    }
  });

  // Portfolio AI Chat - Non-streaming endpoint (for simpler clients)
  app.post("/api/portfolio-chat", chatRateLimiter, async (req, res) => {
    const { message, sessionId = uuidv4() } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    // Input validation: max message length
    if (message.length > MAX_MESSAGE_LENGTH) {
      return res.status(400).json({
        error: "Message too long",
        message: `Message must be ${MAX_MESSAGE_LENGTH} characters or less`,
      });
    }

    // Input validation: reject empty/whitespace-only messages
    if (!message.trim()) {
      return res.status(400).json({ error: "Message cannot be empty" });
    }

    // Check rate limit
    const rateLimit = checkRateLimit(sessionId);
    if (!rateLimit.allowed) {
      return res.status(429).json({
        error: "Rate limit exceeded",
        message: "You've reached the message limit. Please try again later.",
      });
    }

    try {
      const response = await generatePortfolioChatResponse(message, sessionId);
      res.json({
        response,
        sessionId,
        remaining: rateLimit.remaining - 1,
      });
    } catch (error) {
      console.error("Portfolio chat error:", error);
      res.status(500).json({ error: "Failed to generate response" });
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

  // Prompt Evaluator - Run evaluation
  app.post("/api/prompt-evaluator/run", async (req, res) => {
    try {
      const { prompt, testScenario, providers, variationName } = req.body;

      if (!prompt || !testScenario || !providers || !Array.isArray(providers)) {
        return res.status(400).json({
          error: "Missing required fields: prompt, testScenario, providers",
        });
      }

      // Run evaluation
      const results = await runEvaluation({
        prompt,
        testScenario,
        providers,
        variationName,
      });

      // Save to database
      const savedEvaluations = [];
      for (const result of results) {
        const evaluation = await storage.createPromptEvaluation({
          promptText: prompt,
          provider: result.provider,
          model: result.model,
          testScenario,
          variationName: variationName || null,
        });

        await storage.createEvaluationResult({
          evaluationId: evaluation.id,
          planOutput: result.planOutput,
          qualityScores: result.qualityScores,
          assertionsPassed: result.assertions,
          feedback: result.feedback,
        });

        savedEvaluations.push({
          ...evaluation,
          result: {
            ...result,
            evaluationId: evaluation.id,
          },
        });
      }

      res.json(savedEvaluations);
    } catch (error) {
      console.error("Prompt evaluation error:", error);
      res.status(500).json({
        error: "Failed to run evaluation",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // Prompt Evaluator - Get history
  app.get("/api/prompt-evaluator/history", async (req, res) => {
    try {
      const limit = req.query.limit
        ? parseInt(req.query.limit as string)
        : 50;
      const history = await storage.getEvaluationHistory(limit);
      res.json(history);
    } catch (error) {
      console.error("Get evaluation history error:", error);
      res.status(500).json({ error: "Failed to fetch evaluation history" });
    }
  });

  // Prompt Evaluator - Get specific evaluation
  app.get("/api/prompt-evaluator/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid evaluation ID" });
      }

      const evaluation = await storage.getEvaluationById(id);
      if (!evaluation) {
        return res.status(404).json({ error: "Evaluation not found" });
      }

      res.json(evaluation);
    } catch (error) {
      console.error("Get evaluation error:", error);
      res.status(500).json({ error: "Failed to fetch evaluation" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}