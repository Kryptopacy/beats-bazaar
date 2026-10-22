/**
 * In-browser Web Audio API soundboard synthesizer for live cypher sessions.
 * Generates instant zero-latency DJ FX (Airhorn, Laser, Vinyl Scratch, Sub Boom)
 * without needing external asset downloads or network requests.
 * Features master volume routing and studio-grade psychoacoustic balancing.
 */

let sharedAudioCtx: AudioContext | null = null;
let masterGainNode: GainNode | null = null;
let soundboardVolume: number = 0.8; // default 80%

function getAudioContext(): AudioContext {
  if (!sharedAudioCtx) {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    sharedAudioCtx = new AudioCtx();
  }
  if (sharedAudioCtx.state === 'suspended') {
    sharedAudioCtx.resume();
  }
  return sharedAudioCtx;
}

function getMasterGain(ctx: AudioContext): GainNode {
  if (!masterGainNode || masterGainNode.context !== ctx) {
    masterGainNode = ctx.createGain();
    masterGainNode.gain.setValueAtTime(soundboardVolume, ctx.currentTime);
    masterGainNode.connect(ctx.destination);
  }
  return masterGainNode;
}

/**
 * Set master soundboard output volume (0.0 to 1.0)
 */
export function setSoundboardVolume(volume: number): void {
  soundboardVolume = Math.max(0, Math.min(1, volume));
  if (sharedAudioCtx && masterGainNode) {
    masterGainNode.gain.setValueAtTime(soundboardVolume, sharedAudioCtx.currentTime);
  }
}

/**
 * Get current master soundboard output volume (0.0 to 1.0)
 */
export function getSoundboardVolume(): number {
  return soundboardVolume;
}

/**
 * Classic Dancehall / Hip-Hop Reggae Airhorn (Tri-tone multi-pulse burst)
 */
export function playAirhorn(): void {
  if (typeof window === 'undefined') return;
  const ctx = getAudioContext();
  const master = getMasterGain(ctx);
  const now = ctx.currentTime;

  // Staggered 4-pulse rhythm: ta-ta-ta-taaaa
  const pulseOffsets = [0, 0.12, 0.24, 0.40];
  const pulseDurations = [0.09, 0.09, 0.09, 0.22];

  pulseOffsets.forEach((offset, idx) => {
    const dur = pulseDurations[idx];
    // Authentic chord frequencies (F#5, C#6, A5)
    const freqs = [554.37, 659.25, 830.61];

    freqs.forEach(freq => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + offset);
      // Characteristic airhorn portamento/pitch-drift
      osc.frequency.exponentialRampToValueAtTime(freq * 1.05, now + offset + 0.03);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.98, now + offset + dur);

      gain.gain.setValueAtTime(0, now + offset);
      gain.gain.linearRampToValueAtTime(0.12, now + offset + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + dur);

      osc.connect(gain);
      gain.connect(master);

      osc.start(now + offset);
      osc.stop(now + offset + dur + 0.02);
    });
  });
}

/**
 * Sci-Fi Laser Beam Sweep Drop
 */
export function playLaserDrop(): void {
  if (typeof window === 'undefined') return;
  const ctx = getAudioContext();
  const master = getMasterGain(ctx);
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(2200, now);
  osc.frequency.exponentialRampToValueAtTime(65, now + 0.38);

  gain.gain.setValueAtTime(0.20, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

  osc.connect(gain);
  gain.connect(master);

  osc.start(now);
  osc.stop(now + 0.4);
}

/**
 * Authentic Turntable Vinyl Scratch (Expressive Multi-Phase "Wick-a-Wick-a" Chirp Scratch)
 * Synthesizes both physical needle groove glide and dynamic friction noise.
 */
export function playRecordScratch(): void {
  if (typeof window === 'undefined') return;
  const ctx = getAudioContext();
  const master = getMasterGain(ctx);
  const now = ctx.currentTime;

  // Total gesture duration: 0.28 seconds
  const totalDur = 0.28;

  // --- LAYER 1: Tonal Needle Drag / Vinyl Formant (Pitch Bending) ---
  const osc = ctx.createOscillator();
  const oscGain = ctx.createGain();
  const formantFilter = ctx.createBiquadFilter();

  osc.type = 'sawtooth';
  // Multi-phase pitch motion:
  // Phase 1 (Forward push): 320 Hz -> 1150 Hz
  osc.frequency.setValueAtTime(320, now);
  osc.frequency.exponentialRampToValueAtTime(1150, now + 0.07);
  // Phase 2 (Reverse pull): 1150 Hz -> 360 Hz
  osc.frequency.exponentialRampToValueAtTime(360, now + 0.15);
  // Phase 3 (Final flick): 360 Hz -> 920 Hz -> 420 Hz
  osc.frequency.exponentialRampToValueAtTime(920, now + 0.21);
  osc.frequency.exponentialRampToValueAtTime(420, now + totalDur);

  // Formant filter mimicking vinyl vocal sample ("Fresh" / "Aaah")
  formantFilter.type = 'peaking';
  formantFilter.frequency.setValueAtTime(1600, now);
  formantFilter.frequency.exponentialRampToValueAtTime(2400, now + 0.08);
  formantFilter.frequency.exponentialRampToValueAtTime(1400, now + 0.16);
  formantFilter.frequency.exponentialRampToValueAtTime(2000, now + 0.22);
  formantFilter.Q.value = 3.2;
  formantFilter.gain.value = 14; // Resonant boost

  // Layer 1 envelope (rhythmic hand cuts)
  oscGain.gain.setValueAtTime(0, now);
  oscGain.gain.linearRampToValueAtTime(0.24, now + 0.02);
  oscGain.gain.setValueAtTime(0.26, now + 0.07);
  oscGain.gain.setValueAtTime(0.08, now + 0.09); // micro-mute between cuts
  oscGain.gain.linearRampToValueAtTime(0.28, now + 0.11);
  oscGain.gain.setValueAtTime(0.22, now + 0.15);
  oscGain.gain.setValueAtTime(0.06, now + 0.17); // micro-mute
  oscGain.gain.linearRampToValueAtTime(0.32, now + 0.19);
  oscGain.gain.exponentialRampToValueAtTime(0.001, now + totalDur);

  osc.connect(formantFilter);
  formantFilter.connect(oscGain);
  oscGain.connect(master);

  osc.start(now);
  osc.stop(now + totalDur + 0.02);

  // --- LAYER 2: Vinyl Surface Friction & Needle Grit ---
  const bufferSize = Math.floor(ctx.sampleRate * totalDur);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  // Dynamic friction noise with velocity bursts matching hand cuts
  for (let i = 0; i < bufferSize; i++) {
    const t = i / ctx.sampleRate;
    // Hand velocity modulation curve
    const stroke1 = Math.exp(-Math.pow((t - 0.05) / 0.025, 2));
    const stroke2 = Math.exp(-Math.pow((t - 0.13) / 0.025, 2));
    const stroke3 = Math.exp(-Math.pow((t - 0.21) / 0.03, 2));
    const envelope = (stroke1 * 0.9 + stroke2 * 0.75 + stroke3 * 1.0);
    data[i] = (Math.random() * 2 - 1) * envelope;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = 'bandpass';
  noiseFilter.frequency.setValueAtTime(900, now);
  noiseFilter.frequency.exponentialRampToValueAtTime(3200, now + 0.07);
  noiseFilter.frequency.exponentialRampToValueAtTime(1100, now + 0.15);
  noiseFilter.frequency.exponentialRampToValueAtTime(2800, now + 0.21);
  noiseFilter.Q.value = 1.6; // Wider bandpass for fuller crunch

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.42, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + totalDur);

  noise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(master);

  noise.start(now);
  noise.stop(now + totalDur + 0.02);
}

/**
 * 808 Sub Boom / Crowd Impact Drop
 * Features punchy transient kick click and rich 2nd/3rd harmonic saturation
 * so it hits hard on laptops, phones, and studio subwoofers alike.
 */
export function playSubDrop(): void {
  if (typeof window === 'undefined') return;
  const ctx = getAudioContext();
  const master = getMasterGain(ctx);
  const now = ctx.currentTime;
  const dur = 0.75;

  // 1. Transient Kick Punch (Pitch drops from 220Hz down to 55Hz in 35ms)
  const punchOsc = ctx.createOscillator();
  const punchGain = ctx.createGain();
  punchOsc.type = 'sine';
  punchOsc.frequency.setValueAtTime(220, now);
  punchOsc.frequency.exponentialRampToValueAtTime(55, now + 0.035);

  punchGain.gain.setValueAtTime(0.55, now);
  punchGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

  punchOsc.connect(punchGain);
  punchGain.connect(master);
  punchOsc.start(now);
  punchOsc.stop(now + 0.09);

  // 2. Sub-Bass Fundamental Body (55Hz down to 38Hz)
  const subOsc = ctx.createOscillator();
  const subGain = ctx.createGain();
  subOsc.type = 'sine';
  subOsc.frequency.setValueAtTime(75, now);
  subOsc.frequency.exponentialRampToValueAtTime(52, now + 0.12);
  subOsc.frequency.exponentialRampToValueAtTime(38, now + dur);

  subGain.gain.setValueAtTime(0.65, now);
  subGain.gain.setValueAtTime(0.60, now + 0.08);
  subGain.gain.exponentialRampToValueAtTime(0.001, now + dur);

  subOsc.connect(subGain);
  subGain.connect(master);
  subOsc.start(now);
  subOsc.stop(now + dur + 0.02);

  // 3. Upper Harmonic Saturation Layer (104Hz - 156Hz)
  // Ensures sub boom is punchy and audible on mobile and laptop speakers
  const satOsc = ctx.createOscillator();
  const satGain = ctx.createGain();
  satOsc.type = 'triangle';
  satOsc.frequency.setValueAtTime(150, now);
  satOsc.frequency.exponentialRampToValueAtTime(104, now + 0.12);
  satOsc.frequency.exponentialRampToValueAtTime(76, now + dur * 0.7);

  satGain.gain.setValueAtTime(0.28, now);
  satGain.gain.exponentialRampToValueAtTime(0.001, now + dur * 0.6);

  satOsc.connect(satGain);
  satGain.connect(master);
  satOsc.start(now);
  satOsc.stop(now + dur * 0.65);
}
