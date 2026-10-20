'use client';

import React, { useState, useEffect } from 'react';
import { useAudio } from '@/context/AudioContext';
import { Beat } from '@/types';
import { BazzaMascot } from '@/components/BazzaMascot';
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
  Flame, 
  Music2, 
  Radio, 
  Mic2,
  Heart,
  ArrowUpDown
} from 'lucide-react';

interface MarketplaceViewProps {
  onLicenseBeat: (beat: Beat, tier: 'Standard Lease' | 'Exclusive Rights') => void;
  onOpenUpload: () => void;
  onSelectProducer: (producerName: string) => void;
  onOpenAiDj?: () => void;
}

export function MarketplaceView({ onLicenseBeat, onOpenUpload, onSelectProducer, onOpenAiDj }: MarketplaceViewProps) {
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
    seek,
    setActiveSurface,
    likedBeatIds,
    toggleLikeBeat,
    producerAvatars
  } = useAudio();

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'likes' | 'newest' | 'price-asc' | 'bpm'>('likes');
  const itemsPerPage = 6;

  // Reset to page 1 when filtering, searching, or changing sort
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedGenre, searchQuery, sortBy]);

  // Dynamically compute all unique genres present in active catalog + 'All'
  const dynamicGenres = [
    'All',
    ...Array.from(new Set(beats.map(b => b.genre)))
  ];

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

  // Sponsored beats are pinned directly to the top of the primary catalog for maximum visibility without buttons
  // Organic beats immediately follow, ranked meritocratically by community likes (or user sort)
  const sortedBeats = [...filteredBeats].sort((a, b) => {
    if (a.isSponsored && !b.isSponsored) return -1;
    if (!a.isSponsored && b.isSponsored) return 1;

    if (sortBy === 'likes') {
      return (b.likes || 0) - (a.likes || 0);
    }
    if (sortBy === 'newest') {
      return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
    }
    if (sortBy === 'price-asc') {
      return a.leasePrice - b.leasePrice;
    }
    if (sortBy === 'bpm') {
      return b.bpm - a.bpm;
    }
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
      
      {/* Hero Banner (Dual Marketplace & Cypher Landing Experience) */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-b from-[#151D28] via-[#0E141C] to-[#0A0D12] border border-white/[0.08] p-6 sm:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-[30rem] h-[30rem] bg-accent-green/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-96 h-96 bg-accent-gold/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
            The Global Beat Marketplace <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-green via-emerald-300 to-accent-gold">
              &amp; 24/7 Freestyle Cypher Room.
            </span>
          </h1>

          <p className="mt-5 text-sm sm:text-base text-gray-300 max-w-2xl leading-relaxed">
            Stream continuous beats in the <strong className="text-white">Freestyle Cypher Room</strong> with custom crossfading, or buy untagged master rights directly in the <strong className="text-white">Marketplace</strong> with instant checkout.
          </p>

          {/* Dual Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={() => {
                const el = document.getElementById('catalog-controls');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center space-x-2.5 bg-gradient-to-r from-accent-green via-emerald-400 to-[#00E599] text-black px-7 py-3.5 rounded-full text-xs sm:text-sm font-black shadow-xl shadow-accent-green/25 hover:shadow-accent-green/40 hover:scale-[1.02] active:scale-95 transition-all duration-200 ring-1 ring-white/20"
            >
              <Music2 className="w-4 h-4" />
              <span>Explore Marketplace</span>
            </button>

            <button
              onClick={() => setActiveSurface('cypher')}
              className="flex items-center space-x-2.5 bg-white/[0.05] hover:bg-white/[0.1] text-white px-7 py-3.5 rounded-full text-xs sm:text-sm font-bold border border-white/[0.1] hover:border-white/[0.2] active:scale-95 transition-all duration-200 group backdrop-blur-md"
            >
              <Radio className="w-4 h-4 text-accent-gold animate-pulse" />
              <span>Enter Cypher Room</span>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </button>
          </div>

          {/* Interactive Dual-Engine Feature Cards */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8 border-t border-white/[0.08]">
            {/* Engine A: The Marketplace */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.15] transition-all">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-9 h-9 rounded-xl bg-accent-green/15 border border-accent-green/30 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-accent-green" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Direct Beat Licensing</h3>
                  <span className="text-[10px] text-gray-400">Lease or Exclusive Buyout</span>
                </div>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Clear contract tiers, verified legal license certificates stamped on purchase, and immediate untagged WAV downloads.
              </p>
            </div>

            {/* Engine B: The Cypher Room */}
            <div 
              onClick={() => setActiveSurface('cypher')}
              className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-accent-gold/40 hover:bg-accent-gold/[0.02] transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-accent-gold/15 border border-accent-gold/30 flex items-center justify-center">
                    <Mic2 className="w-5 h-5 text-accent-yellow" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-accent-yellow transition-colors">Freestyle Cypher Room</h3>
                    <span className="text-[10px] text-gray-400">Continuous Auto-Advance &amp; Crossfade</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-accent-yellow group-hover:translate-x-1 transition-all" />
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Seamless infinite beat streaming designed for MCs, rappers, and studio jam sessions. Set your crossfade and flow non-stop.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Controls & Scalable Filters Bar */}
      <div id="catalog-controls" className="space-y-4 pt-4">
        
        {/* Search, Sort, & Metadata Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 flex-1 max-w-xl">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-accent-green transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, producer, genre, or tag (#sax, #club)..."
                className="w-full bg-white/[0.03] backdrop-blur-md border border-white/[0.08] focus:border-accent-green focus:ring-4 focus:ring-accent-green/10 rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm text-white placeholder-gray-500 outline-none transition-all duration-200"
              />
            </div>
            {onOpenAiDj && (
              <button
                type="button"
                onClick={onOpenAiDj}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-accent-green/15 via-emerald-500/10 to-accent-green/5 border border-accent-green/30 hover:border-accent-green/60 text-accent-green hover:text-white text-xs sm:text-sm font-bold shadow-lg shadow-accent-green/10 hover:shadow-accent-green/20 transition-all duration-200 active:scale-95 whitespace-nowrap cursor-pointer group"
                title="Ask Bazza (Native AI DJ)"
              >
                <BazzaMascot size="sm" glow={false} className="group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline">Ask Bazza</span>
                <span className="sm:hidden">Bazza</span>
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2.5 self-center sm:self-auto">
            {/* Rank / Sort Selector */}
            <div className="flex items-center space-x-1.5 px-3 py-2 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-accent-green" />
              <span className="text-gray-400 hidden sm:inline">Rank by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-white font-bold text-xs outline-none cursor-pointer pr-1"
              >
                <option value="likes" className="bg-[#121820] text-white">Most Liked ❤️</option>
                <option value="newest" className="bg-[#121820] text-white">Newest First ⚡</option>
                <option value="price-asc" className="bg-[#121820] text-white">Price: Low to High</option>
                <option value="bpm" className="bg-[#121820] text-white">BPM Tempo</option>
              </select>
            </div>

            <div className="text-xs text-gray-400 font-medium px-3 py-2 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <span className="text-white font-bold">{filteredBeats.length}</span> beats
            </div>
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
                className={`flex items-center space-x-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 active:scale-95 cursor-pointer ${
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
                      : beat.isSponsored
                        ? 'border-amber-400/50 hover:border-amber-400/80 shadow-xl shadow-amber-500/10 hover:-translate-y-1 ring-1 ring-amber-400/20'
                        : 'border-white/[0.07] hover:border-white/[0.18] shadow-lg hover:shadow-2xl hover:shadow-black/70 hover:-translate-y-1'
                  }`}
                >
                  {/* Prominent Gold Accent for Sponsored Tracks */}
                  {beat.isSponsored && (
                    <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-500 via-amber-300 to-amber-500 shadow-sm shadow-amber-400/50" />
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
                        <div className="flex items-center space-x-2 text-xs flex-wrap mb-1">
                          {beat.isSponsored && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/35 text-amber-300 text-[10px] font-black uppercase tracking-wider">
                              <Flame className="w-3 h-3 fill-amber-400 text-amber-400" />
                              Sponsored
                            </span>
                          )}
                          <span className="font-bold text-accent-green">{beat.genre}</span>
                          <span className="text-gray-600">•</span>
                          <span className="text-gray-400 font-mono">{beat.bpm} BPM</span>
                        </div>
                        <h3 className="mt-1 text-base font-black text-white truncate group-hover:text-accent-green transition-colors tracking-tight">
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
                            className="text-white hover:text-accent-green font-bold transition-all inline-flex items-center gap-1.5 hover:underline cursor-pointer"
                            title="View producer public storefront"
                          >
                            {(producerAvatars && producerAvatars[beat.producer]) || beat.producerAvatar ? (
                              <img
                                src={(producerAvatars && producerAvatars[beat.producer]) || beat.producerAvatar}
                                alt={beat.producer}
                                className="w-4 h-4 rounded-full object-cover ring-1 ring-white/20"
                              />
                            ) : (
                              <UserCheck className="w-3.5 h-3.5 text-accent-green" />
                            )}
                            <span>{beat.producer}</span>
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
                    <div className="flex items-center space-x-3">
                      <div>
                        <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Standard Lease</div>
                        <div className="text-lg font-black text-white tracking-tight">${beat.leasePrice}</div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLikeBeat(beat.id);
                        }}
                        className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all active:scale-95 cursor-pointer ${
                          likedBeatIds.includes(beat.id)
                            ? 'bg-rose-500/15 border-rose-500/40 text-rose-400 shadow-sm shadow-rose-500/10'
                            : 'bg-white/[0.04] border-white/[0.08] text-gray-400 hover:text-white hover:bg-white/[0.08]'
                        }`}
                        title={likedBeatIds.includes(beat.id) ? 'Unlike this beat' : 'Like this beat'}
                      >
                        <Heart className={`w-3.5 h-3.5 ${likedBeatIds.includes(beat.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                        <span className="font-mono text-xs">{beat.likes || 0}</span>
                      </button>
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
