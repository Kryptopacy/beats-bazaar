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
    xl: { icon: 84, font: 'text-4xl', sub: 'text-sm', gap: 'space-x-4' }
  };

  const current = sizeMap[size];

  return (
    <div className={`inline-flex items-center ${current.gap} select-none group ${className}`}>
      {/* Official Master Certification Plaque (True Transparent Hardware Emblem) */}
      <div 
        className={`relative flex-shrink-0 transition-transform duration-300 group-hover:scale-105 ${
          glow ? 'drop-shadow-[0_0_18px_rgba(0,229,153,0.35)]' : ''
        }`}
        style={{ width: current.icon, height: current.icon }}
      >
        <img
          src="/logo-plaque.png?v=3"
          alt="Beats Bazaar Master Plaque"
          width={current.icon}
          height={current.icon}
          className="w-full h-full object-contain pointer-events-none select-none"
        />
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
