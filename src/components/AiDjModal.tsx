'use client';

import React, { useState } from 'react';
import { useAudio } from '@/context/AudioContext';
import { Beat } from '@/types';
import { BazzaMascot } from '@/components/BazzaMascot';
import { 
  X, 
  Sparkles, 
  Disc3, 
  Play, 
  Radio, 
  ArrowRight, 
  CheckCircle2,
  Wand2
} from 'lucide-react';

interface AiDjModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBeat?: (beat: Beat) => void;
}

const PRESET_VIBES = [
  { label: '🌴 Chilled Sunset & Melodic Chords', prompt: 'Chilled sunset vibe with organic acoustic chords and mellow tempo for smooth singing' },
  { label: '🔥 Aggressive Drill Cypher Bars', prompt: 'Dark and aggressive drill 808 slides for rapid-fire freestyle bars' },
  { label: '🎹 Heavy Amapiano Log Drum Heat', prompt: 'High-energy private school Amapiano with heavy rolling 3-step log drums for a party crowd' },
  { label: '🎷 Bouncy Lagos Club Nightdrive', prompt: 'Syncopated shakers, lively saxophone licks, and infectious bouncy Afrobeats' }
];

export function AiDjModal({ isOpen, onClose, onSelectBeat }: AiDjModalProps) {
  const { beats, playBeat, setActiveSurface } = useAudio();
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
        body: JSON.stringify({ prompt: finalPrompt, beats })
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
      setError(err.message || 'Error connecting to AI DJ');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayNow = (beat: Beat) => {
    playBeat(beat);
    setActiveSurface('cypher');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-3xl sm:rounded-[2.5rem] bg-gradient-to-b from-[#151D28] via-[#0E141C] to-[#0A0D12] border border-white/[0.1] p-4 sm:p-10 shadow-2xl my-auto sm:my-8 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 sm:pb-6 border-b border-white/[0.08]">
          <div className="flex items-center space-x-3.5">
            <BazzaMascot 
              state={isLoading ? 'mixing' : result ? 'success' : 'idle'} 
              size="md" 
            />
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Bazza</h2>
              <p className="text-xs text-gray-400 mt-0.5">Native AI Cypher DJ • Describe your mood, tempo, or vibe in plain English.</p>
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
        <div className="mt-6 space-y-4">
          <div className="relative">
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. We need something mellow with live guitar chords like Tems or Seyi Vibez for melodic freestyle..."
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4 text-sm text-white placeholder-gray-500 focus:border-accent-green focus:ring-4 focus:ring-accent-green/10 outline-none transition-all resize-none"
            />
          </div>

          {/* Preset Inspiration Pills */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">Or ask Bazza for one of these:</div>
            <div className="flex flex-wrap gap-2">
              {PRESET_VIBES.map((pv, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setPrompt(pv.prompt);
                    handleAskDj(pv.prompt);
                  }}
                  className="px-3.5 py-2 rounded-full text-xs font-semibold bg-white/[0.03] hover:bg-white/[0.08] text-gray-300 hover:text-white border border-white/[0.06] transition-all active:scale-95 text-left cursor-pointer"
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
              className="w-full sm:w-auto justify-center flex items-center space-x-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-accent-green via-emerald-400 to-[#00E599] text-black font-black text-sm shadow-xl shadow-accent-green/25 hover:shadow-accent-green/40 hover:scale-[1.02] active:scale-95 disabled:opacity-40 transition-all ring-1 ring-white/20 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <BazzaMascot state="mixing" size="sm" glow={false} />
                  <span>Bazza is digging through crates...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>Ask Bazza</span>
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
          <div className="mt-6 p-6 rounded-3xl bg-white/[0.03] border border-accent-green/40 shadow-xl space-y-4 animate-fadeIn">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-black text-white tracking-tight">
                  {result.recommendedBeat.title}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Prod. by <span className="text-white font-bold">{result.recommendedBeat.producer}</span> • <span className="text-accent-green font-bold">{result.recommendedBeat.genre}</span> ({result.recommendedBeat.bpm} BPM)
                </p>
              </div>

              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md ring-1 ring-white/10"
                style={{ background: result.recommendedBeat.coverArt || 'linear-gradient(135deg, #00E599, #0B0F12)' }}
              >
                <Disc3 className="w-8 h-8 text-black/60" />
              </div>
            </div>

            {/* Bazza's Verdict Commentary */}
            <div className="flex items-start space-x-3.5 p-4 rounded-2xl bg-[#090D10] border border-white/[0.08]">
              <BazzaMascot state="success" size="sm" glow={false} />
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-black uppercase tracking-wider text-accent-green mb-0.5">Bazza&apos;s Verdict</div>
                <p className="text-xs text-gray-200 leading-relaxed italic">
                  &ldquo;{result.reasoning}&rdquo;
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => handlePlayNow(result.recommendedBeat)}
                className="flex items-center space-x-2 px-6 py-3 rounded-full bg-gradient-to-r from-accent-green to-emerald-400 text-black text-xs font-black shadow-md hover:scale-[1.02] active:scale-95 transition-all"
              >
                <Radio className="w-4 h-4 text-black animate-pulse" />
                <span>Play in Cypher Room</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
