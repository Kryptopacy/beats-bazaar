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
    xs: { icon: 26, font: 'text-sm', sub: 'text-[9px]', gap: 'space-x-2' },
    sm: { icon: 34, font: 'text-base', sub: 'text-[10px]', gap: 'space-x-2.5' },
    md: { icon: 44, font: 'text-xl', sub: 'text-[11px]', gap: 'space-x-3' },
    lg: { icon: 56, font: 'text-2xl', sub: 'text-xs', gap: 'space-x-3.5' },
    xl: { icon: 76, font: 'text-4xl', sub: 'text-sm', gap: 'space-x-4' }
  };

  const current = sizeMap[size];

  return (
    <div className={`inline-flex items-center ${current.gap} select-none group ${className}`}>
      {/* High-Precision Audiophile Hardware Emblem */}
      <div 
        className={`relative flex-shrink-0 transition-all duration-300 group-hover:scale-105 ${
          glow ? 'drop-shadow-[0_0_20px_rgba(0,229,153,0.35)]' : ''
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
            {/* Aerospace Titanium Base Plate Gradient */}
            <linearGradient id="bb-chassis-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E2836" />
              <stop offset="50%" stopColor="#111721" />
              <stop offset="100%" stopColor="#080C10" />
            </linearGradient>

            {/* Neon Cyber Emerald Core */}
            <linearGradient id="bb-emerald-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="40%" stopColor="#00E599" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>

            {/* Warm Studio Analog Gold */}
            <linearGradient id="bb-gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>

            {/* Outer Chamfer Edge Stroke */}
            <linearGradient id="bb-bevel-stroke" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#00E599" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.8" />
            </linearGradient>

            {/* Ambient Radial Core Light */}
            <radialGradient id="bb-ambient-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00E599" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#00E599" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Outer Squircle Chassis */}
          <rect
            x="4"
            y="4"
            width="92"
            height="92"
            rx="24"
            fill="url(#bb-chassis-grad)"
            stroke="url(#bb-bevel-stroke)"
            strokeWidth="1.5"
          />

          {/* Precision Hardware Inset Groove */}
          <rect
            x="8"
            y="8"
            width="84"
            height="84"
            rx="20"
            fill="none"
            stroke="#000000"
            strokeWidth="2"
            strokeOpacity="0.6"
          />

          {/* Ambient Lighting Field */}
          <circle cx="50" cy="50" r="38" fill="url(#bb-ambient-glow)" />

          {/* Vinyl Soundwave Concentric Precision Rings */}
          <circle cx="50" cy="50" r="36" stroke="#FFFFFF" strokeOpacity="0.08" strokeWidth="0.8" strokeDasharray="3 3" />
          <circle cx="50" cy="50" r="26" stroke="#FFFFFF" strokeOpacity="0.06" strokeWidth="0.8" strokeDasharray="2 2" />

          {/* Sculptural "BB" Soundwave Monolith */}
          {/* Main Vertical Frequency Spine */}
          <path
            d="M 24 24 C 24 20.686 26.686 18 30 18 C 33.314 18 36 20.686 36 24 V 76 C 36 79.314 33.314 82 30 82 C 26.686 82 24 79.314 24 76 Z"
            fill="url(#bb-emerald-grad)"
          />

          {/* Upper Resonator Wave Chamber (Top 'B') */}
          <path
            d="M 36 22 H 56 C 68.15 22 76 29.85 76 40 C 76 48.2 70.8 54.8 62 56 C 53.5 54 44 52 36 50 Z"
            fill="url(#bb-emerald-grad)"
            fillOpacity="0.9"
          />

          {/* Lower Resonator Wave Chamber (Bottom 'B') */}
          <path
            d="M 36 48 C 46 48 58 50 66 52 C 76.5 54.5 82 62.5 82 71 C 82 80 73 82 58 82 H 36 Z"
            fill="url(#bb-emerald-grad)"
          />

          {/* Precision Laser-Etched Sound Ports (Negative Space Cavities) */}
          <path
            d="M 44 30 H 54 C 61 30 65 34 65 39 C 65 44 61 46 54 46 H 44 Z"
            fill="#0A0E13"
          />
          <path
            d="M 44 56 H 56 C 64 56 69 61 69 67 C 69 73 64 76 56 76 H 44 Z"
            fill="#0A0E13"
          />

          {/* Analog Gold Transducer Prism (Golden Playhead Core) */}
          <polygon
            points="48,34 56,39 48,44"
            fill="url(#bb-gold-grad)"
          />
          <polygon
            points="48,62 58,67 48,72"
            fill="url(#bb-gold-grad)"
          />

          {/* Dynamic LED VU-Meter Level Indicators on Spine */}
          <circle cx="30" cy="28" r="1.5" fill="#FFFFFF" />
          <circle cx="30" cy="38" r="1.5" fill="#34D399" />
          <circle cx="30" cy="48" r="1.5" fill="#00E599" />
          <circle cx="30" cy="58" r="1.5" fill="#FBBF24" />
          <circle cx="30" cy="68" r="1.5" fill="#F59E0B" />
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
            <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
            <span className={`${current.sub} font-bold uppercase tracking-[0.2em] text-gray-400`}>
              MARKET &amp; CYPHER
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
