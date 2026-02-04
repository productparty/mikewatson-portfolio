# Leafed - Technical Journey

## How I Built It (As a Non-Developer)

Building Leafed was an exercise in leveraging every AI tool available to bridge the gap between product vision and technical execution. I'm not a developer by training, but I refused to let that stop me from building something I believed in.

### The Toolkit

My primary tools were:
- **Cursor** - AI-powered code editor that became my main development environment
- **Claude** - For reasoning through architecture decisions and debugging complex issues
- **ChatGPT** - Quick questions and alternative perspectives on problems
- **Gemini** - Additional AI assistance for specific challenges
- **Figma** - Design work and prototyping the UI before building

### The Hardest Technical Challenges

**1. Design System Consistency**
The hardest part was building out a design system *after* I had already popped up so many features. When you're iterating fast and adding capabilities, it's easy to let visual consistency slip. Going back to create a cohesive design system while keeping everything looking and feeling consistent was a significant challenge.

**2. Native Testing on Physical Devices**
Testing on both physical Android and Apple phones with their native features was genuinely difficult. Expo Go worked well for most development - you could iterate quickly and see changes in real time. But when it came to native features that required actual device testing, things got tougher. Each platform has its quirks, and debugging issues that only appear on physical hardware (not simulators) added significant friction to the development process.

## Tech Stack

- **Framework:** React Native with Expo
- **Development:** Cursor IDE with AI assistance
- **Design:** Figma
- **AI Assistants:** Claude, ChatGPT, Gemini
- **Platforms:** iOS and Android

## Lessons for Non-Developer Builders

1. **Start with Expo Go** - The fast iteration cycle is worth it for early development
2. **Design system early** - Retrofitting consistency is harder than building it in from the start
3. **Budget time for native testing** - Simulator testing only gets you 80% of the way there
4. **Use multiple AI tools** - Different AIs have different strengths; don't limit yourself to one
