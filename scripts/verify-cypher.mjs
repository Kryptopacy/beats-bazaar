// Verification script for Cypher auto-advance & crossfade queue logic
const beats = [
  { id: 'beat-1', title: 'Lagos Nightdrive', inCypher: true, genre: 'Afrobeats' },
  { id: 'beat-2', title: 'Joburg Sunset', inCypher: true, genre: 'Amapiano' },
  { id: 'beat-3', title: 'Mainland Drill 2.0', inCypher: true, genre: 'Afro-Drill' }
];

function getNextTrack(currentId, shuffle = false) {
  const queue = beats.filter(b => b.inCypher);
  if (shuffle) {
    const remaining = queue.filter(b => b.id !== currentId);
    return remaining[Math.floor(Math.random() * remaining.length)];
  }
  const currentIndex = queue.findIndex(b => b.id === currentId);
  const nextIndex = (currentIndex + 1) % queue.length;
  return queue[nextIndex];
}

function calculateCrossfadeVolume(currentTime, duration, crossfadeDuration, baseVolume) {
  if (duration - currentTime <= crossfadeDuration) {
    const remaining = duration - currentTime;
    const fadeRatio = Math.max(0, remaining / crossfadeDuration);
    return baseVolume * fadeRatio;
  }
  return baseVolume;
}

// Test sequential queue advance
const next1 = getNextTrack('beat-1', false);
if (next1.id !== 'beat-2') throw new Error(`Expected beat-2, got ${next1.id}`);

const next2 = getNextTrack('beat-3', false); // loop around to start
if (next2.id !== 'beat-1') throw new Error(`Expected loop to beat-1, got ${next2.id}`);

// Test crossfade curve
const volNormal = calculateCrossfadeVolume(5, 12, 3, 1.0);
if (volNormal !== 1.0) throw new Error('Volume should be normal before crossfade window');

const volFading = calculateCrossfadeVolume(10.5, 12, 3, 1.0); // 1.5s remaining of 3s = 50%
if (Math.abs(volFading - 0.5) > 0.01) throw new Error(`Expected 0.5 volume, got ${volFading}`);

console.log('✅ Cypher queue auto-advance & crossfade verification passed!');
