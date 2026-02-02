# Leafed - Privacy-First Book Tracking App

## What It Is

A privacy-first book tracking app for iOS and Android. Track your reading without every app trying to harvest your data or push social features you don't want.

**Key Features:**
- Search and add books (Open Library API + custom indie book database)
- Track reading status: Want to Read, Currently Reading, Finished
- Rate and review books privately
- Cover image support
- Offline-first architecture
- No account required, no data collection

## Where It Lives

- iOS App Store
- Google Play Store
- Web: leafed.app (indie book submission portal)

## Tech Stack

**Mobile App:**
- React Native with Expo
- TypeScript
- Local storage (no cloud sync by design)
- In-app purchases via RevenueCat

**Backend (Indie Books Database):**
- PHP API on Namecheap shared hosting
- MySQL database
- Admin panel with .htaccess protection
- reCAPTCHA spam protection
- Cover image upload/processing with GD library

## Why I Built It

Three things converged:

**1. Curiosity about the book app landscape.** There's a surprising number of book tracking apps out there, and an interesting tension in the market: on one side, there's huge appetite for AI features, data analytics, and reporting. On the other, a growing segment of users actively want to escape that and have a private space that's just theirs.

**2. Testing open source APIs.** I'd found some open source book APIs (Open Library) that I wanted to experiment with, and book tracking was a clean use case to build around.

**3. Seeing how far I could get with vibe coding.** I wanted to test whether I could actually bring an app to market using AI-assisted development. Leafed became the proving ground for that experiment.

As I started building, I kept discovering cool features from other apps and wanted to see if I could implement them myself. The scope grew organically from "can I ship something?" to "can I ship something good?"

**Why privacy-first?** It let me add value to a user's day-to-day without worrying about data leakage. No accounts means no user data to protect, no privacy policy headaches, no GDPR concerns. The constraint became a feature.

## The Product Thinking Behind It

**Build Ambitiously, Cut Intelligently**

I started with a feature flag system that let me build everything I was curious about, then systematically cut what didn't work:

**Features that shipped:**
- Book search via Open Library API
- Reading status tracking (Want to Read, Currently Reading, Finished)
- Star ratings and private reviews
- Cover image support
- Indie book database with community submissions

**Features I built but cut:**
- **AI Chatbot for book recommendations** - Cool tech, but didn't fit the privacy-first positioning. If users wanted AI recommendations, they'd use ChatGPT directly.
- **Bookshelf scanner** (initially cut, later brought back) - Cut it for v1 to reduce complexity, then added it back after launch when I had more confidence in the core app.

The hardest part wasn't coding. It was knowing which features NOT to ship. The feature flag system let me build ambitiously without committing to shipping everything.

## Building It As a Non-Developer

This project is proof that non-developers can ship real products to app stores using AI tools. I used Cursor and Claude to write the vast majority of the code.

**The Development Workflow:**
1. **Perplexity** for research and understanding concepts
2. **Cursor with Claude** for actual code generation
3. **Expo Go** for real-time testing on my phone
4. **Expo EAS** for cloud builds when ready for app stores

**Key tool: Cursor's Agent "Plan" feature.** Before writing code, I'd have the AI create a detailed implementation plan. Review the plan, approve it, then let it execute. This caught potential issues before they became problems.

**Costs:** About $175 total - Cursor subscription, Expo EAS builds, and a $15 testing service for Google Play's closed testing requirement.

## The App Store Journey

**Google Play was surprisingly harder than Apple.**

Google requires 12 people to test your app for 14 consecutive days before you can publish. Finding 12 people willing to commit to testing a book app for two weeks? Harder than it sounds. I ended up using a $15 testing service.

Google also asks essay questions during submission: "How does your app provide value to users?" "How is your app different from competitors?" Felt like applying to college.

**Apple was smoother** - TestFlight made beta testing easy, and the review process was straightforward.

Both approved on the first submission attempt.

## Timeline

The goal wasn't to move fast - it was to learn the full process. From first line of code to both app stores: roughly 6-8 weeks of part-time work.

**The barrier isn't technical skill. It's understanding the full process and being willing to build big, test honestly, and ship smart.**

## Key Metrics

- **300+ organic downloads** across iOS App Store and Google Play
- **5-star reviews** from early users
- No feedback mechanism built in due to the local/privacy-first nature of the app - users don't create accounts, so there's no way to reach them directly
