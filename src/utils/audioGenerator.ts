/**
 * Generates an in-memory rhythmic African drum & melody loop as a playable WAV Blob URL.
 * Guarantees zero-latency, 100% offline-resilient audio playback for demo beats.
 */
export function generateBeatAudioUrl(genre: string, bpm: number): string {
  if (typeof window === 'undefined') return '';

  const sampleRate = 22050; // Lightweight high-quality sample rate
  const durationSeconds = 12; // 12-second seamless loop
  const totalSamples = sampleRate * durationSeconds;
  const numChannels = 1;
  const bytesPerSample = 2; // 16-bit PCM

  // Allocate buffer
  const buffer = new ArrayBuffer(44 + totalSamples * bytesPerSample);
  const view = new DataView(buffer);

  // Write WAV Header
  function writeString(offset: number, str: string) {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  }

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + totalSamples * bytesPerSample, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true); // PCM Chunk size
  view.setUint16(20, 1, true); // Audio format 1 = PCM
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * bytesPerSample, true); // Byte rate
  view.setUint16(32, numChannels * bytesPerSample, true); // Block align
  view.setUint16(34, 16, true); // Bits per sample
  writeString(36, 'data');
  view.setUint32(40, totalSamples * bytesPerSample, true);

  // Beat parameters
  const beatInterval = 60 / bpm;
  const samplesPerBeat = sampleRate * beatInterval;

  // Synthesize rhythmic African percussion & harmonic elements
  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    const beatPos = (i % samplesPerBeat) / samplesPerBeat;
    const barBeat = (i / samplesPerBeat) % 4;
    let sample = 0;

    // 1. Kick / Bass Pulse (Downbeat + Syncopated Afrobeats groove)
    const isKick = barBeat < 0.2 || (barBeat > 1.4 && barBeat < 1.6) || (barBeat > 2.5 && barBeat < 2.7);
    if (isKick) {
      const kickT = (i % (samplesPerBeat * 0.5)) / sampleRate;
      const kickFreq = Math.max(45, 120 - kickT * 400);
      sample += Math.sin(2 * Math.PI * kickFreq * kickT) * Math.exp(-kickT * 12) * 0.5;
    }

    // 2. Amapiano Log Drum or Afro Bassline
    if (genre === 'Amapiano') {
      const logT = (i % (samplesPerBeat * 0.75)) / sampleRate;
      const logFreq = 55 + Math.sin(t * 4) * 15;
      sample += Math.sin(2 * Math.PI * logFreq * logT) * Math.exp(-logT * 8) * 0.45;
    } else {
      const bassFreq = 65 + (Math.floor((t * 2) % 4) * 12);
      sample += Math.sin(2 * Math.PI * bassFreq * t) * 0.25;
    }

    // 3. Shaker / Hi-Hat Rhythms (African syncopation 16th notes)
    const sixteenth = (i % (samplesPerBeat / 4)) / (samplesPerBeat / 4);
    if (sixteenth < 0.3) {
      const noise = (Math.random() * 2 - 1) * Math.exp(-sixteenth * 18);
      sample += noise * 0.15;
    }

    // 4. Melodic Synth Chord / Keys
    const chordBase = genre === 'Alté' ? 220 : genre === 'Afrobeats' ? 261.63 : 196;
    const melodyOsc = Math.sin(2 * Math.PI * chordBase * t) * 0.12 
                    + Math.sin(2 * Math.PI * (chordBase * 1.25) * t) * 0.08
                    + Math.sin(2 * Math.PI * (chordBase * 1.5) * t) * 0.08;
    sample += melodyOsc * (0.6 + 0.4 * Math.sin(t * 1.5));

    // Clamp to 16-bit PCM range [-32768, 32767]
    const clamped = Math.max(-1, Math.min(1, sample));
    view.setInt16(44 + i * 2, clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff, true);
  }

  const blob = new Blob([buffer], { type: 'audio/wav' });
  return URL.createObjectURL(blob);
}
