'use client';

import React, { useState } from 'react';
import { useAudio } from '@/context/AudioContext';
import { Beat } from '@/types';
import { BazzaMascot } from '@/components/BazzaMascot';
import { 
  X, 
  Disc3, 
  Play, 
  Pause,
  Store, 
  Mic2, 
  ArrowRight, 
  Wand2,
  DollarSign
} from 'lucide-react';

interface AiDjModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBeat?: (beat: Beat) => void;
  onLicenseBeat?: (beat: Beat) => void;
  context?: 'marketplace' | 'cypher';
}

const MARKETPLACE_PRESETS = [
  { 
    label: '📻 100-108 BPM Radio Afrobeats', 
    prompt: 'Radio-ready Afrobeats around 104 BPM with melodic saxophone licks and energetic bounce for a streaming single' 
  },
  { 
    label: '🔥 Heavy 808 Afro-Drill Single', 
    prompt: 'Dark aggressive 808 drill slides with menacing hats and punchy snares for hard-hitting lead rap single' 
  },
  { 
    label: '🎹 3-Step Club Amapiano Log Drums', 
    prompt: 'Authentic rolling log drum Amapiano with deep bass chords for high-energy club anthems' 
  },
  { 
    label: '✨ Mellow Alté Guitar Chords', 
    prompt: 'Mellow acoustic guitar licks, warm Rhodes chords, and laid-back rhythm like Seyi Vibez or Tems' 
  },
  { 
    label: '💎 Commercial Buyout Under $400', 
    prompt: 'High-tier master instrumentals with exclusive commercial buyout rights ready for major label release' 
  }
];

const CYPHER_PRESETS = [
  { 
    label: '🎤 140 BPM Rapid-Fire Battle Drill', 
    prompt: 'Fast 140 BPM drill beat with sharp percussive pockets designed for back-to-back rapid MC verses' 
  },
  { 
    label: '🔄 Smooth 4s Crossfade MC Groove', 
    prompt: 'Medium tempo infectious bounce that flows effortlessly into subsequent tracks when switching rappers' 
  },
  { 
    label: '🥁 Rolling Log Drums for Flow Cadence', 
    prompt: 'Complex Amapiano 3-step syncopation to challenge lyricists and test freestyle cadence' 
  },
  { 
    label: '🌊 98 BPM Alté Pocket for Melodic Freestyle', 
    prompt: 'Spacious, soulful Alté instrumental with open frequency room for vocal harmonies and freestyle singing' 
  },
  { 
    label: '⚡ High-Voltage Party Banger for the Room', 
    prompt: 'Peak-energy club beat with explosive drops and heavy bottom end to hype up the room' 
  }
];

export function AiDjModal({ isOpen, onClose, onSelectBeat, onLicenseBeat, context }: AiDjModalProps) {
  const { beats, playBeat, setActiveSurface, activeSurface, activeBeat, isPlaying, togglePlay } = useAudio();
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    recommendedBeat: Beat;
    vibeTags: string[];
    reasoning: string;
    source: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentContext = context || activeSurface;
  const isMarketplace = currentContext === 'marketplace';
  const presets = isMarketplace ? MARKETPLACE_PRESETS : CYPHER_PRESETS;

  const handleAskDj = async (queryText?: string) => {
    const finalPrompt = queryText || prompt;
    if (!finalPrompt.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/ai-dj', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: finalPrompt, beats, context: currentContext })
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to get recommendation');
      }

      const foundBeat = beats.find(b => b.id === data.recommendedBeatId) || beats[0];
      setResult({
        recommendedBeat: foundBeat,
        vibeTags: data.vibeTags || [foundBeat.genre],
        reasoning: data.reasoning,
        source: data.source || 'gemini-3.8-flash'
      });
    } catch (err: any) {
      setError(err.message || 'Error connecting to Bazza');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayNow = (beat: Beat) => {
    playBeat(beat);
    setActiveSurface('cypher');
    onClose();
  };

  const isCurrentPlaying = result && activeBeat?.id === result.recommendedBeat.id && isPlaying;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-3xl sm:rounded-[2.5rem] bg-gradient-to-b from-[#151D28] via-[#0E141C] to-[#0A0D12] border border-white/[0.1] p-4 sm:p-8 shadow-2xl my-auto sm:my-8 max-h-[92vh] overflow-y-auto">
        
        {/* Context-Aware Header */}
        <div className="flex items-center justify-between pb-4 sm:pb-6 border-b border-white/[0.08]">
          <div className="flex items-center space-x-3.5">
            <BazzaMascot 
              state={isLoading ? 'mixing' : result ? 'success' : 'idle'} 
              size="md" 
            />
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Bazza</h2>
                <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                  isMarketplace 
                    ? 'bg-accent-green/15 text-accent-green border-accent-green/30' 
                    : 'bg-accent-gold/15 text-accent-gold border-accent-gold/30'
                }`}>
                  {isMarketplace ? (
                    <>
                      <Store className="w-2.5 h-2.5 mr-1" />
                      <span>Crate Curator</span>
                    </>
                  ) : (
                    <>
                      <Mic2 className="w-2.5 h-2.5 mr-1" />
                      <span>Cypher Selector</span>
                    </>
                  )}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {isMarketplace 
                  ? 'Describe the mood, tempo, artist reference, or production style you need to license.'
                  : 'Describe the energy, tempo, or freestyle cadence for your next cypher round.'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-gray-400 hover:text-white rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-white/[0.08] transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Form */}
        <div className="mt-5 space-y-4">
          <div className="relative">
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={
                isMarketplace
                  ? "e.g. Need a hard-hitting Afro-Drill beat around 140 BPM with heavy 808 slides for a lead single..."
                  : "e.g. Queue up high-energy Amapiano log drums with bouncy rhythm for 3 MCs passing the mic..."
              }
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4 text-xs sm:text-sm text-white placeholder-gray-500 focus:border-accent-green focus:ring-4 focus:ring-accent-green/10 outline-none transition-all resize-none"
            />
          </div>

          {/* Genuine Practical Session Presets */}
          <div>
            <div className="text-[11px] font-black uppercase tracking-wider text-gray-400 mb-2">
              {isMarketplace ? 'Production Requirements & Crate Presets:' : 'Cypher Session Presets:'}
            </div>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {presets.map((pv, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setPrompt(pv.prompt);
                    handleAskDj(pv.prompt);
                  }}
                  className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-semibold bg-white/[0.03] hover:bg-white/[0.08] text-gray-300 hover:text-white border border-white/[0.06] transition-all active:scale-95 text-left cursor-pointer"
                >
                  {pv.label}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex justify-end">
            <button
              type="button"
              disabled={isLoading || !prompt.trim()}
              onClick={() => handleAskDj()}
              className="w-full sm:w-auto justify-center flex items-center space-x-2.5 px-7 py-3 rounded-full bg-gradient-to-r from-accent-green via-emerald-400 to-[#00E599] text-black font-black text-xs sm:text-sm shadow-xl shadow-accent-green/25 hover:shadow-accent-green/40 hover:scale-[1.02] active:scale-95 disabled:opacity-40 transition-all ring-1 ring-white/20 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <BazzaMascot state="mixing" size="sm" glow={false} />
                  <span>Bazza is digging through crates...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>{isMarketplace ? 'Find Matching Beats' : 'Queue Cypher Rhythm'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mt-4 p-4 rounded-2xl bg-red-500/10 border border-red-500/25 text-red-400 text-xs">
            {error}
          </div>
        )}

        {/* Recommendation Output */}
        {result && (
          <div className="mt-6 p-4 sm:p-6 rounded-3xl bg-white/[0.03] border border-accent-green/40 shadow-xl space-y-4 animate-fadeIn">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <span className="text-[10px] font-black uppercase tracking-wider text-accent-green block mb-1">
                  {isMarketplace ? 'Recommended Production Match' : 'Selected Cypher Beat'}
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white tracking-tight truncate">
                  {result.recommendedBeat.title}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Prod. by <span className="text-white font-bold">{result.recommendedBeat.producer}</span> • <span className="text-accent-green font-bold">{result.recommendedBeat.genre}</span> ({result.recommendedBeat.bpm} BPM)
                </p>
              </div>

              <div 
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md ring-1 ring-white/10"
                style={{ background: result.recommendedBeat.coverArt || 'linear-gradient(135deg, #00E599, #0B0F12)' }}
              >
                <Disc3 className="w-7 h-7 sm:w-8 sm:h-8 text-black/60" />
              </div>
            </div>

            {/* Bazza's Verdict Commentary */}
            <div className="flex items-start space-x-3.5 p-3.5 sm:p-4 rounded-2xl bg-[#090D10] border border-white/[0.08]">
              <BazzaMascot state="success" size="sm" glow={false} />
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-black uppercase tracking-wider text-accent-green mb-0.5">Bazza&apos;s Verdict</div>
                <p className="text-xs text-gray-200 leading-relaxed italic">
                  &ldquo;{result.reasoning}&rdquo;
                </p>
              </div>
            </div>

            {/* Contextual Action Buttons */}
            <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  if (activeBeat?.id === result.recommendedBeat.id) {
                    togglePlay();
                  } else {
                    playBeat(result.recommendedBeat);
                  }
                }}
                className="flex items-center space-x-1.5 px-4 py-2.5 rounded-full bg-white/[0.08] hover:bg-white/[0.15] text-white text-xs font-bold border border-white/[0.1] transition-all cursor-pointer"
              >
                {isCurrentPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isCurrentPlaying ? 'Pause Preview' : 'Preview Beat'}</span>
              </button>

              {isMarketplace && onLicenseBeat && (
                <button
                  type="button"
                  onClick={() => {
                    onLicenseBeat(result.recommendedBeat);
                    onClose();
                  }}
                  className="flex items-center space-x-1.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-accent-green to-emerald-400 text-black text-xs font-black shadow-md hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                >
                  <DollarSign className="w-3.5 h-3.5 text-black" />
                  <span>License (${result.recommendedBeat.leasePrice})</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => handlePlayNow(result.recommendedBeat)}
                className={`flex items-center space-x-1.5 px-5 py-2.5 rounded-full text-xs font-black shadow-md hover:scale-[1.02] active:scale-95 transition-all cursor-pointer ${
                  isMarketplace 
                    ? 'bg-accent-gold/20 hover:bg-accent-gold/30 text-accent-gold border border-accent-gold/30'
                    : 'bg-gradient-to-r from-accent-gold via-amber-400 to-yellow-400 text-black'
                }`}
              >
                <Mic2 className="w-3.5 h-3.5" />
                <span>{isMarketplace ? 'Queue in Cypher' : 'Play in Cypher Room'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
