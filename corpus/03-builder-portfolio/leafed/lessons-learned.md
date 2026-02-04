# Leafed - Lessons Learned

## What Building a Real Product Taught Me

Building Leafed changed how I think about product management. The goal was simple: understand mobile development by actually shipping something to production. Not a tutorial. Not a prototype. A real app in real app stores.

## The Surprisingly Hard Part

Coding wasn't the hard part. Building ambitious features wasn't hard either. The surprisingly hard part? Knowing which features NOT to ship.

I built a conversational AI chatbot (Rasa + Google Gemini hybrid)—then cut it because people just wanted to search and scan. I built a bookshelf scanner inspired by Vivino—then cut it due to book cover formatting challenges. Later, I brought the scanner back with a different implementation after researching alternative approaches.

That's not failure. That's product judgment. The feature flag system let me build ambitious and cut intelligently.

## People Problems Are Harder Than Code Problems

Google requires 12 testers actively engaged for 14 consecutive days before you can go to production. Coordinating 12 humans to actively use an app daily for 14 days straight? That's not a technical problem. That's a people problem.

When internal recruitment hit a wall, I paid $15 for a testing service. Sometimes paying a small amount to solve a blocker is the smartest decision you can make. That $15 bought two weeks of momentum.

## What I Learned About App Store Processes

**Google** focuses on testing evidence—proof of legitimate closed test, feedback collection, improvements based on feedback. They want to see you've iterated.

**Apple** focuses on guidelines compliance—design standards, privacy requirements, user experience expectations. They approved in 48 hours after I fixed their feedback (a "Buy Me a Coffee" button that was confusing with in-app purchases).

Understanding these different philosophies changes how I talk to developers and think about mobile products now.

## My Product Workflow Now

1. **Research deeply** - Use Perplexity for obscure repos, alternative libraries
2. **Feed context to Cursor** - Include approach, what didn't work
3. **Experiment in isolation** - Build 3 versions, test each, keep best
4. **Test fast** - Expo Go for quick iteration
5. **Make product decisions** - Decide what ships

## The Real Skill

Tools like Cursor and Perplexity make building accessible, but they don't replace developers. They close the gap enough that product people can experience the process viscerally and develop the skills that actually matter: research, synthesis, pattern recognition, and product judgment.

When developers push back on timelines or talk about technical debt, I get it now—because I've made those same tradeoff decisions myself.
