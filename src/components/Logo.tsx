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
    xs: { icon: 26, font: 'text-[11px] sm:text-xs', sub: 'text-[9px]', gap: 'space-x-1.5' },
    sm: { icon: 32, font: 'text-xs xs:text-sm sm:text-base', sub: 'text-[10px]', gap: 'space-x-1.5 sm:space-x-2.5' },
    md: { icon: 44, font: 'text-lg sm:text-xl', sub: 'text-[11px]', gap: 'space-x-2.5 sm:space-x-3' },
    lg: { icon: 56, font: 'text-xl sm:text-2xl', sub: 'text-xs', gap: 'space-x-3 sm:space-x-3.5' },
    xl: { icon: 80, font: 'text-3xl sm:text-4xl', sub: 'text-sm', gap: 'space-x-3.5 sm:space-x-4' }
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
        <picture className="w-full h-full block">
          <source srcSet="/logo-plaque-64.webp 1x, /logo-plaque-128.webp 2x" type="image/webp" />
          <img
            src="/logo-plaque-64.png"
            srcSet="/logo-plaque-64.png 1x, /logo-plaque-128.png 2x"
            alt="Beats Bazaar Master Plaque"
            width={current.icon}
            height={current.icon}
            loading="eager"
            decoding="sync"
            fetchPriority="high"
            className="w-full h-full object-contain pointer-events-none select-none"
          />
        </picture>
      </div>

      {/* Modern High-End Typography: Always render full BEATS BAZAAR */}
      {showWordmark && (
        <div className="flex items-center space-x-1 sm:space-x-1.5 leading-none">
          <span className={`${current.font} font-black tracking-tight text-white`}>
            BEATS
          </span>
          <span className={`${current.font} font-black tracking-tight text-white`}>
            BAZAAR
          </span>
        </div>
      )}
    </div>
  );
}
