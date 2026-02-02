# Closing Engine - HVAC Manual J Calculator

## What It Is

A freemium iOS/iPadOS Manual J load calculator for HVAC contractors. Perform residential heating and cooling load calculations with professional PDF export.

## The Problem It Solves

HVAC contractors need to calculate heating and cooling loads for residential properties to properly size equipment. Manual J is the industry standard methodology, but most tools are either:
- Expensive enterprise software
- Overly complex for quick field estimates
- Desktop-only (not useful on job sites)

This app gives contractors a mobile-first tool they can use on-site to run calculations and generate professional PDFs for customers.

## Business Model

**Free Tier:**
- 10 free Manual J calculations
- Create and manage projects
- Automatic project save
- Offline-first architecture

**Pro Tier ($9.99 one-time):**
- Unlimited calculations
- PDF export with professional formatting
- iCloud sync across devices
- Lifetime access

## Tech Stack

- **Framework:** React Native with Expo
- **Navigation:** Expo Router (file-based routing)
- **State Management:** Zustand
- **Database:** expo-sqlite (local persistence)
- **In-App Purchases:** RevenueCat
- **PDF Generation:** expo-print
- **Language:** TypeScript

## How the Calculator Works

Implements simplified ACCA Manual J methodology:

**Cooling Load (BTU/hr):**
- Base load: sq ft × 25 BTU × climate multiplier
- Window solar gain: window area × glass type × orientation
- Insulation adjustment: based on R-value grade
- Occupancy load: occupants × 400 BTU
- Door loads: exterior + sliding glass doors
- Ductwork factor: location-based multiplier

**Heating Load (BTU/hr):**
- Base load: sq ft × heating degree days ÷ 1000
- Wall/ceiling loss: wall area × construction × insulation
- Window loss: window area × glass type × temp differential
- Infiltration: ceiling height × sq ft × 0.018 × temp diff
- Ductwork factor: location-based multiplier

**Output:**
- Cooling BTU/hr
- Heating BTU/hr
- Recommended tonnage (rounded to 0.5 tons)
- Recommended furnace size (rounded to 5,000 BTU)

## ZIP Code Database

Bundled database of cooling/heating degree days for ~80 major US ZIP codes. Fallback logic:
1. Exact match
2. First 3 digits (same area)
3. First 2 digits (same region)
4. US average (1500 CDD / 4500 HDD)

Users can also manually enter degree day values.

## Why I Built It

**Testing one-shot builds with deep research.** I wanted to see if I could do a mostly one-shot build based on a problem that deep research indicated was real. The experiment: use AI research tools to identify an underserved niche, then build a solution quickly.

**What the research showed.** For niche tools like HVAC calculators, there's appetite for:
- Quick access without creating accounts
- Modern-looking mobile interfaces (not clunky desktop software)
- Tools that work in the field during sales conversations
- Free or low-cost alternatives to expensive enterprise software

**No domain expertise required.** I learned the Manual J calculations from scratch using publicly available ACCA methodology. The formulas are complex but well-documented. Custom development + open source information = viable product.

**The build philosophy.** Limited functionality, but focused on the core value: accurate-enough calculations with no friction. Ship something useful, see if there's traction.

## Status & Roadmap

Current: MVP with core calculation functionality

Future features planned:
- AR room measurement (v2)
- Compass-based window orientation
- Equipment recommendations
- More comprehensive ZIP database

## Key Metrics

[TO BE FILLED VIA INTERVIEW]
- Downloads
- Conversion rate (free to pro)
- Any user feedback
