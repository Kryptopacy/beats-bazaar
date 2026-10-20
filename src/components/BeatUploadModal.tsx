'use client';

import React, { useState } from 'react';
import { useAudio } from '@/context/AudioContext';
import { Beat, Genre } from '@/types';
import { X, Upload, Music, Sparkles, CheckCircle2 } from 'lucide-react';

interface BeatUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GENRES: Genre[] = ['Afrobeats', 'Amapiano', 'Afro-Drill', 'Hip Hop', 'Trap', 'R&B', 'Alté'];

const GRADIENTS = [
  'linear-gradient(135deg, #00E599 0%, #151B22 100%)',
  'linear-gradient(135deg, #F59E0B 0%, #0B0F12 100%)',
  'linear-gradient(135deg, #EC4899 0%, #111827 100%)',
  'linear-gradient(135deg, #8B5CF6 0%, #064E3B 100%)',
  'linear-gradient(135deg, #3B82F6 0%, #1F2937 100%)'
];

export function BeatUploadModal({ isOpen, onClose }: BeatUploadModalProps) {
  const { addNewBeat } = useAudio();

  const [title, setTitle] = useState('');
  const [producer, setProducer] = useState('');
  const [genre, setGenre] = useState<Genre>('Afrobeats');
  const [bpm, setBpm] = useState(105);
  const [leasePrice, setLeasePrice] = useState(35);
  const [exclusivePrice, setExclusivePrice] = useState(350);
  const [inCypher, setInCypher] = useState(true);
  const [selectedGradient, setSelectedGradient] = useState(GRADIENTS[0]);
  const [audioFileName, setAudioFileName] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [tagsInput, setTagsInput] = useState('New Heat, Club');
  const [isSponsored, setIsSponsored] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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

    const newBeat: Beat = {
      id: `beat-${Date.now()}`,
      title: title.trim(),
      producer: producer.trim(),
      genre,
      bpm: Number(bpm) || 100,
      audioUrl: audioUrl || '', // If empty, AudioContext generates a synth track
      leasePrice: Number(leasePrice) || 30,
      exclusivePrice: Number(exclusivePrice) || 300,
      inCypher,
      isSoldExclusive: false,
      isSponsored,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl rounded-3xl bg-surface border border-border p-6 sm:p-8 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-accent-green/20 border border-accent-green/40 flex items-center justify-center">
              <Upload className="w-5 h-5 text-accent-green" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Drop a Beat</h2>
              <p className="text-xs text-gray-400">Publish your sound to the Marketplace & Cypher room.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-surface-light">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-16 text-center space-y-3">
            <CheckCircle2 className="w-16 h-16 text-accent-green mx-auto animate-bounce" />
            <h3 className="text-2xl font-bold text-white">Beat Dropped Successfully!</h3>
            <p className="text-sm text-gray-400">Live in the Bazaar and queued in the Cypher room.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            
            {/* Title & Producer */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Beat Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Accra Moonlight"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#0B0F12] border border-border rounded-xl px-4 py-2.5 text-sm text-white focus:border-accent-green outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Producer Handle *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TCG-m / Sarz"
                  value={producer}
                  onChange={(e) => setProducer(e.target.value)}
                  className="w-full bg-[#0B0F12] border border-border rounded-xl px-4 py-2.5 text-sm text-white focus:border-accent-green outline-none"
                />
              </div>
            </div>

            {/* Genre & BPM */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Genre</label>
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value as Genre)}
                  className="w-full bg-[#0B0F12] border border-border rounded-xl px-4 py-2.5 text-sm text-white focus:border-accent-green outline-none"
                >
                  {GENRES.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Tempo (BPM)</label>
                <input
                  type="number"
                  min={60}
                  max={200}
                  value={bpm}
                  onChange={(e) => setBpm(parseInt(e.target.value))}
                  className="w-full bg-[#0B0F12] border border-border rounded-xl px-4 py-2.5 text-sm text-white focus:border-accent-green outline-none"
                />
              </div>
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Standard Lease Price ($)</label>
                <input
                  type="number"
                  min={5}
                  value={leasePrice}
                  onChange={(e) => setLeasePrice(parseFloat(e.target.value))}
                  className="w-full bg-[#0B0F12] border border-border rounded-xl px-4 py-2.5 text-sm text-white focus:border-accent-green outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Exclusive Buyout Price ($)</label>
                <input
                  type="number"
                  min={50}
                  value={exclusivePrice}
                  onChange={(e) => setExclusivePrice(parseFloat(e.target.value))}
                  className="w-full bg-[#0B0F12] border border-border rounded-xl px-4 py-2.5 text-sm text-white focus:border-accent-green outline-none"
                />
              </div>
            </div>

            {/* Audio File Upload */}
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">Master Audio File (.mp3, .wav)</label>
              <div className="relative border-2 border-dashed border-border hover:border-accent-green/60 rounded-2xl p-4 text-center cursor-pointer transition-colors bg-[#0B0F12]/50">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleAudioFile}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Music className="w-6 h-6 text-accent-green mx-auto mb-1" />
                <span className="text-xs text-gray-300 font-semibold block">
                  {audioFileName ? `Attached: ${audioFileName}` : 'Choose audio file or drop here'}
                </span>
                <span className="text-[10px] text-gray-500 block mt-0.5">
                  (If omitted, high-energy synthetic African rhythm will be generated)
                </span>
              </div>
            </div>

            {/* Cypher Opt-In Checkbox */}
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-[#0B0F12] border border-border">
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
            <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-yellow-500/5 to-transparent border border-amber-500/30">
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
                  <span>Boost &amp; Sponsor Beat ($15)</span>
                </div>
                <span className="text-[11px] text-gray-400 font-normal block mt-0.5">
                  Pins your track to the top of the Marketplace &amp; features with a gold flame badge.
                </span>
              </label>
            </div>

            {/* Actions */}
            <div className="pt-4 flex items-center justify-end space-x-3 border-t border-border">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-border text-sm font-semibold text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-accent-green to-emerald-400 text-black text-sm font-extrabold shadow-lg shadow-accent-green/20 hover:opacity-95"
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
