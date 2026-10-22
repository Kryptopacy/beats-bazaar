'use client';

import React, { useState, useEffect } from 'react';
import { playAirhorn, playLaserDrop, playRecordScratch, playSubDrop } from '@/utils/soundboard';
import { Volume2, Zap, Disc3, Bomb, Megaphone } from 'lucide-react';

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
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center space-x-2">
          <Volume2 className="w-3.5 h-3.5 text-accent-green" />
          <span className="text-[11px] font-bold text-gray-300 uppercase tracking-wider">
            Cypher FX Soundboard
          </span>
        </div>
        <span className="text-[10px] text-gray-400 font-mono hidden sm:inline">
          Hotkeys: [1] [2] [3] [4]
        </span>
      </div>

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
