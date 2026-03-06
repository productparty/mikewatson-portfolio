# Mike Watson Portfolio

Personal portfolio site with AI-powered chat assistant.

## Tech Stack

- **Frontend**: React + Vite + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Express.js (local dev) / Vercel Serverless Functions (production)
- **Database**: Neon PostgreSQL (connected via Vercel integration)
- **ORM**: Drizzle
- **AI**: Anthropic Claude API (claude-sonnet-4-20250514)
- **Email**: Resend API

## Deployment

- **Host**: Vercel (auto-deploys from GitHub main branch)
- **Live URL**: https://mikewatson.us / https://mikewatsonusportfolio.vercel.app
- **Database**: Neon DB connected via Vercel integration

## Key Features

### AI Chat Assistant
- Located in `client/src/components/consulting/ai-hero-section.tsx`
- Streams responses via `api/portfolio-chat/stream.ts`
- Uses corpus files in `corpus/` directory for personality and knowledge
- Rate limited to 20 messages per hour per session

### Lead Capture System
- Form appears after first chat exchange
- Saves leads to `chat_leads` table via `api/chat-lead.ts`
- Transcripts saved to `chat_transcripts` table
- Single email sent when user leaves page (via `api/chat-transcript.ts` + sendBeacon)
- Uses `email_sent` flag to prevent duplicate emails

## Important Files

```
api/
  portfolio-chat/stream.ts  # Main chat endpoint (Vercel serverless)
  chat-lead.ts              # Lead capture endpoint
  chat-transcript.ts        # Final transcript + email endpoint

client/src/components/consulting/
  ai-hero-section.tsx       # Chat UI component

corpus/                     # AI personality and knowledge base
  01-professional-narrative/
  02-thought-leadership/
  03-builder-portfolio/
  04-frameworks-and-opinions/
  05-practical-faq/
  06-meta/                  # voice-guide.md, topics-to-avoid.md, sample-exchanges.md

shared/schema.ts            # Drizzle database schema
drizzle.config.ts           # Drizzle configuration
```

## Environment Variables

### Required in Vercel
- `DATABASE_URL` - Neon PostgreSQL connection string (auto-set by Vercel integration)
- `ANTHROPIC_API_KEY` - For Claude AI chat
- `RESEND_API_KEY` - For email notifications (optional)
- `RESEND_FROM_EMAIL` - Sender email address
- `NOTIFICATION_EMAIL` - Where to send lead notifications

### Local Development
Copy these to `.env` file (not committed):
```
DATABASE_URL=<get from Vercel or Neon dashboard>
ANTHROPIC_API_KEY=<your key>
```

## Commands

```bash
npm run dev          # Start local dev server
npm run build        # Build for production
npm run db:push      # Push schema changes to database
npm run check        # TypeScript check
```

## Database Schema

Key tables for chat system:
- `chat_leads` - Visitor contact info (session_id, name, email, email_sent flag)
- `chat_transcripts` - Full conversation history (session_id, lead_id, messages JSON)

## Notes

- Vercel serverless functions are in `api/` directory
- Local dev uses Express server in `server/`
- Both share the same database schema
- Changes pushed to main branch auto-deploy to Vercel
