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
          <label className="text-xs text-gray-400 font-semibold whitespace-nowrap">Filter Genre:</label>
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value as any)}
            className="bg-[#0B0F12] border border-border text-white text-xs font-bold rounded-xl px-3 py-2 outline-none focus:border-accent-green"
          >
            {GENRES.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Cypher Deck */}
      <div className="relative rounded-3xl bg-gradient-to-b from-[#131920] to-[#0D1217] border border-border/80 p-8 sm:p-12 shadow-2xl overflow-hidden text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-accent-green/5 blur-3xl pointer-events-none" />

        {/* Beat Tag & Producer */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-surface border border-border text-xs text-gray-300 mb-3 shadow-inner">
            <span className="text-accent-green font-bold">{activeBeat?.genre || 'Afrobeats'}</span>
            <span>•</span>
            <span className="font-mono text-gray-400">{activeBeat?.bpm || 110} BPM</span>
            <span>•</span>
            <span className="text-accent-gold font-semibold">Cypher Active</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            {activeBeat?.title || 'Selecting Track...'}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-400">
            Crafted by <span className="text-accent-green font-bold">{activeBeat?.producer || 'Unknown'}</span>
          </p>

          {/* Animated Waveform Visualizer */}
          <div className="w-full my-8">
            <WaveformVisualizer isPlaying={isPlaying} color="#00E599" />
          </div>

          {/* Scrubber & Time */}
          <div className="w-full max-w-xl mx-auto space-y-1">
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
              className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-accent-green"
            />
          </div>

          {/* Full Playback Controls */}
          <div className="mt-8 flex items-center justify-center space-x-6">
            <button
              onClick={toggleShuffle}
              className={`p-3 rounded-2xl border transition-all ${
                isShuffle 
                  ? 'bg-accent-gold/20 text-accent-yellow border-accent-gold/40 shadow-md' 
                  : 'bg-surface text-gray-400 hover:text-white border-border hover:border-gray-700'
              }`}
              title="Toggle Shuffle / Randomize"
            >
              <Shuffle className="w-5 h-5" />
            </button>

            <button
              onClick={prevTrack}
              className="p-3 rounded-2xl bg-surface border border-border text-gray-300 hover:text-white hover:border-gray-700 transition-all active:scale-95"
              title="Previous Track"
            >
              <SkipBack className="w-6 h-6" />
            </button>

            <button
              onClick={togglePlay}
              className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-accent-green to-emerald-400 text-black flex items-center justify-center shadow-xl shadow-accent-green/30 hover:scale-105 active:scale-95 transition-all"
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
              className="p-3 rounded-2xl bg-surface border border-border text-gray-300 hover:text-white hover:border-gray-700 transition-all active:scale-95"
              title="Skip to Next Track"
            >
              <SkipForward className="w-6 h-6" />
            </button>

            {/* Volume */}
            <div className="hidden sm:flex items-center space-x-2 bg-surface p-2.5 rounded-2xl border border-border">
              <button onClick={() => setVolume(volume === 0 ? 0.8 : 0)}>
                {volume === 0 ? <VolumeX className="w-5 h-5 text-gray-400" /> : <Volume2 className="w-5 h-5 text-gray-400" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-16 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-accent-green"
              />
            </div>
          </div>

          {/* Crossfade Controls (Learner requested feature) */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 py-3 px-6 rounded-2xl bg-[#090D10]/80 border border-border text-xs text-gray-300">
            <div className="flex items-center space-x-2">
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
              <div className="flex items-center space-x-2 pl-4 border-l border-border">
                <span className="text-gray-400">Duration:</span>
                <input
                  type="range"
                  min={1}
                  max={8}
                  step={1}
                  value={crossfadeDuration}
                  onChange={(e) => setCrossfadeDuration(parseInt(e.target.value))}
                  className="w-20 h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-accent-green"
                />
                <span className="font-mono text-accent-green font-bold">{crossfadeDuration}s</span>
              </div>
            )}
          </div>

          {/* Direct Monetization Action Bar */}
          {activeBeat && (
            <div className="mt-8 pt-8 border-t border-border/80 w-full flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => onTipProducer(activeBeat)}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 rounded-2xl bg-surface border border-accent-gold/50 text-accent-yellow hover:bg-accent-gold hover:text-black font-extrabold text-sm shadow-md transition-all active:scale-95"
              >
                <Coins className="w-4 h-4" />
                <span>Tip Producer (Bachs)</span>
              </button>

              <button
                onClick={() => onLicenseBeat(activeBeat)}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-accent-green to-emerald-400 text-black font-black text-sm shadow-lg shadow-accent-green/20 hover:opacity-95 transition-all active:scale-95"
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
