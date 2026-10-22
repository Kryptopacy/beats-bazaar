'use client';

import React from 'react';
import { useAudio } from '@/context/AudioContext';
import { Logo } from '@/components/Logo';
import { Music2, Mic2, PlusCircle, Radio, Sparkles } from 'lucide-react';

interface NavbarProps {
  onOpenUpload: () => void;
}

export function Navbar({ onOpenUpload }: NavbarProps) {
  const { activeSurface, setActiveSurface } = useAudio();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.06] bg-[#0B0F12]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          className="cursor-pointer group py-1" 
          onClick={() => setActiveSurface('marketplace')}
          title="Beats Bazaar Home"
        >
          <Logo size="sm" showWordmark={true} />
        </div>

        {/* Surface Switcher Tabs (Sleek Glass Segmented Pill) */}
        <nav className="flex items-center p-1 bg-[#12171A]/90 backdrop-blur-xl rounded-full border border-white/[0.08] shadow-inner">
          <button
            onClick={() => setActiveSurface('marketplace')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 ${
              activeSurface === 'marketplace'
                ? 'bg-white/[0.12] text-white shadow-sm ring-1 ring-white/10'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Music2 className={`w-4 h-4 ${activeSurface === 'marketplace' ? 'text-accent-green' : 'text-zinc-400'}`} />
            <span>Marketplace</span>
          </button>

          <button
            onClick={() => setActiveSurface('cypher')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 ${
              activeSurface === 'cypher'
                ? 'bg-white/[0.12] text-white shadow-sm ring-1 ring-white/10'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Radio className={`w-4 h-4 ${activeSurface === 'cypher' ? 'text-accent-gold' : 'text-zinc-400'} animate-pulse`} />
            <span>Cypher Room</span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
              activeSurface === 'cypher' ? 'bg-accent-gold/20 text-accent-gold' : 'bg-white/[0.06] text-zinc-400'
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
