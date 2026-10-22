/**
 * In-browser Web Audio API soundboard synthesizer for live cypher sessions.
 * Generates instant zero-latency DJ FX (Airhorn, Laser, Vinyl Scratch, Sub Boom)
 * without needing external asset downloads or network requests.
 */

let sharedAudioCtx: AudioContext | null = null;

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

/**
 * Classic Dancehall / Hip-Hop Reggae Airhorn (Tri-tone multi-pulse burst)
 */
export function playAirhorn(): void {
  if (typeof window === 'undefined') return;
  const ctx = getAudioContext();
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
      osc.frequency.exponentialRampToValueAtTime(freq * 1.06, now + offset + 0.03);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.98, now + offset + dur);

      gain.gain.setValueAtTime(0, now + offset);
      gain.gain.linearRampToValueAtTime(0.14, now + offset + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

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
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(2200, now);
  osc.frequency.exponentialRampToValueAtTime(65, now + 0.38);

  gain.gain.setValueAtTime(0.22, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.4);
}

/**
 * Authentic Turntable Vinyl Scratch (Bandpass filtered white noise burst)
 */
export function playRecordScratch(): void {
  if (typeof window === 'undefined') return;
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  const bufferSize = Math.floor(ctx.sampleRate * 0.24);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  // Generate shaped noise burst
  for (let i = 0; i < bufferSize; i++) {
    const progress = i / bufferSize;
    const envelope = Math.sin(progress * Math.PI);
    data[i] = (Math.random() * 2 - 1) * envelope;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(500, now);
  filter.frequency.exponentialRampToValueAtTime(3200, now + 0.08);
  filter.frequency.exponentialRampToValueAtTime(350, now + 0.22);
  filter.Q.value = 5.0;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.35, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  noise.start(now);
  noise.stop(now + 0.25);
}

/**
 * 808 Sub Boom / Crowd Impact Drop
 */
export function playSubDrop(): void {
  if (typeof window === 'undefined') return;
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(130, now);
  osc.frequency.exponentialRampToValueAtTime(32, now + 0.65);

  gain.gain.setValueAtTime(0.45, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.67);
}
