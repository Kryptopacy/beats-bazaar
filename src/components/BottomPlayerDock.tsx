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
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0B0F12]/95 border-t border-border backdrop-blur-xl px-4 py-3 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Track Info */}
        <div className="flex items-center space-x-3 w-full sm:w-1/4">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md overflow-hidden"
            style={{ background: activeBeat.coverArt || 'linear-gradient(135deg, #00E599, #0B0F12)' }}
          >
            <span className="text-xs font-bold text-black/80">{activeBeat.genre.slice(0, 4)}</span>
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-white truncate">{activeBeat.title}</h4>
            <p className="text-xs text-gray-400 truncate">{activeBeat.producer} • {activeBeat.bpm} BPM</p>
          </div>
        </div>

        {/* Center Controls & Scrubber */}
        <div className="flex flex-col items-center w-full sm:w-2/4 max-w-lg">
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
        <div className="hidden sm:flex items-center justify-end space-x-4 w-1/4">
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
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-accent-green to-emerald-400 text-black text-xs font-bold shadow-sm hover:opacity-90 active:scale-95 transition-all"
            >
              License (${activeBeat.leasePrice})
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
