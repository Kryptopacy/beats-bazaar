'use client';

import React, { useEffect, useState } from 'react';

interface WaveformVisualizerProps {
  isPlaying: boolean;
  color?: string;
  barCount?: number;
}

export function WaveformVisualizer({ 
  isPlaying, 
  color = '#00E599', 
  barCount = 36 
}: WaveformVisualizerProps) {
  const [heights, setHeights] = useState<number[]>([]);

  useEffect(() => {
    // Generate initial waveform profile
    const initial = Array.from({ length: barCount }, (_, i) => {
      const x = i / barCount;
      // Bell-curve-ish profile with rhythmic variation
      return Math.sin(x * Math.PI) * 50 + Math.random() * 25 + 15;
    });
    setHeights(initial);
  }, [barCount]);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setHeights(prev => prev.map((h, i) => {
        const x = i / barCount;
        const base = Math.sin(x * Math.PI) * 45 + 15;
        const jitter = Math.random() * 35;
        return Math.min(95, Math.max(12, base + jitter));
      }));
    }, 110);

    return () => clearInterval(interval);
  }, [isPlaying, barCount]);

  return (
    <div className="flex items-center justify-center space-x-1 sm:space-x-1.5 h-32 px-4 py-2">
      {heights.map((height, idx) => (
        <div
          key={idx}
          className="w-1.5 sm:w-2 rounded-full transition-all duration-100 ease-in-out"
          style={{
            height: isPlaying ? `${height}%` : '15%',
            background: isPlaying 
              ? `linear-gradient(to top, ${color}, #F59E0B)` 
              : '#21262D',
            boxShadow: isPlaying ? `0 0 10px ${color}33` : 'none'
          }}
        />
      ))}
    </div>
  );
}
