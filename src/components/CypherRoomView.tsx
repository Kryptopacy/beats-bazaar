'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAudio } from '@/context/AudioContext';
import { WaveformVisualizer } from '@/components/WaveformVisualizer';
import { BazzaMascot } from '@/components/BazzaMascot';
import { Beat, Genre } from '@/types';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Shuffle, 
  Sliders, 
  Radio, 
  Flame, 
  Coins, 
  ShieldCheck, 
  Volume2, 
  VolumeX, 
  Sparkles,
  ArrowRight,
  Search,
  ChevronDown,
  Check,
  SlidersHorizontal,
  X
} from 'lucide-react';

interface CypherRoomViewProps {
  onTipProducer: (beat: Beat) => void;
  onLicenseBeat: (beat: Beat) => void;
  onOpenAiDj?: () => void;
}

export function CypherRoomView({ onTipProducer, onLicenseBeat, onOpenAiDj }: CypherRoomViewProps) {
  const {
    activeBeat,
    isPlaying,
    togglePlay,
    nextTrack,
    prevTrack,
    currentTime,
    duration,
    seek,
    volume,
    setVolume,
    isShuffle,
    toggleShuffle,
    isCrossfade,
    toggleCrossfade,
    crossfadeDuration,
    setCrossfadeDuration,
    selectedGenre,
    setSelectedGenre,
    beats
  } = useAudio();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [genreSearch, setGenreSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = Math.floor(secs % 60);
    return `${mins}:${remaining < 10 ? '0' : ''}${remaining}`;
  };

  const cypherBeats = beats.filter(b => b.inCypher);

  // Dynamically compute all unique genres present in the cypher stream + track counts
  const dynamicGenresWithCounts = [
    { name: 'All', count: cypherBeats.length },
    ...Array.from(new Set(cypherBeats.map(b => b.genre))).map(g => ({
      name: g,
      count: cypherBeats.filter(b => b.genre === g).length
    }))
  ];

  const filteredDropdownGenres = dynamicGenresWithCounts.filter(g =>
    g.name.toLowerCase().includes(genreSearch.toLowerCase().trim())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-28">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-b from-[#141A23] via-[#0F141B] to-[#0A0D12] border border-white/[0.08] shadow-2xl relative">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-accent-gold/20 to-yellow-500/10 border border-accent-gold/30 flex items-center justify-center shadow-lg shadow-accent-gold/10">
            <Radio className="w-6 h-6 text-accent-yellow animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-tight">Freestyle Cypher Room</h2>
            <p className="text-xs text-gray-400 mt-0.5">Infinite streaming beats for vocalists, MCs, and campus cyphers.</p>
          </div>
        </div>

        {/* Actions & Scalable Searchable Genre Selector */}
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          {onOpenAiDj && (
            <button
              type="button"
              onClick={onOpenAiDj}
              className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-accent-green/20 via-emerald-500/15 to-accent-green/10 border border-accent-green/40 hover:border-accent-green/70 text-accent-green hover:text-white text-xs font-bold transition-all active:scale-95 shadow-sm shadow-accent-green/10 cursor-pointer group"
              title="Ask Bazza (Native AI DJ)"
            >
              <BazzaMascot size="sm" glow={false} className="group-hover:scale-110 transition-transform" />
              <span>Ask Bazza</span>
            </button>
          )}

          <div className="relative flex-1 sm:flex-initial" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full sm:w-auto flex items-center justify-between sm:justify-start space-x-2.5 px-4 py-2.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.18] text-white text-xs font-bold transition-all active:scale-95 shadow-sm cursor-pointer"
            >
            <div className="flex items-center space-x-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-accent-green" />
              <span>Genre: <strong className="text-accent-green">{selectedGenre}</strong></span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.08] text-gray-300 font-mono">
                {selectedGenre === 'All' ? cypherBeats.length : cypherBeats.filter(b => b.genre === selectedGenre).length}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </div>
          </button>

          {/* Searchable Dropdown Popover */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-3xl bg-[#141A23]/95 backdrop-blur-2xl border border-white/[0.1] shadow-2xl p-3 z-50 animate-fadeIn">
              {/* Search Input */}
              <div className="relative mb-2.5">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  type="text"
                  value={genreSearch}
                  onChange={(e) => setGenreSearch(e.target.value)}
                  placeholder={`Search ${dynamicGenresWithCounts.length - 1} genres...`}
                  autoFocus
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-gray-500 outline-none focus:border-accent-green focus:ring-2 focus:ring-accent-green/20"
                />
                {genreSearch && (
                  <button onClick={() => setGenreSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1">
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Genres List */}
              <div className="max-h-60 overflow-y-auto space-y-1 scrollbar-thin pr-1">
                {filteredDropdownGenres.length === 0 ? (
                  <p className="text-[11px] text-gray-500 py-6 text-center">No genres match &quot;{genreSearch}&quot;</p>
                ) : (
                  filteredDropdownGenres.map((g) => {
                    const isSelected = selectedGenre === g.name;
                    return (
                      <button
                        key={g.name}
                        type="button"
                        onClick={() => {
                          setSelectedGenre(g.name as any);
                          setIsDropdownOpen(false);
                          setGenreSearch('');
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-gradient-to-r from-accent-green to-emerald-400 text-black shadow-sm font-black'
                            : 'text-gray-300 hover:text-white hover:bg-white/[0.05]'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <span>{g.name}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                          isSelected ? 'bg-black/20 text-black font-black' : 'bg-white/[0.05] text-gray-400'
                        }`}>
                          {g.count}
                        </span>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      </div>

      {/* Quick-Pick Horizontal Genre Chips (Scalable single-row scroll) */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-thin">
        {dynamicGenresWithCounts.map((g) => {
          const isSelected = selectedGenre === g.name;
          return (
            <button
              key={g.name}
              onClick={() => setSelectedGenre(g.name as any)}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 active:scale-95 ${
                isSelected
                  ? 'bg-gradient-to-r from-accent-gold to-yellow-400 text-black shadow-md shadow-accent-gold/20 font-black'
                  : 'bg-white/[0.03] hover:bg-white/[0.07] text-gray-400 hover:text-white border border-white/[0.06]'
              }`}
            >
              <span>{g.name}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                isSelected ? 'bg-black/20 text-black font-black' : 'bg-white/[0.06] text-gray-400'
              }`}>
                {g.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Cypher Deck */}
      <div className="relative rounded-[2.5rem] bg-gradient-to-b from-[#141A24] via-[#0E131A] to-[#070A0E] border border-white/[0.08] p-8 sm:p-14 shadow-2xl overflow-hidden text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-48 bg-accent-green/10 blur-3xl pointer-events-none rounded-full" />

        {/* Beat Tag & Producer */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-white/[0.04] backdrop-blur-md border border-white/[0.08] text-xs text-gray-300 mb-4 shadow-inner">
            <span className="text-accent-green font-black uppercase tracking-wider">{activeBeat?.genre || 'Afrobeats'}</span>
            <span className="text-gray-600">•</span>
            <span className="font-mono text-gray-300">{activeBeat?.bpm || 110} BPM</span>
            <span className="text-gray-600">•</span>
            <span className="text-accent-yellow font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-accent-green animate-ping inline-block" /> Live Stream
            </span>
          </div>

          <h1 className="text-3xl sm:text-6xl font-black text-white tracking-tight">
            {activeBeat?.title || 'Selecting Track...'}
          </h1>
          <p className="mt-3 text-sm sm:text-base text-gray-400">
            Crafted by <span className="text-white font-extrabold hover:text-accent-green transition-colors">{activeBeat?.producer || 'Unknown'}</span>
          </p>

          {/* Animated Waveform Visualizer */}
          <div className="w-full my-8">
            <WaveformVisualizer isPlaying={isPlaying} color="#00E599" />
          </div>

          {/* Scrubber & Time */}
          <div className="w-full max-w-xl mx-auto space-y-1.5">
            <div className="flex justify-between text-xs font-mono text-gray-400">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
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

          {/* Full Playback Controls (Studio Hardware Style) */}
          <div className="mt-10 flex items-center justify-center space-x-4 sm:space-x-8">
            <button
              onClick={toggleShuffle}
              className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-200 active:scale-95 ${
                isShuffle 
                  ? 'bg-amber-400/20 text-amber-300 border-amber-400/50 shadow-lg shadow-amber-400/10' 
                  : 'bg-white/[0.04] text-gray-400 hover:text-white border-white/[0.08] hover:border-white/[0.2]'
              }`}
              title="Toggle Shuffle / Randomize"
            >
              <Shuffle className="w-5 h-5" />
            </button>

            <button
              onClick={prevTrack}
              className="w-14 h-14 rounded-full bg-white/[0.04] border border-white/[0.08] text-gray-200 hover:text-white hover:border-white/[0.2] hover:bg-white/[0.08] transition-all duration-200 flex items-center justify-center active:scale-95 shadow-md"
              title="Previous Track"
            >
              <SkipBack className="w-6 h-6" />
            </button>

            <button
              onClick={togglePlay}
              className="w-20 h-20 rounded-full bg-gradient-to-tr from-accent-green via-emerald-400 to-[#00E599] text-black flex items-center justify-center shadow-2xl shadow-accent-green/35 hover:scale-105 active:scale-95 transition-all duration-200 ring-4 ring-white/10"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 fill-black" />
              ) : (
                <Play className="w-8 h-8 fill-black ml-1" />
              )}
            </button>

            <button
              onClick={nextTrack}
              className="w-14 h-14 rounded-full bg-white/[0.04] border border-white/[0.08] text-gray-200 hover:text-white hover:border-white/[0.2] hover:bg-white/[0.08] transition-all duration-200 flex items-center justify-center active:scale-95 shadow-md"
              title="Skip to Next Track"
            >
              <SkipForward className="w-6 h-6" />
            </button>

            {/* Volume */}
            <div className="hidden md:flex items-center space-x-2.5 bg-white/[0.04] px-4 py-3 rounded-full border border-white/[0.08]">
              <button onClick={() => setVolume(volume === 0 ? 0.8 : 0)}>
                {volume === 0 ? <VolumeX className="w-5 h-5 text-gray-400" /> : <Volume2 className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-20 h-1 bg-white/[0.1] rounded-lg appearance-none cursor-pointer accent-accent-green"
              />
            </div>
          </div>

          {/* Crossfade Controls */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 py-3.5 px-7 rounded-full bg-white/[0.03] backdrop-blur-md border border-white/[0.08] text-xs text-gray-300">
            <div className="flex items-center space-x-2.5">
              <input
                type="checkbox"
                id="crossfadeToggle"
                checked={isCrossfade}
                onChange={toggleCrossfade}
                className="w-4 h-4 rounded text-accent-green bg-gray-900 border-gray-700 focus:ring-accent-green cursor-pointer"
              />
              <label htmlFor="crossfadeToggle" className="cursor-pointer font-bold select-none text-white">
                Smooth Crossfade
              </label>
            </div>

            {isCrossfade && (
              <div className="flex items-center space-x-3 pl-4 border-l border-white/[0.1]">
                <span className="text-gray-400 font-medium">Transition Duration:</span>
                <input
                  type="range"
                  min={1}
                  max={8}
                  step={1}
                  value={crossfadeDuration}
                  onChange={(e) => setCrossfadeDuration(parseInt(e.target.value))}
                  className="w-24 h-1 bg-white/[0.1] rounded-lg appearance-none cursor-pointer accent-accent-green"
                />
                <span className="font-mono text-accent-green font-extrabold">{crossfadeDuration}s</span>
              </div>
            )}
          </div>

          {/* Direct Monetization Action Bar */}
          {activeBeat && (
            <div className="mt-10 pt-10 border-t border-white/[0.08] w-full flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => onTipProducer(activeBeat)}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-7 py-3.5 rounded-full bg-white/[0.04] hover:bg-amber-400/10 border border-amber-400/30 hover:border-amber-400 text-amber-300 font-black text-sm shadow-md transition-all duration-200 active:scale-95"
              >
                <Coins className="w-4 h-4" />
                <span>Tip Producer</span>
              </button>

              <button
                onClick={() => onLicenseBeat(activeBeat)}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-accent-green via-emerald-400 to-[#00E599] text-black font-black text-sm shadow-xl shadow-accent-green/25 hover:shadow-accent-green/40 hover:scale-[1.02] active:scale-95 transition-all duration-200 ring-1 ring-white/20"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>License This Beat (${activeBeat.leasePrice})</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
