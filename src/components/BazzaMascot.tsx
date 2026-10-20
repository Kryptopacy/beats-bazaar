'use client';

import React from 'react';

export type BazzaState = 'idle' | 'mixing' | 'success';

interface BazzaMascotProps {
  state?: BazzaState;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  glow?: boolean;
}

export function BazzaMascot({
  state = 'idle',
  size = 'md',
  className = '',
  glow = true
}: BazzaMascotProps) {
  // Sizing maps
  const sizePx = {
    sm: 36,
    md: 56,
    lg: 96,
    xl: 132
  }[size];

  return (
    <div 
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: sizePx, height: sizePx }}
      title="Bazza, Native AI DJ"
    >
      {/* Ambient Glow */}
      {glow && (
        <div 
          className={`absolute inset-0 rounded-full blur-xl transition-all duration-500 pointer-events-none ${
            state === 'mixing'
              ? 'bg-accent-gold/30 scale-125'
              : state === 'success'
              ? 'bg-accent-green/40 scale-125'
              : 'bg-accent-green/20 scale-105'
          }`}
        />
      )}

      {/* SVG Robot Mascot */}
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full relative z-10 transition-transform duration-300 ${
          state === 'mixing' ? 'animate-bounce' : state === 'success' ? 'animate-pulse' : 'hover:scale-105'
        }`}
      >
        {/* Antenna with Jack Plug */}
        <path d="M50 22 V11" stroke="#F5A623" strokeWidth="3" strokeLinecap="round" />
        <circle cx="50" cy="8" r="4" fill="#00E599" className={state === 'mixing' ? 'animate-ping' : ''} />
        <circle cx="50" cy="8" r="2.5" fill="#FFFFFF" />

        {/* Headphone Band */}
        <path
          d="M20 50 C20 28, 80 28, 80 50"
          stroke="#2A3441"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M26 42 C32 32, 68 32, 74 42"
          stroke="#1E2631"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Headphone Ear Cushions (Glowing Emerald / Amber Rings) */}
        {/* Left Ear */}
        <rect x="11" y="44" width="10" height="26" rx="5" fill="#141A22" stroke="#222C38" strokeWidth="2" />
        <rect x="13" y="48" width="6" height="18" rx="3" fill={state === 'mixing' ? '#F5A623' : '#00E599'} opacity="0.8" />
        
        {/* Right Ear */}
        <rect x="79" y="44" width="10" height="26" rx="5" fill="#141A22" stroke="#222C38" strokeWidth="2" />
        <rect x="81" y="48" width="6" height="18" rx="3" fill={state === 'mixing' ? '#F5A623' : '#00E599'} opacity="0.8" />

        {/* Main Chassis / Head (Dark Matte Titanium Cube) */}
        <rect
          x="23"
          y="26"
          width="54"
          height="52"
          rx="16"
          fill="#11161F"
          stroke="#283545"
          strokeWidth="2"
        />

        {/* Subtle Chamfer Highlight */}
        <path
          d="M28 28 H72"
          stroke="#FFFFFF"
          strokeOpacity="0.12"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* OLED Visor Screen (Glossy Dark Glass) */}
        <rect
          x="29"
          y="34"
          width="42"
          height="36"
          rx="10"
          fill="#06090D"
          stroke="#19232F"
          strokeWidth="1.5"
        />

        {/* Visor Content by State */}
        {state === 'idle' && (
          <g>
            {/* Friendly LED Visor Eyes */}
            <circle cx="41" cy="50" r="4.5" fill="#00E599" />
            <circle cx="42" cy="49" r="1.5" fill="#FFFFFF" />

            <circle cx="59" cy="50" r="4.5" fill="#00E599" />
            <circle cx="60" cy="49" r="1.5" fill="#FFFFFF" />

            {/* Subtle Soundwave Smile */}
            <path
              d="M45 59 Q50 63 55 59"
              stroke="#00E599"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.85"
            />
          </g>
        )}

        {state === 'mixing' && (
          <g>
            {/* Spinning Turntable / Dynamic Equalizer Visor */}
            {/* Left Eye: Spinning Vinyl Disk */}
            <circle cx="41" cy="50" r="6" fill="#141A22" stroke="#F5A623" strokeWidth="1.5" />
            <circle cx="41" cy="50" r="2" fill="#F5A623" />
            
            {/* Right Eye: Animated Spectrum Bars */}
            <rect x="54" y="44" width="2" height="12" rx="1" fill="#00E599" className="animate-pulse" />
            <rect x="58" y="40" width="2" height="16" rx="1" fill="#F5A623" className="animate-pulse" />
            <rect x="62" y="46" width="2" height="10" rx="1" fill="#00E599" className="animate-pulse" />

            {/* DJ Audio Smile */}
            <path
              d="M43 61 L46 59 L50 62 L54 59 L57 61"
              stroke="#F5A623"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        )}

        {state === 'success' && (
          <g>
            {/* Triumphant Happy Audio-Wave Eyes */}
            <path
              d="M36 50 Q41 43 46 50"
              stroke="#00E599"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M54 50 Q59 43 64 50"
              stroke="#00E599"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Radiant Big DJ Smile */}
            <path
              d="M42 58 Q50 66 58 58"
              stroke="#00E599"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </g>
        )}

        {/* Hardware Corner Bolts */}
        <circle cx="27" cy="30" r="1" fill="#4B5563" />
        <circle cx="73" cy="30" r="1" fill="#4B5563" />
        <circle cx="27" cy="74" r="1" fill="#4B5563" />
        <circle cx="73" cy="74" r="1" fill="#4B5563" />
      </svg>
    </div>
  );
}