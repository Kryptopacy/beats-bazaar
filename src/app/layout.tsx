import type { Metadata } from 'next';
import './globals.css';
import { AudioProvider } from '@/context/AudioContext';

export const metadata: Metadata = {
  title: 'Beats Bazaar — Global Beat Marketplace & Freestyle Cypher',
  description: 'Connecting music producers and artists worldwide. Audition beats, jump into the live freestyle cypher room, and license master rights directly.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-gray-100 min-h-screen antialiased selection:bg-accent-green selection:text-black">
        <AudioProvider>
          {children}
        </AudioProvider>
      </body>
    </html>
  );
}
