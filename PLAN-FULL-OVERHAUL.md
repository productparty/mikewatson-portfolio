# Full Portfolio Overhaul — Implementation Plan

Based on Stitch-generated Material Design 3 mockups. Each phase is self-contained and can be executed in a fresh chat context.

---

## Phase 1: Design System Foundation

**Goal**: Replace all design tokens (colors, fonts, utilities) so every subsequent phase renders correctly.

### 1A. Update font imports in `client/index.html`
- **Replace** Noto Sans with **Inter** (400, 500, 600)
- **Add** Plus Jakarta Sans (500, 600, 700)
- **Keep** Manrope (already loaded with 400–800)
- **Keep** Material Symbols Outlined (already loaded)

### 1B. Update `tailwind.config.ts` font families
```
Current:
  display: ["Manrope", "sans-serif"]
  body: ["Noto Sans", "sans-serif"]

Target:
  headline: ["Manrope", "sans-serif"]
  body: ["Inter", "sans-serif"]
  label: ["Plus Jakarta Sans", "sans-serif"]
```
- Remove old `display` and `body` keys, add `headline`, `body`, `label`

### 1C. Update CSS custom properties in `client/src/index.css`
Replace `:root` light-mode tokens with Stitch M3 values (convert hex → HSL):

| Token | Current HSL | New Hex | New HSL |
|-------|-------------|---------|---------|
| --background | 40 33% 98% | #fcf9f5 | 36 54% 97% |
| --foreground | 222 47% 11% | #1c1c1a | 60 6% 11% |
| --card | 40 20% 99% | #ffffff | 0 0% 100% |
| --card-foreground | 222 47% 11% | #1c1c1a | 60 6% 11% |
| --primary | 193 82% 31% | #0f6672 | 187 76% 25% |
| --primary-foreground | 0 0% 100% | #ffffff | 0 0% 100% |
| --secondary | 40 10% 95% | #576063 | 200 6% 36% |
| --secondary-foreground | 222 14% 20% | #ffffff | 0 0% 100% |
| --muted | 40 10% 95% | #f0ede9 | 34 16% 93% |
| --muted-foreground | 215 16% 34% | #3f484a | 191 8% 27% |
| --accent | 193 82% 31% | #347f8b | 189 45% 37% |
| --accent-foreground | 0 0% 100% | #fafeff | 195 100% 99% |
| --destructive | 0 84% 60% | #ba1a1a | 0 76% 42% |
| --border | 220 13% 91% | #bec8ca | 190 12% 77% |
| --input | 220 9% 88% | #bec8ca | 190 12% 77% |
| --ring | 193 82% 40% | #0f6672 | 187 76% 25% |

Add NEW custom properties for M3 surface hierarchy:
```css
--surface-container-low: 30 14% 95%;     /* #f6f3ef */
--surface-container: 30 10% 93%;         /* #f0ede9 */
--surface-container-high: 30 10% 90%;    /* #eae8e4 */
--surface-container-highest: 30 9% 87%;  /* #e5e2de */
--outline: 195 5% 46%;                   /* #6f797b */
--outline-variant: 190 12% 77%;          /* #bec8ca */
--primary-container: 189 45% 37%;        /* #347f8b */
--primary-fixed: 189 89% 82%;            /* #a6eefb */
--primary-fixed-dim: 189 54% 71%;        /* #8ad2df */
--secondary-container: 197 16% 87%;      /* #d9e1e5 */
--on-surface-variant: 191 8% 27%;        /* #3f484a */
```

### 1D. Add new Tailwind color mappings in `tailwind.config.ts`
Add to `extend.colors`:
```ts
"surface-container-low": "hsl(var(--surface-container-low))",
"surface-container": "hsl(var(--surface-container))",
"surface-container-high": "hsl(var(--surface-container-high))",
"surface-container-highest": "hsl(var(--surface-container-highest))",
"outline": "hsl(var(--outline))",
"outline-variant": "hsl(var(--outline-variant))",
"primary-container": "hsl(var(--primary-container))",
"primary-fixed": "hsl(var(--primary-fixed))",
"primary-fixed-dim": "hsl(var(--primary-fixed-dim))",
"secondary-container": "hsl(var(--secondary-container))",
"on-surface-variant": "hsl(var(--on-surface-variant))",
```

### 1E. Add utility classes in `index.css` `@layer components`
```css
.glass-nav {
  @apply bg-background/70 backdrop-blur-xl;
}
.ghost-border {
  outline: 1px solid hsl(var(--outline-variant) / 0.15);
}
.gradient-cta {
  background: linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary-container)) 100%);
}
```

### 1F. Update `body` class in `index.css`
Change `font-sans` → `font-body` in the base body rule.

### 1G. Fix all font class references across codebase
- Global search/replace: `font-display` → `font-headline` (used in consulting.tsx and sticky-header.tsx)
- Verify `font-body` references still work (tailwind key renamed)

### Verification
- [ ] `npm run check` passes with no new TS errors
- [ ] `npm run dev` renders the page without missing fonts
- [ ] Inspect computed styles: body uses Inter, headings use Manrope
- [ ] Primary color is visually teal (#0f6672), not the old lighter teal
- [ ] Background is warm off-white (#fcf9f5)

---

## Phase 2: Navigation + Footer Overhaul

**Goal**: Replace StickyHeader and inline footer with Stitch glass-nav design.

### Files to modify
- `client/src/components/consulting/sticky-header.tsx`
- `client/src/pages/consulting.tsx` (footer section)

### 2A. Redesign StickyHeader
Reference: Stitch mockup nav pattern

**Structure:**
```
<nav class="fixed top-0 w-full z-50 glass-nav">
  <div class="max-w-7xl mx-auto px-8 h-20 flex justify-between items-center">
    <!-- Logo: text only, font-headline font-extrabold text-primary -->
    <div>Mike Watson</div>

    <!-- Desktop nav: font-headline font-bold links -->
    <div class="hidden md:flex items-center gap-8">
      <a>Work</a>           → scrolls to #portfolio-content
      <a>Experience</a>     → scrolls to #experience
      <a>Projects</a>       → scrolls to #technical-projects
      <a>About</a>          → scrolls to #methodology
      <a>Contact</a>        → scrolls to #contact
      <button class="gradient-cta text-white px-6 py-2.5 rounded-full font-label text-xs uppercase tracking-widest">
        Download CV
      </button>
    </div>

    <!-- Mobile hamburger (keep existing toggle logic) -->
  </div>
</nav>
```

**Key changes from current:**
- `sticky top-0` → `fixed top-0` (Stitch uses fixed)
- `bg-background/90 backdrop-blur-md` → `glass-nav` utility (bg/70 + blur-xl)
- Remove icon logo square, use text-only branding
- Links: `font-headline font-bold` with `text-secondary hover:text-primary`
- Active link gets `border-b-2 border-primary`
- CTA: gradient-cta rounded-full with label typography
- Height: h-20 (from current h-auto/py-3)
- Max width: max-w-7xl (from max-w-[1280px])

### 2B. Redesign Footer
Reference: Stitch mockup footer

**Structure in consulting.tsx:**
```
<footer class="w-full py-12 border-t border-outline-variant/15 bg-background">
  <div class="flex flex-col md:flex-row justify-between items-center px-8 max-w-7xl mx-auto gap-8">
    <p class="font-label text-[10px] uppercase tracking-widest text-secondary">
      © 2026 Mike Watson. Built with Architectural Precision.
    </p>
    <div class="flex items-center gap-12">
      <!-- Social links from PERSONAL_INFO.social -->
      <a>LinkedIn</a>
      <a>Bluesky</a>
      <a>GitHub</a>
      <a>Newsletter</a>
    </div>
    <div class="flex items-center gap-2">
      <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
      <span class="font-label text-[10px] uppercase tracking-widest text-secondary">
        Available for consulting
      </span>
    </div>
  </div>
</footer>
```

### 2C. Update consulting.tsx page wrapper
- `pt-32` to account for fixed nav (currently relies on sticky which doesn't need it)
- Update `min-h-screen bg-background font-display` → `min-h-screen bg-background font-body`

### Verification
- [ ] Nav is fixed, glass-blur visible on scroll
- [ ] All nav links scroll to correct sections
- [ ] Mobile menu works with updated styling
- [ ] Footer shows social links, status indicator
- [ ] No layout shift from fixed nav (proper pt-32 padding)

---

## Phase 3: Hero Section Redesign

**Goal**: Transform the AI chat hero into the Stitch hero layout with headshot, stats, and embedded AI ask card.

### Files to modify
- `client/src/components/consulting/ai-hero-section.tsx`

### 3A. Pre-conversation hero layout
Reference: Stitch "Mike Watson | Senior PM" hero mockup

**New structure (before chat starts):**
```
<section class="max-w-7xl mx-auto px-8 pt-32 pb-24">
  <!-- Two-column hero -->
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
    <!-- Left: 8 cols -->
    <div class="lg:col-span-8 space-y-8">
      <div class="inline-block bg-surface-container-high px-4 py-1.5 rounded-full">
        <span class="font-label text-[10px] text-secondary uppercase tracking-[0.2em]">
          Senior Product Manager
        </span>
      </div>
      <h1 class="text-[3.5rem] md:text-[5rem] font-headline font-extrabold leading-[1.1] tracking-tight">
        Architecting <span class="text-primary italic">clarity</span> out of complex systems.
      </h1>
      <p class="text-xl md:text-2xl text-secondary font-body leading-relaxed max-w-2xl">
        {PERSONAL_INFO.bio — abbreviated}
      </p>
    </div>

    <!-- Right: 4 cols — headshot -->
    <div class="lg:col-span-4 relative">
      <div class="aspect-[4/5] rounded-xl overflow-hidden bg-surface-container-low">
        <img src={PERSONAL_INFO.avatar} class="w-full h-full object-cover" />
      </div>
      <!-- Floating stat badge -->
      <div class="absolute -bottom-6 -left-6 bg-primary-container p-6 rounded-xl text-white hidden md:block">
        <div class="font-headline font-bold text-3xl">14+</div>
        <div class="font-label text-[10px] uppercase tracking-widest opacity-80">Years Experience</div>
      </div>
    </div>
  </div>

  <!-- AI Ask Card (below hero grid) -->
  <div class="mt-20">
    <div class="bg-card ghost-border p-8 md:p-12 rounded-xl shadow-[0_20px_40px_rgba(28,28,26,0.03)] relative overflow-hidden">
      <!-- Watermark icon -->
      <div class="absolute top-0 right-0 p-8 opacity-5">
        <span class="material-symbols-outlined text-9xl">smart_toy</span>
      </div>

      <div class="relative z-10 space-y-8">
        <div class="flex items-center gap-3">
          <span class="material-symbols-outlined text-primary">auto_awesome</span>
          <h3 class="font-headline font-bold text-2xl">Ask my AI double anything</h3>
        </div>

        <!-- Input row -->
        <form class="flex flex-col md:flex-row gap-4">
          <div class="flex-grow bg-surface-container-low rounded-full px-6 py-4 flex items-center">
            <span class="material-symbols-outlined text-secondary mr-3">search</span>
            <textarea ... placeholder="What is Mike's approach to..." />
          </div>
          <button type="submit" class="bg-foreground text-background px-8 py-4 rounded-full font-headline font-bold hover:bg-primary transition-colors">
            Ask Question
          </button>
        </form>

        <!-- Starter chips -->
        <div class="flex flex-wrap gap-2">
          {STARTER_QUESTIONS.map → font-label text-[10px] uppercase tracking-widest chips}
        </div>

        <!-- Stitch follow-ups (same chip style, different bg) -->
      </div>
    </div>
  </div>
</section>
```

### 3B. Active conversation layout
When `hasConversation === true`:
- Hero grid collapses, AI card expands to full width
- Messages area replaces the input area content (keep ScrollArea)
- Input bar stays at bottom of card
- Follow-up chips appear between messages and input
- Lead capture form stays as-is (already works)

### 3C. Preserve ALL existing functionality
**DO NOT CHANGE** the following logic (only restyle):
- `sendMessage` / streaming / SSE parsing
- `loadStitchRecommendations` callback
- Lead capture form + submission + dismissal
- Transcript saving (both periodic + beforeunload)
- Session ID generation
- Rate limit handling
- `sanitizeRecommendations` import

### Verification
- [ ] Pre-conversation: two-column hero with headshot visible
- [ ] Headshot loads from `/headshot.jpg`
- [ ] Starter chips trigger messages
- [ ] Stitch recommendations appear (or fallback gracefully)
- [ ] Chat streaming still works end-to-end
- [ ] Lead form appears after first exchange
- [ ] Mobile: single column, stacked layout, 44px touch targets
- [ ] "More about Mike" scroll arrow still works

---

## Phase 4: Experience + Projects Sections

**Goal**: Rebuild ExperienceTimeline, TechnicalProjects, and BuiltAndShipped with Stitch bento layouts.

### Files to modify
- `client/src/components/consulting/experience-timeline.tsx`
- `client/src/components/consulting/technical-projects.tsx`
- `client/src/components/consulting/built-and-shipped.tsx`

### 4A. Experience Section
Reference: Stitch "Professional Trajectory" layout

**New structure:**
```
<section class="bg-surface-container-low py-24" id="experience">
  <div class="max-w-7xl mx-auto px-8">
    <!-- Header row -->
    <div class="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
      <div class="space-y-4">
        <span class="font-label text-[10px] text-primary uppercase tracking-[0.3em] font-bold">The Journey</span>
        <h2 class="text-4xl md:text-5xl font-headline font-extrabold tracking-tight">Professional Trajectory</h2>
      </div>
      <div class="max-w-md text-secondary text-lg leading-relaxed font-body">
        Scaling products from zero-to-one and optimizing systems at enterprise scale.
      </div>
    </div>

    <!-- Experience cards (NOT timeline dots) -->
    <div class="space-y-4">
      {roles.map(role => (
        <div class="group bg-card p-8 rounded-xl ghost-border flex flex-col md:grid md:grid-cols-12 gap-8 items-start hover:shadow-lg transition-all">
          <div class="md:col-span-3">
            <div class="font-label text-xs text-secondary uppercase tracking-widest mb-1">{role.period}</div>
            <div class="font-headline font-bold text-xl text-primary">{role.title}, {role.company}</div>
          </div>
          <div class="md:col-span-7 space-y-4">
            <h4 class="text-xl font-headline font-bold">{role.problem}</h4>
            <p class="text-secondary leading-relaxed font-body">{role.action}</p>
          </div>
          <div class="md:col-span-2 flex md:justify-end">
            <span class="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors">north_east</span>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
```

### 4B. Projects Bento Grid
Reference: Stitch "Selected Works" bento grid

Merge TechnicalProjects + BuiltAndShipped data into one bento section.

**New structure:**
```
<section class="max-w-7xl mx-auto px-8 py-24" id="technical-projects">
  <header class="mb-20">
    <span class="font-label text-xs uppercase tracking-widest text-primary font-bold mb-4 block">Selected Works</span>
    <h2 class="font-headline text-4xl md:text-5xl font-extrabold tracking-tight">
      Products built from concept to code.
    </h2>
  </header>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(180px,auto)]">
    <!-- Featured project (Leafed): md:col-span-2 md:row-span-2, large card -->
    <!-- Standard project cards: single col each -->
    <!-- Open source / tools row: md:col-span-3 horizontal card -->
  </div>
</section>
```

Each card uses: `bg-card rounded-3xl ghost-border hover:shadow-lg` pattern.
Tech stack shown as: `font-label text-[11px] font-bold tracking-widest uppercase` pills.

### 4C. Remove BuiltAndShipped as separate section
- Merge its data (Leafed, etc.) into the projects bento grid above
- Keep the component file but stop importing it in consulting.tsx
- OR: delete the import and let consulting.tsx skip it

### Verification
- [ ] Experience renders as card grid, not timeline
- [ ] All 6 roles from EXPERIENCE_TIMELINE render
- [ ] Projects bento grid shows featured + standard layout
- [ ] All project links work (Google Play, App Store, etc.)
- [ ] Mobile: stacks to single column
- [ ] Ghost borders visible on hover

---

## Phase 5: Case Studies + Methodology + CTA

**Goal**: Rebuild remaining content sections with Stitch patterns.

### Files to modify
- `client/src/components/consulting/spotlight-case-studies.tsx`
- `client/src/components/consulting/methodology-grid.tsx`
- `client/src/components/consulting/final-cta.tsx`
- `client/src/components/consulting/tools-section.tsx`

### 5A. Case Studies
Reference: Stitch "Case Studies & Logic" section

**New structure:**
```
<section class="max-w-7xl mx-auto px-8 py-24" id="case-studies">
  <div class="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
    <h2 class="text-4xl font-headline font-extrabold tracking-tight">Case Studies & Impact</h2>
    <div class="h-[1px] flex-grow mx-8 bg-outline-variant/20 hidden md:block" />
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
    {caseStudies.map(study => (
      <div class="group">
        <div class="aspect-video rounded-xl overflow-hidden bg-surface-container mb-6 relative">
          <img src={study.imageUrl} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          <div class="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div class="space-y-3">
          <div class="font-label text-[10px] text-primary uppercase tracking-widest font-bold">
            {study.tags.join(" · ")}
          </div>
          <h3 class="text-2xl font-headline font-bold group-hover:text-primary transition-colors">
            {study.title}
          </h3>
          <p class="text-secondary leading-relaxed font-body">{study.description}</p>
          <!-- Key impact callout -->
          <div class="inline-block bg-primary/5 px-4 py-2 rounded-full">
            <span class="font-label text-xs font-bold text-primary">{study.keyImpact.value}</span>
            <span class="text-secondary text-xs ml-1">{study.keyImpact.context}</span>
          </div>
        </div>
      </div>
    ))}
  </div>
</section>
```

### 5B. Methodology Section
Reference: Stitch "The Methodology" dark bento section

**New structure:**
```
<section class="bg-primary py-24 text-white" id="methodology">
  <div class="max-w-7xl mx-auto px-8">
    <div class="max-w-2xl mb-20 space-y-6">
      <span class="font-label text-[10px] text-primary-fixed uppercase tracking-[0.3em] font-bold">The Methodology</span>
      <h2 class="text-4xl md:text-5xl font-headline font-extrabold tracking-tight">A framework for clarity.</h2>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Card 1 (2-col): bg-on-primary-fixed-variant / bg-primary-container -->
      <!-- Card 2 (1-col) -->
      <!-- Card 3 (1-col) -->
      <!-- Card 4 (2-col) -->
    </div>
  </div>
</section>
```

Each card: Material icon + title + description (from METHODOLOGY_CARDS data).
Use `bg-primary-container` for standard cards, darker variant for wide cards.

### 5C. Tools Section
Simplify to tag cloud or horizontal scroll within a ghost-border card.
Keep same data from `TOOLS_BUILD_WITH` but render as `font-label text-[10px] uppercase tracking-widest` pills grouped by category.

### 5D. Final CTA
Reference: Stitch "AI Assistant Banner" section

**New structure:**
```
<section class="max-w-7xl mx-auto px-8 pb-24" id="contact">
  <div class="bg-primary/5 rounded-[2rem] p-12 ghost-border relative overflow-hidden">
    <div class="max-w-2xl relative z-10">
      <h3 class="font-headline text-3xl font-bold mb-4">{CONTACT_INFO.ctaHeadline}</h3>
      <p class="text-secondary mb-8 font-body">{CONTACT_INFO.ctaSubheadline}</p>
      <div class="flex flex-wrap gap-4">
        <a href="mailto:..." class="gradient-cta text-white px-8 py-4 rounded-full font-headline font-bold">
          Get in Touch
        </a>
        <a href={linkedin} class="bg-card ghost-border px-8 py-4 rounded-full font-headline font-bold hover:bg-surface-container-low">
          LinkedIn
        </a>
        <a href={resume} class="bg-card ghost-border px-8 py-4 rounded-full font-headline font-bold hover:bg-surface-container-low">
          Download CV
        </a>
      </div>
    </div>
    <!-- Watermark -->
    <div class="absolute right-0 top-0 h-full w-1/3 opacity-10 pointer-events-none flex items-center justify-center">
      <span class="material-symbols-outlined text-[15rem]">smart_toy</span>
    </div>
  </div>
</section>
```

### Verification
- [ ] Case studies render with hover image zoom
- [ ] Methodology section has dark primary background
- [ ] Methodology cards readable with proper contrast
- [ ] Tools section shows all 3 categories
- [ ] CTA section has gradient button + ghost-border secondary buttons
- [ ] All links functional (email, LinkedIn, resume PDF)
- [ ] Mobile: all sections stack properly

---

## Phase 6: Polish + Page Integration + QA

**Goal**: Wire everything together, fix spacing, ensure mobile responsiveness, run final checks.

### 6A. Update `consulting.tsx` page composition
- Ensure section order matches design flow:
  1. StickyHeader (fixed nav)
  2. AIHeroSection (hero + AI card)
  3. ToolsSection (optional — can be removed or integrated)
  4. ExperienceTimeline
  5. TechnicalProjects (merged bento with built-and-shipped data)
  6. SpotlightCaseStudies
  7. MethodologyGrid
  8. FinalCTA
  9. Footer (inline)
- Remove BuiltAndShipped import if merged
- Ensure `id` attributes on sections match nav scroll targets

### 6B. Responsive audit
- Test at 320px, 375px, 768px, 1024px, 1440px
- All touch targets ≥ 44px on mobile
- No horizontal overflow
- Glass nav readable at all widths
- Bento grids collapse to single column on mobile

### 6C. Accessibility audit
- All images have alt text
- Focus-visible rings on interactive elements
- Color contrast ≥ 4.5:1 for text
- Methodology dark section: verify white-on-primary contrast
- Screen reader: nav landmarks, heading hierarchy (h1→h2→h3)

### 6D. Performance
- No new heavyweight dependencies added
- Font loading: `display=swap` on all Google Font imports
- Images: lazy-load below-the-fold images

### 6E. Clean up
- Delete unused component files if any (hero-section.tsx, case-studies.tsx, case-study-card.tsx, service-card.tsx, article-card.tsx, background-context.tsx — verify they're not imported anywhere first)
- Remove old `font-display` references if any remain
- Remove `content-container` utility class from index.css if no longer used

### Verification
- [ ] `npm run check` — zero new TS errors
- [ ] `npm run build` — builds successfully
- [ ] `npm run dev` — full page renders with new design
- [ ] Chat AI works end-to-end (send message, get streaming response)
- [ ] Lead capture works (submit form, get confirmation)
- [ ] Stitch recommendations load (or fallback gracefully)
- [ ] All nav links scroll to correct sections
- [ ] All external links open in new tab
- [ ] Mobile layout verified at 375px
- [ ] Dark mode tokens still sensible (if dark mode is used)
- [ ] Deploy to Vercel, verify on production

---

## Anti-Pattern Guards (All Phases)

1. **DO NOT** remove or modify chat streaming logic (SSE parsing, message state, etc.)
2. **DO NOT** remove lead capture functionality
3. **DO NOT** expose API keys or env vars client-side
4. **DO NOT** add new npm dependencies unless absolutely necessary (prefer Tailwind utilities)
5. **DO NOT** use inline styles when Tailwind classes exist
6. **DO NOT** break existing `id` attributes used for scroll navigation
7. **DO NOT** change the `api/` directory files (stitch-recommendations.ts already updated)
8. **DO NOT** modify `shared/schema.ts` or database-related files
9. **DO NOT** use `any` TypeScript type
10. **DO NOT** remove dark mode CSS variables (even if not actively used)
