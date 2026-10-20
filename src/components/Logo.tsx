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
    xs: { icon: 24, font: 'text-sm', sub: 'text-[9px]' },
    sm: { icon: 32, font: 'text-base', sub: 'text-[10px]' },
    md: { icon: 40, font: 'text-xl', sub: 'text-[11px]' },
    lg: { icon: 52, font: 'text-2xl', sub: 'text-xs' },
    xl: { icon: 72, font: 'text-4xl', sub: 'text-sm' }
  };

  const current = sizeMap[size];

  return (
    <div className={`inline-flex items-center space-x-3 select-none ${className}`}>
      {/* Vector Emblem */}
      <div 
        className={`relative flex-shrink-0 transition-transform duration-300 group-hover:scale-105 ${
          glow ? 'drop-shadow-[0_0_16px_rgba(0,229,153,0.35)]' : ''
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
            {/* Primary Emerald Gradient */}
            <linearGradient id="bb-emerald" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00E599" />
              <stop offset="60%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>

            {/* Accent Gold Gradient */}
            <linearGradient id="bb-gold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FBBF24" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>

            {/* Shield / Plate Metallic Base */}
            <linearGradient id="bb-plate" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#17212D" />
              <stop offset="100%" stopColor="#0A0E13" />
            </linearGradient>

            {/* Inner Glow */}
            <radialGradient id="bb-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00E599" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#00E599" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background Squircle Shield */}
          <rect
            x="4"
            y="4"
            width="92"
            height="92"
            rx="24"
            fill="url(#bb-plate)"
            stroke="url(#bb-emerald)"
            strokeWidth="2.5"
            strokeOpacity="0.4"
          />

          {/* Ambient Center Glow */}
          <circle cx="50" cy="50" r="34" fill="url(#bb-glow)" />

          {/* Vinyl Soundwave Concentric Grooves */}
          <circle cx="50" cy="50" r="36" stroke="#FFFFFF" strokeOpacity="0.08" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="50" cy="50" r="28" stroke="#FFFFFF" strokeOpacity="0.06" strokeWidth="1" strokeDasharray="2 2" />

          {/* Interlocking Dual 'B' Soundwave Monogram */}
          {/* Stem: Vertical Equalizer Spine */}
          <rect x="26" y="24" width="7" height="52" rx="3.5" fill="url(#bb-emerald)" />
          
          {/* Top Equalizer Wave / Upper 'B' Loop */}
          <path
            d="M33 28 C 48 28, 64 32, 64 42 C 64 50, 48 52, 33 52"
            stroke="url(#bb-emerald)"
            strokeWidth="7"
            strokeLinecap="round"
          />

          {/* Bottom Equalizer Wave / Lower 'B' Loop */}
          <path
            d="M33 48 C 52 48, 70 51, 70 63 C 70 72, 52 76, 33 76"
            stroke="url(#bb-emerald)"
            strokeWidth="7"
            strokeLinecap="round"
          />

          {/* Cyber Gold Central Audio Pulse Playhead */}
          <polygon
            points="46,45 57,50 46,55"
            fill="url(#bb-gold)"
            filter="drop-shadow(0 0 4px #F59E0B)"
          />

          {/* Studio Rhythm Dots */}
          <circle cx="76" cy="30" r="3" fill="#00E599" />
          <circle cx="80" cy="40" r="2.5" fill="#FBBF24" />
          <circle cx="78" cy="70" r="2.5" fill="#00E599" opacity="0.8" />
        </svg>
      </div>

      {/* Typography Wordmark */}
      {showWordmark && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center space-x-1.5">
            <span className={`${current.font} font-black tracking-tight text-white`}>
              Beats
            </span>
            <span className={`${current.font} font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-accent-green via-emerald-300 to-accent-gold`}>
              Bazaar
            </span>
          </div>
          <span className={`${current.sub} font-semibold uppercase tracking-widest text-gray-400 mt-0.5`}>
            Sound &amp; Cypher
          </span>
        </div>
      )}
    </div>
  );
}
