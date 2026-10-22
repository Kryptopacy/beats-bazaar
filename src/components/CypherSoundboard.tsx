'use client';

import React, { useState, useEffect } from 'react';
import {
  playAirhorn,
  playLaserDrop,
  playRecordScratch,
  playSubDrop,
  setSoundboardVolume,
  getSoundboardVolume
} from '@/utils/soundboard';
import { Volume2, VolumeX, Zap, Disc3, Bomb, Megaphone } from 'lucide-react';

interface SoundPad {
  id: string;
  name: string;
  key: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  activeColor: string;
  borderColor: string;
  play: () => void;
}

export function CypherSoundboard() {
  const [activePad, setActivePad] = useState<string | null>(null);
  const [volume, setVolume] = useState<number>(() => Math.round(getSoundboardVolume() * 100));
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [prevVolume, setPrevVolume] = useState<number>(80);

  const pads: SoundPad[] = [
    {
      id: 'airhorn',
      name: 'Airhorn',
      key: '1',
      icon: Megaphone,
      color: 'from-amber-500/15 to-yellow-500/10 text-amber-300',
      activeColor: 'bg-amber-400 text-black shadow-lg shadow-amber-400/40 ring-2 ring-amber-300',
      borderColor: 'border-amber-400/30 hover:border-amber-400/60',
      play: playAirhorn
    },
    {
      id: 'laser',
      name: 'Laser Drop',
      key: '2',
      icon: Zap,
      color: 'from-cyan-500/15 to-blue-500/10 text-cyan-300',
      activeColor: 'bg-cyan-400 text-black shadow-lg shadow-cyan-400/40 ring-2 ring-cyan-300',
      borderColor: 'border-cyan-400/30 hover:border-cyan-400/60',
      play: playLaserDrop
    },
    {
      id: 'scratch',
      name: 'Scratch',
      key: '3',
      icon: Disc3,
      color: 'from-purple-500/15 to-pink-500/10 text-purple-300',
      activeColor: 'bg-purple-400 text-black shadow-lg shadow-purple-400/40 ring-2 ring-purple-300',
      borderColor: 'border-purple-400/30 hover:border-purple-400/60',
      play: playRecordScratch
    },
    {
      id: 'sub',
      name: '808 Boom',
      key: '4',
      icon: Bomb,
      color: 'from-rose-500/15 to-red-500/10 text-rose-300',
      activeColor: 'bg-rose-500 text-white shadow-lg shadow-rose-500/40 ring-2 ring-rose-400',
      borderColor: 'border-rose-400/30 hover:border-rose-400/60',
      play: playSubDrop
    }
  ];

  const handleVolumeChange = (newVal: number) => {
    setVolume(newVal);
    if (newVal > 0) setIsMuted(false);
    setSoundboardVolume(newVal / 100);
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      const restore = prevVolume || 80;
      setVolume(restore);
      setSoundboardVolume(restore / 100);
    } else {
      setPrevVolume(volume);
      setIsMuted(true);
      setVolume(0);
      setSoundboardVolume(0);
    }
  };

  const triggerPad = (pad: SoundPad) => {
    setActivePad(pad.id);
    pad.play();
    setTimeout(() => {
      setActivePad((current) => (current === pad.id ? null : current));
    }, 180);
  };

  // Keyboard shortcut support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      const match = pads.find(p => p.key === e.key);
      if (match) {
        e.preventDefault();
        triggerPad(match);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto my-6 p-4 rounded-2xl bg-black/40 border border-white/[0.08] backdrop-blur-md">
      {/* Soundboard Header with Interactive FX Volume Slider */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 px-1">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={toggleMute}
            className="text-accent-green hover:text-white transition-colors cursor-pointer"
            title={isMuted ? 'Unmute FX Soundboard' : 'Mute FX Soundboard'}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-3.5 h-3.5 text-red-400" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-accent-green" />
            )}
          </button>
          <span className="text-[11px] font-bold text-gray-300 uppercase tracking-wider">
            Cypher FX Soundboard
          </span>
          <span className="text-[10px] text-gray-500 font-mono hidden md:inline">
            [1] [2] [3] [4]
          </span>
        </div>

        {/* Real-time FX Volume Slider */}
        <div className="flex items-center space-x-2 bg-white/[0.04] px-2.5 py-1 rounded-full border border-white/[0.06]">
          <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">
            FX Vol
          </span>
          <input
            type="range"
            min="0"
            max="100"
            value={isMuted ? 0 : volume}
            onChange={(e) => handleVolumeChange(Number(e.target.value))}
            className="w-16 sm:w-20 h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[#00E599]"
            title={`Soundboard FX Volume: ${isMuted ? 0 : volume}%`}
          />
          <span className="text-[10px] font-mono text-gray-300 w-7 text-right">
            {isMuted ? '0%' : `${volume}%`}
          </span>
        </div>
      </div>

      {/* FX Trigger Pads */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {pads.map((pad) => {
          const Icon = pad.icon;
          const isActive = activePad === pad.id;

          return (
            <button
              key={pad.id}
              type="button"
              onClick={() => triggerPad(pad)}
              className={`relative flex flex-col items-center justify-center p-2.5 sm:p-3.5 rounded-xl border transition-all duration-150 cursor-pointer select-none active:scale-90 ${
                isActive
                  ? pad.activeColor
                  : `bg-gradient-to-b ${pad.color} ${pad.borderColor} hover:bg-white/[0.06]`
              }`}
              title={`Trigger ${pad.name} (Press ${pad.key})`}
            >
              <span className="absolute top-1 right-1.5 text-[9px] font-mono opacity-50 hidden sm:inline">
                {pad.key}
              </span>
              <Icon className={`w-4 h-4 sm:w-5 sm:h-5 mb-1 ${isActive ? 'scale-125' : ''} transition-transform`} />
              <span className="text-[10px] sm:text-xs font-black tracking-tight truncate max-w-full">
                {pad.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
