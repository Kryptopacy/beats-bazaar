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
      title={
        state === 'mixing' 
          ? 'Bazza is digging through crates...' 
          : state === 'success' 
          ? 'Bazza found the perfect match!' 
          : 'Bazza, Beat Curator'
      }
    >
      <style>{`
        @keyframes bazza-idle-float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-4px) rotate(1deg);
          }
        }

        @keyframes bazza-mixing-bob {
          0%, 100% {
            transform: translateY(0px) scale(1) rotate(0deg);
          }
          25% {
            transform: translateY(-6px) scale(1.06) rotate(-2.5deg);
          }
          50% {
            transform: translateY(1px) scale(0.97) rotate(0deg);
          }
          75% {
            transform: translateY(-4px) scale(1.04) rotate(2.5deg);
          }
        }

        @keyframes bazza-success-pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.08);
          }
        }

        @keyframes bazza-vinyl-rotate-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes bazza-vinyl-rotate-fast {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes bazza-eq-1 {
          0%, 100% { transform: scaleY(0.3); }
          50% { transform: scaleY(1.0); }
        }
        @keyframes bazza-eq-2 {
          0%, 100% { transform: scaleY(0.9); }
          50% { transform: scaleY(0.2); }
        }
        @keyframes bazza-eq-3 {
          0%, 100% { transform: scaleY(0.4); }
          50% { transform: scaleY(1.1); }
        }
        @keyframes bazza-eq-4 {
          0%, 100% { transform: scaleY(0.8); }
          50% { transform: scaleY(0.35); }
        }

        @keyframes bazza-sonar-pulse {
          0% {
            r: 2px;
            opacity: 0.9;
          }
          100% {
            r: 10px;
            opacity: 0;
          }
        }

        @keyframes bazza-glow-breath {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.15);
          }
        }

        .bazza-idle-anim {
          animation: bazza-idle-float 3.6s ease-in-out infinite;
          transform-origin: center bottom;
        }

        .bazza-mixing-anim {
          animation: bazza-mixing-bob 0.55s ease-in-out infinite;
          transform-origin: center bottom;
        }

        .bazza-success-anim {
          animation: bazza-success-pulse 1.8s ease-in-out infinite;
          transform-origin: center center;
        }

        .bazza-spin-idle {
          animation: bazza-vinyl-rotate-slow 5s linear infinite;
          transform-origin: 15px 56px;
        }
        .bazza-spin-idle-right {
          animation: bazza-vinyl-rotate-slow 5s linear infinite reverse;
          transform-origin: 85px 56px;
        }

        .bazza-spin-fast {
          animation: bazza-vinyl-rotate-fast 0.8s linear infinite;
          transform-origin: 15px 56px;
        }
        .bazza-spin-fast-right {
          animation: bazza-vinyl-rotate-fast 0.8s linear infinite reverse;
          transform-origin: 85px 56px;
        }

        .bazza-eq-bar-1 {
          animation: bazza-eq-1 0.7s ease-in-out infinite alternate;
          transform-box: fill-box;
          transform-origin: bottom center;
        }
        .bazza-eq-bar-2 {
          animation: bazza-eq-2 0.6s ease-in-out infinite alternate;
          transform-box: fill-box;
          transform-origin: bottom center;
        }
        .bazza-eq-bar-3 {
          animation: bazza-eq-3 0.85s ease-in-out infinite alternate;
          transform-box: fill-box;
          transform-origin: bottom center;
        }
        .bazza-eq-bar-4 {
          animation: bazza-eq-4 0.65s ease-in-out infinite alternate;
          transform-box: fill-box;
          transform-origin: bottom center;
        }

        .bazza-sonar-wave {
          animation: bazza-sonar-pulse 2s cubic-bezier(0.1, 0.8, 0.3, 1) infinite;
        }
        .bazza-sonar-wave-delayed {
          animation: bazza-sonar-pulse 2s cubic-bezier(0.1, 0.8, 0.3, 1) infinite;
          animation-delay: 1s;
        }

        .bazza-ambient-glow {
          animation: bazza-glow-breath 3s ease-in-out infinite;
        }
      `}</style>

      {/* Ambient Hardware Aura Glow */}
      {glow && (
        <div 
          className={`absolute inset-0 rounded-full blur-xl pointer-events-none transition-all duration-500 ${
            state === 'mixing'
              ? 'bg-accent-gold/40 scale-130'
              : state === 'success'
              ? 'bg-accent-green/50 scale-130'
              : 'bg-accent-green/25 scale-110 bazza-ambient-glow'
          }`}
        />
      )}

      {/* Bespoke 2026 Audiophile Hardware Mascot */}
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full relative z-10 ${
          state === 'mixing' 
            ? 'bazza-mixing-anim' 
            : state === 'success' 
            ? 'bazza-success-anim' 
            : 'bazza-idle-anim'
        }`}
      >
        <defs>
          {/* Obsidian Chassis Gradient */}
          <linearGradient id="bazzaChassis" x1="50" y1="20" x2="50" y2="82" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1E2630" />
            <stop offset="40%" stopColor="#121820" />
            <stop offset="100%" stopColor="#0B0F14" />
          </linearGradient>

          {/* Curved Visor Screen Glass */}
          <linearGradient id="bazzaVisor" x1="50" y1="34" x2="50" y2="72" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#080C10" />
            <stop offset="100%" stopColor="#040608" />
          </linearGradient>

          {/* Gold Vinyl Stamper Earcups */}
          <radialGradient id="bazzaGoldVinyl" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF2A3" />
            <stop offset="35%" stopColor="#F59E0B" />
            <stop offset="70%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#78350F" />
          </radialGradient>

          {/* Studio Monitor Headband Arc */}
          <linearGradient id="bazzaHeadband" x1="15" y1="20" x2="85" y2="20" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#374151" />
            <stop offset="50%" stopColor="#1F2937" />
            <stop offset="100%" stopColor="#374151" />
          </linearGradient>

          {/* Specular Edge Highlight */}
          <linearGradient id="bazzaRimGlow" x1="24" y1="24" x2="76" y2="24" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00E599" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {/* 1. Antenna: 1/4" Gold Studio Jack Transmitter */}
        <g>
          {/* Sonar Radar Wave Rings */}
          <circle cx="50" cy="7" r="2" stroke="#00E599" strokeWidth="1.2" fill="none" className="bazza-sonar-wave" />
          <circle cx="50" cy="7" r="2" stroke="#F59E0B" strokeWidth="1" fill="none" className="bazza-sonar-wave-delayed" />

          {/* Antenna Rod */}
          <line x1="50" y1="20" x2="50" y2="10" stroke="#4B5563" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="50" y1="14" x2="50" y2="10" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
          
          {/* Glowing Crystal Tip */}
          <circle cx="50" cy="8" r="3.5" fill={state === 'mixing' ? '#F59E0B' : '#00E599'} />
          <circle cx="50" cy="8" r="1.5" fill="#FFFFFF" />
        </g>

        {/* 2. Studio Monitor Headband Rig */}
        <path
          d="M17 54 C17 24, 83 24, 83 54"
          stroke="url(#bazzaHeadband)"
          strokeWidth="6"
          strokeLinecap="round"
        />
        {/* Inner Padding Arch */}
        <path
          d="M23 48 C23 29, 77 29, 77 48"
          stroke="#111822"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* 3. Earcups: Spinning 24k Gold Master Vinyl Discs with Acoustic Halo */}
        {/* Left Earcup */}
        <g>
          {/* Outer Housing */}
          <rect x="7" y="42" width="14" height="28" rx="6" fill="#121820" stroke="#25303D" strokeWidth="1.5" />
          {/* Glowing Acoustic LED Ring */}
          <rect 
            x="9" 
            y="45" 
            width="3" 
            height="22" 
            rx="1.5" 
            fill={state === 'mixing' ? '#F59E0B' : '#00E599'} 
            opacity={state === 'mixing' ? '1' : '0.85'} 
          />
          {/* Gold Mini Vinyl Disc on Ear Cup */}
          <g className={state === 'mixing' ? 'bazza-spin-fast' : 'bazza-spin-idle'}>
            <circle cx="15" cy="56" r="5" fill="url(#bazzaGoldVinyl)" stroke="#222" strokeWidth="0.5" />
            <circle cx="15" cy="56" r="3" stroke="#92400E" strokeWidth="0.4" fill="none" />
            <circle cx="15" cy="56" r="1.5" fill="#111" />
          </g>
        </g>

        {/* Right Earcup */}
        <g>
          {/* Outer Housing */}
          <rect x="79" y="42" width="14" height="28" rx="6" fill="#121820" stroke="#25303D" strokeWidth="1.5" />
          {/* Glowing Acoustic LED Ring */}
          <rect 
            x="88" 
            y="45" 
            width="3" 
            height="22" 
            rx="1.5" 
            fill={state === 'mixing' ? '#F59E0B' : '#00E599'} 
            opacity={state === 'mixing' ? '1' : '0.85'} 
          />
          {/* Gold Mini Vinyl Disc on Ear Cup */}
          <g className={state === 'mixing' ? 'bazza-spin-fast-right' : 'bazza-spin-idle-right'}>
            <circle cx="85" cy="56" r="5" fill="url(#bazzaGoldVinyl)" stroke="#222" strokeWidth="0.5" />
            <circle cx="85" cy="56" r="3" stroke="#92400E" strokeWidth="0.4" fill="none" />
            <circle cx="85" cy="56" r="1.5" fill="#111" />
          </g>
        </g>

        {/* 4. Capsule Chassis (Titanium Audiophile Cube) */}
        <rect
          x="22"
          y="24"
          width="56"
          height="54"
          rx="18"
          fill="url(#bazzaChassis)"
          stroke="#263342"
          strokeWidth="2"
        />

        {/* Top Chamfer Beveled Highlight Line */}
        <path
          d="M28 26 H72"
          stroke="url(#bazzaRimGlow)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Studio Top Microphone/Acoustic Vents */}
        <line x1="38" y1="28" x2="44" y2="28" stroke="#374151" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="56" y1="28" x2="62" y2="28" stroke="#374151" strokeWidth="1.2" strokeLinecap="round" />

        {/* 4 Precision Gold Hex Bolts at Chassis Corners */}
        <circle cx="27" cy="29" r="1.2" fill="#F59E0B" />
        <circle cx="73" cy="29" r="1.2" fill="#F59E0B" />
        <circle cx="27" cy="73" r="1.2" fill="#F59E0B" />
        <circle cx="73" cy="73" r="1.2" fill="#F59E0B" />

        {/* 5. Panoramic Cyber OLED Visor */}
        <rect
          x="27"
          y="33"
          width="46"
          height="38"
          rx="12"
          fill="url(#bazzaVisor)"
          stroke={state === 'mixing' ? '#F59E0B' : '#1F2A38'}
          strokeWidth="1.5"
        />

        {/* Visor Glass Specular Curved Reflection */}
        <path
          d="M30 36 C42 34, 58 34, 70 36"
          stroke="#FFFFFF"
          strokeOpacity="0.12"
          strokeWidth="1"
          strokeLinecap="round"
        />

        {/* 6. Dynamic Visor Content by State */}
        {state === 'idle' && (
          <g>
            {/* Left Eye: High-Visibility Multi-Band Equalizer Matrix */}
            <g transform="translate(34, 54)">
              <rect x="0" y="-10" width="3.2" height="15" rx="1.6" fill="#00E599" className="bazza-eq-bar-1" />
              <rect x="4.8" y="-14" width="3.2" height="19" rx="1.6" fill="#00E599" className="bazza-eq-bar-3" />
              <rect x="9.6" y="-8" width="3.2" height="13" rx="1.6" fill="#00E599" className="bazza-eq-bar-2" />
            </g>

            {/* Right Eye: High-Visibility Multi-Band Equalizer Matrix */}
            <g transform="translate(53, 54)">
              <rect x="0" y="-8" width="3.2" height="13" rx="1.6" fill="#00E599" className="bazza-eq-bar-2" />
              <rect x="4.8" y="-14" width="3.2" height="19" rx="1.6" fill="#00E599" className="bazza-eq-bar-3" />
              <rect x="9.6" y="-10" width="3.2" height="15" rx="1.6" fill="#00E599" className="bazza-eq-bar-1" />
            </g>

            {/* Soundwave Oscillogram Mouth */}
            <path
              d="M38 64 Q44 60 50 64 Q56 68 62 64"
              stroke="#00E599"
              strokeWidth="2.4"
              strokeLinecap="round"
              opacity="0.95"
            />
          </g>
        )}

        {state === 'mixing' && (
          <g>
            {/* Left Eye: Spinning Mini Scratch Turntable */}
            <circle cx="40" cy="49" r="6.5" fill="#141A22" stroke="#F59E0B" strokeWidth="1.5" />
            <circle cx="40" cy="49" r="4.5" stroke="#F59E0B" strokeWidth="0.5" strokeDasharray="2 1.5" fill="none" />
            <circle cx="40" cy="49" r="2" fill="#F59E0B" />

            {/* Right Eye: Aggressive Peak Overload Meter Bars */}
            <g transform="translate(54, 53)">
              <rect x="0" y="-14" width="2.2" height="18" rx="1" fill="#F59E0B" className="bazza-eq-bar-3" />
              <rect x="3.5" y="-16" width="2.2" height="20" rx="1" fill="#EF4444" className="bazza-eq-bar-1" />
              <rect x="7" y="-12" width="2.2" height="16" rx="1" fill="#F59E0B" className="bazza-eq-bar-4" />
              <rect x="10.5" y="-18" width="2.2" height="22" rx="1" fill="#EF4444" className="bazza-eq-bar-2" />
            </g>

            {/* Energetic Beat-Juggling Wave Mouth */}
            <path
              d="M39 63 L43 61 L47 64 L50 60 L53 64 L57 61 L61 63"
              stroke="#F59E0B"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        )}

        {state === 'success' && (
          <g>
            {/* Triumphant Neon Audio Wave Eyes */}
            <path
              d="M34 50 Q41 40 48 50"
              stroke="#00E599"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
            <circle cx="41" cy="43" r="1.5" fill="#F59E0B" />

            <path
              d="M52 50 Q59 40 66 50"
              stroke="#00E599"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
            <circle cx="59" cy="43" r="1.5" fill="#F59E0B" />

            {/* Harmonic Wide Master Smile */}
            <path
              d="M39 61 Q50 71 61 61"
              stroke="#00E599"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
          </g>
        )}
      </svg>
    </div>
  );
}
