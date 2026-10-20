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
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.06] bg-[#0B0F12]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => setActiveSurface('marketplace')}>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-accent-green to-emerald-400 flex items-center justify-center shadow-lg shadow-accent-green/20 group-hover:scale-105 transition-transform duration-200 ring-1 ring-white/20">
            <Music2 className="w-5 h-5 text-black font-black" />
          </div>
          <span className="text-xl font-black tracking-tight text-white group-hover:text-accent-green transition-colors">Beats Bazaar</span>
        </div>

        {/* Surface Switcher Tabs (Sleek Glass Segmented Pill) */}
        <nav className="flex items-center p-1 bg-white/[0.04] backdrop-blur-xl rounded-full border border-white/[0.08] shadow-inner">
          <button
            onClick={() => setActiveSurface('marketplace')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 ${
              activeSurface === 'marketplace'
                ? 'bg-gradient-to-r from-accent-green to-emerald-400 text-black shadow-md shadow-accent-green/20'
                : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Music2 className="w-4 h-4" />
            <span>Marketplace</span>
          </button>

          <button
            onClick={() => setActiveSurface('cypher')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 relative ${
              activeSurface === 'cypher'
                ? 'bg-gradient-to-r from-accent-gold to-yellow-400 text-black shadow-md shadow-accent-gold/20'
                : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Radio className={`w-4 h-4 ${activeSurface === 'cypher' ? 'text-black' : 'text-accent-gold'} animate-pulse`} />
            <span>Cypher Room</span>
            <span className={`hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
              activeSurface === 'cypher'
                ? 'bg-black/20 text-black'
                : 'bg-accent-gold/15 text-accent-yellow border border-accent-gold/30'
            }`}>
              Live
            </span>
          </button>
        </nav>

        {/* Right CTA */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenUpload}
            className="flex items-center space-x-2 bg-gradient-to-r from-accent-green via-emerald-400 to-[#00E599] text-black px-5 py-2.5 rounded-full text-xs sm:text-sm font-black shadow-lg shadow-accent-green/25 hover:shadow-accent-green/40 hover:scale-[1.02] active:scale-95 transition-all duration-200 ring-1 ring-white/20"
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
