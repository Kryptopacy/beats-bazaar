import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AudioProvider } from '@/context/AudioContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://beatsbazaar.com';

export const viewport: Viewport = {
  themeColor: '#0A0D12',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Beats Bazaar | The Global Beat Marketplace & 24/7 Freestyle Cypher Room',
    template: '%s | Beats Bazaar'
  },
  description: 'The global beat marketplace and 24/7 freestyle cypher room. Direct legal licensing with untagged master WAVs, live crossfading cyphers, and native AI DJ Bazza.',
  keywords: [
    'Beats Marketplace',
    'Freestyle Cypher Room',
    'Music Producers',
    'Beat Licensing',
    'Untagged Master WAV',
    'AI DJ Bazza',
    'Afrobeats',
    'Trap Beats',
    'Hip-Hop',
    'Amapiano',
    'Music Production 2026'
  ],
  authors: [{ name: 'Beats Bazaar Studio' }, { name: 'Pacy Labs' }],
  creator: 'Pacy Labs',
  publisher: 'Beats Bazaar',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico?v=5', sizes: 'any' },
      { url: '/favicon-32.png?v=5', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16.png?v=5', sizes: '16x16', type: 'image/png' },
      { url: '/icon.svg?v=5', type: 'image/svg+xml' },
      { url: '/icon-192.png?v=5', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png?v=5', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png?v=5', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico?v=5',
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Beats Bazaar',
    title: 'Beats Bazaar | The Global Beat Marketplace & 24/7 Freestyle Cypher Room',
    description: 'Direct legal licensing with untagged master WAV delivery, live crossfading cyphers, and native AI DJ Bazza.',
    images: [
      {
        url: '/og-image.png?v=5',
        width: 1200,
        height: 630,
        alt: 'Beats Bazaar - The Global Beat Marketplace & 24/7 Freestyle Cypher Room',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Beats Bazaar | The Global Beat Marketplace & 24/7 Freestyle Cypher Room',
    description: 'Direct legal licensing with untagged master WAV delivery, live crossfading cyphers, and native AI DJ Bazza.',
    images: ['/og-image.png?v=5'],
    creator: '@beatsbazaar',
  },
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans bg-background text-gray-100 min-h-screen antialiased selection:bg-accent-green selection:text-black relative`}>
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
