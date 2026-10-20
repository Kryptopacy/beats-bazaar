'use client';

import React, { useState, useEffect } from 'react';
import { useAudio } from '@/context/AudioContext';
import { Beat } from '@/types';
import { 
  Play, 
  Pause, 
  Disc3, 
  ShieldCheck, 
  Sparkles, 
  Search, 
  SlidersHorizontal, 
  Lock, 
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Flame
} from 'lucide-react';

interface MarketplaceViewProps {
  onLicenseBeat: (beat: Beat, tier: 'Standard Lease' | 'Exclusive Rights') => void;
  onOpenUpload: () => void;
  onSelectProducer: (producerName: string) => void;
}

export function MarketplaceView({ onLicenseBeat, onOpenUpload, onSelectProducer }: MarketplaceViewProps) {
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

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Reset to page 1 when filtering or searching
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedGenre, searchQuery]);

  // Dynamically compute all unique genres present in the active catalog + 'All'
  const dynamicGenres = ['All', ...Array.from(new Set(beats.map(b => b.genre)))];

  // Filter beats by genre and search query
  const filteredBeats = beats.filter(b => {
    const matchesGenre = selectedGenre === 'All' || b.genre === selectedGenre;
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery = !query || 
      b.title.toLowerCase().includes(query) ||
      b.producer.toLowerCase().includes(query) ||
      b.genre.toLowerCase().includes(query) ||
      (b.tags && b.tags.some(t => t.toLowerCase().includes(query)));
    return matchesGenre && matchesQuery;
  });

  // Pin sponsored/boosted beats to the top of the feed
  const sortedBeats = [...filteredBeats].sort((a, b) => {
    if (a.isSponsored && !b.isSponsored) return -1;
    if (!a.isSponsored && b.isSponsored) return 1;
    return 0;
  });

  const totalPages = Math.max(1, Math.ceil(sortedBeats.length / itemsPerPage));
  const paginatedBeats = sortedBeats.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = Math.floor(secs % 60);
    return `${mins}:${remaining < 10 ? '0' : ''}${remaining}`;
  };

  return (
    <div className="space-y-8 pb-32">
      
      {/* Hero Banner (Global Scope) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-surface to-[#1A222D] border border-border p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-accent-green/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            The Global Beat Bazaar. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-green via-emerald-300 to-accent-gold">
              Own Master Rights. License Direct.
            </span>
          </h1>
          <p className="mt-4 text-sm sm:text-base text-gray-300 max-w-2xl leading-relaxed">
            Connecting producers and artists worldwide. Audition tracks, jump into the live freestyle cypher room, and license master rights directly with instant checkout across fiat and crypto.
          </p>
        </div>
      </div>

      {/* Controls & Scalable Filters Bar */}
      <div className="space-y-4">
        
        {/* Search & Metadata Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-accent-green transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, producer, genre, or tag (#sax, #club)..."
              className="w-full bg-white/[0.03] backdrop-blur-md border border-white/[0.08] focus:border-accent-green focus:ring-4 focus:ring-accent-green/10 rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm text-white placeholder-gray-500 outline-none transition-all duration-200"
            />
          </div>

          <div className="text-xs text-gray-400 font-medium self-center sm:self-auto px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06]">
            Showing <span className="text-white font-bold">{filteredBeats.length}</span> of <span className="text-white font-bold">{beats.length}</span> beats (Page {currentPage} of {totalPages})
          </div>
        </div>

        {/* Dynamic Genre Filters (Horizontally Scrollable Glass Pills) */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-thin">
          {dynamicGenres.map((genre) => {
            const count = genre === 'All' 
              ? beats.length 
              : beats.filter(b => b.genre === genre).length;

            return (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 active:scale-95 ${
                  selectedGenre === genre
                    ? 'bg-gradient-to-r from-accent-green to-emerald-400 text-black shadow-lg shadow-accent-green/25 ring-1 ring-white/20'
                    : 'bg-white/[0.03] hover:bg-white/[0.08] text-gray-400 hover:text-white border border-white/[0.06]'
                }`}
              >
                <span>{genre}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                  selectedGenre === genre ? 'bg-black/20 text-black font-extrabold' : 'bg-white/[0.06] text-gray-400'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Beats Grid */}
      {filteredBeats.length === 0 ? (
        <div className="text-center py-20 bg-white/[0.02] backdrop-blur-xl rounded-3xl border border-dashed border-white/[0.08] p-8">
          <Disc3 className="w-12 h-12 text-gray-500 mx-auto animate-spin" />
          <h3 className="mt-4 text-lg font-bold text-white">No beats match your criteria</h3>
          <p className="mt-1 text-sm text-gray-400">Try clearing your search query or drop a fresh beat in this genre!</p>
          <button
            onClick={onOpenUpload}
            className="mt-6 px-6 py-2.5 bg-gradient-to-r from-accent-green to-emerald-400 text-black font-black rounded-full text-sm shadow-lg shadow-accent-green/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            Drop a Beat Now
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedBeats.map((beat) => {
              const isThisActive = activeBeat?.id === beat.id;
              const isThisPlaying = isThisActive && isPlaying;

              return (
                <div
                  key={beat.id}
                  className={`group rounded-3xl bg-gradient-to-b from-[#141A23] via-[#0F141B] to-[#0A0D12] border transition-all duration-300 flex flex-col justify-between overflow-hidden relative ${
                    isThisActive 
                      ? 'border-accent-green/70 ring-2 ring-accent-green/40 shadow-2xl shadow-accent-green/15 -translate-y-1' 
                      : 'border-white/[0.07] hover:border-white/[0.18] shadow-lg hover:shadow-2xl hover:shadow-black/70 hover:-translate-y-1'
                  }`}
                >
                  {/* Subtle Top Glow for Sponsored Tracks */}
                  {beat.isSponsored && (
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-80" />
                  )}

                  {/* Card Top */}
                  <div className="p-5">
                    <div className="flex items-start justify-between space-x-4">
                      {/* Visualizer Thumbnail */}
                      <div 
                        className="w-20 h-20 rounded-2xl flex items-center justify-center relative cursor-pointer shadow-md overflow-hidden flex-shrink-0 ring-1 ring-white/10 group-hover:ring-white/25 transition-all"
                        style={{ background: beat.coverArt || 'linear-gradient(135deg, #10B981, #0B0F12)' }}
                        onClick={() => isThisActive ? togglePlay() : playBeat(beat)}
                      >
                        <div className="absolute inset-0 bg-black/35 backdrop-blur-[1px] flex items-center justify-center group-hover:bg-black/15 transition-all">
                          {isThisPlaying ? (
                            <div className="w-10 h-10 rounded-full bg-accent-green text-black flex items-center justify-center shadow-lg shadow-accent-green/30 animate-pulse">
                              <Pause className="w-5 h-5 fill-black" />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-md group-hover:bg-accent-green group-hover:text-black">
                              <Play className="w-5 h-5 fill-current ml-0.5" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Metadata */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                          {beat.isSponsored && (
                            <span className="text-[10px] font-black uppercase tracking-wider text-black bg-gradient-to-r from-amber-400 to-yellow-300 px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm shadow-yellow-500/20">
                              <Flame className="w-3 h-3 fill-black text-black" />
                              SPONSORED
                            </span>
                          )}
                          <span className="text-[10px] font-bold uppercase tracking-wider text-accent-green bg-accent-green/10 border border-accent-green/20 px-2.5 py-0.5 rounded-full">
                            {beat.genre}
                          </span>
                          <span className="text-[10px] font-semibold text-gray-300 bg-white/[0.04] border border-white/[0.06] px-2.5 py-0.5 rounded-full font-mono">
                            {beat.bpm} BPM
                          </span>
                          {beat.inCypher && (
                            <span className="text-[10px] font-bold text-accent-yellow bg-accent-gold/15 border border-accent-gold/30 px-2.5 py-0.5 rounded-full">
                              CYPHER
                            </span>
                          )}
                        </div>
                        <h3 className="mt-2 text-base font-black text-white truncate group-hover:text-accent-green transition-colors tracking-tight">
                          {beat.title}
                        </h3>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Prod. by{' '}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectProducer(beat.producer);
                            }}
                            className="text-white hover:text-accent-green font-bold transition-all inline-flex items-center gap-1 hover:underline"
                            title="View producer public storefront"
                          >
                            <span>{beat.producer}</span>
                            <UserCheck className="w-3.5 h-3.5 text-accent-green" />
                          </button>
                        </p>
                      </div>
                    </div>

                    {/* Audio Preview Scrubber with Protection Indicator */}
                    {isThisActive && (
                      <div className="mt-4 pt-3 border-t border-white/[0.06]">
                        <div className="flex items-center justify-between text-[11px] text-gray-400 mb-1.5 font-mono">
                          <span className="flex items-center gap-1 text-accent-yellow text-[10px] font-bold uppercase tracking-wider">
                            <Lock className="w-3 h-3" /> Tagged Preview
                          </span>
                          <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={duration || 100}
                          value={currentTime}
                          onChange={(e) => seek(parseFloat(e.target.value))}
                          className="w-full h-1.5 bg-white/[0.08] rounded-lg appearance-none cursor-pointer accent-accent-green hover:accent-emerald-300 transition-all"
                        />
                      </div>
                    )}

                    {/* Tags */}
                    {beat.tags && beat.tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {beat.tags.map((t, idx) => (
                          <span key={idx} className="text-[10px] text-gray-400 hover:text-gray-200 bg-white/[0.03] border border-white/[0.05] px-2.5 py-0.5 rounded-full transition-colors">
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Card Footer / Purchase Drawer */}
                  <div className="px-5 py-4 bg-white/[0.02] backdrop-blur-md border-t border-white/[0.06] flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Standard Lease</div>
                      <div className="text-lg font-black text-white tracking-tight">${beat.leasePrice}</div>
                    </div>

                    {beat.isSoldExclusive ? (
                      <span className="px-3.5 py-1.5 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-xs font-bold uppercase tracking-wider">
                        Exclusive Sold
                      </span>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onLicenseBeat(beat, 'Standard Lease')}
                          className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] hover:border-white/[0.18] text-white text-xs font-bold transition-all duration-200 active:scale-95 shadow-sm"
                        >
                          Lease
                        </button>
                        <button
                          onClick={() => onLicenseBeat(beat, 'Exclusive Rights')}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-black text-xs font-black shadow-md shadow-amber-500/20 hover:brightness-105 active:scale-95 transition-all duration-200 ring-1 ring-white/20"
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

          {/* Scalable Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 pt-8">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs font-bold text-gray-300 hover:text-white hover:bg-white/[0.08] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev</span>
              </button>

              <div className="flex items-center space-x-1.5">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition-all duration-200 ${
                      currentPage === pageNum
                        ? 'bg-gradient-to-r from-accent-green to-emerald-400 text-black font-black shadow-md shadow-accent-green/20'
                        : 'bg-white/[0.03] border border-white/[0.08] text-gray-400 hover:text-white hover:bg-white/[0.08]'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs font-bold text-gray-300 hover:text-white hover:bg-white/[0.08] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
