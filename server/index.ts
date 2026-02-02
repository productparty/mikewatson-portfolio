import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import cors from "cors";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();

// CORS configuration - restrict to allowed origins
const allowedOrigins = [
  "https://mikewatson.us",
  "https://www.mikewatson.us",
  "http://localhost:5000",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      // In production, you may want to be stricter
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Export the app for Vercel
export { app };

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  // Use process.env.NODE_ENV directly since dotenv loads it from .env
  const isDev = process.env.NODE_ENV !== "production";
  if (isDev) {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Skip server startup in production on Vercel
  if (process.env.VERCEL !== "1") {
    // ALWAYS serve the app on port 5000
    // this serves both the API and the client
    const port = 5000;
    // Use standard listen() - reusePort is Linux-only and not supported on Windows
    server.listen(port, "0.0.0.0", () => {
      log(`serving on port ${port}`);
    }).on('error', (err) => {
      throw err;
    });
  }
})();
