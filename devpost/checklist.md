---
doc: checklist
status: approved
---

# Build Checklist

Build mode: fast

## Slices

- [x] **1. Next.js Foundation & Seeded Marketplace Audio Player**
  Becomes usable: The Next.js application runs locally in the dark studio aesthetic (`#0B0F12`), displaying the top Navbar and the Marketplace with pre-seeded Afrobeats & Amapiano tracks that can be played, paused, and scrubbed via the central audio player.
  Why now: Proves the whole foundation end to end on slice one—scaffold, dependencies, styling, state, and audio playback—so every later slice has a solid platform to build upon.
  PRD ref: `prd.md > Screens and Layout` (1. Global Navigation Bar, 2. Marketplace Surface), `prd.md > Look and Feel`, `prd.md > Audio Playback & Cypher Auto-Advance`
  Spec ref: `spec.md > Stack`, `spec.md > NavigationBar`, `spec.md > AudioProvider & PlayerEngine`, `spec.md > MarketplaceView`
  Build: Scaffold Next.js 15 app with Tailwind CSS and TypeScript, create `.env.example` and `.env`, implement data types, pre-seeded African tracks, central `AudioContext.tsx`, `Navbar.tsx`, and `MarketplaceView.tsx`.
  Verify (mechanical): Run build and dev server check, confirm HTTP 200, and verify audio element initializes with track list.
  Learner check: Open `http://localhost:3000`, see the dark Beats Bazaar theme, and hit play on a seed beat to hear it audition cleanly in the player.
  Commit: `Initialize project and build marketplace with audio player`

- [ ] **2. Freestyle Cypher Room with Infinite Play & Crossfade**
  Becomes usable: Switching to the Cypher Room tab presents the dedicated full-screen cypher deck with animated waveform visualizer, infinite stream auto-advance, genre filtering, shuffle mode, and optional smooth crossfade with customizable duration.
  Why now: Implements the unique kernel of Beats Bazaar early, proving seamless continuous beat streaming and transition controls for artists freestyling.
  PRD ref: `prd.md > 3. Freestyle Cypher Room Surface`, `prd.md > Audio Playback & Cypher Auto-Advance`
  Spec ref: `spec.md > CypherRoomView`, `spec.md > WaveformVisualizer`, `spec.md > AudioProvider & PlayerEngine`
  Build: Build `CypherRoomView.tsx` with full playback controls (play/pause, next, prev, scrub, volume), `WaveformVisualizer.tsx`, and add crossfade logic and `onEnded` auto-advance handling to `AudioContext.tsx`.
  Verify (mechanical): Run automated test verifying track queue advancement and crossfade duration timer calculation.
  Learner check: Switch to "Freestyle Cypher Room", play a track, toggle Shuffle, test the crossfade slider, and verify it flows to the next track automatically.
  Commit: `Implement Freestyle Cypher Room with infinite playback and crossfade`

- [ ] **3. Producer Beat Upload Portal**
  Becomes usable: Producers can click "+ Drop a Beat", fill in track metadata (title, producer handle, genre, BPM, lease/exclusive pricing), attach an audio file, and toggle "Feature in Freestyle Cypher". The new beat immediately appears in both the Marketplace and Cypher queues with persistent browser storage.
  Why now: Connects the creator side of the marketplace so underground producers can publish their music without waiting for backend deployments.
  PRD ref: `prd.md > 4. Producer Upload Modal`, `prd.md > Producer Beat Upload`
  Spec ref: `spec.md > BeatUploadModal`, `spec.md > Data Model`
  Build: Create `BeatUploadModal.tsx` with audio file validation and Object URL creation, integrate with `AudioContext` / catalog state, and persist to `localStorage`.
  Verify (mechanical): Programmatic test adding a new beat object into state and verifying it immediately renders in both Marketplace and Cypher queues.
  Learner check: Click "+ Drop a Beat", upload an audio file with custom pricing, and see it appear live in your catalog and playable in the cypher room.
  Commit: `Add producer beat upload modal with live catalog updating`

- [ ] **4. Inline Bachs Checkout & Digital License Certificate Grant**
  Becomes usable: The complete end-to-end monetization loop. Clicking "Tip Beatmaker" or "License This Beat" (or licensing from the Marketplace) launches the inline Bachs payment modal (fiat/crypto). Confirming payment unlocks untagged master audio download and generates a verifiable, printable digital License Certificate with unique ID, timestamp, and legal rights. If Exclusive is bought, the beat is marked "SOLD".
  Why now: Closes the monetization and licensing loop—the core business promise for artists and African producers.
  PRD ref: `prd.md > 5. Bachs Inline Payment Modal`, `prd.md > 6. License Certificate & Download Modal`, `prd.md > Licensing & Bachs Inline Modal`, `prd.md > Digital License Certificate`
  Spec ref: `spec.md > BachsModal`, `spec.md > LicenseCertificateModal`, `spec.md > External Services and Dependencies`
  Build: Create `BachsModal.tsx` supporting fiat and crypto flows with sandbox resilience, and `LicenseCertificateModal.tsx` with dynamic certificate generation, exclusive buyout locking, and audio download unlocking.
  Verify (mechanical): Trigger checkout flow in test, confirm payment success transitions to delivery, verify certificate fields match spec, and confirm exclusive beat is marked SOLD.
  Learner check: License a beat using the Bachs inline modal, complete checkout, inspect your generated digital license certificate, and download your audio.
  Commit: `Integrate inline Bachs checkout and digital license certificate generator`

## Hands-on Checkpoints

- [ ] Early usable behavior explored — Slice 2 (Freestyle Cypher Room & Marketplace auditioning)
- [ ] Final kick-the-tires exploration and feedback completed

## Final Review

- [ ] Final review complete — feedback resolved and learner confirms ready to ship

## Code Tour and App Map

- [ ] Learning activity complete — guided route, focused alternative, prior practice connected, or brief recap
- [ ] Optional edit and transfer reflection addressed — offered/declined/already covered/not applicable as appropriate
- [ ] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence: [what actually happened; real document/test/code references; unfinished work if interrupted]
Route and stops: [actual paths and symbols; guided stops completed, or reference-only route]
Edit outcome: [tried/kept/reverted/declined/not applicable; verification if changed]
Reflection: [offered/answered/declined/already covered — personal answer belongs only in the ignored profile]
Activity mode: [live app and editor, explicit static fallback, focused alternative, prior practice, or recap]

## Revisions
