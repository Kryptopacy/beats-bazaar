import type { Metadata } from 'next';
import './globals.css';
import { AudioProvider } from '@/context/AudioContext';

export const metadata: Metadata = {
  title: 'Beats Bazaar — Underground Beats. Direct Bag.',
  description: 'The premier African and global marketplace & freestyle cypher hub for underground music producers and indie artists.',
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
