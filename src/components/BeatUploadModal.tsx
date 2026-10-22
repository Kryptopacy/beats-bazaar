'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAudio } from '@/context/AudioContext';
import { Beat, Genre, SPONSORED_DROP_FEE_USD } from '@/types';
import { X, Upload, Music, Sparkles, CheckCircle2, Camera, ChevronDown, Check } from 'lucide-react';

interface BeatUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSponsored?: boolean;
}

const GENRES: Genre[] = ['Afrobeats', 'Amapiano', 'Afro-Drill', 'Hip Hop', 'Trap', 'R&B', 'Alté'];

const GRADIENTS = [
  'linear-gradient(135deg, #00E599 0%, #151B22 100%)',
  'linear-gradient(135deg, #F59E0B 0%, #0B0F12 100%)',
  'linear-gradient(135deg, #EC4899 0%, #111827 100%)',
  'linear-gradient(135deg, #8B5CF6 0%, #064E3B 100%)',
  'linear-gradient(135deg, #3B82F6 0%, #1F2937 100%)'
];

export function BeatUploadModal({ isOpen, onClose, initialSponsored = false }: BeatUploadModalProps) {
  const { addNewBeat, producerAvatars, setProducerAvatar } = useAudio();

  const [title, setTitle] = useState('');
  const [producer, setProducer] = useState('TCG-m');
  const [customAvatar, setCustomAvatar] = useState('');
  const [genre, setGenre] = useState<Genre>('Afrobeats');
  const [bpm, setBpm] = useState(105);
  const [leasePrice, setLeasePrice] = useState(35);
  const [exclusivePrice, setExclusivePrice] = useState(350);
  const [inCypher, setInCypher] = useState(true);
  const [selectedGradient, setSelectedGradient] = useState(GRADIENTS[0]);
  const [audioFileName, setAudioFileName] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [tagsInput, setTagsInput] = useState('New Heat, Club');
  const [isSponsored, setIsSponsored] = useState(initialSponsored);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isGenreOpen, setIsGenreOpen] = useState(false);
  const genreDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setIsSponsored(initialSponsored);
    }
  }, [isOpen, initialSponsored]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (genreDropdownRef.current && !genreDropdownRef.current.contains(event.target as Node)) {
        setIsGenreOpen(false);
      }
    }
    if (isGenreOpen) {
      document.addEventListener('pointerdown', handleClickOutside);
      return () => document.removeEventListener('pointerdown', handleClickOutside);
    }
  }, [isGenreOpen]);

  if (!isOpen) return null;

  const handleAudioFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFileName(file.name);
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !producer.trim()) return;

    const trimmedProducer = producer.trim();
    if (customAvatar) {
      setProducerAvatar(trimmedProducer, customAvatar);
    }

    const resolvedAvatar = customAvatar || (producerAvatars && producerAvatars[trimmedProducer]);

    const newBeat: Beat = {
      id: `beat-${Date.now()}`,
      title: title.trim(),
      producer: trimmedProducer,
      genre,
      bpm: Number(bpm) || 100,
      audioUrl: audioUrl || '', // If empty, AudioContext generates a synth track
      leasePrice: Number(leasePrice) || 30,
      exclusivePrice: Number(exclusivePrice) || 300,
      inCypher,
      isSoldExclusive: false,
      isSponsored,
      producerAvatar: resolvedAvatar,
      uploadedAt: new Date().toISOString(),
      tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
      coverArt: selectedGradient
    };

    addNewBeat(newBeat);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
      // Reset form
      setTitle('');
      setAudioFileName('');
      setAudioUrl('');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-3xl sm:rounded-[2.5rem] bg-gradient-to-b from-[#141A23] via-[#0F141B] to-[#0A0D12] border border-white/[0.1] p-4 sm:p-10 shadow-2xl my-auto sm:my-8 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-white/[0.08]">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-accent-green to-emerald-400 flex items-center justify-center shadow-lg shadow-accent-green/20 ring-1 ring-white/20">
              <Upload className="w-6 h-6 text-black font-black" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">Drop a Beat</h2>
              <p className="text-xs text-gray-400 mt-0.5">Publish your sound to the Marketplace & Cypher room.</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-gray-400 hover:text-white rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-white/[0.08] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-16 text-center space-y-3">
            <CheckCircle2 className="w-16 h-16 text-accent-green mx-auto animate-bounce" />
            <h3 className="text-2xl font-black text-white">Beat Dropped Successfully!</h3>
            <p className="text-sm text-gray-400">Live in the Bazaar and queued in the Cypher room.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            
            {/* Title & Producer */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">Beat Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Accra Moonlight"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-2xl px-4 py-3 text-sm text-white focus:border-accent-green focus:ring-4 focus:ring-accent-green/10 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">Producer Handle *</label>
                <div className="flex items-center space-x-2.5">
                  <div className="relative group/avatar flex-shrink-0" title="Upload custom producer avatar">
                    <div className="w-11 h-11 rounded-2xl overflow-hidden bg-white/[0.04] border border-white/[0.1] hover:border-accent-green/50 flex items-center justify-center transition-all cursor-pointer">
                      {customAvatar || (producer && producerAvatars && producerAvatars[producer]) ? (
                        <img 
                          src={customAvatar || (producerAvatars && producerAvatars[producer])} 
                          alt="avatar" 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <Camera className="w-4 h-4 text-gray-400 group-hover/avatar:text-accent-green transition-colors" />
                      )}
                    </div>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = () => {
                            if (typeof reader.result === 'string') {
                              setCustomAvatar(reader.result);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      title="Upload custom avatar image"
                    />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. TCG-m / Sarz"
                    value={producer}
                    onChange={(e) => setProducer(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-2xl px-4 py-3 text-sm text-white focus:border-accent-green focus:ring-4 focus:ring-accent-green/10 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Genre & BPM */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative" ref={genreDropdownRef}>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">Genre</label>
                <button
                  type="button"
                  onClick={() => setIsGenreOpen(!isGenreOpen)}
                  className={`w-full flex items-center justify-between bg-[#141A22] border rounded-2xl px-4 py-3 text-sm text-white transition-all cursor-pointer ${
                    isGenreOpen ? 'border-accent-green ring-4 ring-accent-green/10' : 'border-white/[0.08] hover:border-white/[0.18]'
                  }`}
                >
                  <span className="font-semibold">{genre}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isGenreOpen ? 'rotate-180 text-white' : ''}`} />
                </button>

                {isGenreOpen && (
                  <div className="absolute left-0 top-full mt-2 w-full p-1.5 bg-[#0D1216]/95 backdrop-blur-2xl border border-white/[0.12] rounded-2xl shadow-2xl shadow-black/95 z-50 animate-in fade-in-0 zoom-in-95 duration-150 ring-1 ring-white/10 max-h-60 overflow-y-auto scrollbar-thin">
                    <div className="space-y-0.5">
                      {GENRES.map((g) => {
                        const isSelected = genre === g;
                        return (
                          <button
                            key={g}
                            type="button"
                            onClick={() => {
                              setGenre(g);
                              setIsGenreOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                              isSelected
                                ? 'bg-accent-green/15 text-accent-green font-bold border border-accent-green/30'
                                : 'text-gray-300 hover:text-white hover:bg-white/[0.06]'
                            }`}
                          >
                            <span>{g}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-accent-green" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">Tempo (BPM)</label>
                <input
                  type="number"
                  min={60}
                  max={200}
                  value={bpm}
                  onChange={(e) => setBpm(parseInt(e.target.value))}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-2xl px-4 py-3 text-sm text-white focus:border-accent-green focus:ring-4 focus:ring-accent-green/10 outline-none transition-all"
                />
              </div>
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">Standard Lease Price ($)</label>
                <input
                  type="number"
                  min={5}
                  value={leasePrice}
                  onChange={(e) => setLeasePrice(parseFloat(e.target.value))}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-2xl px-4 py-3 text-sm text-white focus:border-accent-green focus:ring-4 focus:ring-accent-green/10 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">Exclusive Buyout Price ($)</label>
                <input
                  type="number"
                  min={50}
                  value={exclusivePrice}
                  onChange={(e) => setExclusivePrice(parseFloat(e.target.value))}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-2xl px-4 py-3 text-sm text-white focus:border-accent-green focus:ring-4 focus:ring-accent-green/10 outline-none transition-all"
                />
              </div>
            </div>

            {/* Audio File Upload */}
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5">Master Audio File (.mp3, .wav)</label>
              <div className="relative border-2 border-dashed border-white/[0.1] hover:border-accent-green/60 rounded-2xl p-5 text-center cursor-pointer transition-all bg-white/[0.02] hover:bg-white/[0.04]">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleAudioFile}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Music className="w-7 h-7 text-accent-green mx-auto mb-1.5" />
                <span className="text-xs text-gray-200 font-bold block">
                  {audioFileName ? `Attached: ${audioFileName}` : 'Choose audio file or drop here'}
                </span>
                <span className="text-[10px] text-gray-500 block mt-0.5">
                  (If omitted, high-energy synthetic African rhythm will be generated)
                </span>
              </div>
            </div>

            {/* Cypher Opt-In Checkbox */}
            <div className="flex items-center space-x-3 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <input
                type="checkbox"
                id="cypherOptIn"
                checked={inCypher}
                onChange={(e) => setInCypher(e.target.checked)}
                className="w-4 h-4 rounded text-accent-green bg-gray-900 border-gray-700 focus:ring-accent-green cursor-pointer"
              />
              <label htmlFor="cypherOptIn" className="text-xs font-bold text-white cursor-pointer select-none">
                Feature in Freestyle Cypher Room (Free stream-only playback)
              </label>
            </div>

            {/* Sponsored Boost Checkbox */}
            <div className="flex items-start space-x-3.5 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-yellow-500/5 to-transparent border border-amber-500/30">
              <input
                type="checkbox"
                id="sponsorBoost"
                checked={isSponsored}
                onChange={(e) => setIsSponsored(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-amber-500 bg-gray-900 border-gray-700 focus:ring-amber-500 cursor-pointer"
              />
              <label htmlFor="sponsorBoost" className="text-xs font-bold text-white cursor-pointer select-none">
                <div className="flex items-center gap-1.5 text-amber-300">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Boost &amp; Sponsor Beat (${SPONSORED_DROP_FEE_USD})</span>
                </div>
                <span className="text-[11px] text-gray-400 font-normal block mt-0.5">
                  Pins your track to the top of the Marketplace &amp; features with a gold flame badge.
                </span>
              </label>
            </div>

            {/* Actions */}
            <div className="pt-4 flex items-center justify-end space-x-3 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 rounded-full border border-white/[0.08] text-sm font-bold text-gray-400 hover:text-white hover:bg-white/[0.05] transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-3 rounded-full bg-gradient-to-r from-accent-green via-emerald-400 to-[#00E599] text-black text-sm font-black shadow-lg shadow-accent-green/25 hover:shadow-accent-green/40 hover:scale-[1.02] active:scale-95 transition-all ring-1 ring-white/20"
              >
                Publish to Bazaar
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
