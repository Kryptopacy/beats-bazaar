import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Beats Bazaar',
    short_name: 'BeatsBazaar',
    description: 'The Global Beat Marketplace & 24/7 Freestyle Cypher Room',
    start_url: '/',
    display: 'standalone',
    background_color: '#0A0D12',
    theme_color: '#00E599',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}
