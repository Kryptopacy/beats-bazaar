// Verification script for Bachs Checkout, License Certificate generation, and Exclusive Rights
import assert from 'assert';

function processBachsTransaction(beat, tier, paymentMethod, artistName) {
  const txRef = `BACHS-${Date.now().toString(36).toUpperCase()}-TEST`;
  const amount = tier === 'Exclusive Rights' ? beat.exclusivePrice : beat.leasePrice;

  const certificate = {
    certificateId: `BB-LIC-${Date.now().toString(36).toUpperCase()}-VERIFIED`,
    beatId: beat.id,
    beatTitle: beat.title,
    licensor: beat.producer,
    licensee: artistName || 'Independent Artist',
    tier,
    price: amount,
    issuedAt: new Date().toISOString(),
    transactionRef: txRef,
    paymentMethod,
    terms: tier === 'Exclusive Rights' ? [
      'Sole and exclusive worldwide commercial master rights transferred to Licensee.',
      'Unlimited audio streams, physical copies, music videos, and commercial broadcasting.',
      'Beat retired permanently from market; no further leases or licenses permitted.',
      'Licensor (Producer) retains standard 50% writer & publishing royalty share.'
    ] : [
      'Non-exclusive commercial master synchronization rights granted to Licensee.',
      'Up to 100,000 commercial audio streams across Spotify, Apple Music, and DSPs.',
      '1 monetized official music video and non-exclusive radio broadcasting.',
      'Licensor retains master ownership and may continue offering non-exclusive leases.'
    ]
  };

  const updatedBeat = tier === 'Exclusive Rights' 
    ? { ...beat, isSoldExclusive: true }
    : beat;

  return { certificate, updatedBeat };
}

const mockBeat = {
  id: 'beat-demo',
  title: 'Lagos Nightdrive',
  producer: 'SarzAura',
  genre: 'Afrobeats',
  leasePrice: 35,
  exclusivePrice: 350,
  isSoldExclusive: false
};

// 1. Test Lease flow
const leaseResult = processBachsTransaction(mockBeat, 'Standard Lease', 'fiat', 'Rema');
assert(leaseResult.certificate.certificateId.startsWith('BB-LIC-'), 'Must have BB-LIC certificate prefix');
assert.strictEqual(leaseResult.certificate.tier, 'Standard Lease');
assert.strictEqual(leaseResult.certificate.price, 35);
assert.strictEqual(leaseResult.updatedBeat.isSoldExclusive, false, 'Lease does not mark exclusive sold');

// 2. Test Exclusive Buyout flow
const exclusiveResult = processBachsTransaction(mockBeat, 'Exclusive Rights', 'crypto', 'Burna Boy');
assert.strictEqual(exclusiveResult.certificate.tier, 'Exclusive Rights');
assert.strictEqual(exclusiveResult.certificate.price, 350);
assert.strictEqual(exclusiveResult.certificate.paymentMethod, 'crypto');
assert.strictEqual(exclusiveResult.updatedBeat.isSoldExclusive, true, 'Exclusive purchase marks beat as SOLD');
assert(exclusiveResult.certificate.terms[0].includes('Sole and exclusive worldwide commercial master rights'), 'Must include exclusive grant');

console.log('✅ Bachs checkout, licensing terms, and exclusive rights verification passed!');
