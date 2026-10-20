'use client';

import React from 'react';
import { useAudio } from '@/context/AudioContext';
import { WaveformVisualizer } from '@/components/WaveformVisualizer';
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
  ArrowRight
} from 'lucide-react';

interface CypherRoomViewProps {
  onTipProducer: (beat: Beat) => void;
  onLicenseBeat: (beat: Beat) => void;
}

const GENRES: (Genre | 'All')[] = ['All', 'Afrobeats', 'Amapiano', 'Afro-Drill', 'Hip Hop', 'Trap', 'R&B', 'Alté'];

export function CypherRoomView({ onTipProducer, onLicenseBeat }: CypherRoomViewProps) {
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

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = Math.floor(secs % 60);
    return `${mins}:${remaining < 10 ? '0' : ''}${remaining}`;
  };

  const dynamicGenres = ['All', ...Array.from(new Set(beats.map(b => b.genre)))];

  const cypherBeats = beats.filter(b => b.inCypher);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-28">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-surface border border-border shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-accent-gold/20 border border-accent-gold/40 flex items-center justify-center">
            <Radio className="w-5 h-5 text-accent-yellow animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-black text-white tracking-tight">Freestyle Cypher Room</h2>
              <span className="text-[10px] font-extrabold uppercase bg-red-500/10 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                LIVE STREAM
              </span>
            </div>
            <p className="text-xs text-gray-400">Infinite streaming beats for vocalists, MCs, and campus cyphers.</p>
          </div>
        </div>

        {/* Genre Selector */}
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <label className="text-xs text-gray-400 font-bold whitespace-nowrap">Filter Genre:</label>
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value as any)}
            className="bg-white/[0.04] backdrop-blur-md border border-white/[0.08] text-white text-xs font-bold rounded-full px-4 py-2.5 outline-none focus:border-accent-green focus:ring-2 focus:ring-accent-green/20 transition-all cursor-pointer"
          >
            {dynamicGenres.map((g) => (
              <option key={g} value={g} className="bg-[#141A22] text-white">{g}</option>
            ))}
          </select>
        </div>
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
