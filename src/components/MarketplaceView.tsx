'use client';

import React from 'react';
import { useAudio } from '@/context/AudioContext';
import { Beat, Genre } from '@/types';
import { Play, Pause, Disc3, ShieldCheck, Zap, Sparkles, SlidersHorizontal, ArrowRight } from 'lucide-react';

interface MarketplaceViewProps {
  onLicenseBeat: (beat: Beat, tier: 'Standard Lease' | 'Exclusive Rights') => void;
  onOpenUpload: () => void;
}

const GENRES: (Genre | 'All')[] = ['All', 'Afrobeats', 'Amapiano', 'Afro-Drill', 'Hip Hop', 'Trap', 'R&B', 'Alté'];

export function MarketplaceView({ onLicenseBeat, onOpenUpload }: MarketplaceViewProps) {
  const { 
    beats, 
    activeBeat, 
    isPlaying, 
    playBeat, 
    togglePlay, 
    selectedGenre, 
    setSelectedGenre,
    currentTime,
    duration,
    seek
  } = useAudio();

  const filteredBeats = selectedGenre === 'All' 
    ? beats 
    : beats.filter(b => b.genre === selectedGenre);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = Math.floor(secs % 60);
    return `${mins}:${remaining < 10 ? '0' : ''}${remaining}`;
  };

  return (
    <div className="space-y-8 pb-32">
      
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-surface to-[#1A222D] border border-border p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-accent-green/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-accent-green/10 border border-accent-green/30 text-accent-green text-xs font-semibold mb-4">
            <Zap className="w-3.5 h-3.5" />
            <span>Zero Intermediaries • Instant Producer Payouts</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            The African Beat Exchange. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-green via-emerald-300 to-accent-gold">
              Own Rights. Back Creators.
            </span>
          </h1>
          <p className="mt-3 text-sm sm:text-base text-gray-300 max-w-2xl leading-relaxed">
            High-caliber underground Afrobeats, Amapiano, and global heat. Direct licensing powered by <span className="text-accent-yellow font-bold">Bachs</span>—checkout seamlessly in local fiat (NGN/GHS/USD) or crypto.
          </p>
        </div>
      </div>

      {/* Genre Filters Bar */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {GENRES.map((genre) => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(genre)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              selectedGenre === genre
                ? 'bg-accent-green text-black shadow-lg shadow-accent-green/20'
                : 'bg-surface text-gray-400 hover:text-white hover:bg-surface-light border border-border'
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Beats Grid */}
      {filteredBeats.length === 0 ? (
        <div className="text-center py-20 bg-surface rounded-2xl border border-dashed border-border p-8">
          <Disc3 className="w-12 h-12 text-gray-500 mx-auto animate-spin" />
          <h3 className="mt-4 text-lg font-bold text-white">No beats found in {selectedGenre}</h3>
          <p className="mt-1 text-sm text-gray-400">Be the first producer to drop an incredible track in this category!</p>
          <button
            onClick={onOpenUpload}
            className="mt-6 px-5 py-2.5 bg-accent-green text-black font-bold rounded-xl text-sm shadow-md hover:opacity-90"
          >
            Drop the First Beat
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBeats.map((beat) => {
            const isThisActive = activeBeat?.id === beat.id;
            const isThisPlaying = isThisActive && isPlaying;

            return (
              <div
                key={beat.id}
                className={`group rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col justify-between ${
                  isThisActive 
                    ? 'bg-surface border-accent-green/60 shadow-xl shadow-accent-green/10' 
                    : 'bg-surface/80 hover:bg-surface border-border hover:border-gray-700'
                }`}
              >
                {/* Card Top */}
                <div className="p-5">
                  <div className="flex items-start justify-between space-x-4">
                    {/* Visualizer Thumbnail */}
                    <div 
                      className="w-16 h-16 rounded-xl flex items-center justify-center relative cursor-pointer shadow-md overflow-hidden flex-shrink-0"
                      style={{ background: beat.coverArt || 'linear-gradient(135deg, #10B981, #0B0F12)' }}
                      onClick={() => isThisActive ? togglePlay() : playBeat(beat)}
                    >
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/10 transition-colors">
                        {isThisPlaying ? (
                          <Pause className="w-8 h-8 text-white fill-white animate-pulse" />
                        ) : (
                          <Play className="w-8 h-8 text-white fill-white ml-1" />
                        )}
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-accent-green bg-accent-green/10 px-2 py-0.5 rounded-md">
                          {beat.genre}
                        </span>
                        <span className="text-[10px] font-semibold text-gray-400 bg-surface-light px-2 py-0.5 rounded-md">
                          {beat.bpm} BPM
                        </span>
                        {beat.inCypher && (
                          <span className="text-[10px] font-bold text-accent-gold bg-accent-gold/10 px-2 py-0.5 rounded-md">
                            CYPHER
                          </span>
                        )}
                      </div>
                      <h3 className="mt-1.5 text-base font-bold text-white truncate group-hover:text-accent-green transition-colors">
                        {beat.title}
                      </h3>
                      <p className="text-xs text-gray-400">Prod. by <span className="text-gray-300 font-semibold">{beat.producer}</span></p>
                    </div>
                  </div>

                  {/* Scrubber if actively playing */}
                  {isThisActive && (
                    <div className="mt-4 pt-3 border-t border-border">
                      <div className="flex items-center justify-between text-[11px] text-gray-400 mb-1 font-mono">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={duration || 100}
                        value={currentTime}
                        onChange={(e) => seek(parseFloat(e.target.value))}
                        className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-accent-green"
                      />
                    </div>
                  )}

                  {/* Tags */}
                  {beat.tags && beat.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {beat.tags.map((t, idx) => (
                        <span key={idx} className="text-[10px] text-gray-400 bg-[#1F2937]/50 px-2 py-0.5 rounded">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Footer / Purchase Drawer */}
                <div className="px-5 py-4 bg-[#0F141C] border-t border-border/80 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-gray-400">Standard Lease</div>
                    <div className="text-base font-extrabold text-white">${beat.leasePrice}</div>
                  </div>

                  {beat.isSoldExclusive ? (
                    <span className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-wider">
                      Exclusive Sold
                    </span>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onLicenseBeat(beat, 'Standard Lease')}
                        className="px-3 py-1.5 rounded-lg bg-surface border border-accent-green/40 hover:bg-accent-green hover:text-black text-accent-green text-xs font-bold transition-all"
                      >
                        Lease
                      </button>
                      <button
                        onClick={() => onLicenseBeat(beat, 'Exclusive Rights')}
                        className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-accent-gold to-yellow-500 text-black text-xs font-extrabold shadow-sm hover:opacity-90 transition-all"
                      >
                        Buyout (${beat.exclusivePrice})
                      </button>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
