# Mike Watson's Portfolio

A modern, professional portfolio website showcasing 14+ years of product management experience in fintech and enterprise software. Built with React, TypeScript, and Tailwind CSS.

## Features

- 🎨 Modern, metrics-driven portfolio design with teal/cyan color scheme
- 📱 Fully responsive design with dark mode support
- 💼 Professional experience timeline with Problem/Action/Outcome format
- 📊 Spotlight case studies with quantified business impact
- 🎯 "How I Work" methodology section
- 🔄 Real-time chat widget powered by OpenAI
- 📝 Resume download options (PDF & Word)
- 📧 Newsletter subscription (Product Party)
- 💼 Project showcase
- 🔗 Social media integration

## Portfolio Sections

### Hero Section
- Professional headshot with floating metric card
- Experience badges (14+ Years, Fintech & Enterprise)
- Clear value proposition and CTAs

### Experience Timeline
- 6 roles presented in chronological order
- Problem/Action/Outcome format for each position
- Highlighted metrics showing quantifiable impact
- Industry tags and company icons

### Spotlight Case Studies
- 3 featured projects with alternating layouts
- Professional imagery and key impact metrics
- Tags for discovery, delivery, stakeholder management

### How I Work
- 4-card methodology grid
- Real-world examples from actual projects
- Quotes and "In Practice" descriptions

### Contact Section
- Email, LinkedIn, and Resume PDF buttons
- Clear call-to-action for opportunities

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **UI Components**: Radix UI, Shadcn UI
- **Icons**: Material Symbols Outlined
- **Fonts**: Manrope (display), Noto Sans (body)
- **Backend**: Node.js, Express
- **Database**: Neon Database (PostgreSQL)
- **AI Integration**: OpenAI GPT for chat widget
- **Deployment**: Vercel
- **Build Tool**: Vite

## Projects Showcased

### Find My Club
A modern and responsive UI for a golf club/course search engine.
- [View Live Demo](https://golf-club-ui-lac.vercel.app/)
- Technologies: React, Tailwind CSS, Vercel

### Leafed
Privacy-first book discovery mobile app (iOS & Android)
- [Visit Website](https://leafed.app/)
- Technologies: React Native, Mobile App

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/productparty/mikewatsonusportfolio.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with:
   ```
   DATABASE_URL=your_database_url
   SESSION_SECRET=your_session_secret
   OPENAI_API_KEY=your_openai_api_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```
   The site will be available at `http://localhost:5000` (or the port specified in server config)

5. Build for production:
   ```bash
   npm run build
   ```

## Development

- `npm run dev` - Start development server with Vite
- `npm run build` - Build for production
- `npm run check` - Type check with TypeScript
- `npm run db:push` - Push database schema changes

## Design System

The portfolio uses a custom design system with:
- **Primary Color**: Teal/Cyan (#0e7490)
- **Display Font**: Manrope (bold, modern)
- **Body Font**: Noto Sans (readable, clean)
- **Dark Mode**: Full support with Tailwind's class-based dark mode

## License

MIT
