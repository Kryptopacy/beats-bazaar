'use client';

import React, { useState } from 'react';
import { useAudio } from '@/context/AudioContext';
import { Beat } from '@/types';
import { 
  X, 
  MapPin, 
  CheckCircle, 
  Coins, 
  ShieldCheck, 
  Play, 
  Pause, 
  Music, 
  Award,
  ExternalLink,
  Headphones,
  Flame,
  Camera,
  Upload
} from 'lucide-react';

interface ProducerProfileModalProps {
  producerName: string | null;
  isOpen: boolean;
  onClose: () => void;
  onTipProducer: (beat: Beat) => void;
  onLicenseBeat: (beat: Beat, tier: 'Standard Lease' | 'Exclusive Rights') => void;
}

// Enriched mock metadata for producers
const PRODUCER_BIOS: Record<string, { bio: string; location: string; verified: boolean }> = {
  'TCG-m': {
    bio: 'Visionary sound architect blending Alté, Afro-fusion, and organic chords. Known for lush sonic textures, live instrumentation, and unmatched rhythmic bounce.',
    location: 'Lagos & Ibadan, Nigeria',
    verified: true
  },
  'SarzAura': {
    bio: 'Multi-genre Afrobeat pioneer inspired by Sarz & Kel-P. Bouncy rhythms, syncopated shakers, and anthemic hooks.',
    location: 'Lagos, Nigeria',
    verified: true
  },
  'KabzaFlow': {
    bio: 'Pure Amapiano heavyweights. Private school piano keys, rolling 3-step log drums, and atmospheric pads.',
    location: 'Johannesburg, South Africa',
    verified: true
  },
  'AbujaBeatz': {
    bio: 'Dark African Drill specialist. Heavy slide 808s, haunting flute riffs, and razor-sharp hi-hat rolls.',
    location: 'Abuja, Nigeria',
    verified: true
  }
};

// Released placements on streaming platforms (Spotify, Apple Music, Audiomack)
const PRODUCER_PLACEMENTS: Record<string, { songTitle: string; artist: string; platform: string; streams: string; year: string; url: string }[]> = {
  'TCG-m': [
    { songTitle: 'Midnight In Yaba', artist: 'Seyi Vibez ft. TCG-m', platform: 'Spotify', streams: '1.4M streams', year: '2025', url: 'https://open.spotify.com' },
    { songTitle: 'Coastline Breeze', artist: 'Cruel Santino x TCG-m', platform: 'Apple Music', streams: '890K plays', year: '2025', url: 'https://music.apple.com' },
    { songTitle: 'Highland Palmwine', artist: 'Show Dem Camp', platform: 'Audiomack', streams: '620K plays', year: '2024', url: 'https://audiomack.com' }
  ],
  'SarzAura': [
    { songTitle: 'Vibration Wave', artist: 'Burna Boy (Vibe Edit)', platform: 'Spotify', streams: '4.2M streams', year: '2024', url: 'https://open.spotify.com' },
    { songTitle: 'Kilometer Bounce', artist: 'Lojay', platform: 'Apple Music', streams: '2.1M plays', year: '2025', url: 'https://music.apple.com' }
  ],
  'KabzaFlow': [
    { songTitle: 'Pretoria Dawn (Sgija Mix)', artist: 'Focalistic', platform: 'Spotify', streams: '3.1M streams', year: '2025', url: 'https://open.spotify.com' },
    { songTitle: 'Bells & Chords', artist: 'Uncle Waffles x KabzaFlow', platform: 'Apple Music', streams: '1.9M plays', year: '2024', url: 'https://music.apple.com' }
  ],
  'AbujaBeatz': [
    { songTitle: 'Capital Drill', artist: 'PsychoYP', platform: 'Spotify', streams: '980K streams', year: '2025', url: 'https://open.spotify.com' },
    { songTitle: 'Northern Lights', artist: 'Odumodublvck', platform: 'Audiomack', streams: '1.1M plays', year: '2024', url: 'https://audiomack.com' }
  ]
};

export function ProducerProfileModal({
  producerName,
  isOpen,
  onClose,
  onTipProducer,
  onLicenseBeat
}: ProducerProfileModalProps) {
  const { beats, activeBeat, isPlaying, playBeat, togglePlay, producerAvatars, setProducerAvatar } = useAudio();
  const [activeTab, setActiveTab] = useState<'beats' | 'placements'>('beats');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  if (!isOpen || !producerName) return null;

  const currentAvatar = producerName ? producerAvatars[producerName] : undefined;

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && producerName) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setProducerAvatar(producerName, reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const producerBeats = beats.filter(b => b.producer.toLowerCase() === producerName.toLowerCase());
  const meta = PRODUCER_BIOS[producerName] || {
    bio: 'Independent music producer creating exceptional rhythms on Beats Bazaar.',
    location: 'Global',
    verified: true
  };

  const placements = PRODUCER_PLACEMENTS[producerName] || [];
  const sampleBeat = producerBeats[0] || null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl sm:rounded-[2.5rem] bg-gradient-to-b from-[#141A23] via-[#0F141B] to-[#0A0D12] border border-white/[0.1] p-4 sm:p-10 shadow-2xl my-auto sm:my-8 max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-gray-400 hover:text-white rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-white/[0.08] transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 pb-6 border-b border-white/[0.08]">
          <div className="relative group/avatar">
            <div className="w-20 h-20 rounded-3xl overflow-hidden bg-gradient-to-tr from-accent-green to-accent-gold flex items-center justify-center shadow-xl shadow-accent-green/20 flex-shrink-0 ring-1 ring-white/20">
              {currentAvatar ? (
                <img 
                  src={currentAvatar} 
                  alt={producerName} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <Music className="w-10 h-10 text-black font-black" />
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-accent-green text-black flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-all cursor-pointer border-2 border-[#121820]"
              title="Set producer profile avatar"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*" 
              onChange={handleAvatarUpload}
              className="hidden" 
            />
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start space-x-2">
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{producerName}</h2>
              {meta.verified && (
                <CheckCircle className="w-5 h-5 text-accent-green fill-accent-green/20" />
              )}
            </div>

            <div className="flex items-center justify-center sm:justify-start space-x-2 text-xs text-gray-400 mt-1.5 flex-wrap gap-y-1">
              <span className="flex items-center gap-1 text-gray-300">
                <MapPin className="w-3.5 h-3.5 text-accent-gold" />
                <span>{meta.location}</span>
              </span>
              <span>•</span>
              <span className="text-accent-green font-bold">{producerBeats.length} Beats for Sale</span>
              {placements.length > 0 && (
                <>
                  <span>•</span>
                  <span className="text-accent-yellow font-bold">{placements.length} Stream Releases</span>
                </>
              )}
            </div>

            <p className="mt-3 text-xs sm:text-sm text-gray-300 leading-relaxed max-w-lg">
              {meta.bio}
            </p>

            {/* Direct Tip CTA */}
            {sampleBeat && (
              <button
                onClick={() => onTipProducer(sampleBeat)}
                className="mt-4 inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 hover:bg-amber-400 hover:text-black font-extrabold text-xs shadow-md transition-all active:scale-95"
              >
                <Coins className="w-4 h-4" />
                <span>Tip {producerName}</span>
              </button>
            )}
          </div>
        </div>

        {/* Surface Tabs inside Profile (Beats vs Placements) */}
        <div className="mt-6 flex items-center p-1 bg-white/[0.04] backdrop-blur-xl rounded-full border border-white/[0.08] shadow-inner max-w-md">
          <button
            onClick={() => setActiveTab('beats')}
            className={`flex-1 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'beats'
                ? 'bg-gradient-to-r from-accent-green to-emerald-400 text-black shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Beats For Sale ({producerBeats.length})
          </button>

          <button
            onClick={() => setActiveTab('placements')}
            className={`flex-1 flex items-center justify-center space-x-1.5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'placements'
                ? 'bg-gradient-to-r from-accent-gold to-yellow-400 text-black shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Headphones className="w-3.5 h-3.5" />
            <span>Placements ({placements.length})</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'beats' ? (
            <div className="space-y-4">
              {producerBeats.length === 0 ? (
                <p className="text-xs text-gray-500 py-12 text-center">No active beats listed by this producer yet.</p>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {producerBeats.map((beat) => {
                    const isThisActive = activeBeat?.id === beat.id;
                    const isThisPlaying = isThisActive && isPlaying;

                    return (
                      <div
                        key={beat.id}
                        className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                          isThisActive 
                            ? 'bg-white/[0.06] border-accent-green/60 shadow-lg shadow-accent-green/10' 
                            : 'bg-white/[0.02] border-white/[0.06] hover:border-white/[0.15] hover:bg-white/[0.04]'
                        }`}
                      >
                        <div className="flex items-center space-x-3.5 min-w-0 pr-3">
                          <button
                            onClick={() => isThisActive ? togglePlay() : playBeat(beat)}
                            className="w-11 h-11 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center flex-shrink-0 hover:bg-accent-green hover:text-black transition-all shadow-sm"
                          >
                            {isThisPlaying ? (
                              <Pause className="w-5 h-5 text-accent-green" />
                            ) : (
                              <Play className="w-5 h-5 text-white ml-0.5" />
                            )}
                          </button>
                          <div className="min-w-0">
                            <h4 className="text-sm font-bold text-white truncate">{beat.title}</h4>
                            <div className="flex items-center space-x-2 text-[10px] text-gray-400 mt-0.5">
                              <span className="text-accent-green font-bold uppercase">{beat.genre}</span>
                              <span>•</span>
                              <span className="font-mono">{beat.bpm} BPM</span>
                              {beat.isSponsored && (
                                <span className="text-accent-yellow font-extrabold flex items-center gap-0.5">
                                  <Flame className="w-3 h-3 text-accent-gold" /> BOOSTED
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 flex-shrink-0">
                          <div className="text-right pr-2 hidden sm:block">
                            <div className="text-[10px] text-gray-400 uppercase font-semibold">Lease</div>
                            <div className="text-sm font-black text-white">${beat.leasePrice}</div>
                          </div>

                          {beat.isSoldExclusive ? (
                            <span className="px-3 py-1.5 rounded-xl text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/30">
                              SOLD
                            </span>
                          ) : (
                            <button
                              onClick={() => onLicenseBeat(beat, 'Standard Lease')}
                              className="px-4 py-2 rounded-xl bg-gradient-to-r from-accent-green to-emerald-400 text-black text-xs font-black shadow-md hover:scale-[1.02] active:scale-95 transition-all"
                            >
                              License
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* Streaming Placements Tab */
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {placements.length === 0 ? (
                <p className="text-xs text-gray-500 py-12 text-center">No external stream placements linked yet.</p>
              ) : (
                placements.map((song, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.15] hover:bg-white/[0.04] transition-all"
                  >
                    <div className="flex items-center space-x-3.5 min-w-0 pr-3">
                      <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center flex-shrink-0">
                        <Headphones className="w-5 h-5 text-accent-gold" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-white truncate">{song.songTitle}</h4>
                        <p className="text-xs text-gray-400 truncate mt-0.5">
                          {song.artist} • <span className="text-accent-green font-bold">{song.streams}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 flex-shrink-0">
                      <span className="text-xs font-semibold text-gray-400">
                        {song.platform}
                      </span>
                      <a
                        href={song.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-accent-gold hover:text-black text-gray-400 transition-all shadow-sm"
                        title="Listen on streaming platform"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-border flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-surface border border-border text-xs font-semibold text-gray-300 hover:text-white"
          >
            Close Storefront
          </button>
        </div>

      </div>
    </div>
  );
}
