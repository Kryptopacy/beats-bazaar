import type { Metadata } from 'next';
import './globals.css';
import { AudioProvider } from '@/context/AudioContext';

export const metadata: Metadata = {
  title: 'Beats Bazaar | Beat Marketplace & Freestyle Cypher',
  description: 'Connecting music producers and artists worldwide. Audition beats, jump into the live freestyle cypher room, and license master rights directly.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-gray-100 min-h-screen antialiased selection:bg-accent-green selection:text-black relative">
        {/* Tactile Hardware Studio Noise Overlay (Hardware Anodized Matte Grain) */}
        <svg 
          className="pointer-events-none fixed inset-0 z-50 h-full w-full opacity-20 mix-blend-screen select-none"
          aria-hidden="true"
        >
          <filter id="tactile-hardware-grain">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.75"
              numOctaves="3"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#tactile-hardware-grain)" />
        </svg>

        <AudioProvider>
          {children}
        </AudioProvider>
      </body>
    </html>
  );
}
