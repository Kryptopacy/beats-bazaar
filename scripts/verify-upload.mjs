// Verification script for Producer Beat Upload & Catalog State
import assert from 'assert';

const initialCatalog = [
  { id: 'beat-1', title: 'Lagos Nightdrive', inCypher: true, genre: 'Afrobeats' }
];

function addNewBeat(catalog, newBeat) {
  assert(newBeat.title && newBeat.title.trim().length > 0, 'Title required');
  assert(newBeat.producer && newBeat.producer.trim().length > 0, 'Producer required');
  assert(newBeat.leasePrice > 0, 'Lease price must be > 0');
  assert(newBeat.exclusivePrice > newBeat.leasePrice, 'Exclusive price must be > lease price');
  
  return [newBeat, ...catalog];
}

const customBeat = {
  id: `beat-${Date.now()}`,
  title: 'Ibadan Sunset Groove',
  producer: 'TCG-m',
  genre: 'Alté',
  bpm: 102,
  audioUrl: 'blob:http://localhost:3000/mock-audio',
  leasePrice: 50,
  exclusivePrice: 500,
  inCypher: true,
  isSoldExclusive: false,
  uploadedAt: new Date().toISOString()
};

const updatedCatalog = addNewBeat(initialCatalog, customBeat);

assert.strictEqual(updatedCatalog.length, 2, 'Catalog should now contain 2 beats');
assert.strictEqual(updatedCatalog[0].title, 'Ibadan Sunset Groove', 'New beat should be at the top');

const cypherQueue = updatedCatalog.filter(b => b.inCypher);
assert(cypherQueue.some(b => b.id === customBeat.id), 'New beat should be in Cypher queue');

console.log('✅ Producer Upload & Catalog state verification passed!');
