'use client';

import React, { useState } from 'react';
import { useAudio } from '@/context/AudioContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { MarketplaceView } from '@/components/MarketplaceView';
import { CypherRoomView } from '@/components/CypherRoomView';
import { BottomPlayerDock } from '@/components/BottomPlayerDock';
import { BeatUploadModal } from '@/components/BeatUploadModal';
import { BachsModal } from '@/components/BachsModal';
import { LicenseCertificateModal } from '@/components/LicenseCertificateModal';
import { ProducerProfileModal } from '@/components/ProducerProfileModal';
import { AiDjModal } from '@/components/AiDjModal';
import { Beat, LicenseTier, LicenseCertificate } from '@/types';

export default function Home() {
  const { activeSurface, activeBeat, markExclusiveSold } = useAudio();
  
  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isAiDjOpen, setIsAiDjOpen] = useState(false);
  const [bachsState, setBachsState] = useState<{
    isOpen: boolean;
    mode: 'license' | 'tip';
    beat: Beat | null;
    tier?: LicenseTier;
  }>({
    isOpen: false,
    mode: 'license',
    beat: null,
    tier: 'Standard Lease'
  });

  const [certificate, setCertificate] = useState<LicenseCertificate | null>(null);
  const [downloadAudioUrl, setDownloadAudioUrl] = useState<string>('');
  const [selectedProducer, setSelectedProducer] = useState<string | null>(null);

  // Open Bachs Modal for licensing
  const handleOpenLicense = (beat: Beat, tier: LicenseTier = 'Standard Lease') => {
    setBachsState({
      isOpen: true,
      mode: 'license',
      beat,
      tier
    });
  };

  // Open Bachs Modal for tipping
  const handleOpenTip = (beat: Beat) => {
    setBachsState({
      isOpen: true,
      mode: 'tip',
      beat
    });
  };

  // Handle successful Bachs checkout
  const handleBachsSuccess = (txRef: string, method: 'fiat' | 'crypto', amount: number) => {
    const currentBeat = bachsState.beat;
    const currentMode = bachsState.mode;
    const currentTier = bachsState.tier || 'Standard Lease';

    setBachsState(prev => ({ ...prev, isOpen: false }));

    if (currentMode === 'tip') {
      alert(`Success! Tip of $${amount} sent directly to ${currentBeat?.producer} (${method.toUpperCase()}). TxRef: ${txRef}`);
      return;
    }

    if (!currentBeat) return;

    // Generate verified digital License Certificate
    const newCert: LicenseCertificate = {
      certificateId: `BB-LIC-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 9000 + 1000)}`,
      beatId: currentBeat.id,
      beatTitle: currentBeat.title,
      licensor: currentBeat.producer,
      licensee: 'Independent Artist (Verified)',
      tier: currentTier,
      price: amount,
      issuedAt: new Date().toISOString(),
      transactionRef: txRef,
      paymentMethod: method,
      terms: currentTier === 'Exclusive Rights' ? [
        'Sole and exclusive worldwide commercial master rights transferred to Licensee.',
        'Unlimited audio streams, physical copies, music videos, and commercial broadcasting.',
        'Beat retired permanently from market; no further leases or licenses permitted.',
        'Licensor (Producer) retains standard 50% writer & publishing royalty share.'
      ] : [
        'Non-exclusive commercial master synchronization rights granted to Licensee.',
        'Up to 100,000 commercial audio streams across Spotify, Apple Music, and DSPs.',
        '1 monetized official music video and non-exclusive radio broadcasting.',
        'Licensor retains master ownership and may continue offering non-exclusive leases.'
      ]
    };

    if (currentTier === 'Exclusive Rights') {
      markExclusiveSold(currentBeat.id);
    }

    setCertificate(newCert);
    setDownloadAudioUrl(currentBeat.audioUrl);
  };

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      <div>
        <Navbar onOpenUpload={() => setIsUploadOpen(true)} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          {activeSurface === 'marketplace' ? (
            <MarketplaceView 
              onLicenseBeat={(beat, tier) => handleOpenLicense(beat, tier)}
              onOpenUpload={() => setIsUploadOpen(true)}
              onSelectProducer={(prod) => setSelectedProducer(prod)}
              onOpenAiDj={() => setIsAiDjOpen(true)}
            />
          ) : (
            <CypherRoomView 
              onTipProducer={(beat) => handleOpenTip(beat)}
              onLicenseBeat={(beat) => handleOpenLicense(beat, 'Standard Lease')}
              onOpenAiDj={() => setIsAiDjOpen(true)}
            />
          )}
        </div>

        <Footer 
          onOpenUpload={() => setIsUploadOpen(true)} 
          onOpenAiDj={() => setIsAiDjOpen(true)} 
        />
      </div>

      {/* Persistent Bottom Audio Player Dock (Active in Marketplace; Cypher has its own dedicated master deck) */}
      {activeSurface === 'marketplace' && (
        <BottomPlayerDock 
          onLicenseCurrentBeat={activeBeat ? () => handleOpenLicense(activeBeat, 'Standard Lease') : undefined} 
        />
      )}

      {/* Modals */}
      <AiDjModal
        isOpen={isAiDjOpen}
        onClose={() => setIsAiDjOpen(false)}
      />

      <BeatUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
      />

      <ProducerProfileModal
        producerName={selectedProducer}
        isOpen={Boolean(selectedProducer)}
        onClose={() => setSelectedProducer(null)}
        onTipProducer={handleOpenTip}
        onLicenseBeat={handleOpenLicense}
      />

      <BachsModal
        isOpen={bachsState.isOpen}
        beat={bachsState.beat}
        mode={bachsState.mode}
        tier={bachsState.tier}
        onClose={() => setBachsState(prev => ({ ...prev, isOpen: false }))}
        onSuccess={handleBachsSuccess}
      />

      <LicenseCertificateModal
        certificate={certificate}
        audioDownloadUrl={downloadAudioUrl}
        onClose={() => setCertificate(null)}
      />
    </main>
  );
}
