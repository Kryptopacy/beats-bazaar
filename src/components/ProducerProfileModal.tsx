'use client';

import React from 'react';
import { useAudio } from '@/context/AudioContext';
import { Beat } from '@/types';
import { X, MapPin, CheckCircle, Coins, ShieldCheck, Play, Pause, Music, Award } from 'lucide-react';

interface ProducerProfileModalProps {
  producerName: string | null;
  isOpen: boolean;
  onClose: () => void;
  onTipProducer: (beat: Beat) => void;
  onLicenseBeat: (beat: Beat, tier: 'Standard Lease' | 'Exclusive Rights') => void;
}

// Enriched mock metadata for producers
const PRODUCER_BIOS: Record<string, { bio: string; location: string; verified: boolean }> = {
  DoctorOpto: {
    bio: 'Optometrist by day, sound architect by night. Crafting soulful Alté grooves, organic percussion, and warm African melodies.',
    location: 'Lagos & Ibadan, Nigeria',
    verified: true
  },
  SarzAura: {
    bio: 'Multi-genre Afrobeat pioneer inspired by Sarz & Kel-P. Bouncy rhythms, syncopated shakers, and anthemic hooks.',
    location: 'Lagos, Nigeria',
    verified: true
  },
  KabzaFlow: {
    bio: 'Pure Amapiano heavyweights. Private school piano keys, rolling 3-step log drums, and atmospheric pads.',
    location: 'Johannesburg, South Africa',
    verified: true
  },
  AbujaBeatz: {
    bio: 'Dark African Drill specialist. Heavy slide 808s, haunting flute riffs, and razor-sharp hi-hat rolls.',
    location: 'Abuja, Nigeria',
    verified: true
  }
};

export function ProducerProfileModal({
  producerName,
  isOpen,
  onClose,
  onTipProducer,
  onLicenseBeat
}: ProducerProfileModalProps) {
  const { beats, activeBeat, isPlaying, playBeat, togglePlay } = useAudio();

  if (!isOpen || !producerName) return null;

  const producerBeats = beats.filter(b => b.producer.toLowerCase() === producerName.toLowerCase());
  const meta = PRODUCER_BIOS[producerName] || {
    bio: 'Independent music producer creating exceptional underground rhythms on Beats Bazaar.',
    location: 'Global / Underground',
    verified: true
  };

  const sampleBeat = producerBeats[0] || null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-surface border border-border p-6 sm:p-8 shadow-2xl my-8">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-gray-400 hover:text-white rounded-xl hover:bg-surface-light"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-5 pb-6 border-b border-border">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-accent-green to-accent-gold flex items-center justify-center shadow-lg shadow-accent-green/20 flex-shrink-0">
            <Music className="w-10 h-10 text-black" />
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start space-x-2">
              <h2 className="text-2xl font-black text-white">{producerName}</h2>
              {meta.verified && (
                <CheckCircle className="w-5 h-5 text-accent-green fill-accent-green/20" />
              )}
            </div>

            <div className="flex items-center justify-center sm:justify-start space-x-1.5 text-xs text-gray-400 mt-1">
              <MapPin className="w-3.5 h-3.5 text-accent-gold" />
              <span>{meta.location}</span>
              <span>•</span>
              <span className="text-accent-green font-semibold">{producerBeats.length} Tracks in Store</span>
            </div>

            <p className="mt-2 text-xs sm:text-sm text-gray-300 leading-relaxed max-w-lg">
              {meta.bio}
            </p>

            {/* Direct Tip CTA */}
            {sampleBeat && (
              <button
                onClick={() => onTipProducer(sampleBeat)}
                className="mt-4 inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-accent-gold/15 border border-accent-gold/40 text-accent-yellow hover:bg-accent-gold hover:text-black font-bold text-xs shadow-sm transition-all"
              >
                <Coins className="w-4 h-4" />
                <span>Tip {producerName} via Bachs</span>
              </button>
            )}
          </div>
        </div>

        {/* Producer Catalog List */}
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-gray-400">
              Discography &amp; Master Leases
            </h3>
            <span className="text-xs text-gray-500 font-mono">Instant Bachs Delivery</span>
          </div>

          {producerBeats.length === 0 ? (
            <p className="text-xs text-gray-500 py-6 text-center">No active beats listed by this producer yet.</p>
          ) : (
            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {producerBeats.map((beat) => {
                const isThisActive = activeBeat?.id === beat.id;
                const isThisPlaying = isThisActive && isPlaying;

                return (
                  <div
                    key={beat.id}
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                      isThisActive ? 'bg-[#0B0F12] border-accent-green/60' : 'bg-[#090D10] border-border hover:border-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0 pr-3">
                      <button
                        onClick={() => isThisActive ? togglePlay() : playBeat(beat)}
                        className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center flex-shrink-0 hover:bg-accent-green hover:text-black transition-colors"
                      >
                        {isThisPlaying ? (
                          <Pause className="w-5 h-5 text-accent-green" />
                        ) : (
                          <Play className="w-5 h-5 text-white ml-0.5" />
                        )}
                      </button>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-white truncate">{beat.title}</h4>
                        <div className="flex items-center space-x-2 text-[10px] text-gray-400">
                          <span className="text-accent-green font-semibold">{beat.genre}</span>
                          <span>•</span>
                          <span>{beat.bpm} BPM</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <div className="text-right pr-2 hidden sm:block">
                        <div className="text-[10px] text-gray-400">Lease</div>
                        <div className="text-xs font-extrabold text-white">${beat.leasePrice}</div>
                      </div>

                      {beat.isSoldExclusive ? (
                        <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/30">
                          SOLD
                        </span>
                      ) : (
                        <button
                          onClick={() => onLicenseBeat(beat, 'Standard Lease')}
                          className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-accent-green to-emerald-400 text-black text-xs font-bold hover:opacity-90 transition-all"
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
