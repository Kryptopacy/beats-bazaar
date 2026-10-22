'use client';

import React from 'react';
import { useAudio } from '@/context/AudioContext';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, ShieldCheck, Shuffle } from 'lucide-react';

interface BottomPlayerDockProps {
  onLicenseCurrentBeat?: () => void;
}

export function BottomPlayerDock({ onLicenseCurrentBeat }: BottomPlayerDockProps) {
  const { 
    activeBeat, 
    isPlaying, 
    togglePlay, 
    currentTime, 
    duration, 
    seek, 
    volume, 
    setVolume,
    nextTrack,
    prevTrack,
    isShuffle,
    toggleShuffle
  } = useAudio();

  if (!activeBeat) return null;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = Math.floor(secs % 60);
    return `${mins}:${remaining < 10 ? '0' : ''}${remaining}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0B0F12]/95 border-t border-white/[0.08] backdrop-blur-xl shadow-2xl">
      
      {/* Mobile Thin Top Audio Progress Scrubber */}
      <div className="sm:hidden relative w-full h-1 bg-white/[0.08]">
        <div 
          className="h-full bg-gradient-to-r from-accent-green to-emerald-400"
          style={{ width: `${Math.min(100, Math.max(0, ((currentTime || 0) / (duration || 1)) * 100))}%` }}
        />
      </div>

      {/* Mobile Compact Player Bar (Single Sleek Row - Spotify Style) */}
      <div className="flex sm:hidden items-center justify-between px-3 py-2.5 gap-2.5">
        {/* Cover + Info */}
        <div className="flex items-center space-x-2.5 min-w-0 flex-1">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md overflow-hidden ring-1 ring-white/10"
            style={{ background: activeBeat.coverArt || 'linear-gradient(135deg, #00E599, #0B0F12)' }}
          >
            <span className="text-[10px] font-black text-black/80 uppercase">{activeBeat.genre.slice(0, 3)}</span>
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-white truncate leading-tight">{activeBeat.title}</h4>
            <p className="text-[11px] text-gray-400 truncate leading-tight">{activeBeat.producer} • {activeBeat.bpm} BPM</p>
          </div>
        </div>

        {/* Quick Controls */}
        <div className="flex items-center space-x-1.5 flex-shrink-0">
          <button
            onClick={nextTrack}
            className="p-1.5 text-gray-400 hover:text-white transition-colors"
            title="Next Track"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <button
            onClick={togglePlay}
            className="w-9 h-9 rounded-full bg-accent-green text-black flex items-center justify-center shadow-md shadow-accent-green/25 active:scale-95 transition-all"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-black" />
            ) : (
              <Play className="w-4 h-4 fill-black ml-0.5" />
            )}
          </button>

          {onLicenseCurrentBeat && !activeBeat.isSoldExclusive && (
            <button
              onClick={onLicenseCurrentBeat}
              className="px-2.5 py-1.5 rounded-full bg-gradient-to-r from-accent-green to-emerald-400 text-black text-[11px] font-black shadow-md shadow-accent-green/20 active:scale-95 transition-all whitespace-nowrap"
            >
              ${activeBeat.leasePrice}
            </button>
          )}
        </div>
      </div>

      {/* Desktop / Tablet Full Studio Player Bar */}
      <div className="hidden sm:block max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          
          {/* Track Info */}
          <div className="flex items-center space-x-3 w-1/4 min-w-0">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md overflow-hidden ring-1 ring-white/10"
              style={{ background: activeBeat.coverArt || 'linear-gradient(135deg, #00E599, #0B0F12)' }}
            >
              <span className="text-xs font-bold text-black/80">{activeBeat.genre.slice(0, 4)}</span>
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-bold text-white truncate">{activeBeat.title}</h4>
              <p className="text-xs text-gray-400 truncate">{activeBeat.producer} • {activeBeat.bpm} BPM</p>
            </div>
          </div>

          {/* Center Controls & Scrubber */}
          <div className="flex flex-col items-center w-2/4 max-w-lg">
            <div className="flex items-center space-x-4 mb-1">
              <button
                onClick={toggleShuffle}
                className={`p-1.5 rounded-lg transition-colors ${isShuffle ? 'text-accent-gold bg-accent-gold/10' : 'text-gray-400 hover:text-white'}`}
                title="Toggle Shuffle"
              >
                <Shuffle className="w-4 h-4" />
              </button>

              <button
                onClick={prevTrack}
                className="p-1.5 text-gray-400 hover:text-white transition-colors"
                title="Previous Track"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={togglePlay}
                className="w-9 h-9 rounded-full bg-accent-green text-black flex items-center justify-center shadow-md shadow-accent-green/20 hover:scale-105 active:scale-95 transition-all"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 fill-black" />
                ) : (
                  <Play className="w-5 h-5 fill-black ml-0.5" />
                )}
              </button>

              <button
                onClick={nextTrack}
                className="p-1.5 text-gray-400 hover:text-white transition-colors"
                title="Next Track"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            {/* Scrubber */}
            <div className="w-full flex items-center space-x-2 text-[10px] text-gray-400 font-mono">
              <span>{formatTime(currentTime)}</span>
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={(e) => seek(parseFloat(e.target.value))}
                className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-accent-green"
              />
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right Tools (Volume & License CTA) */}
          <div className="flex items-center justify-end space-x-4 w-1/4">
            <div className="flex items-center space-x-2">
              <button onClick={() => setVolume(volume === 0 ? 0.8 : 0)}>
                {volume === 0 ? <VolumeX className="w-4 h-4 text-gray-400" /> : <Volume2 className="w-4 h-4 text-gray-400" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-16 h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-accent-green"
              />
            </div>

            {onLicenseCurrentBeat && !activeBeat.isSoldExclusive && (
              <button
                onClick={onLicenseCurrentBeat}
                className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-accent-green to-emerald-400 text-black text-xs font-black shadow-md shadow-accent-green/20 hover:opacity-90 active:scale-95 transition-all whitespace-nowrap"
              >
                License (${activeBeat.leasePrice})
              </button>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}
