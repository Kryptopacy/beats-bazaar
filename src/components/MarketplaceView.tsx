'use client';

import React, { useState, useEffect } from 'react';
import { useAudio } from '@/context/AudioContext';
import { Beat } from '@/types';
import { 
  Play, 
  Pause, 
  Disc3, 
  ShieldCheck, 
  Zap, 
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
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-accent-green/10 border border-accent-green/30 text-accent-green text-xs font-semibold mb-4">
            <Zap className="w-3.5 h-3.5" />
            <span>Direct P2P Creator Marketplace • Instant Payouts</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            The Global Beat Bazaar. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-green via-emerald-300 to-accent-gold">
              Own Master Rights. License Direct.
            </span>
          </h1>
          <p className="mt-3 text-sm sm:text-base text-gray-300 max-w-2xl leading-relaxed">
            Where underground heat meets global reach. Audition protected previews, freestyle in the cypher, and legally license master rights directly from producers—with instant checkout across fiat (NGN, GHS, USD, EUR) and crypto.
          </p>
        </div>
      </div>

      {/* Controls & Scalable Filters Bar */}
      <div className="space-y-4">
        
        {/* Search & Metadata Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, producer, genre, or tag (#sax, #club)..."
              className="w-full bg-surface border border-border rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:border-accent-green outline-none"
            />
          </div>

          <div className="text-xs text-gray-400 font-semibold self-center sm:self-auto">
            Showing <span className="text-white font-bold">{filteredBeats.length}</span> of <span className="text-white font-bold">{beats.length}</span> beats (Page {currentPage} of {totalPages})
          </div>
        </div>

        {/* Dynamic Genre Filters (Horizontally Scrollable) */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-thin">
          {dynamicGenres.map((genre) => {
            const count = genre === 'All' 
              ? beats.length 
              : beats.filter(b => b.genre === genre).length;

            return (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre as any)}
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                  selectedGenre === genre
                    ? 'bg-accent-green text-black shadow-lg shadow-accent-green/20'
                    : 'bg-surface text-gray-400 hover:text-white hover:bg-surface-light border border-border'
                }`}
              >
                <span>{genre}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  selectedGenre === genre ? 'bg-black/20 text-black' : 'bg-surface-light text-gray-400'
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
        <div className="text-center py-20 bg-surface rounded-2xl border border-dashed border-border p-8">
          <Disc3 className="w-12 h-12 text-gray-500 mx-auto animate-spin" />
          <h3 className="mt-4 text-lg font-bold text-white">No beats match your criteria</h3>
          <p className="mt-1 text-sm text-gray-400">Try clearing your search query or drop a fresh beat in this genre!</p>
          <button
            onClick={onOpenUpload}
            className="mt-6 px-5 py-2.5 bg-accent-green text-black font-bold rounded-xl text-sm shadow-md hover:opacity-90"
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
                        <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                          {beat.isSponsored && (
                            <span className="text-[10px] font-black uppercase tracking-wider text-black bg-gradient-to-r from-amber-400 to-yellow-300 px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm shadow-yellow-500/20">
                              <Flame className="w-3 h-3 fill-black text-black" />
                              SPONSORED
                            </span>
                          )}
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
                        <p className="text-xs text-gray-400">
                          Prod. by{' '}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectProducer(beat.producer);
                            }}
                            className="text-accent-green hover:underline font-bold transition-all inline-flex items-center gap-0.5"
                            title="View producer public storefront"
                          >
                            <span>{beat.producer}</span>
                            <UserCheck className="w-3 h-3 text-accent-green/80" />
                          </button>
                        </p>
                      </div>
                    </div>

                    {/* Audio Preview Scrubber with Protection Indicator */}
                    {isThisActive && (
                      <div className="mt-4 pt-3 border-t border-border">
                        <div className="flex items-center justify-between text-[11px] text-gray-400 mb-1 font-mono">
                          <span className="flex items-center gap-1 text-accent-gold text-[10px] font-bold uppercase">
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

          {/* Scalable Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 pt-6">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-surface border border-border text-xs font-bold text-gray-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev</span>
              </button>

              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                      currentPage === pageNum
                        ? 'bg-accent-green text-black shadow-md'
                        : 'bg-surface border border-border text-gray-400 hover:text-white'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-surface border border-border text-xs font-bold text-gray-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
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
