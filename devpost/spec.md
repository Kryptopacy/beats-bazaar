---
doc: spec
status: approved
---

# Beats Bazaar — Technical Specification

## How This Works, In Plain Language
Beats Bazaar is a Next.js web application built for underground music producers and independent vocalists. It provides two core views: the **Marketplace** for beat discovery, auditioning, and purchasing licenses, and the **Freestyle Cypher Room** for continuous, stream-only audio playback with direct tipping and licensing conversion.

Audio files are streamed directly in the browser via a centralized audio controller. When a producer uploads a beat, it is saved in local application state with Object URLs and persistent browser storage. When a buyer checks out or a fan tips a producer, an inline Bachs modal opens directly on the screen without redirecting away from the app. Upon payment confirmation, the buyer unlocks the untagged audio download and a generated legal digital license certificate.

## The Core Journey Through the System
1. **Producer Drops a Beat:** The producer clicks "+ Drop a Beat", filling in metadata (Title, Producer Name, Genre, BPM, Pricing) and attaching an audio file. The track is saved into the client catalog store and immediately reflected across the app.  
   *PRD ref: `prd.md > Producer Upload`, `prd.md > Producer Beat Upload`.*
2. **Freestyle Cypher Session:** The artist enters the Freestyle Cypher Room. The central audio player auto-plays tracks in infinite stream mode. When a track ends, the audio engine automatically transitions to the next track. The user can filter by genre or toggle Shuffle.  
   *PRD ref: `prd.md > Freestyle Cypher Experience`, `prd.md > Audio Playback & Cypher Auto-Advance`.*
3. **Bachs Tipping & Licensing:** Clicking "Tip Beatmaker" or "License This Beat" triggers the inline Bachs checkout modal. The modal handles fiat and crypto flows directly in-app.  
   *PRD ref: `prd.md > Monetization & Conversion`, `prd.md > Licensing & Bachs Inline Modal`.*
4. **Instant Fulfillment:** Once the Bachs modal fires the success callback, the app unlocks the download button for the audio track and renders the official digital License Certificate with unique certificate ID, parties, and rights terms. If purchased Exclusively, the beat status is marked "SOLD".  
   *PRD ref: `prd.md > Delivery & Rights Grant`, `prd.md > Digital License Certificate`.*

## Stack
* **Language & Runtime:** TypeScript, Node.js (v24+).
* **Framework:** Next.js 15 (App Router) with React 19.
  * *Doc link:* [Next.js Documentation](https://nextjs.org/docs)
* **Styling:** Tailwind CSS (utility-first styling for dark aesthetic and neon accents).
  * *Doc link:* [Tailwind CSS Documentation](https://tailwindcss.com/docs)
* **Icons:** Lucide React (clean UI icons for play, pause, volume, shuffle, download).
  * *Doc link:* [Lucide React Icons](https://lucide.dev/guide/packages/lucide-react)
* **Payments:** Bachs Inline Payment Integration (dual fiat & crypto payment modal).
* **Audio:** HTML5 Web Audio API & native Audio elements.

## Where It Runs and How Someone Tries It
* **Runtime:** Local Node environment, executed in any modern web browser.
* **Environment Configuration:** Configured via `.env` duplicated from `.env.example`:
  ```
  NEXT_PUBLIC_BACHS_APP_ID=your_bachs_app_id
  BACHS_API_KEY=your_bachs_api_key
  NEXT_PUBLIC_APP_URL=http://localhost:3000
  ```
* **Start Command:**
  ```bash
  npm install
  npm run dev
  ```
* **What to Open:** `http://localhost:3000`
* **Demo Recording Scenario:** Open browser, upload a sample beat, switch to Freestyle Cypher Room to show infinite stream & shuffle, launch Bachs checkout modal, confirm purchase, and inspect the unlocked audio download & generated license certificate.

## Look and Feel
* **Palette:** Dark studio aesthetic. Deep background (`#0B0F12`), card surfaces (`#151B22`), borders (`#21262D`).
* **Accents:** Electric Afrobeat Green (`#00E599` / `#10B981`) for playback/primary CTAs; Warm Gold (`#F59E0B`) for exclusive licensing highlights.
* **Typography:** Sans-serif (Geist / Inter) with clean hierarchy, bold headers, and high contrast.

## Components

### NavigationBar (`components/Navbar.tsx`)
Top navigation bar containing the Beats Bazaar logo, active surface toggle buttons (Marketplace vs. Freestyle Cypher Room), and the "+ Drop a Beat" trigger button.  
*PRD ref: `prd.md > 1. Global Navigation Bar`.*

### AudioProvider & PlayerEngine (`context/AudioContext.tsx`)
Centralized React context managing active audio element, current playing beat, play/pause state, scrub progress, volume, queue management, and the Cypher auto-advance trigger on audio `ended` event.  
*PRD ref: `prd.md > Audio Playback & Cypher Auto-Advance`.*

### MarketplaceView (`components/MarketplaceView.tsx`)
Grid and list view of beats with genre filter pills, live audio play buttons, pricing indicators, and "License" action buttons.  
*PRD ref: `prd.md > 2. Marketplace Surface`.*

### CypherRoomView (`components/CypherRoomView.tsx`)
Dedicated full-screen cypher deck featuring:
* Full audio playback controls: Play/Pause, Skip to Next Track, Previous Track, interactive scrubbable progress bar, volume slider, and optional smooth Crossfade toggle with customizable duration (seconds) for seamless beat transitions.
* Mode controls: Genre filter dropdown and Shuffle / Randomize mode toggle.
* Animated audio waveform visualizer synced to play state.
* Monetization CTAs: "Tip Beatmaker" (opens Bachs micro-tip modal) and "License This Beat" (opens checkout).  
*PRD ref: `prd.md > 3. Freestyle Cypher Room Surface`.*

### BeatUploadModal (`components/BeatUploadModal.tsx`)
Modal dialog containing form inputs for track title, producer name, genre, BPM, Standard Lease price, Exclusive price, audio file attachment, and "Include in Freestyle Cypher" checkbox.  
*PRD ref: `prd.md > 4. Producer Upload Modal`.*

### BachsModal (`components/BachsModal.tsx`)
Inline payment modal embedded directly on the page. Supports fiat and crypto selection, live transaction status feedback, and a fallback sandbox test mode for recording demos without external merchant bottlenecks.  
*PRD ref: `prd.md > 5. Bachs Inline Payment Modal`.*

### LicenseCertificateModal (`components/LicenseCertificateModal.tsx`)
Modal rendering the official digital certificate (unique Certificate ID, timestamp, licensor, licensee, rights scope) alongside an instant untagged audio download trigger.  
*PRD ref: `prd.md > 6. License Certificate & Download Modal`.*

## Data Model

### Beat Object
```typescript
interface Beat {
  id: string;
  title: string;
  producer: string;
  genre: 'Afrobeats' | 'Amapiano' | 'Drill' | 'Hip Hop' | 'Trap' | 'R&B' | string;
  bpm: number;
  audioUrl: string;
  leasePrice: number;
  exclusivePrice: number;
  inCypher: boolean;
  isSoldExclusive: boolean;
  uploadedAt: string;
}
```

### License Certificate Object
```typescript
interface LicenseCertificate {
  certificateId: string;
  beatId: string;
  beatTitle: string;
  licensor: string;
  licensee: string;
  tier: 'Standard Lease' | 'Exclusive Rights';
  terms: string[];
  issuedAt: string;
  transactionRef: string;
}
```

## File Structure
```
beats_bazaar/
├── devpost/                         # Devpost learning and planning artifacts
│   ├── learner-profile.md
│   ├── scope.md
│   ├── prd.md
│   └── spec.md
├── src/
│   ├── app/
│   │   ├── layout.tsx               # Root layout and metadata
│   │   ├── page.tsx                 # Main application dashboard (Surface switcher)
│   │   └── globals.css              # Tailwind and dark aesthetic styles
│   ├── components/
│   │   ├── Navbar.tsx               # Top header, surface switcher, upload trigger
│   │   ├── MarketplaceView.tsx      # Beat browsing, filters, licensing cards
│   │   ├── CypherRoomView.tsx       # Infinite stream player, tipping & licensing CTA
│   │   ├── BeatUploadModal.tsx      # Producer upload form
│   │   ├── BachsModal.tsx           # Inline payment modal (fiat/crypto)
│   │   ├── LicenseCertificateModal.tsx # Post-purchase certificate & audio download
│   │   └── WaveformVisualizer.tsx   # Interactive audio visualizer animation
│   ├── context/
│   │   └── AudioContext.tsx         # Central audio player and queue manager
│   ├── data/
│   │   └── seedBeats.ts             # Preloaded high-energy African beats
│   └── types/
│       └── index.ts                 # TypeScript interfaces for Beats and Licenses
├── .env.example                     # Environment template for Bachs credentials
├── .env                             # Local environment file
├── .gitignore                       # Git ignore configuration
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## External Services and Dependencies
* **Bachs Payments:** Inline payment modal integration supporting fiat and crypto checkout. Configured via `NEXT_PUBLIC_BACHS_APP_ID` and `BACHS_API_KEY`.
* **Client Audio API:** Native browser Audio element and AudioContext for zero-latency audio playback without heavy external media players.

## Important Failure Modes
* **Audio Playback Blocked by Browser Autoplay Policy:** If browser blocks autoplay when switching tracks in Cypher mode, display a subtle "Click to Start Cypher Audio" badge.
* **Bachs Payment Interrupted/Cancelled:** If user closes the modal or payment fails, display a dismissible alert and leave the beat in cart without locking the catalog.
* **Corrupt or Missing Audio Upload:** File picker validates audio MIME types (`audio/*`) before allowing form submission.

## What Was Simplified and Why
* **Client-side Seed Data & Storage instead of Supabase Backend:** Pre-seeding high-quality sample beats and persisting user-uploaded beats in browser storage allows an immediate, reliable 2–4 hour build and zero deployment friction for the hackathon demo video. Full Supabase backend is deferred to post-hackathon v1.
* **Sandbox Mode for Bachs Modal:** Allows recording the full checkout and certificate unlock flow instantly, even before live merchant account verification keys are issued.

## Decisions and Open Issues
* **Learner Decision:** Duplicate `.env.example` directly into `.env` so environment variables are pre-staged for immediate use.
* **Learner Decision:** Use Markdown review format throughout planning.
* **Uncertainty Resolved:** Confirmed that the Bachs checkout operates as an inline modal directly on the page, keeping the user in the app without redirects.
