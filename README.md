# Beats Bazaar

> The Global Beat Marketplace & 24/7 Freestyle Cypher Room

Beats Bazaar is a music technology web application built for independent music producers and recording artists. It bridges instant digital licensing for untagged master WAV recordings with a live 24/7 interactive freestyle cypher room powered by native AI DJ Bazza and deterministic Bachs checkout.

---

## Key Features

- **Verified Master Beat Marketplace**: Browse, preview, filter, and license high-definition instrumental tracks with rotating sponsored visibility across Afrobeats, Trap, Boom Bap, Amapiano, and R&B.
- **24/7 Freestyle Cypher Room**: Real-time dual-turntable audio crossfading deck with interactive visualizers for live freestyle sessions.
- **Native AI DJ Bazza**: Autonomous virtual DJ with local heuristic fallback and live vocal/text advice, rhyme coaching, and beat curation.
- **Direct Digital Legal Licensing**: Instant generation and download of digital master license contracts and certificates with cryptographic token attribution.
- **Bachs Checkout**: Seamless checkout flow for licensing transactions.
- **Hardware-Grade Visual Design**: Custom 3D Master Certification Plaque brand identity and responsive dark studio interface.

---

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19, Tailwind CSS, Lucide Icons
- **Audio Engine**: Web Audio API (Synthesizer, AudioContext, Crossfader, Real-time Waveform Analyser)
- **Language**: TypeScript
- **State Management**: React Context (`AudioContext`)

---

## Getting Started

### Prerequisites

- Node.js 18.18 or later
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Kryptopacy/beats-bazaar.git
   cd beats-bazaar
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) (or `http://localhost:3001` if port 3000 is occupied).

### Production Build

```bash
npm run build
npm start -- -p 3001
```

---

## Planning & Process Documentation

This project was built following the Devpost Learn Skill Pack workflow:

- [`devpost/scope.md`](devpost/scope.md): Initial idea scoping, kernel definition, and PoC boundaries.
- [`devpost/prd.md`](devpost/prd.md): Product requirements, state machine, and user journeys.
- [`devpost/spec.md`](devpost/spec.md): Technical architecture blueprint and component contracts.
- [`devpost/checklist.md`](devpost/checklist.md): Slice-by-slice verification log.
- [`devpost/app-map.html`](devpost/app-map.html): Interactive code tour and architecture map.

---

## License

MIT License. Built for the Devpost Build With AI: Basics Hackathon.
