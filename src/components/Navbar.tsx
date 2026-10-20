'use client';

import React from 'react';
import { useAudio } from '@/context/AudioContext';
import { Music2, Mic2, PlusCircle, Radio, Sparkles } from 'lucide-react';

interface NavbarProps {
  onOpenUpload: () => void;
}

export function Navbar({ onOpenUpload }: NavbarProps) {
  const { activeSurface, setActiveSurface } = useAudio();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-[#0B0F12]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveSurface('marketplace')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-accent-green to-accent-gold flex items-center justify-center shadow-lg shadow-accent-green/20">
            <Music2 className="w-6 h-6 text-black font-black" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-white">Beats Bazaar</span>
        </div>

        {/* Surface Switcher Tabs */}
        <nav className="flex items-center space-x-1 sm:space-x-2 bg-surface p-1 rounded-xl border border-border">
          <button
            onClick={() => setActiveSurface('marketplace')}
            className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeSurface === 'marketplace'
                ? 'bg-gradient-to-r from-accent-green/20 to-accent-emerald/20 text-accent-green border border-accent-green/30 shadow-sm'
                : 'text-gray-400 hover:text-white hover:bg-surface-light'
            }`}
          >
            <Music2 className="w-4 h-4" />
            <span>Marketplace</span>
          </button>

          <button
            onClick={() => setActiveSurface('cypher')}
            className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold transition-all relative ${
              activeSurface === 'cypher'
                ? 'bg-gradient-to-r from-accent-gold/20 to-yellow-500/20 text-accent-yellow border border-accent-gold/40 shadow-sm'
                : 'text-gray-400 hover:text-white hover:bg-surface-light'
            }`}
          >
            <Radio className="w-4 h-4 text-accent-gold animate-pulse" />
            <span>Cypher Room</span>
            <span className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-accent-gold/20 text-accent-yellow border border-accent-gold/30">
              STREAM
            </span>
          </button>
        </nav>

        {/* Right CTA */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenUpload}
            className="flex items-center space-x-2 bg-gradient-to-r from-accent-green to-emerald-400 text-black px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-accent-green/25 hover:opacity-95 active:scale-95 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Drop a Beat</span>
            <span className="sm:hidden">Drop</span>
          </button>
        </div>

      </div>
    </header>
  );
}
