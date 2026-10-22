# Beats Bazaar: Devpost Submission Details

**Live Deployment:** [beatsbazaar.vercel.app](https://beatsbazaar.vercel.app)  
**GitHub Repository:** [github.com/Kryptopacy/beats-bazaar](https://github.com/Kryptopacy/beats-bazaar)  
**Launch Film (Local):** `recordings/beats-bazaar-launch.mp4`

---

## Elevator Pitch (138 / 200 characters)

Hardware-grade beat marketplace paired with a 24/7 freestyle cypher room, direct master rights licensing, and Gemini AI crate curation.

---

## What Gemini model or tool did you use and how? (182 / 255 characters)

Google Gemini 2.5 Flash powers Bazza, our AI sound selector. It parses natural-language mood, BPM, and genre prompts to curate matching beats and queue them onto live cypher decks.

---

## About the Project

## Inspiration

During my university days in Nigeria, I was surrounded by extraordinary underground music producers and beatmakers crafting world-class Afrobeats, Amapiano, Trap, and many more. Despite their immense talent, almost all of them faced the same crushing bottleneck: broken discovery, word-of-mouth marketing status quo, and their success in their craft relying solely on hope the right artist comes their way and they "blow" by extension. I believe strongly that for some songs, what actually hooks the listener is not the lyrics or the melodies, but the beautiful work the producer/beatmaker did on the track. I knew then that one of my dream projects would be something that improves their repute, that allows the world meet my talented producer friends and others out there: to help them make money and gain fame from what they already do fantastically.

Pre-AI, building things meant learning the skills or paying someone to do it and both were out of scope at the time as I was busy with school and also could not afford to fund a passion project. Build with AI hackathon however gave me a reason to finally bring the first phase to life. 

However, instead of just building a beats marketplace, I considered another small inconvenience I could attend to, killing two birds with one stone. For as long as music has existed, I assume there has also always been freestylers and cyphers. I for one, might not have any released songs, but I take pleasure in freestyling over beats or remixing existing songs for the fun of it: a pleasure I have shared with my friends (artiste/non-artiste). Typically, we go to YouTube to find beats and just play one after the other and just go at it. It genuinely serves and there is a lot of memories to prove. But YouTube is a video app for a lot of things not just beats: some regular streaming platforms can have free beats too but it just doesn't hit like the YouTube versions. What if I didn't need to open YouTube to search, get a video ad, song plays, next video ad before the next beat, when all I wanted was just audio. Imagine if you could simply open an app or site, type in the types of beats you want and get infinite play letting you focus on your bars or melody: populated with the same beats producers already gave for the same purpose. It also becomes an extra discoverability funnel for beats on the marketplace or the producer behind the beat. I decided, why not make Beats Bazaar natively support what we go to YouTube for: vocalists, rappers, MCs, hypemen, whoever uses beats whether for work or fun know to just go there to find them.
This provided vocalists, rappers and MCs with an accessible, collaborative space to test their flows and discover fresh beats. Inspired by direct-to-creator digital distribution models, I set out to build **Beats Bazaar**: an open, hardware-grade digital marketplace paired with a live 24/7 freestyle cypher room where producers get paid directly and artists connect in real time.

## What it does

Beats Bazaar unites independent beat commerce with interactive cypher performance:

- **Verified Master Beat Marketplace**: Producers showcase original instrumentals across Afrobeats, Amapiano, Afro-Drill, Trap, Boom Bap, R&B, and more. Prospective buyers can filter by genre, sort by trending/likes, preview protected tagged audio, and inspect track metadata.
- **24/7 Live Freestyle Cypher Room**: An interactive dual-turntable audio deck equipped with a responsive crossfader, real-time Web Audio API waveform visualizer, and an interactive crowd soundboard (airhorn, laser drops, record scratches) for live freestyle sessions.
- **Bazza, Resident Sound Selector (Powered by Gemini AI)**: An intelligent in-house crate curator with an animated visual mascot:
  - **In the Marketplace**: Artists describe their desired sound, artist reference (e.g. Asake, Burna Boy, Travis Scott), BPM, or mood in plain language, and Bazza digs through the catalog crates to recommend the ideal beat to license, accompanied by punchy street-smart commentary on why the sonic pocket fits the project.
  - **In the Cypher Room**: MCs specify the tempo, energy, or groove they want next, and Bazza automatically selects and queues the matching instrumental directly onto the turntable deck to keep the cypher rolling.
  - **Resilient Fallback**: Includes a deterministic heuristic matching engine so sound selection functions smoothly even during network outages.
- **Instant Digital Rights Licensing**: Artists can purchase **Standard Lease** or **Exclusive Buyout** rights, instantly generating legally structured digital license certificates with unique verification tokens and immediate untagged master WAV audio access.
- **Producer Storefronts & Standout Boosts**: Dedicated producer profile modals highlighting discography, external stream placement credits, and an in-app "Boost" promotion system that elevates standout beats to the top marketplace spotlight banner.

## How we built it

- **Frontend & UI**: Next.js (App Router), React 19, and Tailwind CSS, structured with an obsidian-and-gold hardware aesthetic inspired by tactile studio equipment.
- **Audio Processing Engine**: Browser-native Web Audio API handling dual-track turntable mixing, gain-stage crossfading, audio watermarking for previews, and real-time frequency analysis.
- **Intelligent Crate Curator (Bazza)**: Integrated Google Gemini (`gemini-2.5-flash` / `gemini-3.8-flash`) to parse open-ended user mood prompts against the live beat catalog schema, returning structured JSON containing recommended track IDs, genre matches, and punchy curator commentary.
- **Digital Licensing System**: Client-side license engine generating verified contract certificates with unique legal hashes and rights distribution metadata.

## Challenges we ran into

- **Crossfader & Turntable Synchronization**: Balancing dual-deck Web Audio playback, scratch sound triggers, and smooth gain interpolation across desktop and mobile browsers without audio latency.
- **Tagged Audio Scrubber vs. Master Delivery**: Building an interactive audio preview that protects producers with audible voice tags while keeping the player responsive and delivering pristine uncompressed master WAVs after licensing.
- **Grounding Gemini in Beat Curation**: Engineering domain-specific prompt instructions so Bazza acts as an authentic, street-smart music director who understands production terms (BPM, pocket, bounce, cadence) rather than a generic assistant.

## Accomplishments that we're proud of

- Combining Beat Sales with an Always-On Room: Most beat platforms (BeatStars, Airbit) are purely transactional e-commerce catalogs. We built a platform that bridges browsing beats with an active, streaming Cypher Room where artists can audition and vibe to beats continuously.
- Self-Contained Audio Engine: Synthesized in-memory audio loops and soundboard FX using the browser Web Audio API, allowing full playback and sound effects without needing expensive third-party audio hosting or dealing with broken external media links.
- Constrained JSON Curation with Gemini: Built a beat selector where Gemini reliably outputs strict JSON referencing actual catalog IDs, ensuring it only suggests instrumentals that exist in the store rather than hallucinating fake tracks.
- Complete Licensing Flow: Designed an end-to-end licensing state machine that distinguishes between Standard Leases and Exclusive Buyouts, generates verification tokens, and marks exclusive tracks as sold across the store.

## What we learned

- Prompt Engineering for Catalog Schemas: How to feed structured catalog metadata (BPM, genre, tags, price) into Gemini and enforce strict JSON schemas so the model acts as an accurate search filter rather than an unconstrained chatbot.
- Audio State Continuity: How to manage a single shared audio context across multiple view switches, ensuring that navigating between the Marketplace and Cypher Room does not stutter, restart, or double-play audio.
- Responsive Layouts for Media Hardware: How to handle tight spacing constraints on mobile screens for audio scrubbers, visualizers, and multi-button action drawers without buttons colliding or overflowing.
- Scoping Discipline: How following a structured planning process (Scope -> PRD -> Spec) kept the build focused on a working proof of concept rather than getting lost in payment processing and user auth before the core product worked.

## What's next for Beats Bazaar

- **Weekly Bazza Cover Contests & "Headliner" Rep**: Producers deposit beats into a challenge pool with a mandatory lyrical constraint (a required word or phrase like "No Gree" or "Midnight Drift"). Every week, Bazza selects one beat and drops the public challenge. Vocalists and rappers submit their 60-second takes, and the community votes to crown that week's **Headliner**, earning the top marketplace spotlight banner, free master lease rights, and sponsored cash or studio prizes.
- **Persistent Producer Accounts & Cloud Backend**: Migrate from in-memory seed state to a persistent database (PostgreSQL / Supabase) with creator authentication, allowing producers to manage their storefronts, track plays, and view sales analytics across sessions.
- **Multi-Track Studio Stem Packages**: Expand the license delivery engine to support zipped multi-track audio stems (separated kicks, snares, 808s, and melodies) so artists purchasing Exclusive Buyouts can take full tracks into professional studio mixing sessions.
- **Live Payment Settlement via Bachs**: Transition from client-side checkout simulation to live merchant settlement in fiat and crypto, giving underground African and international beatmakers a frictionless way to withdraw directly to local bank accounts or crypto wallets without traditional Stripe/PayPal regional restrictions.
