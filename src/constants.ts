export interface Song {
  id: string;
  title: string;
  artist: string;
  duration: number; // in seconds
  coverUrl: string;
  audioUrl?: string; // Optional if we just want dummy tracks
}

export const DUMMY_SONGS: Song[] = [
  {
    id: '1',
    title: 'Neon Drift',
    artist: 'Cyber Synth',
    duration: 185,
    coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&h=400&fit=crop',
  },
  {
    id: '2',
    title: 'Digital Pulse',
    artist: 'AI Oracle',
    duration: 210,
    coverUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=400&fit=crop',
  },
  {
    id: '3',
    title: 'Late Night Grid',
    artist: 'Bit Runner',
    duration: 155,
    coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop',
  },
];
