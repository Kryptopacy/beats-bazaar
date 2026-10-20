export type Genre = 
  | 'Afrobeats'
  | 'Amapiano'
  | 'Afro-Drill'
  | 'Hip Hop'
  | 'Trap'
  | 'R&B'
  | 'Alté';

export interface Beat {
  id: string;
  title: string;
  producer: string;
  genre: Genre;
  bpm: number;
  audioUrl: string;
  leasePrice: number;
  exclusivePrice: number;
  inCypher: boolean;
  isSoldExclusive: boolean;
  uploadedAt: string;
  tags?: string[];
  coverArt?: string;
  isSponsored?: boolean;
  likes?: number;
  producerAvatar?: string;
}

export interface StreamingPlacement {
  id: string;
  songTitle: string;
  artistName: string;
  platform: 'Spotify' | 'Apple Music' | 'Audiomack' | 'YouTube';
  streams: string;
  url: string;
}

export type LicenseTier = 'Standard Lease' | 'Exclusive Rights';

export interface LicenseCertificate {
  certificateId: string;
  beatId: string;
  beatTitle: string;
  licensor: string;
  licensee: string;
  tier: LicenseTier;
  price: number;
  terms: string[];
  issuedAt: string;
  transactionRef: string;
  paymentMethod: 'fiat' | 'crypto';
}
