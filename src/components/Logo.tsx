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
      {/* Floating Master Certification Plaque (Transparent Background) */}
      <div 
        className={`relative flex-shrink-0 transition-all duration-300 group-hover:scale-105 ${
          glow ? 'drop-shadow-[0_0_24px_rgba(0,229,153,0.35)]' : ''
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
            {/* Obsidian Titanium Plaque Surface */}
            <linearGradient id="plaque-body" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E2734" />
              <stop offset="45%" stopColor="#121822" />
              <stop offset="100%" stopColor="#090D12" />
            </linearGradient>

            {/* Chamfered Plaque Bevel */}
            <linearGradient id="plaque-bevel" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
              <stop offset="40%" stopColor="#00E599" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.9" />
            </linearGradient>

            {/* 24K Brushed Gold Vinyl Master Disc */}
            <radialGradient id="gold-master-disc" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFBEB" />
              <stop offset="35%" stopColor="#FDE68A" />
              <stop offset="65%" stopColor="#F59E0B" />
              <stop offset="88%" stopColor="#B45309" />
              <stop offset="100%" stopColor="#78350F" />
            </radialGradient>

            {/* Dark Obsidian Center Sound Well */}
            <radialGradient id="center-sound-well" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#161F2B" />
              <stop offset="70%" stopColor="#0B0F14" />
              <stop offset="100%" stopColor="#040608" />
            </radialGradient>

            {/* Neon Emerald Glow for Center Monogram */}
            <linearGradient id="neon-bb" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6EE7B7" />
              <stop offset="50%" stopColor="#00E599" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>

            {/* Corner Hex-Bolt Gold */}
            <linearGradient id="hex-bolt" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE68A" />
              <stop offset="100%" stopColor="#92400E" />
            </linearGradient>

            {/* Circular Text Arc Paths */}
            {/* Top Center Crown Arc for BEATS BAZAAR */}
            <path id="arc-crown" d="M 19 50 A 31 31 0 0 1 81 50" />
            {/* Left Certification Arc */}
            <path id="arc-left" d="M 21 68 A 31 31 0 0 1 31 32" />
            {/* Right Certification Arc */}
            <path id="arc-right" d="M 69 32 A 31 31 0 0 1 79 68" />
          </defs>

          {/* 1. Floating Anodized Hardware Plaque (NO Solid Background) */}
          <rect
            x="4"
            y="4"
            width="92"
            height="92"
            rx="22"
            fill="url(#plaque-body)"
            stroke="url(#plaque-bevel)"
            strokeWidth="1.8"
          />

          {/* Precision Inset Rim */}
          <rect
            x="8"
            y="8"
            width="84"
            height="84"
            rx="18"
            fill="none"
            stroke="#000000"
            strokeWidth="1.5"
            strokeOpacity="0.7"
          />

          {/* 2. Four Precision Industrial Gold Corner Hex-Bolts */}
          {/* Top-Left */}
          <polygon points="12,10 14.5,11.5 14.5,14.5 12,16 9.5,14.5 9.5,11.5" fill="url(#hex-bolt)" />
          <circle cx="12" cy="13" r="1.2" fill="#0A0E13" />
          {/* Top-Right */}
          <polygon points="88,10 90.5,11.5 90.5,14.5 88,16 85.5,14.5 85.5,11.5" fill="url(#hex-bolt)" />
          <circle cx="88" cy="13" r="1.2" fill="#0A0E13" />
          {/* Bottom-Left */}
          <polygon points="12,84 14.5,85.5 14.5,88.5 12,90 9.5,88.5 9.5,85.5" fill="url(#hex-bolt)" />
          <circle cx="12" cy="87" r="1.2" fill="#0A0E13" />
          {/* Bottom-Right */}
          <polygon points="88,84 90.5,85.5 90.5,88.5 88,90 85.5,88.5 85.5,85.5" fill="url(#hex-bolt)" />
          <circle cx="88" cy="87" r="1.2" fill="#0A0E13" />

          {/* 3. Gold Master Disc Plate */}
          <circle cx="50" cy="50" r="34" fill="url(#gold-master-disc)" stroke="#92400E" strokeWidth="1" />

          {/* Precision Audio Concentric Micro-Grooves */}
          <circle cx="50" cy="50" r="30" stroke="#78350F" strokeOpacity="0.4" strokeWidth="0.5" strokeDasharray="6 2" />
          <circle cx="50" cy="50" r="26" stroke="#FFFFFF" strokeOpacity="0.25" strokeWidth="0.5" strokeDasharray="4 2" />
          <circle cx="50" cy="50" r="22" stroke="#78350F" strokeOpacity="0.3" strokeWidth="0.5" strokeDasharray="5 3" />

          {/* 4. Engraved Text on the Disc Rim */}
          {/* CROWN: BEATS BAZAAR Prominently at Top Center of the Curve */}
          <text>
            <textPath 
              href="#arc-crown" 
              startOffset="50%" 
              textAnchor="middle" 
              fill="#2A1A04" 
              fontSize="4.4" 
              fontWeight="900" 
              letterSpacing="1"
            >
              BEATS BAZAAR
            </textPath>
          </text>

          {/* Left Arc: VERIFIED MASTER curving up towards BEATS BAZAAR */}
          <text>
            <textPath 
              href="#arc-left" 
              startOffset="50%" 
              textAnchor="middle" 
              fill="#52360B" 
              fontSize="2.8" 
              fontWeight="800" 
              letterSpacing="0.8"
            >
              VERIFIED MASTER
            </textPath>
          </text>

          {/* Right Arc: LEGAL RIGHTS curving up towards BEATS BAZAAR */}
          <text>
            <textPath 
              href="#arc-right" 
              startOffset="50%" 
              textAnchor="middle" 
              fill="#52360B" 
              fontSize="2.8" 
              fontWeight="800" 
              letterSpacing="0.8"
            >
              LEGAL RIGHTS
            </textPath>
          </text>

          {/* 5. Center High-Contrast Sound Chamber for Bold Double "BB" Visibility */}
          <circle 
            cx="50" 
            cy="50" 
            r="16.5" 
            fill="url(#center-sound-well)" 
            stroke="#00E599" 
            strokeWidth="1.8"
            filter="drop-shadow(0 0 6px rgba(0,229,153,0.5))"
          />

          {/* 6. Bold, Sculpted, High-Contrast Interlocking "BB" Monogram */}
          {/* Main Left Frequency Stem (Thick & Solid) */}
          <rect 
            x="40" 
            y="40" 
            width="3.6" 
            height="20" 
            rx="1.8" 
            fill="url(#neon-bb)"
          />

          {/* Upper Resonator 'B' Loop (Bold 3.4px Stroke) */}
          <path
            d="M 43 42 C 49 42, 57 43.5, 57 47 C 57 50.5, 49 51, 43 51"
            stroke="url(#neon-bb)"
            strokeWidth="3.4"
            strokeLinecap="round"
            fill="none"
          />

          {/* Lower Resonator 'B' Loop (Bold 3.4px Stroke) */}
          <path
            d="M 43 50 C 50 50, 59 51.5, 59 55.5 C 59 59.5, 50 60, 43 60"
            stroke="url(#neon-bb)"
            strokeWidth="3.4"
            strokeLinecap="round"
            fill="none"
          />

          {/* Interlocking Mirrored Reverse 'B' Soundwave Echo */}
          <path
            d="M 40 44.5 C 36 44.5, 33 46, 33 48 C 33 50, 36 51, 40 51"
            stroke="#FDE68A"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 40 51 C 35 51, 31 52.5, 31 55 C 31 57.5, 35 58.5, 40 58.5"
            stroke="#FDE68A"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />

          {/* Studio Playhead Diamond (High Contrast Cyber Core) */}
          <polygon
            points="46,48 51,50 46,52"
            fill="#FFFFFF"
          />
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
            <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse shadow-sm shadow-accent-green/50" />
            <span className={`${current.sub} font-black uppercase tracking-[0.22em] text-gray-400`}>
              CERTIFIED MASTER RIGHTS
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
