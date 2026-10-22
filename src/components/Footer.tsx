'use client';

import React from 'react';
import { Logo } from '@/components/Logo';
import { useAudio } from '@/context/AudioContext';
import { Store, Mic2, Sparkles, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onOpenUpload: (sponsored?: boolean) => void;
  onOpenBazza?: () => void;
  onOpenAiDj?: () => void;
}

export function Footer({ onOpenUpload, onOpenBazza, onOpenAiDj }: FooterProps) {
  const triggerBazza = onOpenBazza || onOpenAiDj;
  const { setActiveSurface, setSelectedGenre } = useAudio();

  return (
    <footer className="border-t border-white/[0.08] bg-[#0A0D12]/90 backdrop-blur-xl mt-20 pt-12 pb-28 sm:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-white/[0.06]">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Logo size="md" showWordmark={true} />
            <p className="text-sm text-gray-400 max-w-md leading-relaxed">
              The premier global beat marketplace and 24/7 freestyle cypher room. Direct master rights licensing with verified certificates, untagged studio audio, and beat curation by Bazza.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">Experience</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setActiveSurface('marketplace');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-accent-green transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>Marketplace Catalog</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setActiveSurface('cypher');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-accent-gold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Mic2 className="w-3.5 h-3.5" />
                  <span>24/7 Cypher Room</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={triggerBazza}
                  className="hover:text-accent-green transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ask Bazza</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Creator Tools */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">Producers</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <button
                  type="button"
                  onClick={() => onOpenUpload(false)}
                  className="hover:text-accent-green transition-colors cursor-pointer text-left"
                >
                  Drop a New Beat
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenUpload(true)}
                  className="hover:text-accent-gold transition-colors cursor-pointer text-left flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-accent-gold" />
                  <span>Boost a Beat</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenUpload(false)}
                  className="hover:text-accent-green transition-colors cursor-pointer text-left"
                >
                  Digital Legal Rights (PDF &amp; WAV)
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>© 2026 Beats Bazaar. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
}
