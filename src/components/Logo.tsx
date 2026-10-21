'use client';

import React from 'react';

interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  className?: string;
  glow?: boolean;
}

export function Logo({
  size = 'md',
  showWordmark = true,
  className = '',
  glow = true
}: LogoProps) {
  const sizeMap = {
    xs: { icon: 28, font: 'text-sm', sub: 'text-[9px]', gap: 'space-x-2' },
    sm: { icon: 36, font: 'text-base', sub: 'text-[10px]', gap: 'space-x-2.5' },
    md: { icon: 46, font: 'text-xl', sub: 'text-[11px]', gap: 'space-x-3' },
    lg: { icon: 60, font: 'text-2xl', sub: 'text-xs', gap: 'space-x-3.5' },
    xl: { icon: 80, font: 'text-4xl', sub: 'text-sm', gap: 'space-x-4' }
  };

  const current = sizeMap[size];

  return (
    <div className={`inline-flex items-center ${current.gap} select-none group ${className}`}>
      {/* Official Master Certification Plaque Emblem */}
      <div 
        className={`relative flex-shrink-0 transition-all duration-300 group-hover:scale-105 ${
          glow ? 'drop-shadow-[0_0_22px_rgba(245,158,11,0.3)]' : ''
        }`}
        style={{ width: current.icon, height: current.icon }}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            {/* Heavy Anodized Obsidian Plaque Base */}
            <linearGradient id="plaque-base" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1C2430" />
              <stop offset="40%" stopColor="#10151E" />
              <stop offset="100%" stopColor="#070A0E" />
            </linearGradient>

            {/* 24K Brushed Gold Plaque Rim */}
            <linearGradient id="plaque-gold-rim" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE68A" />
              <stop offset="30%" stopColor="#F59E0B" />
              <stop offset="70%" stopColor="#B45309" />
              <stop offset="100%" stopColor="#78350F" />
            </linearGradient>

            {/* Circular Master Vinyl Disc (Gold Stamper Core) */}
            <radialGradient id="master-disc-grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FEF3C7" />
              <stop offset="45%" stopColor="#F59E0B" />
              <stop offset="85%" stopColor="#92400E" />
              <stop offset="100%" stopColor="#451A03" />
            </radialGradient>

            {/* Cyber Emerald Soundwave Core */}
            <linearGradient id="plaque-emerald" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6EE7B7" />
              <stop offset="50%" stopColor="#00E599" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>

            {/* Hex Bolt Hardware Texture */}
            <linearGradient id="bolt-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE68A" />
              <stop offset="100%" stopColor="#78350F" />
            </linearGradient>

            {/* Radial Plaque Ambient Lighting */}
            <radialGradient id="plaque-ambient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.25" />
              <stop offset="70%" stopColor="#00E599" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* 1. Heavy Heavy Milled Plaque Chassis */}
          <rect
            x="3"
            y="3"
            width="94"
            height="94"
            rx="14"
            fill="url(#plaque-base)"
            stroke="url(#plaque-gold-rim)"
            strokeWidth="1.75"
          />

          {/* Inset Laser-Engraved Security Frame */}
          <rect
            x="7.5"
            y="7.5"
            width="85"
            height="85"
            rx="10"
            fill="none"
            stroke="#FFFFFF"
            strokeOpacity="0.12"
            strokeWidth="1"
          />
          <rect
            x="9.5"
            y="9.5"
            width="81"
            height="81"
            rx="8.5"
            fill="none"
            stroke="url(#plaque-gold-rim)"
            strokeOpacity="0.4"
            strokeWidth="0.75"
            strokeDasharray="4 2"
          />

          {/* 2. Four Precision Industrial Gold Corner Hex-Bolts */}
          {/* Top-Left */}
          <circle cx="12.5" cy="12.5" r="3" fill="url(#bolt-grad)" />
          <circle cx="12.5" cy="12.5" r="1.5" fill="#10151E" />
          {/* Top-Right */}
          <circle cx="87.5" cy="12.5" r="3" fill="url(#bolt-grad)" />
          <circle cx="87.5" cy="12.5" r="1.5" fill="#10151E" />
          {/* Bottom-Left */}
          <circle cx="12.5" cy="87.5" r="3" fill="url(#bolt-grad)" />
          <circle cx="12.5" cy="87.5" r="1.5" fill="#10151E" />
          {/* Bottom-Right */}
          <circle cx="87.5" cy="87.5" r="3" fill="url(#bolt-grad)" />
          <circle cx="87.5" cy="87.5" r="1.5" fill="#10151E" />

          {/* Ambient Lighting Field */}
          <circle cx="50" cy="50" r="36" fill="url(#plaque-ambient)" />

          {/* 3. Centerpiece: 24K Gold Master Record Stamper Disc */}
          <circle cx="50" cy="50" r="33" fill="url(#master-disc-grad)" stroke="url(#plaque-gold-rim)" strokeWidth="1.2" />

          {/* Vinyl Audio Concentric Precision Sound Grooves */}
          <circle cx="50" cy="50" r="29" stroke="#000000" strokeOpacity="0.3" strokeWidth="0.6" strokeDasharray="5 2" />
          <circle cx="50" cy="50" r="25" stroke="#FFFFFF" strokeOpacity="0.15" strokeWidth="0.5" strokeDasharray="4 3" />
          <circle cx="50" cy="50" r="21" stroke="#000000" strokeOpacity="0.25" strokeWidth="0.5" strokeDasharray="3 2" />

          {/* Outer Certification Security Run-Out Ring */}
          <circle cx="50" cy="50" r="31" stroke="#FEF3C7" strokeOpacity="0.35" strokeWidth="0.6" strokeDasharray="2 2" />

          {/* 4. Sculptural "BB" Soundwave Monogram on Master Disc */}
          {/* Vertical Equalizer Frequency Spine */}
          <path
            d="M 27 27 C 27 24.238 29.238 22 32 22 C 34.762 22 37 24.238 37 27 V 73 C 37 75.762 34.762 78 32 78 C 29.238 78 27 75.762 27 73 Z"
            fill="url(#plaque-emerald)"
            filter="drop-shadow(0 2px 4px rgba(0,0,0,0.6))"
          />

          {/* Upper Wave Resonator (Top 'B') */}
          <path
            d="M 37 25 H 54 C 64 25 71 31 71 39 C 71 46 66 50.5 58 51.5 C 50 50 42 48.5 37 47 Z"
            fill="url(#plaque-emerald)"
            filter="drop-shadow(0 2px 4px rgba(0,0,0,0.5))"
          />

          {/* Lower Wave Resonator (Bottom 'B') */}
          <path
            d="M 37 46 C 44 46 54 47.5 61 49 C 70 51 75 58 75 65 C 75 73 67 75 55 75 H 37 Z"
            fill="url(#plaque-emerald)"
            filter="drop-shadow(0 2px 4px rgba(0,0,0,0.5))"
          />

          {/* Precision Laser-Etched Sound Ports */}
          <path d="M 43 32 H 52 C 57 32 61 35 61 39 C 61 43 57 45 52 45 H 43 Z" fill="#1A130B" />
          <path d="M 43 53 H 54 C 60 53 64 57 64 62 C 64 67 60 69 54 69 H 43 Z" fill="#1A130B" />

          {/* Master Stamper Diamond Prisms */}
          <polygon points="46,35 53,39 46,43" fill="#FDE68A" />
          <polygon points="46,58 55,62 46,66" fill="#FDE68A" />

          {/* Studio Proof-of-Work VU Meter Indicators */}
          <circle cx="32" cy="30" r="1.3" fill="#FFFFFF" />
          <circle cx="32" cy="40" r="1.3" fill="#6EE7B7" />
          <circle cx="32" cy="50" r="1.3" fill="#00E599" />
          <circle cx="32" cy="60" r="1.3" fill="#FDE68A" />
          <circle cx="32" cy="70" r="1.3" fill="#F59E0B" />
        </svg>
      </div>

      {/* Modern High-End Typography */}
      {showWordmark && (
        <div className="flex flex-col justify-center leading-none">
          <div className="flex items-center space-x-1.5">
            <span className={`${current.font} font-black tracking-tight text-white`}>
              BEATS
            </span>
            <span className={`${current.font} font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-accent-green via-emerald-300 to-accent-gold`}>
              BAZAAR
            </span>
          </div>
          <div className="flex items-center space-x-1.5 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-gold animate-pulse shadow-sm shadow-amber-400/50" />
            <span className={`${current.sub} font-black uppercase tracking-[0.22em] text-gray-400`}>
              CERTIFIED MASTER RIGHTS
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
