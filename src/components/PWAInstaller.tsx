'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // 1. Register Service Worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('Beats Bazaar PWA ServiceWorker registered with scope:', registration.scope);
          })
          .catch((err) => {
            console.warn('PWA ServiceWorker registration failed:', err);
          });
      });
    }

    // 2. Check if already installed in standalone display mode
    if (typeof window !== 'undefined') {
      const isStandaloneMode =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true;
      setIsStandalone(isStandaloneMode);

      // 3. Listen for native install prompt
      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e as BeforeInstallPromptEvent);
        setIsInstallable(true);
      };

      const handleAppInstalled = () => {
        setIsInstallable(false);
        setDeferredPrompt(null);
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.addEventListener('appinstalled', handleAppInstalled);

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('appinstalled', handleAppInstalled);
      };
    }
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;
    if (choiceResult.outcome === 'accepted') {
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  // Don't render if already in standalone app mode, not installable, or dismissed by user
  if (isStandalone || !isInstallable || isDismissed) {
    return null;
  }

  return (
    <aside 
      aria-label="Install Beats Bazaar Progressive Web App"
      className="fixed bottom-20 sm:bottom-6 left-4 sm:left-6 z-40 animate-slideUp"
    >
      <div className="flex items-center space-x-3 p-2.5 sm:p-3 rounded-2xl bg-[#0D131A]/95 border border-white/[0.12] backdrop-blur-xl shadow-2xl shadow-black/80 ring-1 ring-accent-green/20">
        <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden flex-shrink-0 bg-black/40 border border-white/[0.08]">
          <Image
            src="/apple-touch-icon.png"
            alt="Beats Bazaar App"
            width={40}
            height={40}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col pr-1">
          <span className="text-xs sm:text-sm font-black text-white tracking-tight">
            Install Beats Bazaar
          </span>
          <span className="text-[10px] sm:text-xs text-gray-400">
            Offline 24/7 Cypher & Studio App
          </span>
        </div>

        <button
          type="button"
          onClick={handleInstallClick}
          className="flex items-center space-x-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-gradient-to-r from-accent-green to-emerald-400 text-black text-xs font-black shadow-md shadow-accent-green/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer whitespace-nowrap"
        >
          <Download className="w-3.5 h-3.5 text-black" />
          <span>Install</span>
        </button>

        <button
          type="button"
          onClick={() => setIsDismissed(true)}
          className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors cursor-pointer"
          title="Dismiss install banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
