---
doc: scope
status: approved
---

# Beats Bazaar

A web marketplace and freestyle cypher hub connecting underground African and global music producers with indie artists, powered by dual fiat/crypto payments via Bachs inline checkout.

## The Unique Kernel
The **Freestyle Cypher Room**—an intuitive, interactive stream-only space where artists and friends can vibe and freestyle over underground beats without upfront purchase. Features infinite continuous playback (with genre filtering or shuffle/randomize mode), instant micro-tipping to the beatmaker, and a direct inline CTA to legally license the beat.

## Who It's For
* **The Underground Producer / Beatmaker:** Talented producers (starting in Nigeria and Africa) making incredible sounds who struggle with reach, lack access to Western payment gateways (Stripe/PayPal), and get pennies from traditional streaming royalties.
* **The Independent Vocalist / Freestyler:** Artists tired of digging through cluttered YouTube videos for type beats who want an interactive, clean space to freestyle immediately, with an inline path to license and own rights when they want to record a track.

## The Core Loop
1. **Producer** uploads a beat with title, genre tag (Afrobeats, Amapiano, Drill, Hip Hop, etc.), BPM, audio file, license pricing (Lease vs. Exclusive), and an opt-in toggle for the Freestyle Cypher.
2. **Artist in the Cypher Room** experiences infinite, continuous beat playback (filtered by genre or randomized/shuffled) for live freestyles, with one-click Bachs inline tipping and a "License This Beat" CTA.
3. **Artist in the Marketplace** auditions beats, selects a license tier, and checks out seamlessly via the Bachs inline modal (fiat or crypto) without page redirection.
4. **Fulfillment:** Instant unlock of the untagged master audio download and a generated verifiable digital license certificate.

## Inspiration & Identity
* **Sound & Scene:** Nigerian and Pan-African underground music culture, campus cyphers, Afro-fusion, Amapiano, and street rap culture.
* **Economic Inspiration:** Alternative, direct-to-creator monetization models (e.g. Tory Lanez's tokenized album drop) that bypass exploitative streaming math.
* **Vibe:** Sleek, high-energy, dark-themed audio aesthetic with interactive audio waveforms and prominent creator attribution.

## Why This Matters to the Learner
Rooted in university memories connecting with underground Nigerian producers whose talent was undeniable but monetization avenues were broken and painful.

## What "Working" Looks Like
A crisp 60–90 second end-to-end screen recording demonstrating:
1. Producer publishing a new beat and opting it into the Cypher.
2. Freestyler hopping into the **Freestyle Cypher Room**, experiencing continuous stream-only play (genre filter or shuffle), and clicking "License This Beat".
3. Smooth checkout using the Bachs inline payment modal (supporting fiat & crypto) directly on the page.
4. Immediate unlock of the untagged audio download and stamped digital license certificate.

## The POC Boundary
* **Included in Proof of Concept:**
  * Two distinct access portals: **Marketplace** (browse/audition/license) and **Freestyle Cypher Room** (infinite stream-only play / genre filter / shuffle / tip / license funnel).
  * Web audio player with waveform/playback controls.
  * Producer listing form (upload audio, title, genre, BPM, price, Cypher opt-in).
  * Licensing tiers: *Standard Lease* (non-exclusive) vs. *Exclusive Buyout*.
  * Bachs inline payment modal integration (configured via `.env.example`).
  * Instant post-purchase audio download and digital license certificate view.

## Later (Post-Hackathon Roadmap)
* Persistent user authentication and database persistence via Supabase.
* Full audio watermarking / voice tag injection engine.
* Multi-track audio stem downloads (WAV stems archive).
* Live multi-user voice cypher room.

## Explicitly Cut
* Complex automated DRM and external copyright web scrapers (requires enterprise audio fingerprinting and legal infrastructure out of scope for a fast hackathon build).
