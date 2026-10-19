---
doc: prd
status: approved
---

# Beats Bazaar — Product Requirements

A web-based beat marketplace and freestyle cypher hub empowering African and global underground music producers to monetize their craft directly via Bachs inline fiat/crypto payments.

Source: `scope.md > The Core Loop`, `scope.md > The Unique Kernel`, `scope.md > The POC Boundary`.

## The Core Journey
1. **Producer Upload:** A producer clicks "+ Drop a Beat" in the top navigation, fills out track details (Title, Producer Name, Genre, BPM, Price for Lease and Exclusive), uploads the audio file, and toggles "Include in Freestyle Cypher". The beat is immediately added to the live catalog.
2. **Freestyle Cypher Experience:** An artist or group of friends opens the **Freestyle Cypher Room** for continuous, stream-only beat playback. They can filter by genre or hit "Shuffle / Randomize" for unexpected inspirations.
3. **Monetization & Conversion:** 
   * In the Cypher Room, the listener can tap "Tip Beatmaker" to send a direct micro-tip via the Bachs inline modal.
   * If they write a track they love, they click "License This Beat", which launches the license checkout directly.
4. **Marketplace Browsing & Auditioning:** In the **Marketplace**, artists browse beats with waveform players, filter by genre, and compare license options (*Standard Lease* vs. *Exclusive Rights*).
5. **Inline Checkout:** The artist clicks "License Beat", choosing their tier. The Bachs inline modal pops up on-screen (no redirect) to complete payment via fiat or crypto.
6. **Delivery & Rights Grant:** Upon successful Bachs confirmation, the user receives an instant untagged audio download link and an on-screen, printable digital License Certificate with unique ID, timestamp, and legal rights grants. If bought Exclusively, the beat is marked "SOLD" in the marketplace.

## Screens and Layout

### 1. Global Navigation Bar
* **Branding:** "Beats Bazaar" logo and tagline ("Underground Beats. Direct Bag.").
* **Surface Tabs:** Toggle between **Marketplace** and **Freestyle Cypher Room**.
* **Action CTA:** Prominent "+ Drop a Beat" button to trigger the upload modal.

### 2. Marketplace Surface
* **Genre Filter Pills:** All, Afrobeats, Amapiano, Drill, Hip Hop, Trap, R&B, etc.
* **Beat Cards / Table:**
  * Beat title, producer name, genre pill, BPM badge.
  * Inline interactive audio player with play/pause and scrubbable progress bar.
  * Pricing display (Lease price from \$X, Exclusive from \$Y).
  * "License" button opening the license selection drawer/modal.
  * Sold badge if Exclusive rights have been purchased.

### 3. Freestyle Cypher Room Surface
* **Full-Focus Cypher Deck:** Large visualizer/waveform, prominent beat title and producer credits.
* **Continuous Playback Engine:** Infinite stream-only playback that auto-advances to the next beat.
* **Controls:**
  * Play / Pause / Skip to Next Beat.
  * Mode Toggle: Genre Filter dropdown vs. "Shuffle / Randomize" switch.
* **Direct Monetization Bar:**
  * "Tip Beatmaker" button (opens Bachs micro-tip modal).
  * "License This Beat" button (pre-selects beat and opens checkout).

### 4. Producer Upload Modal
* Modal with fields: Beat Title, Producer Handle, Genre, BPM, Standard Lease Price (\$), Exclusive Buyout Price (\$), Audio File upload picker.
* Checkbox: `[x] Feature in Freestyle Cypher (Stream-Only Play)`.
* Validation: All required fields must be filled before submission.

### 5. Bachs Inline Payment Modal
* Embedded inline modal overlay (no external redirect).
* Displays: Beat Title, Selected Tier (or Tip Amount), Amount Due.
* Payment options: Fiat (Cards / Local African rails) and Crypto.
* Real-time states: Awaiting Payment, Processing, Success, Failed.

### 6. License Certificate & Download Modal
* Displays verified Certificate Card:
  * Certificate ID (e.g. `BB-LIC-XXXXX`) & Timestamp.
  * Producer (Licensor) & Artist (Licensee).
  * Beat details (Title, BPM, Genre).
  * Legal grant terms (e.g. up to 100k streams for Lease vs. full transfer for Exclusive).
* Primary action: "Download Untagged Master Audio (.mp3/.wav)".
* Secondary action: "Save / Print License Certificate".

## Look and Feel
* **Aesthetic:** High-energy, dark-themed music studio vibe (`#0B0F12` background, deep charcoal cards `#151B22`).
* **Accents:** Electric Afrobeat Green (`#00E599` / `#10B981`) for playback and primary CTAs, with Warm African Gold (`#F59E0B`) for exclusive badges and licensing highlights.
* **Typography:** Clean, punchy modern sans-serif typography with high legibility across mobile and desktop.
* **Audio Visualizer:** Interactive waveform aesthetic indicating playback status.

## Features and Behavior

### Audio Playback & Cypher Auto-Advance
- [ ] Clicking play on any beat pauses any currently playing track.
- [ ] In the Freestyle Cypher Room, when a beat ends, the next beat begins playing automatically (infinite stream).
- [ ] Shuffling randomizes the track queue without repeats until all tracks have played.

### Producer Beat Upload
- [ ] Producer can submit a new beat with audio file and pricing.
- [ ] Newly added beat immediately displays in the Marketplace and (if opted-in) the Cypher queue.

### Licensing & Bachs Inline Modal
- [ ] User can choose between *Standard Lease* and *Exclusive Rights*.
- [ ] Bachs modal opens inline without leaving the app page.
- [ ] Completing transaction transitions seamlessly to the Delivery state.
- [ ] Exclusive purchase marks the beat as "SOLD" in the marketplace, preventing duplicate exclusive buys.

### Digital License Certificate
- [ ] Generates a unique certificate hash/ID and binds licensor and licensee names.
- [ ] Explicitly defines stream limits (100k for Lease) vs. full commercial master transfer (Exclusive).

## States and Boundaries

- **First Use / Empty State:** If no beats match a filtered genre, a clean state appears: *"No beats found in this category. Be the first producer to drop one!"* with a direct CTA to upload.
- **Normal State:** Active catalog loaded, audio playback controls active, Cypher auto-advancing.
- **Payment In-Flight State:** Bachs modal displays processing animation; UI prevents double submission.
- **Payment Failed / Cancelled State:** Bachs modal closes cleanly; user remains on the beat page with an informative notice; license remains locked.
- **Success State:** Instant celebratory confirmation with download button and certificate view.

## Product Decisions
- **Two Distinct Surfaces:** Marketplace for serious buyers vs. Cypher Room for freestylers/casual discovery. Reason: Gives artists a frictionless jam session space while creating an organic top-of-funnel for sales.
- **Inline Bachs Modal:** Retains user context on Beats Bazaar rather than redirecting to an external checkout page.
- **Immediate In-Memory / Client State for PoC:** Full database and backend user authentication deferred to post-hackathon to keep the build bulletproof and demo-ready in 2–4 hours.

## What We're Building (POC Scope)
* Full two-surface web UI (Marketplace + Freestyle Cypher Room).
* Audio player engine with continuous play and genre/shuffle controls.
* Producer upload modal with instant catalog addition.
* Licensing tier selector (Standard Lease vs. Exclusive).
* Bachs inline checkout trigger (supporting fiat & crypto).
* Digital License Certificate generator & audio download unlock.

## Deferred From the POC
* **Supabase User Auth:** Persistent producer logins and artist account portals.
* **Dynamic Audio Watermarking:** Auto-baking producer voice tags into streams on upload.
* **Multi-Track Stems Archive:** Uploading and packaging separate stem tracks.

## Non-Goals
* Heavy automated copyright enforcement algorithms or external streaming crawlers (Spotify/Apple Music fingerprinting).
* Complex multi-party split-sheet contract negotiations.

## Open Questions
* None blocking technical specification.
